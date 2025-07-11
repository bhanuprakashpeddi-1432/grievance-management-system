const { setupDatabase } = require('./backend/database/setup');

async function main() {
    try {
        console.log('🗄️  Setting up database...');
        await setupDatabase();
        console.log('✅ Database setup completed successfully!');
        process.exit(0);
    } catch (error) {
        console.error('❌ Database setup failed:', error.message);
        process.exit(1);
    }
}

main();
