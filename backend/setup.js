// =====================================================
// Setup Script - Initialize Database and Test Connection
// =====================================================

const mysql = require('mysql2/promise');
const fs = require('fs');
const path = require('path');
const dotenv = require('dotenv');

dotenv.config();

async function setupDatabase() {
    console.log('╔════════════════════════════════════════════════╗');
    console.log('║   REQUIEM MEDICAL CENTER - Database Setup     ║');
    console.log('╚════════════════════════════════════════════════╝\n');
    
    // Read schema file
    const schemaPath = path.join(__dirname, '..', 'database', 'schema.sql');
    
    if (!fs.existsSync(schemaPath)) {
        console.error('❌ Schema file not found:', schemaPath);
        process.exit(1);
    }
    
    const schema = fs.readFileSync(schemaPath, 'utf8');
    
    // Connect to MySQL (without database selection first)
    let connection;
    try {
        connection = await mysql.createConnection({
            host: process.env.DB_HOST || 'localhost',
            port: process.env.DB_PORT || 3306,
            user: process.env.DB_USER || 'root',
            password: process.env.DB_PASSWORD || ''
        });
        
        console.log('✅ Connected to MySQL server\n');
        
        // Execute schema
        console.log('📝 Executing database schema...');
        await connection.query(schema);
        console.log('✅ Database schema applied successfully\n');
        
        // Test connection with database
        const testPool = mysql.createPool({
            host: process.env.DB_HOST || 'localhost',
            port: process.env.DB_PORT || 3306,
            user: process.env.DB_USER || 'root',
            password: process.env.DB_PASSWORD || '',
            database: process.env.DB_NAME || 'requiem_hospital'
        });
        
        const testConn = await testPool.getConnection();
        const [tables] = await testConn.query(
            "SELECT TABLE_NAME FROM information_schema.TABLES WHERE TABLE_SCHEMA = 'requiem_hospital'"
        );
        
        console.log('📊 Tables created:');
        tables.forEach(table => {
            console.log(`   ✓ ${table.TABLE_NAME}`);
        });
        
        await testConn.release();
        
        console.log('\n✅ Database setup complete!');
        console.log('\n📝 Next steps:');
        console.log('   1. Copy .env.example to .env and configure your database credentials');
        console.log('   2. Run: npm install');
        console.log('   3. Run: npm start to start the backend server');
        
    } catch (error) {
        console.error('\n❌ Error during setup:', error.message);
        process.exit(1);
    } finally {
        if (connection) {
            await connection.end();
        }
    }
}

setupDatabase();
