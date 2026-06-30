// routes/reports.js
const express = require("express");
const router = express.Router();
const pool = require("../db");

// Inventory summary
router.get("/inventorysummary", async (req, res) => {
  try {
    const productsRes = await pool.query("SELECT * FROM products");
    const products = productsRes.rows;
    const totalProducts = products.length;
    const totalStock = products.reduce((sum, p) => sum + p.stock, 0);
    const lowStock = products.filter(p => p.stock < 5);
    res.json({ totalProducts, totalStock, lowStock });
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch inventory summary" });
  }
});

// Today’s sales snapshot
router.get("/today", async (req, res) => {
  try {
    const salesRes = await pool.query("SELECT * FROM sales WHERE createdAt::date = CURRENT_DATE");
    const sales = salesRes.rows;
    const revenue = sales.reduce((sum, s) => sum + parseFloat(s.amount), 0);
    const items = sales.reduce((sum, s) => sum + s.quantity, 0);
    res.json({ revenue, items });
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch today’s sales" });
  }
});

module.exports = router;
