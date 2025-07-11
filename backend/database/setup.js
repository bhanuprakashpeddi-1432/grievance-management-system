import mysql from 'mysql2';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';

// Get __dirname equivalent in ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load environment variables
dotenv.config({ path: path.join(__dirname, '..', '.env') });

// Database configuration
const dbConfig = {
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '',
    database: process.env.DB_NAME || 'grievance_management_system',
    multipleStatements: true
};

// Debug: Log the configuration (without showing password)
console.log('🔧 Database config loaded:');
console.log(`   Host: ${dbConfig.host}`);
console.log(`   User: ${dbConfig.user}`);
console.log(`   Password: ${dbConfig.password ? '***' : 'NOT SET'}`);
console.log(`   Database: ${dbConfig.database}`);
console.log('');

// Create database and tables
async function initializeDatabase() {
    try {
        // First connect without database to create it
        const connection = mysql.createConnection({
            host: dbConfig.host,
            user: dbConfig.user,
            password: dbConfig.password,
            multipleStatements: true
        });

        // Read and execute schema
        const schemaPath = path.join(__dirname, 'schema.sql');
        const schemaSQL = fs.readFileSync(schemaPath, 'utf8');
        
        // Use query() instead of execute() for DDL statements
        console.log('📋 Executing database schema...');
        await connection.promise().query(schemaSQL);
        console.log('✅ Database schema created successfully');

        connection.end();
        return true;
    } catch (error) {
        console.error('Error initializing database:', error);
        throw error;
    }
}

// Seed database with sample data
async function seedDatabase() {
    try {
        const connection = mysql.createConnection(dbConfig);
        
        // Read and execute seed data
        const seedPath = path.join(__dirname, 'seed.sql');
        const seedSQL = fs.readFileSync(seedPath, 'utf8');
        
        console.log('📋 Seeding database with sample data...');
        await connection.promise().query(seedSQL);
        console.log('✅ Database seeded successfully');

        connection.end();
        return true;
    } catch (error) {
        console.error('Error seeding database:', error);
        throw error;
    }
}

// Check if database exists and has tables
async function checkDatabaseExists() {
    try {
        const connection = mysql.createConnection(dbConfig);
        
        const [rows] = await connection.promise().execute(
            'SELECT COUNT(*) as count FROM information_schema.tables WHERE table_schema = ?',
            [dbConfig.database]
        );

        connection.end();
        return rows[0].count > 0;
    } catch (error) {
        console.error('Error checking database:', error);
        return false;
    }
}

// Run database migrations
async function runMigrations() {
    try {
        const migrationsPath = path.join(__dirname, 'migrations');
        
        // Check if migrations directory exists
        if (!fs.existsSync(migrationsPath)) {
            console.log('No migrations directory found, skipping migrations');
            return;
        }

        const connection = mysql.createConnection(dbConfig);
        
        // Create migrations table if it doesn't exist
        await connection.promise().execute(`
            CREATE TABLE IF NOT EXISTS migrations (
                id INT AUTO_INCREMENT PRIMARY KEY,
                filename VARCHAR(255) NOT NULL,
                executed_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            )
        `);

        // Get executed migrations
        const [executedMigrations] = await connection.promise().execute(
            'SELECT filename FROM migrations'
        );
        
        const executed = executedMigrations.map(row => row.filename);

        // Read migration files
        const migrationFiles = fs.readdirSync(migrationsPath)
            .filter(file => file.endsWith('.sql'))
            .sort();

        // Execute pending migrations
        for (const file of migrationFiles) {
            if (!executed.includes(file)) {
                console.log(`Running migration: ${file}`);
                
                const migrationSQL = fs.readFileSync(
                    path.join(migrationsPath, file), 
                    'utf8'
                );
                
                await connection.promise().execute(migrationSQL);
                await connection.promise().execute(
                    'INSERT INTO migrations (filename) VALUES (?)',
                    [file]
                );
                
                console.log(`Migration ${file} completed`);
            }
        }

        connection.end();
        console.log('All migrations completed');
    } catch (error) {
        console.error('Error running migrations:', error);
        throw error;
    }
}

// Setup database (initialize and seed if needed)
async function setupDatabase() {
    try {
        const exists = await checkDatabaseExists();
        
        if (!exists) {
            console.log('Database not found, initializing...');
            await initializeDatabase();
            console.log('Database initialized successfully');
            
            // Ask if user wants to seed with sample data
            if (process.env.SEED_DATABASE === 'true') {
                console.log('Seeding database with sample data...');
                await seedDatabase();
                console.log('Database seeded successfully');
            }
        } else {
            console.log('Database already exists');
        }

        // Run any pending migrations
        await runMigrations();
        
        return true;
    } catch (error) {
        console.error('Error setting up database:', error);
        throw error;
    }
}

export {
    initializeDatabase,
    seedDatabase,
    checkDatabaseExists,
    runMigrations,
    setupDatabase
};
