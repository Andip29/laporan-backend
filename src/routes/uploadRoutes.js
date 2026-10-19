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

// Wajib gunakan Memory Storage untuk Vercel Serverless
const storage = multer.memoryStorage();
const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // Maksimal 5MB per foto
});

// POST: Upload Foto Dokumentasi (Mengubah gambar menjadi Data URL Base64)
router.post(
  "/",
  authenticateToken,
  upload.single("image"),
  async (req, res) => {
    try {
      if (!req.file) {
        return res
          .status(400)
          .json({ error: "Tidak ada file foto yang diunggah." });
      }

      // Ubah buffer file menjadi string Base64 Data URL agar bisa langsung ditampilkan di Galeri
      const base64Image = `data:${req.file.mimetype};base64,${req.file.buffer.toString("base64")}`;

      res.json({
        message: "Foto berhasil diunggah!",
        imageUrl: base64Image,
        url: base64Image,
      });
    } catch (err) {
      console.error("Error Upload Photo:", err);
      res.status(500).json({ error: "Gagal mengunggah foto: " + err.message });
    }
  },
);

module.exports = router;
