const express = require('express');
const router = express.Router();
const { getConnection, sql } = require('../../config/database');

// GET all transactions
router.get('/', async (req, res, next) => {
  try {
    const pool = await getConnection();
    const result = await pool.request().query(`
      SELECT t.*, p.part_number, p.description
      FROM Transactions t
      LEFT JOIN Parts p ON t.part_id = p.part_id
      ORDER BY t.transaction_date DESC
    `);
    res.json(result.recordset);
  } catch (error) {
    next(error);
  }
});

// POST create transaction
router.post('/', async (req, res, next) => {
  try {
    const {
      part_id, transaction_type, quantity, reference_number,
      employee_name, department, notes
    } = req.body;

    const pool = await getConnection();
    const result = await pool.request()
      .input('part_id', sql.Int, part_id)
      .input('transaction_type', sql.NVarChar, transaction_type)
      .input('quantity', sql.Int, quantity)
      .input('reference_number', sql.NVarChar, reference_number)
      .input('employee_name', sql.NVarChar, employee_name)
      .input('department', sql.NVarChar, department)
      .input('notes', sql.NVarChar, notes)
      .query(`
        INSERT INTO Transactions (part_id, transaction_type, quantity, reference_number,
          employee_name, department, notes)
        OUTPUT INSERTED.*
        VALUES (@part_id, @transaction_type, @quantity, @reference_number,
          @employee_name, @department, @notes)
      `);

    res.status(201).json(result.recordset[0]);
  } catch (error) {
    next(error);
  }
});

module.exports = router;
