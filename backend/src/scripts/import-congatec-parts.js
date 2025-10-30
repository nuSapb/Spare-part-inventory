const XLSX = require('xlsx');
const { getConnection } = require('../../config/database');

async function importCongatecParts() {
  try {
    console.log('📊 Starting Congatec parts import...');
    
    const pool = await getConnection();
    
    // First, add missing columns to Parts table
    try {
      console.log('🔧 Adding missing columns to database...');
      
      // Add spare_name column
      await pool.request().query(`
        IF NOT EXISTS (SELECT * FROM INFORMATION_SCHEMA.COLUMNS WHERE TABLE_NAME = 'Parts' AND COLUMN_NAME = 'spare_name')
        BEGIN
          ALTER TABLE Parts ADD spare_name NVARCHAR(255) NULL
        END
      `);
      
      // Add change_rate column
      await pool.request().query(`
        IF NOT EXISTS (SELECT * FROM INFORMATION_SCHEMA.COLUMNS WHERE TABLE_NAME = 'Parts' AND COLUMN_NAME = 'change_rate')
        BEGIN
          ALTER TABLE Parts ADD change_rate NVARCHAR(100) NULL
        END
      `);
      
      // Add photo column
      await pool.request().query(`
        IF NOT EXISTS (SELECT * FROM INFORMATION_SCHEMA.COLUMNS WHERE TABLE_NAME = 'Parts' AND COLUMN_NAME = 'photo')
        BEGIN
          ALTER TABLE Parts ADD photo NVARCHAR(500) NULL
        END
      `);
      
      console.log('✅ Database columns updated');
    } catch (error) {
      console.log('⚠️  Database column update failed (may already exist):', error.message);
    }
    
    // Read Excel file from root directory
    const workbook = XLSX.readFile('../Congatec Spare Part.xlsx');
    const sheetName = workbook.SheetNames[0];
    const worksheet = workbook.Sheets[sheetName];
    const data = XLSX.utils.sheet_to_json(worksheet);
    
    console.log(`📋 Found ${data.length} parts in Excel file`);
    
    let successCount = 0;
    let errorCount = 0;
    
    for (let i = 0; i < data.length; i++) {
      const row = data[i];
      
      // Skip header rows - look for actual data with numeric No. in __EMPTY
      if (!row['__EMPTY'] || isNaN(row['__EMPTY'])) {
        continue;
      }
      
      try {
        // Parse the data using correct column names
        const partNumber = row['__EMPTY_1']?.toString().trim() || row['No.']?.toString().trim();
        const spareName = row['__EMPTY']?.toString().trim() || '';
        const description = row['__EMPTY_2']?.toString().trim() || '';
        const congatecPartNumber = row['__EMPTY_3']?.toString().trim() || '';
        const whereUse = row['Spare Part Congatec']?.toString().trim() || '';
        const location = row['__EMPTY_4']?.toString().trim() || '';
        const totalQty = parseInt(row['__EMPTY_5']) || 0;
        const changeRate = row['__EMPTY_6']?.toString().trim() || '';
        const photo = row['__EMPTY_7']?.toString().trim() || '';
        
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
        
        // Insert new part with all Excel columns
        await pool.request()
          .input('partNumber', partNumber)
          .input('spareName', spareName)
          .input('description', description)
          .input('category', 'Congatec') // Mark as Congatec part
          .input('department', 'Test') // Default department for Congatec parts
          .input('location', location)
          .input('storageDetail', congatecPartNumber)
          .input('machineUsed', whereUse)
          .input('currentStock', totalQty)
          .input('minimumStock', 1) // Default minimum stock
          .input('unit', 'piece')
          .input('changeRate', changeRate)
          .input('photo', photo)
          .query(`
            INSERT INTO Parts (
              part_number, spare_name, description, category, department, location, 
              storage_detail, machine_used, current_stock, minimum_stock, unit,
              change_rate, photo, created_at, updated_at
            ) VALUES (
              @partNumber, @spareName, @description, @category, @department, @location,
              @storageDetail, @machineUsed, @currentStock, @minimumStock, @unit,
              @changeRate, @photo, GETDATE(), GETDATE()
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
