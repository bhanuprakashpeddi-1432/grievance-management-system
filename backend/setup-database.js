import dotenv from 'dotenv';
import { setupDatabase } from './database/setup.js';
import path from 'path';
import { fileURLToPath } from 'url';

// Get the current directory for ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load environment variables from .env file in the backend directory
dotenv.config({ path: path.join(__dirname, '.env') });

async function main() {
    try {
        console.log('🗄️  Setting up database...');
        console.log('📋 Database configuration:');
        console.log(`   Host: ${process.env.DB_HOST || 'localhost'}`);
        console.log(`   Database: ${process.env.DB_NAME || 'grievance_management_system'}`);
        console.log(`   User: ${process.env.DB_USER || 'root'}`);
        console.log(`   Password: ${process.env.DB_PASSWORD ? '***' : 'NOT SET'}`);
        console.log('');
        
        // Check if password is set
        if (!process.env.DB_PASSWORD) {
            console.error('❌ Database password is not set in .env file');
            console.error('');
            console.error('🔧 Please create a .env file with your database credentials:');
            console.error('   Copy .env.example to .env and update the DB_PASSWORD field');
            process.exit(1);
        }
        
        await setupDatabase();
        
        console.log('');
        console.log('✅ Database setup completed successfully!');
        console.log('');
        console.log('🚀 You can now start the server with: npm start');
        console.log('');
        console.log('🔐 Default login credentials:');
        console.log('   Admin: admin@company.com / password123');
        console.log('   Staff: jane.smith@company.com / password123');
        console.log('   User: john.doe@company.com / password123');
        
        process.exit(0);
    } catch (error) {
        console.error('❌ Database setup failed:', error.message);
        console.error('');
        console.error('🔍 Common issues:');
        console.error('   1. Make sure MySQL is running');
        console.error('   2. Check your database credentials in .env file');
        console.error('   3. Ensure the database user has proper permissions');
        console.error('');
        process.exit(1);
    }
}

main();
