import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import pool from "../config/db.js";

export const register = async (req, res) => {
  const { name, email, password } = req.body;
  try {
    const hashed = await bcrypt.hash(password, 10);
    const result = await pool.query(
      "INSERT INTO users (name, email, password_hash, role) VALUES ($1, $2, $3, 'guest') RETURNING id, name, email",
      [name, email, hashed]
    );
    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: "User registration failed" });
  }
};

export const login = async (req, res) => {
  const { email, password } = req.body;
  try {
    const userRes = await pool.query("SELECT * FROM users WHERE email=$1", [email]);
    if (userRes.rows.length === 0) return res.status(400).json({ error: "Invalid credentials" });

    const valid = await bcrypt.compare(password, userRes.rows[0].password_hash);
    if (!valid) return res.status(400).json({ error: "Invalid credentials" });

    const token = jwt.sign({ id: userRes.rows[0].id, role: userRes.rows[0].role }, process.env.JWT_SECRET, { expiresIn: "1d" });
    res.json({ token });
  } catch (err) {
    res.status(500).json({ error: "Login failed" });
  }
};
