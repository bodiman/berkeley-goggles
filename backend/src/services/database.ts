import { PrismaClient } from '@prisma/client';
import { logger } from '../utils/logger';

// Create Prisma client instance
export const prisma = new PrismaClient({
  log: process.env.NODE_ENV === 'development' ? ['query', 'error', 'warn'] : ['error'],
  datasources: {
    db: {
      url: process.env.DATABASE_URL,
    },
  },
});

// Connect to database
export const connectDatabase = async () => {
  try {
    await prisma.$connect();
    logger.info('✅ Database connected successfully');
    
    // Test the database connection
    await prisma.$queryRaw`SELECT 1`;
    logger.info(`📊 Database type: ${process.env.NODE_ENV === 'development' ? 'SQLite (dev)' : 'PostgreSQL (prod)'}`);
  } catch (error) {
    logger.error('❌ Database connection failed:', error);
    if (process.env.NODE_ENV === 'production') {
      logger.error('💡 Make sure to run database migrations: npm run db:migrate:prod');
    }
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