// routes/cash.js
const express = require("express");
const router = express.Router();
const pool = require("../db");
const authenticateToken = require("../middleware/auth");

// CREATE cash transaction
router.post("/", authenticateToken, async (req, res) => {
  const { type, amount, remarks } = req.body;
 const username = req.user.username;

  try {
    if (!["income", "expense"].includes(type.toLowerCase())) {
      return res.status(400).json({ error: "Invalid type. Must be income or expense." });
    }

    const result = await pool.query(
      "INSERT INTO cash (type, amount, remarks) VALUES ($1,$2,$3) RETURNING *",
      [type, amount, remarks]
    );

    // Audit log
    await pool.query(
      "INSERT INTO audit (username, action, details) VALUES ($1,$2,$3)",
      [
        username,
        "CASH_" + type.toUpperCase(),
        `${type} of KES ${amount} recorded. Remarks: ${remarks}`
      ]
    );

    res.json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to record cash transaction" });
  }
});

// READ all cash transactions
router.get("/", authenticateToken, async (req, res) => {
  try {
    const result = await pool.query("SELECT * FROM cash ORDER BY createdAt DESC");
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch cash transactions" });
  }
});
// Get cash summary (today’s revenue)
router.get("/summary", authenticateToken, async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT 
         SUM(CASE WHEN type = 'income' THEN amount ELSE 0 END) AS total_income,
         SUM(CASE WHEN type = 'expense' THEN amount ELSE 0 END) AS total_expense
       FROM cash
       WHERE createdAt::date = CURRENT_DATE`
    );

    const { total_income, total_expense } = result.rows[0];
    const revenue = (total_income || 0) - (total_expense || 0);

    res.json({
      revenue,
      income: total_income || 0,
      expense: total_expense || 0
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch cash summary" });
  }
});


module.exports = router;
