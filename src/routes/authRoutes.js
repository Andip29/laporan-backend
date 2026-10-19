const express = require("express");
const router = express.Router();
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const db = require("../config/db-laporan-kerja");

// POST: Register User
router.post("/register", async (req, res) => {
  try {
    const { name, email, password } = req.body;
    if (!name || !email || !password) {
      return res
        .status(400)
        .json({ error: "Nama, email, dan password wajib diisi!" });
    }

    // Cek apakah email sudah terdaftar
    const [existing] = await db.query("SELECT id FROM users WHERE email = ?", [
      email,
    ]);
    if (existing.length > 0) {
      return res.status(400).json({ error: "Email sudah terdaftar!" });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Simpan user baru ke database
    const [result] = await db.query(
      "INSERT INTO users (name, email, password) VALUES (?, ?, ?)",
      [name, email, hashedPassword],
    );

    res.json({
      message: "Registrasi berhasil! Silakan login.",
      userId: result.insertId,
    });
  } catch (err) {
    console.error("Error Register:", err);
    res.status(500).json({ error: "Gagal registrasi: " + err.message });
  }
});

// POST: Login User
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ error: "Email dan password wajib diisi!" });
    }

    // Cari user berdasarkan email
    const [users] = await db.query("SELECT * FROM users WHERE email = ?", [
      email,
    ]);
    if (users.length === 0) {
      return res.status(400).json({ error: "Email atau password salah!" });
    }

    const user = users[0];

    // Cek kecocokan password (bcrypt atau plain text jika password lama belum di-hash)
    let isMatch = false;
    if (user.password.startsWith("$2a$") || user.password.startsWith("$2b$")) {
      isMatch = await bcrypt.compare(password, user.password);
    } else {
      isMatch = password === user.password;
    }

    if (!isMatch) {
      return res.status(400).json({ error: "Email atau password salah!" });
    }

    // Buat token JWT
    const token = jwt.sign(
      { id: user.id, name: user.name, email: user.email },
      process.env.JWT_SECRET || "secretkey",
      { expiresIn: "7d" },
    );

    res.json({
      message: "Login berhasil!",
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
      },
    });
  } catch (err) {
    console.error("Error Login:", err);
    res.status(500).json({ error: "Gagal login: " + err.message });
  }
});

module.exports = router;
