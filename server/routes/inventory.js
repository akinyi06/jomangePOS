// routes/inventory.js
const express = require("express");
const router = express.Router();
const pool = require("../db");
const authenticateToken = require("../middleware/auth");

router.post("/", authenticateToken, async (req, res) => {
  const { productId, type, quantity, remarks } = req.body;
  const username = req.user.username;

  try {
    // 1. Get product
    const productRes = await pool.query("SELECT * FROM products WHERE id=$1", [productId]);
    if (productRes.rows.length === 0) return res.status(404).json({ error: "Product not found" });

    const product = productRes.rows[0];

    // 2. Adjust stock
    let newStock = product.stock;
    if (type.toUpperCase() === "ADD") {
      newStock += quantity;
    } else if (type.toUpperCase() === "REMOVE") {
      if (product.stock < quantity) return res.status(400).json({ error: "Insufficient stock" });
      newStock -= quantity;
    } else {
      return res.status(400).json({ error: "Invalid type" });
    }

    await pool.query("UPDATE products SET stock=$1 WHERE id=$2", [newStock, productId]);

    // 3. Insert inventory movement
    const invRes = await pool.query(
      "INSERT INTO inventory (productId, productName, type, quantity, remarks) VALUES ($1,$2,$3,$4,$5) RETURNING *",
      [productId, product.name, type, quantity, remarks]
    );

    // 4. Audit log
    await pool.query(
      "INSERT INTO audit (username, action, details) VALUES ($1,$2,$3)",
      [username, "INVENTORY_" + type.toUpperCase(), `${type} ${quantity} units of ${product.name}`]
    );

    res.json(invRes.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to record inventory movement" });
  }
});

router.get("/", authenticateToken, async (req, res) => {
  try {
    const result = await pool.query("SELECT * FROM inventory ORDER BY createdAt DESC");
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch inventory movements" });
  }
});

module.exports = router;
