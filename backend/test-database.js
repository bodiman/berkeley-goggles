const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function testTrophyFields() {
  try {
    console.log('🔍 Testing database trophy fields...\n');
    
    // Test 1: Check if trophy fields exist in schema
    console.log('1. Checking PhotoRanking table structure...');
    
    // Try to create a test entry with trophy fields
    const testUser = await prisma.user.create({
      data: {
        name: 'Test User',
        email: 'test@example.com',
        password: 'test123',
        agreedToTerms: true,
        agreedToPrivacy: true,
      }
    });

    const testPhoto = await prisma.photo.create({
      data: {
        userId: testUser.id,
        url: 'https://example.com/test.jpg',
        originalFilename: 'test.jpg',
        fileSize: 1000,
        width: 400,
        height: 400,
        format: 'jpg'
      }
    });

    const testRanking = await prisma.photoRanking.create({
      data: {
        photoId: testPhoto.id,
        userId: testUser.id,
        trophyScore: 500,
        hiddenBradleyTerryScore: 0.3,
        targetTrophyScore: 1200,
        totalComparisons: 10,
        wins: 6,
        losses: 4
      }
    });

    console.log('✅ Successfully created test ranking with trophy fields!');
    console.log('Test ranking data:');
    console.log(`  Trophy Score: ${testRanking.trophyScore}`);
    console.log(`  Hidden BT Score: ${testRanking.hiddenBradleyTerryScore}`);
    console.log(`  Target Trophy: ${testRanking.targetTrophyScore}`);
    
    // Test 2: Check TrophyConfig table
    console.log('\n2. Testing TrophyConfig table...');
    
    const defaultConfig = await prisma.trophyConfig.create({
      data: {
        configName: 'default',
        winGain: 35,
        lossPenalty: 25,
        targetMean: 1500,
        targetStd: 430,
        fadeWidth: 300,
        learningRate: 0.05
      }
    });

    console.log('✅ Successfully created trophy config!');
    console.log('Config data:');
    console.log(`  Win Gain: ${defaultConfig.winGain}`);
    console.log(`  Target Mean: ${defaultConfig.targetMean}`);
    console.log(`  Fade Width: ${defaultConfig.fadeWidth}`);

    // Clean up test data
    console.log('\n3. Cleaning up test data...');
    await prisma.photoRanking.delete({ where: { id: testRanking.id } });
    await prisma.photo.delete({ where: { id: testPhoto.id } });
    await prisma.user.delete({ where: { id: testUser.id } });
    await prisma.trophyConfig.delete({ where: { id: defaultConfig.id } });
    
    console.log('✅ Test data cleaned up successfully!');
    console.log('\n🎉 All trophy system database fields are working correctly!');
    
  } catch (error) {
    console.error('❌ Database test failed:', error.message);
    console.error('Full error:', error);
  } finally {
    await prisma.$disconnect();
  }
}

testTrophyFields();