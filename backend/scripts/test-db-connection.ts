import dotenv from 'dotenv';
import { PrismaClient } from '@prisma/client';

dotenv.config();

const prisma = new PrismaClient();

async function testDatabase() {
  try {
    console.log('🔍 Testing database connection...');
    console.log('Database URL:', process.env.DATABASE_URL?.replace(/:[^:@]*@/, ':***@'));
    
    // Test basic connection
    await prisma.$connect();
    console.log('✅ Database connected successfully');
    
    // Count sample images
    const count = await prisma.sampleImage.count();
    console.log(`📊 Sample images count: ${count}`);
    
    // Get first few records if any exist
    const samples = await prisma.sampleImage.findMany({ take: 3 });
    console.log(`🖼️  First 3 sample images:`, samples.map(s => ({ id: s.id, url: s.url })));
    
    // List all tables
    const tables = await prisma.$queryRaw`
      SELECT table_name FROM information_schema.tables 
      WHERE table_schema = 'public' 
      ORDER BY table_name;
    `;
    console.log('📋 Available tables:', tables);
    
  } catch (error) {
    console.error('❌ Database test failed:', error);
  } finally {
    await prisma.$disconnect();
  }
}

testDatabase();