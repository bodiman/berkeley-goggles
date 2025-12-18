import { PrismaClient } from '@prisma/client';
import { logger } from '../utils/logger';

console.log("database service - DATABASE_URL:", process.env.DATABASE_URL?.substring(0, 50) + '...');

// Create Prisma client instance
// Let Prisma read DATABASE_URL from environment naturally
export const prisma = new PrismaClient({
  log: process.env.NODE_ENV === 'development' ? ['query', 'error', 'warn'] : ['error'],
});

// Connect to database
export const connectDatabase = async () => {
  try {
    await prisma.$connect();
    logger.info('✅ Database connected successfully');
    
    // Test the database connection
    await prisma.$queryRaw`SELECT 1`;
    const dbType = process.env.DATABASE_URL?.startsWith('postgresql://') ? 'PostgreSQL' : 
                   process.env.DATABASE_URL?.startsWith('file:') ? 'SQLite' : 'Unknown';
    logger.info(`📊 Database type: ${dbType}`);
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