const express = require("express");
const router = express.Router();
const multer = require("multer");
const jwt = require("jsonwebtoken");
const db = require("../config/database");

// Middleware Verifikasi Token JWT
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];

  if (!token) {
    return res
      .status(401)
      .json({ error: "Token tidak ditemukan. Silakan login kembali!" });
  }

  jwt.verify(token, process.env.JWT_SECRET || "secretkey", (err, user) => {
    if (err)
      return res
        .status(403)
        .json({ error: "Sesi login habis, silakan login ulang." });
    req.user = user;
    next();
  });
};

const storage = multer.memoryStorage();
const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // Maksimal 5MB
});

// GET: Ambil semua foto galeri milik user yang login
router.get("/", authenticateToken, async (req, res) => {
  try {
    const userId = req.user.id;
    // Mengambil berkas bertipe gambar dari drive_files
    const [rows] = await db.query(
      `SELECT id, original_name, file_url, created_at 
       FROM drive_files 
       WHERE user_id = ? AND (mime_type LIKE 'image%' OR file_name LIKE '%.png' OR file_name LIKE '%.jpg' OR file_name LIKE '%.jpeg') 
       ORDER BY created_at DESC`,
      [userId],
    );
    res.json(rows);
  } catch (err) {
    console.error("Error GET galeri:", err);
    res
      .status(500)
      .json({ error: "Gagal mengambil galeri foto: " + err.message });
  }
});

// POST: Simpan foto ke Database (Base64 / Data URL)
router.post("/", authenticateToken, upload.any(), async (req, res) => {
  try {
    if (!req.files || req.files.length === 0) {
      return res
        .status(400)
        .json({ error: "Tidak ada file foto yang diunggah." });
    }

    const userId = req.user.id;
    const imageUrls = [];

    for (const file of req.files) {
      const fileName = file.originalname;
      const fileSize = file.size;
      const mimeType = file.mimetype;
      const base64Url = `data:${mimeType};base64,${file.buffer.toString("base64")}`;

      // Simpan langsung ke database agar tersimpan permanen saat reload/pindah halaman
      await db.query(
        "INSERT INTO drive_files (user_id, original_name, file_name, file_url, file_size, mime_type) VALUES (?, ?, ?, ?, ?, ?)",
        [userId, fileName, fileName, base64Url, fileSize, mimeType],
      );

      imageUrls.push(base64Url);
    }

    res.json({
      message: "Foto berhasil diunggah dan disimpan ke database!",
      imageUrls: imageUrls,
    });
  } catch (err) {
    console.error("Error Upload Photo:", err);
    res
      .status(500)
      .json({ error: "Gagal menyimpan foto ke database: " + err.message });
  }
});

module.exports = router;
