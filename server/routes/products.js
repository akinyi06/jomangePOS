// routes/products.js
const express = require("express");
const router = express.Router();
const pool = require("../db");
const authenticateToken = require("../middleware/auth");

// CREATE product
router.post("/", authenticateToken, async (req, res) => {
  const { name, category, unit, stock, buyingPrice, sellingPrice } = req.body;
  const username = req.user.username;
  const role=req.user.role;
  if (!["ADMIN", "STAFF"].includes(role)) {
    return res.status(403).json({ error: "Unauthorized" });
  }
  try {
    const result = await pool.query(
      `INSERT INTO products (name, category, unit, stock, buyingPrice, sellingPrice)
       VALUES ($1,$2,$3,$4,$5,$6) RETURNING *`,
      [name, category, unit, stock, buyingPrice, sellingPrice]
    );

    // Audit log
    await pool.query(
      "INSERT INTO audit (username, action, details) VALUES ($1,$2,$3)",
      [username, "PRODUCT_CREATE", `Added product ${name} at KES ${sellingPrice}`]
    );

    res.json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to add product" });
  }
});

// READ all products
router.get("/", authenticateToken, async (req, res) => {
  try {
    const result = await pool.query("SELECT * FROM products ORDER BY createdAt DESC");
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch products" });
  }
});

// UPDATE product
router.put("/:id", authenticateToken, async (req, res) => {
  const { id } = req.params;
  const { name, category, unit, stock, buyingPrice, sellingPrice } = req.body;
  const username = req.user.username;

  try {
    const result = await pool.query(
      `UPDATE products SET name=$1, category=$2, unit=$3, stock=$4, buyingPrice=$5, sellingPrice=$6
       WHERE id=$7 RETURNING *`,
      [name, category, unit, stock, buyingPrice, sellingPrice, id]
    );

    await pool.query(
      "INSERT INTO audit (username, action, details) VALUES ($1,$2,$3)",
      [username, "PRODUCT_UPDATE", `Updated product ${name} to KES ${sellingPrice}`]
    );

    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: "Failed to update product" });
  }
});

// DELETE product
router.delete("/:id", authenticateToken, async (req, res) => {
  const { id } = req.params;
  const username = req.user.username;

  try {
    const result = await pool.query("DELETE FROM products WHERE id=$1 RETURNING *", [id]);

    await pool.query(
      "INSERT INTO audit (username, action, details) VALUES ($1,$2,$3)",
      [username, "PRODUCT_DELETE", `Deleted product ${result.rows[0]?.name}`]
    );

    res.json({ message: "Product deleted" });
  } catch (err) {
    res.status(500).json({ error: "Failed to delete product" });
  }
});

module.exports = router;
