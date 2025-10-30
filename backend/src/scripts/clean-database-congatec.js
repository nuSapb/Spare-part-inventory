const { getConnection } = require('../../config/database');

async function cleanDatabaseForCongatecOnly() {
  try {
    console.log('🧹 Starting database cleanup for Congatec-only system...');
    
    const pool = await getConnection();
    
    // Check current parts in database
    const allPartsResult = await pool.request()
      .query('SELECT part_id, part_number, category, current_stock FROM Parts ORDER BY category');
    
    console.log(`📊 Current database: ${allPartsResult.recordset.length} total parts`);
    
    // Separate Congatec and non-Congatec parts
    const congatecParts = allPartsResult.recordset.filter(part => part.category === 'Congatec');
    const nonCongatecParts = allPartsResult.recordset.filter(part => part.category !== 'Congatec');
    
    console.log(`✅ Congatec parts to keep: ${congatecParts.length}`);
    console.log(`🗑️  Non-Congatec parts to remove: ${nonCongatecParts.length}`);
    
    // Remove non-Congatec parts
    let deletedCount = 0;
    for (const part of nonCongatecParts) {
      try {
        // Delete related transactions first
        await pool.request()
          .input('partId', part.part_id)
          .query('DELETE FROM Transactions WHERE part_id = @partId');
        
        // Delete alerts related to this part
        await pool.request()
          .input('partId', part.part_id)
          .query('DELETE FROM StockAlerts WHERE part_id = @partId');
        
        // Delete the part
        await pool.request()
          .input('partId', part.part_id)
          .query('DELETE FROM Parts WHERE part_id = @partId');
        
        deletedCount++;
        console.log(`🗑️  Deleted: ${part.part_number} (${part.category})`);
      } catch (error) {
        console.error(`❌ Error deleting ${part.part_number}:`, error.message);
      }
    }
    
    // Verify final state
    const finalResult = await pool.request()
      .query(`SELECT COUNT(*) as total_parts, SUM(CASE WHEN category = 'Congatec' THEN 1 ELSE 0 END) as congatec_parts FROM Parts`);
    
    const stats = finalResult.recordset[0];
    
    await pool.close();
    
    console.log('\n📊 Cleanup Summary:');
    console.log(`✅ Parts deleted: ${deletedCount}`);
    console.log(`✅ Congatec parts remaining: ${stats.congatec_parts}`);
    console.log(`✅ Total parts remaining: ${stats.total_parts}`);
    console.log(`🎉 Database is now Congatec-only!`);
    
    return {
      deletedParts: deletedCount,
      remainingParts: stats.total_parts,
      congatecParts: stats.congatec_parts
    };
    
  } catch (error) {
    console.error('💥 Database cleanup failed:', error.message);
    throw error;
  }
}

// Run cleanup if called directly
if (require.main === module) {
  cleanDatabaseForCongatecOnly()
    .then((result) => {
      console.log('\n🎉 Database cleanup completed successfully!');
      process.exit(0);
    })
    .catch((error) => {
      console.error('💥 Database cleanup failed:', error);
      process.exit(1);
    });
}

module.exports = { cleanDatabaseForCongatecOnly };
