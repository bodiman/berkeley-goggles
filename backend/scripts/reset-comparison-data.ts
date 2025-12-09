import { PrismaClient } from '@prisma/client';
import * as readline from 'readline';

const prisma = new PrismaClient();

// Create readline interface for user input
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

// Helper function to prompt user for input
function promptUser(question: string): Promise<string> {
  return new Promise((resolve) => {
    rl.question(question, (answer) => {
      resolve(answer);
    });
  });
}

async function resetComparisonData() {
  console.log('\n🚨 WARNING: COMPARISON DATA RESET SCRIPT 🚨\n');
  
  // Environment check
  if (process.env.NODE_ENV === 'production') {
    console.log('❌ This script cannot be run in production environment!');
    process.exit(1);
  }
  
  console.log('This script will permanently delete ALL comparison and ranking data:');
  console.log('📊 Tables that will be cleared:');
  console.log('   • Comparison (all user comparisons)');
  console.log('   • ComparisonSession (all comparison sessions)');
  console.log('   • PhotoRanking (all photo rankings and stats)');
  console.log('   • SampleImageRanking (all sample image rankings)');
  console.log('   • CombinedRanking (all combined rankings)');
  console.log('   • CombinedRankingHistory (all combined ranking history)');
  console.log('   • PercentileHistory (all percentile history)');
  console.log('\n⚠️  This action is IRREVERSIBLE and will:');
  console.log('   • Remove all comparison history');
  console.log('   • Reset all photo rankings to defaults');
  console.log('   • Clear all user voting sessions');
  console.log('   • Delete all ranking statistics');
  console.log('\n💡 User accounts and photos will NOT be deleted');
  
  // First confirmation
  const firstConfirmation = await promptUser('\nDo you want to continue? Type "yes" to proceed: ');
  
  if (firstConfirmation !== 'yes') {
    console.log('\n✅ Operation cancelled. No data was modified.');
    rl.close();
    return;
  }
  
  // Final confirmation
  console.log('\n🔴 FINAL CONFIRMATION REQUIRED 🔴');
  console.log('Type exactly "confirm" (without quotes) to proceed with data deletion:');
  
  const finalConfirmation = await promptUser('> ');
  
  if (finalConfirmation !== 'confirm') {
    console.log('\n✅ Operation cancelled. Confirmation not received.');
    rl.close();
    return;
  }
  
  console.log('\n🔄 Starting data reset...\n');
  
  try {
    // Delete data in correct order to avoid foreign key conflicts
    
    console.log('🗑️  Deleting percentile history...');
    const percentileHistoryCount = await prisma.percentileHistory.deleteMany();
    console.log(`   ✓ Deleted ${percentileHistoryCount.count} percentile history records`);
    
    console.log('🗑️  Deleting combined ranking history...');
    const combinedHistoryCount = await prisma.combinedRankingHistory.deleteMany();
    console.log(`   ✓ Deleted ${combinedHistoryCount.count} combined ranking history records`);
    
    console.log('🗑️  Deleting comparisons...');
    const comparisonCount = await prisma.comparison.deleteMany();
    console.log(`   ✓ Deleted ${comparisonCount.count} comparison records`);
    
    console.log('🗑️  Deleting comparison sessions...');
    const sessionCount = await prisma.comparisonSession.deleteMany();
    console.log(`   ✓ Deleted ${sessionCount.count} comparison session records`);
    
    console.log('🗑️  Deleting photo rankings...');
    const photoRankingCount = await prisma.photoRanking.deleteMany();
    console.log(`   ✓ Deleted ${photoRankingCount.count} photo ranking records`);
    
    console.log('🗑️  Deleting sample image rankings...');
    const sampleRankingCount = await prisma.sampleImageRanking.deleteMany();
    console.log(`   ✓ Deleted ${sampleRankingCount.count} sample image ranking records`);
    
    console.log('🗑️  Deleting combined rankings...');
    const combinedRankingCount = await prisma.combinedRanking.deleteMany();
    console.log(`   ✓ Deleted ${combinedRankingCount.count} combined ranking records`);
    
    console.log('\n✅ Data reset completed successfully!');
    console.log('\n📊 Summary:');
    console.log(`   • ${comparisonCount.count} comparisons deleted`);
    console.log(`   • ${sessionCount.count} comparison sessions deleted`);
    console.log(`   • ${photoRankingCount.count} photo rankings deleted`);
    console.log(`   • ${sampleRankingCount.count} sample image rankings deleted`);
    console.log(`   • ${combinedRankingCount.count} combined rankings deleted`);
    console.log(`   • ${combinedHistoryCount.count} combined history records deleted`);
    console.log(`   • ${percentileHistoryCount.count} percentile history records deleted`);
    
    console.log('\n🎯 The system is now ready for fresh comparisons and rankings!');
    console.log('\n💡 Next steps:');
    console.log('   • Users can start making comparisons again');
    console.log('   • New rankings will be generated from scratch');
    console.log('   • All duplicate prevention logic will work with clean slate');
    
  } catch (error) {
    console.error('\n❌ Error during data reset:', error);
    console.log('\n⚠️  Database may be in inconsistent state. Consider manual cleanup.');
    process.exit(1);
  } finally {
    await prisma.$disconnect();
    rl.close();
  }
}

async function main() {
  try {
    await resetComparisonData();
  } catch (error) {
    console.error('Fatal error:', error);
    process.exit(1);
  }
}

// Run the script if executed directly
if (require.main === module) {
  main();
}

export { resetComparisonData };