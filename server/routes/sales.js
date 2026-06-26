// routes/sales.js
const express = require("express");
const router = express.Router();
const pool = require("../db");
const authenticateToken = require("../middleware/auth");

router.post("/", authenticateToken, async (req, res) => {
  const { productId, quantity } = req.body;
  const username = req.user.username;

  try {
    // 1. Get product
    const productRes = await pool.query("SELECT * FROM products WHERE id=$1", [productId]);
    if (productRes.rows.length === 0) return res.status(404).json({ error: "Product not found" });

    const product = productRes.rows[0];
    if (product.stock < quantity) return res.status(400).json({ error: "Insufficient stock" });

    // 2. Calculate amount in KES
    const amount = product.sellingprice * quantity;

    // 3. Deduct stock
    await pool.query("UPDATE products SET stock = stock - $1 WHERE id=$2", [quantity, productId]);

    // 4. Insert sale
    const saleRes = await pool.query(
      "INSERT INTO sales (productId, productName, quantity, amount) VALUES ($1,$2,$3,$4) RETURNING *",
      [productId, product.name, quantity, amount]
    );

    // 5. Insert cash transaction
    await pool.query(
      "INSERT INTO cash (type, amount, remarks) VALUES ($1,$2,$3)",
      ["income", amount, `Sale of ${product.name}`]
    );

    // 6. Insert audit log
    await pool.query(
      "INSERT INTO audit (username, action, details) VALUES ($1,$2,$3)",
      [username, "SALE", `Sold ${quantity} ${product.unit} of ${product.name} for KES ${amount}`]
    );

    res.json(saleRes.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to record sale" });
  }
});

module.exports = router;
