const express = require('express');
const router = express.Router();
const { getConnection, sql } = require('../../config/database');

// GET all employees
router.get('/', async (req, res, next) => {
  try {
    const pool = await getConnection();
    const result = await pool.request().query('SELECT * FROM Employees ORDER BY name');
    res.json(result.recordset);
  } catch (error) {
    next(error);
  }
});

// POST create employee
router.post('/', async (req, res, next) => {
  try {
    const { employee_code, name, department, position, email, phone } = req.body;

    const pool = await getConnection();
    const result = await pool.request()
      .input('employee_code', sql.NVarChar, employee_code)
      .input('name', sql.NVarChar, name)
      .input('department', sql.NVarChar, department)
      .input('position', sql.NVarChar, position)
      .input('email', sql.NVarChar, email)
      .input('phone', sql.NVarChar, phone)
      .query(`
        INSERT INTO Employees (employee_code, name, department, position, email, phone)
        OUTPUT INSERTED.*
        VALUES (@employee_code, @name, @department, @position, @email, @phone)
      `);

    res.status(201).json(result.recordset[0]);
  } catch (error) {
    next(error);
  }
});

module.exports = router;
