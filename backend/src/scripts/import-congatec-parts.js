const XLSX = require('xlsx');
const { getConnection } = require('../../config/database');

async function importCongatecParts() {
  try {
    console.log('📊 Starting Congatec parts import...');
    
    // Read Excel file from root directory
    const workbook = XLSX.readFile('../Congatec Spare Part.xlsx');
    const sheetName = workbook.SheetNames[0];
    const worksheet = workbook.Sheets[sheetName];
    const data = XLSX.utils.sheet_to_json(worksheet);
    
    console.log(`📋 Found ${data.length} parts in Excel file`);
    
    const pool = await getConnection();
    let successCount = 0;
    let errorCount = 0;
    
    for (let i = 0; i < data.length; i++) {
      const row = data[i];
      
      // Skip header rows or empty rows
      if (!row['Spare Part Congatec'] || !row['__EMPTY_1']) {
        continue;
      }
      
      try {
        // Parse the data
        const partNumber = row['__EMPTY_1']?.toString().trim();
        const description = row['__EMPTY_2']?.toString().trim() || '';
        const congatecPartNumber = row['Spare Part Congatec']?.toString().trim() || '';
        const location = row['__EMPTY_4']?.toString().trim() || '';
        const totalQty = parseInt(row['__EMPTY_5']) || 0;
        
        if (!partNumber) {
          console.log(`⚠️  Skipping row ${i + 1}: No part number`);
          continue;
        }
        
        // Check if part already exists
        const existingResult = await pool.request()
          .input('partNumber', partNumber)
          .query('SELECT part_id FROM Parts WHERE part_number = @partNumber');
        
        if (existingResult.recordset.length > 0) {
          console.log(`⚠️  Part ${partNumber} already exists, skipping...`);
          continue;
        }
        
        // Insert new part with Congatec integration
        await pool.request()
          .input('partNumber', partNumber)
          .input('description', description)
          .input('category', 'Congatec') // Mark as Congatec part
          .input('department', 'Test') // Default department for Congatec parts
          .input('location', location)
          .input('storageDetail', congatecPartNumber)
          .input('machineUsed', 'Congatec Testbed')
          .input('currentStock', totalQty)
          .input('minimumStock', 1) // Default minimum stock
          .input('unit', 'piece')
          .query(`
            INSERT INTO Parts (
              part_number, description, category, department, location, 
              storage_detail, machine_used, current_stock, minimum_stock, unit,
              created_at, updated_at
            ) VALUES (
              @partNumber, @description, @category, @department, @location,
              @storageDetail, @machineUsed, @currentStock, @minimumStock, @unit,
              GETDATE(), GETDATE()
            )
          `);
        
        successCount++;
        console.log(`✅ Imported: ${partNumber} - ${description}`);
        
      } catch (error) {
        errorCount++;
        console.error(`❌ Error importing row ${i + 1}:`, error.message);
      }
    }
    
    await pool.close();
    
    console.log('\n📊 Import Summary:');
    console.log(`✅ Successfully imported: ${successCount} parts`);
    console.log(`❌ Errors: ${errorCount}`);
    console.log(`📋 Total processed: ${successCount + errorCount}`);
    
    return successCount;
    
  } catch (error) {
    console.error('💥 Import failed:', error.message);
    throw error;
  }
}

// Run import if called directly
if (require.main === module) {
  importCongatecParts()
    .then((count) => {
      console.log(`\n🎉 Successfully imported ${count} Congatec parts!`);
      process.exit(0);
    })
    .catch((error) => {
      console.error('💥 Import failed:', error);
      process.exit(1);
    });
}

module.exports = { importCongatecParts };
