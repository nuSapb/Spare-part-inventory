const express = require('express');
const router = express.Router();
const { getConnection } = require('../../config/database');

// Get all stock alerts (calculated from parts with low stock)
router.get('/', async (req, res, next) => {
  try {
    const pool = await getConnection();
    const result = await pool.request().query(`
      SELECT 
        p.part_id as alert_id,
        p.part_number,
        p.description,
        p.current_stock,
        p.minimum_stock,
        p.location,
        p.created_at,
        CASE 
          WHEN p.current_stock = 0 THEN 'out_of_stock'
          WHEN p.current_stock <= p.minimum_stock THEN 'low_stock'
          ELSE 'normal'
        END as alert_type,
        'active' as status,
        NULL as acknowledged_by,
        NULL as acknowledged_at
      FROM Parts p
      WHERE p.current_stock <= p.minimum_stock
      ORDER BY 
        CASE 
          WHEN p.current_stock = 0 THEN 1
          ELSE 2
        END,
        (p.current_stock * 1.0 / NULLIF(p.minimum_stock, 0)) ASC
    `);
    
    res.json(result.recordset);
  } catch (error) {
    next(error);
  }
});

// Create a new alert (manual alert creation)
router.post('/', async (req, res, next) => {
  try {
    const { part_id, alert_type, message } = req.body;
    
    if (!part_id || !alert_type) {
      return res.status(400).json({ error: 'Part ID and alert type are required' });
    }

    const pool = await getConnection();
    const result = await pool.request()
      .input('part_id', require('mssql').Int, part_id)
      .input('alert_type', require('mssql').VarChar(50), alert_type)
      .input('message', require('mssql').Text, message || null)
      .input('created_at', require('mssql').DateTime, new Date())
      .query(`
        INSERT INTO StockAlerts (part_id, alert_type, message, created_at)
        OUTPUT inserted.*
        VALUES (@part_id, @alert_type, @message, @created_at)
      `);
    
    res.status(201).json(result.recordset[0]);
  } catch (error) {
    next(error);
  }
});

// Acknowledge an alert
router.put('/:id/acknowledge', async (req, res, next) => {
  try {
    const { acknowledged_by } = req.body;
    const alertId = req.params.id;
    
    if (!acknowledged_by) {
      return res.status(400).json({ error: 'Acknowledged by is required' });
    }

    const pool = await getConnection();
    const result = await pool.request()
      .input('alert_id', require('mssql').Int, alertId)
      .input('acknowledged_by', require('mssql').VarChar(100), acknowledged_by)
      .input('acknowledged_at', require('mssql').DateTime, new Date())
      .query(`
        UPDATE StockAlerts 
        SET status = 'acknowledged', 
            acknowledged_by = @acknowledged_by,
            acknowledged_at = @acknowledged_at
        OUTPUT inserted.*
        WHERE alert_id = @alert_id
      `);
    
    if (result.recordset.length === 0) {
      return res.status(404).json({ error: 'Alert not found' });
    }
    
    res.json(result.recordset[0]);
  } catch (error) {
    next(error);
  }
});

// Delete an alert
router.delete('/:id', async (req, res, next) => {
  try {
    const alertId = req.params.id;
    
    const pool = await getConnection();
    const result = await pool.request()
      .input('alert_id', require('mssql').Int, alertId)
      .query(`
        DELETE FROM StockAlerts 
        OUTPUT deleted.*
        WHERE alert_id = @alert_id
      `);
    
    if (result.recordset.length === 0) {
      return res.status(404).json({ error: 'Alert not found' });
    }
    
    res.json({ message: 'Alert deleted successfully' });
  } catch (error) {
    next(error);
  }
});

module.exports = router;
