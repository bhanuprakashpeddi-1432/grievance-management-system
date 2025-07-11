import { PrismaClient } from '@prisma/client';
import dotenv from 'dotenv';

dotenv.config();

// Create a global Prisma client instance
const globalForPrisma = globalThis;

const prisma = globalForPrisma.prisma ?? new PrismaClient({
  log: process.env.NODE_ENV === 'development' ? ['query', 'error', 'warn'] : ['error'],
});

if (process.env.NODE_ENV !== 'production') {
  globalForPrisma.prisma = prisma;
}

// Test database connection
async function testConnection() {
  try {
    await prisma.$connect();
    console.log('✅ Database connected successfully with Prisma');
    return true;
  } catch (error) {
    console.error('❌ Database connection failed:', error.message);
    return false;
  }
}

// Graceful shutdown
async function disconnect() {
  await prisma.$disconnect();
}

export { prisma, testConnection, disconnect };
export default prisma;
