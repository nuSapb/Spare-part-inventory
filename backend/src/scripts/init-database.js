const sql = require('mssql');
const fs = require('fs');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '..', '..', '.env') });

const config = {
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  server: process.env.DB_SERVER,
  port: parseInt(process.env.DB_PORT || '1433'),
  database: '',
  options: {
    encrypt: process.env.DB_ENCRYPT === 'true',
    trustServerCertificate: process.env.DB_TRUST_SERVER_CERTIFICATE === 'true',
    enableArithAbort: true,
  },
  connectionTimeout: 30000,
  requestTimeout: 30000,
};

async function initDatabase() {
  let pool;
  try {
    console.log('Connecting to SQL Server...');
    pool = await sql.connect(config);
    console.log('✓ Connected to SQL Server');

    // Read and execute schema script
    const schemaPath = path.join(__dirname, '../../init-scripts/01-create-database.sql');
    const schemaSQL = fs.readFileSync(schemaPath, 'utf8');

    console.log('\nExecuting schema creation script...');
    const schemaBatches = schemaSQL.split('GO');
    for (const batch of schemaBatches) {
      if (batch.trim()) {
        await pool.request().query(batch);
      }
    }
    console.log('✓ Database schema created');

    // Read and execute seed data script
    const seedPath = path.join(__dirname, '../../init-scripts/02-seed-data.sql');
    const seedSQL = fs.readFileSync(seedPath, 'utf8');

    console.log('\nExecuting seed data script...');
    const seedBatches = seedSQL.split('GO');
    for (const batch of seedBatches) {
      if (batch.trim()) {
        await pool.request().query(batch);
      }
    }
    console.log('✓ Sample data inserted');

    console.log('\n✅ Database initialization complete!');
  } catch (error) {
    console.error('\n❌ Error initializing database:', error.message);
    process.exit(1);
  } finally {
    if (pool) {
      await pool.close();
    }
  }
}

initDatabase();
