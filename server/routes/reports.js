// routes/reports.js
const express = require("express");
const router = express.Router();
const pool = require("../db");
const authenticateToken = require("../middleware/auth");

router.get("/daily", authenticateToken, async (req, res) => {
  const result = await pool.query(
    "SELECT DATE(createdAt) as day, SUM(amount) as revenue FROM sales GROUP BY day ORDER BY day DESC LIMIT 7"
  );
  res.json(result.rows);
});

router.get("/alltime", authenticateToken, async (req, res) => {
  const result = await pool.query("SELECT SUM(amount) as revenue, SUM(quantity) as items_sold FROM sales");
  res.json(result.rows[0]);
});

router.get("/cashbalance", authenticateToken, async (req, res) => {
  const income = await pool.query("SELECT SUM(amount) as total FROM cash WHERE type='income'");
  const expense = await pool.query("SELECT SUM(amount) as total FROM cash WHERE type='expense'");
  res.json({ balance: (income.rows[0].total || 0) - (expense.rows[0].total || 0) });
});

module.exports = router;
