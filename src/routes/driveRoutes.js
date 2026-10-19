const express = require("express");
const router = express.Router();
const multer = require("multer");
const jwt = require("jsonwebtoken");
const db = require("../config/db-laporan-kerja");

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

// Memory Storage untuk Vercel Serverless
const storage = multer.memoryStorage();
const upload = multer({
  storage,
  limits: { fileSize: 10 * 1024 * 1024 }, // Maksimal 10MB
});

// GET: Ambil daftar file user
router.get("/", authenticateToken, async (req, res) => {
  try {
    const userId = req.user.id;
    const [rows] = await db.query(
      "SELECT id, original_name, file_name, file_url, file_size, mime_type, created_at FROM drive_files WHERE user_id = ? ORDER BY created_at DESC",
      [userId],
    );
    res.json(rows);
  } catch (err) {
    console.error("Error GET drive:", err);
    res
      .status(500)
      .json({ error: "Gagal mengambil data drive: " + err.message });
  }
});

// POST: Upload File Metadata
router.post("/", authenticateToken, upload.single("file"), async (req, res) => {
  try {
    if (!req.file)
      return res.status(400).json({ error: "Tidak ada file yang dipilih." });

    const userId = req.user.id;
    const fileName = req.file.originalname;
    const fileSize = req.file.size;
    const mimeType = req.file.mimetype;
    const fileUrl = `/uploads/${fileName}`; // URL placeholder/simulasi

    // Mengisi seluruh kolom sesuai skema database db-laporan-kerja
    const [result] = await db.query(
      "INSERT INTO drive_files (user_id, original_name, file_name, file_url, file_size, mime_type) VALUES (?, ?, ?, ?, ?, ?)",
      [userId, fileName, fileName, fileUrl, fileSize, mimeType],
    );

    res.json({
      message: "File berhasil disimpan!",
      id: result.insertId,
      original_name: fileName,
      file_name: fileName,
      file_url: fileUrl,
      file_size: fileSize,
      mime_type: mimeType,
    });
  } catch (err) {
    console.error("Error POST drive:", err);
    res
      .status(500)
      .json({ error: "Gagal menyimpan ke database: " + err.message });
  }
});

// DELETE: Hapus File
router.delete("/:id", authenticateToken, async (req, res) => {
  try {
    const userId = req.user.id;
    const fileId = req.params.id;
    await db.query("DELETE FROM drive_files WHERE id = ? AND user_id = ?", [
      fileId,
      userId,
    ]);
    res.json({ message: "File berhasil dihapus" });
  } catch (err) {
    console.error("Error DELETE drive:", err);
    res.status(500).json({ error: "Gagal menghapus file: " + err.message });
  }
});

module.exports = router;
