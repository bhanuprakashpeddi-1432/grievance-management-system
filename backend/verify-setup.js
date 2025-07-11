import { PrismaClient } from '@prisma/client';
import dotenv from 'dotenv';

dotenv.config();

const prisma = new PrismaClient();

async function verifySetup() {
  console.log('🔍 Verifying Grievance Management System Setup...\n');

  try {
    // Test database connection
    console.log('1. Testing database connection...');
    await prisma.$connect();
    console.log('✅ Database connection successful');

    // Check if tables exist
    console.log('\n2. Checking database tables...');
    const tables = await prisma.$queryRaw`
      SELECT TABLE_NAME 
      FROM INFORMATION_SCHEMA.TABLES 
      WHERE TABLE_SCHEMA = DATABASE() AND TABLE_TYPE = 'BASE TABLE'
    `;
    
    const expectedTables = [
      'users', 'grievances', 'grievance_categories', 
      'grievance_attachments', 'grievance_comments', 
      'grievance_status_history', 'notifications'
    ];
    
    const tableNames = tables.map(t => t.TABLE_NAME);
    const missingTables = expectedTables.filter(table => !tableNames.includes(table));
    
    if (missingTables.length === 0) {
      console.log('✅ All required tables exist');
    } else {
      console.log('❌ Missing tables:', missingTables);
    }

    // Check for admin user
    console.log('\n3. Checking for admin user...');
    const adminUser = await prisma.user.findFirst({
      where: { role: 'ADMIN' }
    });
    
    if (adminUser) {
      console.log('✅ Admin user exists:', adminUser.username);
    } else {
      console.log('❌ No admin user found');
    }

    // Check categories
    console.log('\n4. Checking grievance categories...');
    const categories = await prisma.grievanceCategory.count();
    console.log(`✅ Found ${categories} grievance categories`);

    // Environment variables check
    console.log('\n5. Checking environment variables...');
    const requiredEnvVars = [
      'DATABASE_URL', 'JWT_SECRET', 'PORT'
    ];
    
    const missingEnvVars = requiredEnvVars.filter(envVar => !process.env[envVar]);
    
    if (missingEnvVars.length === 0) {
      console.log('✅ All required environment variables are set');
    } else {
      console.log('❌ Missing environment variables:', missingEnvVars);
    }

    console.log('\n🎉 Setup verification completed!\n');

    // Display system summary
    console.log('📊 System Summary:');
    console.log('==================');
    
    const userCount = await prisma.user.count();
    const grievanceCount = await prisma.grievance.count();
    const categoryCount = await prisma.grievanceCategory.count();
    
    console.log(`👥 Total Users: ${userCount}`);
    console.log(`📝 Total Grievances: ${grievanceCount}`);
    console.log(`📂 Total Categories: ${categoryCount}`);
    
    const statusCounts = await prisma.grievance.groupBy({
      by: ['status'],
      _count: { status: true }
    });
    
    console.log('\n📈 Grievance Status Distribution:');
    statusCounts.forEach(status => {
      console.log(`   ${status.status}: ${status._count.status}`);
    });

    console.log('\n🚀 System is ready for use!');
    console.log('🌐 Frontend: http://localhost:3000');
    console.log('🔗 Backend API: http://localhost:3001');
    
    if (adminUser) {
      console.log(`\n👨‍💼 Admin Login:`);
      console.log(`   Username: ${adminUser.username}`);
      console.log(`   Password: admin123`);
    }

  } catch (error) {
    console.error('❌ Setup verification failed:', error);
    console.log('\n🔧 Troubleshooting steps:');
    console.log('1. Make sure MySQL server is running');
    console.log('2. Check your .env file configuration');
    console.log('3. Run: npx prisma db push');
    console.log('4. Run: npm run db:seed');
  } finally {
    await prisma.$disconnect();
  }
}

verifySetup();
