const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '..', '.env') });

const { getConnection, closeConnection } = require('../config/database');
const partsRoutes = require('./routes/parts');
const transactionsRoutes = require('./routes/transactions');
const employeesRoutes = require('./routes/employees');
const alertsRoutes = require('./routes/alerts');
const uploadRoutes = require('./routes/upload');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
// Temporarily disable helmet to debug CORS issues
// app.use(helmet());
app.use(cors({
  origin: process.env.CORS_ORIGIN || 'http://localhost:3000',
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}));
app.use(morgan('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve static files (uploaded images)
app.use('/uploads', express.static(path.join(__dirname, '..', 'uploads')));

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'ok', message: 'Server is running' });
});

// API Routes
app.use('/api/parts', partsRoutes);
app.use('/api/transactions', transactionsRoutes);
app.use('/api/employees', employeesRoutes);
app.use('/api/stock-alerts', alertsRoutes);
app.use('/api/upload', uploadRoutes);

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Error:', err);
  res.status(err.status || 500).json({
    error: {
      message: err.message || 'Internal server error',
      status: err.status || 500,
    },
  });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({ error: 'Not found' });
});

// Start server
async function startServer() {
  try {
    // Test database connection
    await getConnection();

    app.listen(PORT, () => {
      console.log(`\n✓ Server is running on port ${PORT}`);
      console.log(`✓ Frontend: ${process.env.CORS_ORIGIN}`);
      console.log(`✓ Health check: http://localhost:${PORT}/health\n`);
    });
  } catch (error) {
    console.error('✗ Failed to start server:', error.message);
    process.exit(1);
  }
}

// Graceful shutdown
process.on('SIGTERM', async () => {
  console.log('\nSIGTERM received. Closing server...');
  await closeConnection();
  process.exit(0);
});

process.on('SIGINT', async () => {
  console.log('\nSIGINT received. Closing server...');
  await closeConnection();
  process.exit(0);
});

startServer();
