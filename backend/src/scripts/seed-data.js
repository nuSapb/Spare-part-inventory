const sql = require('mssql');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '..', '..', '.env') });

const config = {
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  server: process.env.DB_SERVER,
  port: parseInt(process.env.DB_PORT || '1433'),
  database: process.env.DB_DATABASE,
  options: {
    encrypt: process.env.DB_ENCRYPT === 'true',
    trustServerCertificate: process.env.DB_TRUST_SERVER_CERTIFICATE === 'true',
    enableArithAbort: true,
  },
  connectionTimeout: 30000,
  requestTimeout: 30000,
};

async function seedData() {
  let pool;
  try {
    console.log('Connecting to SQL Server...');
    pool = await sql.connect(config);
    console.log('✓ Connected to SparePartsInventory database');

    // Insert sample parts
    console.log('\nInserting sample parts...');
    await pool.request().query(`
      SET IDENTITY_INSERT Parts ON;

      INSERT INTO Parts (part_id, part_number, description, category, department, location, storage_detail, machine_used, current_stock, minimum_stock, unit, image_url) VALUES
      (1, 'RES-100K-0805', '100K Ohm Resistor 0805', 'Electronics', 'SMT', 'Warehouse', 'A1-22', 'Pick and Place', 5000, 1000, 'piece', 'https://images.unsplash.com/photo-1591799264318-7e6ef8ddb7ea?w=400&h=400&fit=crop'),
      (2, 'CAP-10UF-1206', '10uF Ceramic Capacitor 1206', 'Electronics', 'SMT', 'Warehouse', 'A1-23', 'Pick and Place', 3000, 500, 'piece', 'https://images.unsplash.com/photo-1601370690183-1c7796ecec61?w=400&h=400&fit=crop'),
      (3, 'IC-MCU-STM32', 'STM32 Microcontroller', 'Electronics', 'SMT', 'Warehouse', 'B2-15', 'Pick and Place', 150, 50, 'piece', 'https://images.unsplash.com/photo-1598965675045-4895e5a4b5e7?w=400&h=400&fit=crop'),
      (4, 'SOLDER-WIRE-1MM', 'Solder Wire 1mm 60/40', 'Consumables', 'Maintenance', 'Maintenance Room', 'C3-10', 'Wave Soldering', 25, 10, 'kg', 'https://images.unsplash.com/photo-1581092160562-40aa08e78837?w=400&h=400&fit=crop'),
      (5, 'FLUX-PASTE-50G', 'Soldering Flux Paste 50g', 'Consumables', 'Maintenance', 'Maintenance Room', 'C3-11', 'Wave Soldering', 0, 20, 'piece', 'https://images.unsplash.com/photo-1581092918056-0c4c3acd3789?w=400&h=400&fit=crop'),
      (6, 'BLADE-SAW-254MM', 'Circular Saw Blade 254mm', 'Tools', 'Maintenance', 'Maintenance Area', 'D1-05', NULL, 8, 5, 'piece', 'https://images.unsplash.com/photo-1572981779307-38b8cabb2407?w=400&h=400&fit=crop'),
      (7, 'BEARING-6205', 'Deep Groove Ball Bearing 6205', 'Mechanical', 'Production', 'Warehouse', 'E2-30', 'Conveyor System', 45, 20, 'piece', 'https://images.unsplash.com/photo-1590642916589-592764865440?w=400&h=400&fit=crop'),
      (8, 'BELT-TIMING-HTD', 'HTD Timing Belt 8mm 200T', 'Mechanical', 'Production', 'Warehouse', 'E2-31', 'Assembly Line', 12, 5, 'piece', 'https://images.unsplash.com/photo-1581092162384-8987c1d64718?w=400&h=400&fit=crop');

      SET IDENTITY_INSERT Parts OFF;
    `);
    console.log('✓ Sample parts inserted');

    // Insert sample employees
    console.log('\nInserting sample employees...');
    await pool.request().query(`
      SET IDENTITY_INSERT Employees ON;

      INSERT INTO Employees (employee_id, employee_code, name, department, position, email, phone, is_active) VALUES
      (1, 'EMP001', 'John Smith', 'Maintenance', 'Technician', 'john.smith@company.com', '555-0101', 1),
      (2, 'EMP002', 'Sarah Johnson', 'Production', 'Line Supervisor', 'sarah.johnson@company.com', '555-0102', 1),
      (3, 'EMP003', 'Mike Chen', 'SMT', 'Operator', 'mike.chen@company.com', '555-0103', 1),
      (4, 'EMP004', 'Lisa Wong', 'Assembly', 'Technician', 'lisa.wong@company.com', '555-0104', 1);

      SET IDENTITY_INSERT Employees OFF;
    `);
    console.log('✓ Sample employees inserted');

    // Insert sample transactions
    console.log('\nInserting sample transactions...');
    await pool.request().query(`
      SET IDENTITY_INSERT Transactions ON;

      INSERT INTO Transactions (transaction_id, part_id, transaction_type, quantity, reference_number, employee_name, department, notes) VALUES
      (1, 1, 'issue', -500, 'REQ-2024-001', 'Mike Chen', 'SMT', 'Production batch #1234'),
      (2, 2, 'issue', -200, 'REQ-2024-002', 'Mike Chen', 'SMT', 'Production batch #1234'),
      (3, 3, 'issue', -10, 'REQ-2024-003', 'Mike Chen', 'SMT', 'Prototype run'),
      (4, 4, 'issue', -2, 'REQ-2024-004', 'John Smith', 'Maintenance', 'Repair work order #567'),
      (5, 7, 'receive', 50, 'PO-2024-100', NULL, 'Warehouse', 'Purchase order received');

      SET IDENTITY_INSERT Transactions OFF;
    `);
    console.log('✓ Sample transactions inserted');

    console.log('\n✅ Sample data inserted successfully!');
  } catch (error) {
    console.error('\n❌ Error inserting sample data:', error.message);
    process.exit(1);
  } finally {
    if (pool) {
      await pool.close();
    }
  }
}

seedData();
