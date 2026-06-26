// routes/audit.js
const express = require("express");
const router = express.Router();
const pool = require("../db");
const authenticateToken = require("../middleware/auth");

// READ all audit logs (Admin only)
router.get("/", authenticateToken, async (req, res) => {
  if (req.user.role !== "ADMIN") {
    return res.status(403).json({ error: "Only Admin can view audit logs" });
  }

  try {
    const result = await pool.query("SELECT * FROM audit ORDER BY createdAt DESC");
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch audit logs" });
  }
});

module.exports = router;
