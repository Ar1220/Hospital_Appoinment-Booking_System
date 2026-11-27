// =====================================================
// REQUIEM MEDICAL CENTER - Node.js Backend API
// Express server with MySQL integration
// =====================================================

const express = require('express');
const mysql = require('mysql2/promise');
const cors = require('cors');
const dotenv = require('dotenv');

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(express.json());

// MySQL Connection Pool
const pool = mysql.createPool({
    host: process.env.DB_HOST || 'localhost',
    port: process.env.DB_PORT || 3306,
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '',
    database: process.env.DB_NAME || 'requiem_hospital',
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
});

// Test database connection
app.get('/api/health', async (req, res) => {
    try {
        const connection = await pool.getConnection();
        res.json({ 
            status: 'healthy', 
            database: 'connected',
            timestamp: new Date().toISOString()
        });
        connection.release();
    } catch (error) {
        res.status(500).json({ 
            status: 'unhealthy', 
            database: 'disconnected',
            error: error.message 
        });
    }
});

// =====================================================
// APPOINTMENT ROUTES
// =====================================================

// Generate appointment number — based on the highest serial used this month,
// not on a row count (deleting rows must never recycle a number).
async function generateAppointmentNumber(connection = pool) {
    const [rows] = await connection.execute(
        `SELECT CONCAT(
            'APT-', YEAR(CURDATE()), '-', MONTH(CURDATE()), '-',
            LPAD(COALESCE(MAX(CAST(SUBSTRING_INDEX(appointment_number, '-', -1) AS UNSIGNED)), 0) + 1, 5, '0')
         ) AS new_number
         FROM appointments
         WHERE appointment_number LIKE CONCAT('APT-', YEAR(CURDATE()), '-', MONTH(CURDATE()), '-%')`
    );
    return rows[0].new_number;
}

// Create new appointment
app.post('/api/appointments', async (req, res) => {
    const connection = await pool.getConnection();
    
    try {
        await connection.beginTransaction();
        
        const {
            fullName,
            dob,
            email,
            phone,
            appointmentType,
            doctor,
            preferredDate,
            preferredTime,
            reason,
            emergencyName,
            emergencyPhone,
            notes
        } = req.body;
        
        // Map appointment type name to ID
        let appointmentTypeId = null;
        if (appointmentType) {
            const [types] = await connection.execute(
                'SELECT id FROM appointment_types WHERE code = ? OR name = ?',
                [appointmentType, appointmentType]
            );
            if (types.length > 0) {
                appointmentTypeId = types[0].id;
            }
        }
        
        // Generate confirmation code
        const confirmationCode = Math.random().toString(36).substring(2, 8).toUpperCase();

        // Generate appointment number (retry if a concurrent request grabbed it first)
        let appointmentNumber = null;
        let result = null;
        for (let attempt = 0; attempt < 3; attempt += 1) {
            const candidate = await generateAppointmentNumber(connection);
            try {
                [result] = await connection.execute(
                    `INSERT INTO appointments (
                        appointment_number, full_name, date_of_birth, email, phone,
                        appointment_type_id, doctor_id, preferred_date, preferred_time,
                        reason_for_visit, emergency_contact_name, emergency_contact_phone,
                        additional_notes, status, confirmation_code
                    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'pending', ?)`,
                    [
                        candidate, fullName, dob, email, phone,
                        appointmentTypeId, doctor, preferredDate, preferredTime,
                        reason, emergencyName, emergencyPhone, notes, confirmationCode
                    ]
                );
                appointmentNumber = candidate;
                break;
            } catch (insertError) {
                if (insertError.code !== 'ER_DUP_ENTRY' || attempt === 2) throw insertError;
            }
        }
        
        await connection.commit();
        
        res.status(201).json({
            success: true,
            message: 'Appointment request submitted successfully',
            data: {
                appointmentId: result.insertId,
                appointmentNumber: appointmentNumber,
                confirmationCode: confirmationCode,
                status: 'pending'
            }
        });
        
    } catch (error) {
        await connection.rollback();
        console.error('Error creating appointment:', error);
        res.status(500).json({
            success: false,
            message: 'Error creating appointment',
            error: error.message
        });
    } finally {
        connection.release();
    }
});

// Get all appointments
app.get('/api/appointments', async (req, res) => {
    try {
        const [rows] = await pool.execute(
            'SELECT * FROM appointment_details ORDER BY created_at DESC'
        );
        res.json({
            success: true,
            count: rows.length,
            data: rows
        });
    } catch (error) {
        console.error('Error fetching appointments:', error);
        res.status(500).json({
            success: false,
            message: 'Error fetching appointments',
            error: error.message
        });
    }
});

// Get appointment by ID
app.get('/api/appointments/:id', async (req, res) => {
    try {
        const [rows] = await pool.execute(
            'SELECT * FROM appointment_details WHERE id = ?',
            [req.params.id]
        );
        
        if (rows.length === 0) {
            return res.status(404).json({
                success: false,
                message: 'Appointment not found'
            });
        }
        
        res.json({
            success: true,
            data: rows[0]
        });
    } catch (error) {
        console.error('Error fetching appointment:', error);
        res.status(500).json({
            success: false,
            message: 'Error fetching appointment',
            error: error.message
        });
    }
});

// Get appointment by confirmation code
app.get('/api/appointments/confirm/:code', async (req, res) => {
    try {
        const [rows] = await pool.execute(
            'SELECT * FROM appointment_details WHERE confirmation_code = ?',
            [req.params.code.toUpperCase()]
        );
        
        if (rows.length === 0) {
            return res.status(404).json({
                success: false,
                message: 'Confirmation code not found'
            });
        }
        
        res.json({
            success: true,
            data: rows[0]
        });
    } catch (error) {
        console.error('Error verifying appointment:', error);
        res.status(500).json({
            success: false,
            message: 'Error verifying appointment',
            error: error.message
        });
    }
});

// Update appointment status
app.patch('/api/appointments/:id/status', async (req, res) => {
    const { status } = req.body;
    const validStatuses = ['pending', 'confirmed', 'in_progress', 'completed', 'cancelled', 'no_show'];
    
    if (!validStatuses.includes(status)) {
        return res.status(400).json({
            success: false,
            message: 'Invalid status'
        });
    }
    
    try {
        const [result] = await pool.execute(
            'UPDATE appointments SET status = ? WHERE id = ?',
            [status, req.params.id]
        );
        
        if (result.affectedRows === 0) {
            return res.status(404).json({
                success: false,
                message: 'Appointment not found'
            });
        }
        
        res.json({
            success: true,
            message: 'Status updated successfully'
        });
    } catch (error) {
        console.error('Error updating appointment:', error);
        res.status(500).json({
            success: false,
            message: 'Error updating appointment',
            error: error.message
        });
    }
});

// =====================================================
// DOCTORS ROUTES
// =====================================================

// Get all doctors
app.get('/api/doctors', async (req, res) => {
    try {
        const [rows] = await pool.execute(
            'SELECT * FROM doctors ORDER BY name ASC'
        );
        res.json({
            success: true,
            count: rows.length,
            data: rows
        });
    } catch (error) {
        console.error('Error fetching doctors:', error);
        res.status(500).json({
            success: false,
            message: 'Error fetching doctors',
            error: error.message
        });
    }
});

// Get doctor by ID
app.get('/api/doctors/:id', async (req, res) => {
    try {
        const [rows] = await pool.execute(
            'SELECT * FROM doctors WHERE id = ?',
            [req.params.id]
        );
        
        if (rows.length === 0) {
            return res.status(404).json({
                success: false,
                message: 'Doctor not found'
            });
        }
        
        res.json({
            success: true,
            data: rows[0]
        });
    } catch (error) {
        console.error('Error fetching doctor:', error);
        res.status(500).json({
            success: false,
            message: 'Error fetching doctor',
            error: error.message
        });
    }
});

// Update doctor status
app.patch('/api/doctors/:id/status', async (req, res) => {
    const { status, availabilityNote } = req.body;
    
    try {
        const [result] = await pool.execute(
            'UPDATE doctors SET status = ?, availability_note = ? WHERE id = ?',
            [status, availabilityNote, req.params.id]
        );
        
        if (result.affectedRows === 0) {
            return res.status(404).json({
                success: false,
                message: 'Doctor not found'
            });
        }
        
        res.json({
            success: true,
            message: 'Doctor status updated successfully'
        });
    } catch (error) {
        console.error('Error updating doctor:', error);
        res.status(500).json({
            success: false,
            message: 'Error updating doctor',
            error: error.message
        });
    }
});

// =====================================================
// APPOINTMENT TYPES ROUTES
// =====================================================

app.get('/api/appointment-types', async (req, res) => {
    try {
        const [rows] = await pool.execute(
            'SELECT * FROM appointment_types WHERE is_active = TRUE ORDER BY name ASC'
        );
        res.json({
            success: true,
            count: rows.length,
            data: rows
        });
    } catch (error) {
        console.error('Error fetching appointment types:', error);
        res.status(500).json({
            success: false,
            message: 'Error fetching appointment types',
            error: error.message
        });
    }
});

// =====================================================
// SERVICES ROUTES
// =====================================================

app.get('/api/services', async (req, res) => {
    try {
        const [rows] = await pool.execute(
            'SELECT * FROM services WHERE is_active = TRUE ORDER BY number_code ASC'
        );
        res.json({
            success: true,
            count: rows.length,
            data: rows
        });
    } catch (error) {
        console.error('Error fetching services:', error);
        res.status(500).json({
            success: false,
            message: 'Error fetching services',
            error: error.message
        });
    }
});

// =====================================================
// TESTIMONIALS ROUTES
// =====================================================

app.get('/api/testimonials', async (req, res) => {
    try {
        const [rows] = await pool.execute(
            'SELECT * FROM testimonials WHERE is_featured = TRUE ORDER BY created_at DESC'
        );
        res.json({
            success: true,
            count: rows.length,
            data: rows
        });
    } catch (error) {
        console.error('Error fetching testimonials:', error);
        res.status(500).json({
            success: false,
            message: 'Error fetching testimonials',
            error: error.message
        });
    }
});

// =====================================================
// NEWSLETTER ROUTES
// =====================================================

app.post('/api/newsletter', async (req, res) => {
    const { email } = req.body;
    
    if (!email || !email.includes('@')) {
        return res.status(400).json({
            success: false,
            message: 'Valid email required'
        });
    }
    
    try {
        const [result] = await pool.execute(
            'INSERT INTO newsletter_subscribers (email) VALUES (?) ON DUPLICATE KEY UPDATE email = email',
            [email]
        );
        
        res.json({
            success: true,
            message: 'Subscribed successfully'
        });
    } catch (error) {
        console.error('Error subscribing to newsletter:', error);
        res.status(500).json({
            success: false,
            message: 'Error subscribing to newsletter',
            error: error.message
        });
    }
});

// =====================================================
// STATS ROUTES (Dashboard)
// =====================================================

app.get('/api/stats/overview', async (req, res) => {
    try {
        const [appointmentsCount] = await pool.execute('SELECT COUNT(*) as total FROM appointments');
        const [pendingCount] = await pool.execute("SELECT COUNT(*) as total FROM appointments WHERE status = 'pending'");
        const [confirmedCount] = await pool.execute("SELECT COUNT(*) as total FROM appointments WHERE status = 'confirmed'");
        const [todayAppointments] = await pool.execute("SELECT COUNT(*) as total FROM appointments WHERE preferred_date = CURDATE()");
        const [doctorsCount] = await pool.execute('SELECT COUNT(*) as total FROM doctors');
        const [subscribersCount] = await pool.execute('SELECT COUNT(*) as total FROM newsletter_subscribers WHERE is_active = TRUE');
        
        res.json({
            success: true,
            data: {
                totalAppointments: appointmentsCount[0].total,
                pendingAppointments: pendingCount[0].total,
                confirmedAppointments: confirmedCount[0].total,
                todayAppointments: todayAppointments[0].total,
                totalDoctors: doctorsCount[0].total,
                newsletterSubscribers: subscribersCount[0].total
            }
        });
    } catch (error) {
        console.error('Error fetching stats:', error);
        res.status(500).json({
            success: false,
            message: 'Error fetching stats',
            error: error.message
        });
    }
});

// =====================================================
// START SERVER
// =====================================================

app.listen(PORT, () => {
    console.log(`
╔════════════════════════════════════════════════════════╗
║     REQUIEM MEDICAL CENTER - Backend API              ║
║     "Your health. Our obsession."                     ║
╠════════════════════════════════════════════════════════╣
║  Server running on port: ${PORT}                            ║
║  Health check: http://localhost:${PORT}/api/health                      ║
║  API Docs: http://localhost:${PORT}/api                                    ║
╚════════════════════════════════════════════════════════╝
    `);
});

module.exports = app;
