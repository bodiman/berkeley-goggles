import { PrismaClient } from '@prisma/client';
import { logger } from '../utils/logger';

// Create Prisma client instance
export const prisma = new PrismaClient({
  log: process.env.NODE_ENV === 'development' ? ['query', 'error', 'warn'] : ['error'],
});

// Connect to database
export const connectDatabase = async () => {
  try {
    await prisma.$connect();
    logger.info('✅ Database connected successfully');
  } catch (error) {
    logger.error('❌ Database connection failed:', error);
    process.exit(1);
  }
};

// Disconnect from database
export const disconnectDatabase = async () => {
  try {
    await prisma.$disconnect();
    logger.info('📦 Database disconnected');
  } catch (error) {
    logger.error('❌ Database disconnection failed:', error);
  }
};

// Handle graceful shutdown
process.on('beforeExit', async () => {
  await disconnectDatabase();
});

process.on('SIGINT', async () => {
  await disconnectDatabase();
  process.exit(0);
});

process.on('SIGTERM', async () => {
  await disconnectDatabase();
  process.exit(0);
});