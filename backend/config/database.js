const sql = require('mssql');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '..', '.env') });

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
  pool: {
    max: 10,
    min: 0,
    idleTimeoutMillis: 30000,
  },
  connectionTimeout: 30000,
  requestTimeout: 30000,
};

let pool = null;

async function getConnection() {
  try {
    if (pool) {
      return pool;
    }

    pool = await sql.connect(config);
    console.log('✓ Connected to SQL Server database');
    return pool;
  } catch (error) {
    console.error('✗ Database connection error:', error.message);
    throw error;
  }
}

async function closeConnection() {
  try {
    if (pool) {
      await pool.close();
      pool = null;
      console.log('✓ Database connection closed');
    }
  } catch (error) {
    console.error('✗ Error closing database connection:', error.message);
  }
}

module.exports = {
  sql,
  getConnection,
  closeConnection,
  config,
};
