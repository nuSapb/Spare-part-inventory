const express = require('express');
const router = express.Router();
const { getConnection, sql } = require('../../config/database');

// GET all parts
router.get('/', async (req, res, next) => {
  try {
    const pool = await getConnection();
    const result = await pool.request().query('SELECT * FROM Parts ORDER BY part_number');
    res.json(result.recordset);
  } catch (error) {
    next(error);
  }
});

// GET single part by ID
router.get('/:id', async (req, res, next) => {
  try {
    const pool = await getConnection();
    const result = await pool.request()
      .input('id', sql.Int, req.params.id)
      .query('SELECT * FROM Parts WHERE part_id = @id');

    if (result.recordset.length === 0) {
      return res.status(404).json({ error: 'Part not found' });
    }

    res.json(result.recordset[0]);
  } catch (error) {
    next(error);
  }
});

// POST create new part
router.post('/', async (req, res, next) => {
  try {
    const {
      part_number, description, category, department, location,
      storage_detail, machine_used, current_stock, minimum_stock, unit, image_url
    } = req.body;

    const pool = await getConnection();
    const result = await pool.request()
      .input('part_number', sql.NVarChar, part_number)
      .input('description', sql.NVarChar, description)
      .input('category', sql.NVarChar, category)
      .input('department', sql.NVarChar, department)
      .input('location', sql.NVarChar, location)
      .input('storage_detail', sql.NVarChar, storage_detail || null)
      .input('machine_used', sql.NVarChar, machine_used || null)
      .input('current_stock', sql.Int, current_stock || 0)
      .input('minimum_stock', sql.Int, minimum_stock || 0)
      .input('unit', sql.NVarChar, unit || 'piece')
      .input('image_url', sql.NVarChar, image_url || null)
      .query(`
        INSERT INTO Parts (part_number, description, category, department, location,
          storage_detail, machine_used, current_stock, minimum_stock, unit, image_url)
        OUTPUT INSERTED.*
        VALUES (@part_number, @description, @category, @department, @location,
          @storage_detail, @machine_used, @current_stock, @minimum_stock, @unit, @image_url)
      `);

    res.status(201).json(result.recordset[0]);
  } catch (error) {
    if (error.number === 2627) { // Unique constraint violation
      return res.status(400).json({ error: 'Part number already exists' });
    }
    next(error);
  }
});

// PUT update part
router.put('/:id', async (req, res, next) => {
  try {
    const {
      part_number, description, category, department, location,
      storage_detail, machine_used, current_stock, minimum_stock, unit, image_url
    } = req.body;

    const pool = await getConnection();
    const result = await pool.request()
      .input('id', sql.Int, req.params.id)
      .input('part_number', sql.NVarChar, part_number)
      .input('description', sql.NVarChar, description)
      .input('category', sql.NVarChar, category)
      .input('department', sql.NVarChar, department)
      .input('location', sql.NVarChar, location)
      .input('storage_detail', sql.NVarChar, storage_detail)
      .input('machine_used', sql.NVarChar, machine_used)
      .input('current_stock', sql.Int, current_stock)
      .input('minimum_stock', sql.Int, minimum_stock)
      .input('unit', sql.NVarChar, unit)
      .input('image_url', sql.NVarChar, image_url)
      .query(`
        UPDATE Parts
        SET part_number = @part_number, description = @description, category = @category,
            department = @department, location = @location, storage_detail = @storage_detail,
            machine_used = @machine_used, current_stock = @current_stock,
            minimum_stock = @minimum_stock, unit = @unit, image_url = @image_url
        OUTPUT INSERTED.*
        WHERE part_id = @id
      `);

    if (result.recordset.length === 0) {
      return res.status(404).json({ error: 'Part not found' });
    }

    res.json(result.recordset[0]);
  } catch (error) {
    next(error);
  }
});

// DELETE part
router.delete('/:id', async (req, res, next) => {
  try {
    const pool = await getConnection();
    const result = await pool.request()
      .input('id', sql.Int, req.params.id)
      .query('DELETE FROM Parts WHERE part_id = @id');

    if (result.rowsAffected[0] === 0) {
      return res.status(404).json({ error: 'Part not found' });
    }

    res.json({ message: 'Part deleted successfully' });
  } catch (error) {
    next(error);
  }
});

module.exports = router;
