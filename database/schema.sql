-- =====================================================
-- REQUIEM MEDICAL CENTER - Hospital Appointment System
-- Database Schema for MySQL
-- =====================================================

-- Create database
CREATE DATABASE IF NOT EXISTS requiem_hospital;
USE requiem_hospital;

-- =====================================================
-- TABLE: doctors
-- Stores doctor/clinician information
-- =====================================================
CREATE TABLE IF NOT EXISTS doctors (
    id VARCHAR(50) PRIMARY KEY,
    initials VARCHAR(10) NOT NULL,
    name VARCHAR(255) NOT NULL,
    specialty VARCHAR(255) NOT NULL,
    experience VARCHAR(255),
    education VARCHAR(255),
    languages VARCHAR(255),
    rating DECIMAL(3,2) DEFAULT 5.00,
    status ENUM('available', 'busy', 'offline') DEFAULT 'available',
    availability_note VARCHAR(255),
    portrait_url VARCHAR(500),
    hue VARCHAR(20) DEFAULT 'teal',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- =====================================================
-- TABLE: appointment_types
-- Stores available appointment types
-- =====================================================
CREATE TABLE IF NOT EXISTS appointment_types (
    id INT AUTO_INCREMENT PRIMARY KEY,
    code VARCHAR(50) UNIQUE NOT NULL,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    duration_minutes INT DEFAULT 30,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- =====================================================
-- TABLE: appointments
-- Stores all appointment bookings
-- =====================================================
CREATE TABLE IF NOT EXISTS appointments (
    id INT AUTO_INCREMENT PRIMARY KEY,
    appointment_number VARCHAR(20) UNIQUE NOT NULL,
    
    -- Patient Information
    full_name VARCHAR(255) NOT NULL,
    date_of_birth DATE,
    email VARCHAR(255) NOT NULL,
    phone VARCHAR(50) NOT NULL,
    
    -- Appointment Details
    appointment_type_id INT,
    doctor_id VARCHAR(50),
    preferred_date DATE NOT NULL,
    preferred_time TIME NOT NULL,
    reason_for_visit TEXT,
    
    -- Emergency Contact
    emergency_contact_name VARCHAR(255),
    emergency_contact_phone VARCHAR(50),
    
    -- Additional Notes
    additional_notes TEXT,
    
    -- Status Tracking
    status ENUM('pending', 'confirmed', 'in_progress', 'completed', 'cancelled', 'no_show') DEFAULT 'pending',
    confirmation_code VARCHAR(20),
    
    -- Timestamps
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    confirmed_at TIMESTAMP NULL,
    completed_at TIMESTAMP NULL,
    
    -- Foreign Keys
    FOREIGN KEY (appointment_type_id) REFERENCES appointment_types(id) ON DELETE SET NULL,
    FOREIGN KEY (doctor_id) REFERENCES doctors(id) ON DELETE SET NULL,
    
    -- Indexes for common queries
    INDEX idx_status (status),
    INDEX idx_preferred_date (preferred_date),
    INDEX idx_doctor_id (doctor_id),
    INDEX idx_email (email),
    INDEX idx_appointment_number (appointment_number)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- =====================================================
-- TABLE: services
-- Stores hospital services
-- =====================================================
CREATE TABLE IF NOT EXISTS services (
    id INT AUTO_INCREMENT PRIMARY KEY,
    number_code VARCHAR(10),
    title VARCHAR(255) NOT NULL,
    description TEXT,
    icon_name VARCHAR(50),
    detail VARCHAR(255),
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- =====================================================
-- TABLE: facilities
-- Stores hospital facility/room information
-- =====================================================
CREATE TABLE IF NOT EXISTS facilities (
    id INT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    floor_location VARCHAR(100),
    image_url VARCHAR(500),
    description TEXT,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- =====================================================
-- TABLE: testimonials
-- Stores patient testimonials/reviews
-- =====================================================
CREATE TABLE IF NOT EXISTS testimonials (
    id INT AUTO_INCREMENT PRIMARY KEY,
    patient_name VARCHAR(255) NOT NULL,
    treatment_type VARCHAR(255),
    quote TEXT NOT NULL,
    rating DECIMAL(3,2) DEFAULT 5.00,
    is_featured BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- =====================================================
-- TABLE: newsletter_subscribers
-- Stores newsletter/email subscription
-- =====================================================
CREATE TABLE IF NOT EXISTS newsletter_subscribers (
    id INT AUTO_INCREMENT PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL,
    subscribed_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    is_active BOOLEAN DEFAULT TRUE,
    INDEX idx_email (email)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- =====================================================
-- INSERT DEFAULT DATA
-- =====================================================

-- Insert appointment types
INSERT INTO appointment_types (code, name, description, duration_minutes) VALUES
('EMG', 'Emergency intake', 'Immediate assessment in a calm, highly equipped clinical environment.', 60),
('SUR', 'Surgical consultation', 'Specialist surgical pathways with uncompromising attention to detail.', 90),
('DIA', 'Diagnostic assessment', 'Advanced imaging, monitoring, and lab-led answers when every detail matters.', 45),
('SPC', 'Specialist consultation', 'Private, considered care with multidisciplinary clinical teams.', 60),
('RUT', 'Routine check-up', 'Standard health assessment and preventive care.', 30);

-- Insert doctors (from the React app data)
INSERT INTO doctors (id, initials, name, specialty, experience, education, languages, rating, status, availability_note, hue) VALUES
('voss', 'LK', 'Leon S. Kennedy', 'Neurosurgery', '15 years in complex care', 'St. Catherin Institute', 'English · German', 4.90, 'available', 'Available today', 'teal'),
('morrow', 'AW', 'Ada Wong', 'Diagnostic Medicine', '12 years in imaging', 'Harrow School of Medicine', 'English · French', 4.80, 'available', 'Available at 16:30', 'blue'),
('gideon', 'VG', 'Dr. Victor Gideon', 'Trauma Surgery', '18 years in emergency care', 'Westbridge University', 'English · Japanese', 5.00, 'busy', 'On surgical duty', 'red'),
('haos', 'HA', 'HAOS', 'Internal Medicine', '10 years in patient care', 'Mercer Medical College', 'English · Spanish', 4.90, 'available', 'Available tomorrow', 'red');

-- Insert services
INSERT INTO services (number_code, title, description, icon_name, detail) VALUES
('01', 'Emergency intake', 'Immediate assessment in a calm, highly equipped clinical environment.', 'emergency', '24 / 7 response'),
('02', 'Precision surgery', 'Specialist surgical pathways with uncompromising attention to detail.', 'scalpel', 'Theatre level 03'),
('03', 'Diagnostics', 'Advanced imaging, monitoring, and lab-led answers when every detail matters.', 'diagnostics', 'Results in 24 hrs'),
('04', 'Specialist consults', 'Private, considered care with multidisciplinary clinical teams.', 'stethoscope', 'Six departments');

-- Insert testimonials
INSERT INTO testimonials (patient_name, treatment_type, quote, rating, is_featured) VALUES
('L. Carter', 'Diagnostics / Record 1024', '"The entire process felt precise, private, and surprisingly calm. Every step was explained before it happened."', 5.00, TRUE),
('M. Reyes', 'Specialist consult / Record 0821', '"From the first call to follow-up, the team made a difficult week feel controlled and considered."', 5.00, TRUE),
('A. Morgan', 'Emergency intake / Record 1173', '"They found the answer quickly, gave me a clear plan, and never made me feel like a number."', 5.00, TRUE);

-- =====================================================
-- CREATE VIEW: appointment_details
-- Joins appointments with doctor and appointment type info
-- =====================================================
CREATE OR REPLACE VIEW appointment_details AS
SELECT 
    a.id,
    a.appointment_number,
    a.full_name,
    a.date_of_birth,
    a.email,
    a.phone,
    at.name AS appointment_type_name,
    d.name AS doctor_name,
    d.specialty AS doctor_specialty,
    a.preferred_date,
    a.preferred_time,
    a.reason_for_visit,
    a.emergency_contact_name,
    a.emergency_contact_phone,
    a.additional_notes,
    a.status,
    a.confirmation_code,
    a.created_at,
    a.updated_at
FROM appointments a
LEFT JOIN appointment_types at ON a.appointment_type_id = at.id
LEFT JOIN doctors d ON a.doctor_id = d.id;

-- =====================================================
-- STORED PROCEDURE: Generate Appointment Number
-- =====================================================
DELIMITER $$

CREATE PROCEDURE GenerateAppointmentNumber(OUT new_number VARCHAR(20))
BEGIN
    DECLARE current_year CHAR(4);
    DECLARE current_month CHAR(2);
    DECLARE counter INT;
    
    SET current_year = DATE_FORMAT(NOW(), '%Y');
    SET current_month = DATE_FORMAT(NOW(), '%m');
    
    SELECT COALESCE(MAX(CAST(SUBSTRING_INDEX(appointment_number, '-', -1) AS UNSIGNED)), 0) INTO counter 
    FROM appointments 
    WHERE appointment_number LIKE CONCAT('APT-', current_year, '-', current_month, '-%');
    
    SET counter = counter + 1;
    SET new_number = CONCAT('APT-', current_year, '-', current_month, '-', LPAD(counter, 5, '0'));
END$$

DELIMITER ;

-- =====================================================
-- STORED PROCEDURE: Create New Appointment
-- =====================================================
DELIMITER $$

CREATE PROCEDURE CreateAppointment(
    IN p_full_name VARCHAR(255),
    IN p_dob DATE,
    IN p_email VARCHAR(255),
    IN p_phone VARCHAR(50),
    IN p_appointment_type_id INT,
    IN p_doctor_id VARCHAR(50),
    IN p_preferred_date DATE,
    IN p_preferred_time TIME,
    IN p_reason TEXT,
    IN p_emergency_name VARCHAR(255),
    IN p_emergency_phone VARCHAR(50),
    IN p_notes TEXT,
    OUT p_appointment_id INT,
    OUT p_appointment_number VARCHAR(20),
    OUT p_confirmation_code VARCHAR(20)
)
BEGIN
    DECLARE new_number VARCHAR(20);
    DECLARE new_confirmation VARCHAR(20);
    
    -- Generate appointment number
    CALL GenerateAppointmentNumber(new_number);
    
    -- Generate confirmation code (random 6-char alphanumeric)
    SET new_confirmation = UPPER(SUBSTR(MD5(RAND() * p_full_name * UNIX_TIMESTAMP()), 1, 6));
    
    -- Insert appointment
    INSERT INTO appointments (
        appointment_number,
        full_name,
        date_of_birth,
        email,
        phone,
        appointment_type_id,
        doctor_id,
        preferred_date,
        preferred_time,
        reason_for_visit,
        emergency_contact_name,
        emergency_contact_phone,
        additional_notes,
        status,
        confirmation_code
    ) VALUES (
        new_number,
        p_full_name,
        p_dob,
        p_email,
        p_phone,
        p_appointment_type_id,
        p_doctor_id,
        p_preferred_date,
        p_preferred_time,
        p_reason,
        p_emergency_name,
        p_emergency_phone,
        p_notes,
        'pending',
        new_confirmation
    );
    
    SET p_appointment_id = LAST_INSERT_ID();
    SET p_appointment_number = new_number;
    SET p_confirmation_code = new_confirmation;
END$$

DELIMITER ;

-- =====================================================
-- GRANT PRIVILEGES (adjust user/password as needed)
-- =====================================================
-- CREATE USER 'requiem_user'@'localhost' IDENTIFIED BY 'requiem_pass_2025';
-- GRANT ALL PRIVILEGES ON requiem_hospital.* TO 'requiem_user'@'localhost';
-- FLUSH PRIVILEGES;

-- =====================================================
-- DISPLAY TABLES CREATED
-- =====================================================
SHOW TABLES;

SELECT 'Database setup complete!' AS status;
SELECT 'Tables created:' AS info;
SELECT TABLE_NAME FROM information_schema.TABLES WHERE TABLE_SCHEMA = 'requiem_hospital';
