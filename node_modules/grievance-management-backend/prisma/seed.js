import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting database seeding...');

  // Create grievance categories
  const categories = await Promise.all([
    prisma.grievanceCategory.upsert({
      where: { id: 1 },
      update: {},
      create: {
        name: 'Academic',
        description: 'Issues related to academic activities, courses, and learning',
        isActive: true,
      },
    }),
    prisma.grievanceCategory.upsert({
      where: { id: 2 },
      update: {},
      create: {
        name: 'Administrative',
        description: 'Issues related to administrative processes and services',
        isActive: true,
      },
    }),
    prisma.grievanceCategory.upsert({
      where: { id: 3 },
      update: {},
      create: {
        name: 'Personal',
        description: 'Personal grievances and concerns',
        isActive: true,
      },
    }),
    prisma.grievanceCategory.upsert({
      where: { id: 4 },
      update: {},
      create: {
        name: 'Technical',
        description: 'Technical issues related to systems and infrastructure',
        isActive: true,
      },
    }),
  ]);

  console.log('✅ Categories created:', categories.length);

  // Create default admin user
  const hashedPassword = await bcrypt.hash('admin123', 10);
  
  // Check if admin user already exists
  let adminUser = await prisma.user.findFirst({
    where: {
      OR: [
        { email: 'admin@grievance.com' },
        { username: 'admin' }
      ]
    }
  });

  if (!adminUser) {
    adminUser = await prisma.user.create({
      data: {
        username: 'admin',
        email: 'admin@grievance.com',
        passwordHash: hashedPassword,
        firstName: 'System',
        lastName: 'Administrator',
        role: 'ADMIN',
        phone: '9999999999',
        department: 'IT',
        isActive: true,
      },
    });
    console.log('✅ Admin user created:', adminUser.email);
  } else {
    console.log('✅ Admin user already exists:', adminUser.email);
  }

  // Create sample users
  const users = [];
  const sampleUsers = [
    {
      username: 'bhanu_prakash',
      email: '2200030939@kluniversity.in',
      firstName: 'Bhanu',
      lastName: 'Prakash',
      phone: '9876543210',
      department: 'CSE-Honors',
    },
    {
      username: 'gn_rohit',
      email: '2200033156@kluniversity.in',
      firstName: 'GN',
      lastName: 'Rohit',
      phone: '9876543211',
      department: 'CSE-Honors',
    },
    {
      username: 'dinesh_srisanth',
      email: '2200031469@kluniversity.in',
      firstName: 'Adari Dinesh',
      lastName: 'Srisanth',
      phone: '9876543212',
      department: 'CSE-Honors',
    },
  ];

  for (const userData of sampleUsers) {
    // Check if user already exists
    let user = await prisma.user.findFirst({
      where: {
        OR: [
          { email: userData.email },
          { username: userData.username }
        ]
      }
    });

    if (!user) {
      const userPassword = await bcrypt.hash('password123', 10);
      user = await prisma.user.create({
        data: {
          ...userData,
          passwordHash: userPassword,
          role: 'USER',
          isActive: true,
        },
      });
      console.log('✅ Sample user created:', user.email);
    } else {
      console.log('✅ Sample user already exists:', user.email);
    }
    users.push(user);
  }

  console.log('✅ Sample users processed:', users.length);

  // Create sample grievances
  const grievances = [];
  const sampleGrievances = [
    {
      title: 'WiFi Connectivity Issues',
      description: 'WiFi connectivity issues in hostel rooms causing disruption to online classes',
      categoryId: 2, // Administrative
      userId: users[0].id,
      priority: 'HIGH',
      status: 'PENDING',
    },
    {
      title: 'Incorrect Attendance Marking',
      description: 'Incorrect attendance marking in Mathematics course affecting overall grades',
      categoryId: 1, // Academic
      userId: users[1].id,
      priority: 'MEDIUM',
      status: 'IN_PROGRESS',
      assignedTo: adminUser.id,
    },
    {
      title: 'Medical Certificate Verification',
      description: 'Need medical certificate verification for semester examination',
      categoryId: 3, // Personal
      userId: users[2].id,
      priority: 'LOW',
      status: 'RESOLVED',
      assignedTo: adminUser.id,
      resolutionDate: new Date(),
      resolutionNotes: 'Medical certificate verified and approved',
    },
  ];

  // Create sample grievances (only if none exist)
  const existingGrievances = await prisma.grievance.count();
  
  if (existingGrievances === 0) {
    const grievances = [];
    const sampleGrievances = [
      {
        title: 'WiFi Connectivity Issues',
        description: 'WiFi connectivity issues in hostel rooms causing disruption to online classes',
        categoryId: 2, // Administrative
        userId: users[0].id,
        priority: 'HIGH',
        status: 'PENDING',
      },
      {
        title: 'Incorrect Attendance Marking',
        description: 'Incorrect attendance marking in Mathematics course affecting overall grades',
        categoryId: 1, // Academic
        userId: users[1].id,
        priority: 'MEDIUM',
        status: 'IN_PROGRESS',
        assignedTo: adminUser.id,
      },
      {
        title: 'Medical Certificate Verification',
        description: 'Need medical certificate verification for semester examination',
        categoryId: 3, // Personal
        userId: users[2].id,
        priority: 'LOW',
        status: 'RESOLVED',
        assignedTo: adminUser.id,
        resolutionDate: new Date(),
        resolutionNotes: 'Medical certificate verified and approved',
      },
    ];

    for (const grievanceData of sampleGrievances) {
      const grievance = await prisma.grievance.create({
        data: grievanceData,
      });
      grievances.push(grievance);

      // Create status history for each grievance
      await prisma.grievanceStatusHistory.create({
        data: {
          grievanceId: grievance.id,
          oldStatus: null,
          newStatus: grievance.status,
          changedBy: grievance.userId,
          changeReason: 'Initial submission',
        },
      });
    }

    console.log('✅ Sample grievances created:', grievances.length);
  } else {
    console.log('✅ Sample grievances already exist:', existingGrievances);
  }

  // Create sample notifications (only if none exist for users)
  for (const user of users) {
    const existingNotification = await prisma.notification.findFirst({
      where: {
        userId: user.id,
        title: 'Welcome to Grievance Management System'
      }
    });

    if (!existingNotification) {
      await prisma.notification.create({
        data: {
          userId: user.id,
          title: 'Welcome to Grievance Management System',
          message: 'Your account has been created successfully. You can now submit and track your grievances.',
          type: 'INFO',
          isRead: false,
        },
      });
      console.log('✅ Welcome notification created for:', user.email);
    } else {
      console.log('✅ Welcome notification already exists for:', user.email);
    }
  }

  console.log('✅ Sample notifications created');
  console.log('🌱 Database seeding completed successfully!');
}

main()
  .catch(e => {
    console.error('❌ Error during seeding:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
