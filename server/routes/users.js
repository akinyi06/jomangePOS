// routes/users.js
const express = require("express");
const bcrypt = require("bcrypt");
const router = express.Router();
const pool = require("../db");
const authenticateToken = require("../middleware/auth");

// CREATE user (Admin only)
router.post("/", authenticateToken, async (req, res) => {
  const { username, password, role } = req.body;
  const creator = req.user;

  if (creator.role !== "ADMIN") {
    return res.status(403).json({ error: "Only Admin can create users" });
  }

  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    const result = await pool.query(
      "INSERT INTO users (username, password, role) VALUES ($1,$2,$3) RETURNING id, username, role, active, createdAt",
      [username, hashedPassword, role || "STAFF"]
    );

    await pool.query(
      "INSERT INTO audit (username, action, details) VALUES ($1,$2,$3)",
      [creator.username, "USER_CREATE", `Created user ${username} with role ${role}`]
    );

    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: "Failed to create user" });
  }
});

// READ all users (Admin only)
router.get("/", authenticateToken, async (req, res) => {
  if (req.user.role !== "ADMIN") {
    return res.status(403).json({ error: "Only Admin can view users" });
  }

  try {
    const result = await pool.query("SELECT id, username, role, active, createdAt FROM users ORDER BY createdAt DESC");
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch users" });
  }
});

// UPDATE user role or active status (Admin only)
router.put("/:id", authenticateToken, async (req, res) => {
  const { id } = req.params;
  const { role, active } = req.body;

  if (req.user.role !== "ADMIN") {
    return res.status(403).json({ error: "Only Admin can update users" });
  }

  try {
    const result = await pool.query(
      "UPDATE users SET role=$1, active=$2 WHERE id=$3 RETURNING id, username, role, active, createdAt",
      [role, active, id]
    );

    await pool.query(
      "INSERT INTO audit (username, action, details) VALUES ($1,$2,$3)",
      [req.user.username, "USER_UPDATE", `Updated user ${result.rows[0].username} role=${role}, active=${active}`]
    );

    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: "Failed to update user" });
  }
});

// DELETE user (Admin only)
router.delete("/:id", authenticateToken, async (req, res) => {
  const { id } = req.params;

  if (req.user.role !== "ADMIN") {
    return res.status(403).json({ error: "Only Admin can delete users" });
  }

  try {
    const result = await pool.query("DELETE FROM users WHERE id=$1 RETURNING username", [id]);

    await pool.query(
      "INSERT INTO audit (username, action, details) VALUES ($1,$2,$3)",
      [req.user.username, "USER_DELETE", `Deleted user ${result.rows[0]?.username}`]
    );

    res.json({ message: "User deleted" });
  } catch (err) {
    res.status(500).json({ error: "Failed to delete user" });
  }
});

module.exports = router;
