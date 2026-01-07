const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function checkDatabase() {
  try {
    const [sampleCount, rankingCount, genderBreakdown] = await Promise.all([
      prisma.sampleImage.count(),
      prisma.sampleImageRanking.count(),
      prisma.sampleImage.groupBy({
        by: ['gender'],
        _count: { id: true }
      })
    ]);
    
    console.log('Current database state:');
    console.log(`Sample images: ${sampleCount}`);
    console.log(`Sample rankings: ${rankingCount}`);
    console.log('Gender breakdown:');
    genderBreakdown.forEach(group => {
      console.log(`  ${group.gender}: ${group._count.id}`);
    });
    
  } catch (error) {
    console.error('Error:', error.message);
  } finally {
    await prisma.$disconnect();
  }
}

checkDatabase();