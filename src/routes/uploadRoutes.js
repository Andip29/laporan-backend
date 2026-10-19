const express = require("express");
const router = express.Router();
const multer = require("multer");

// Memory Storage untuk Serverless Vercel
const storage = multer.memoryStorage();
const upload = multer({
  storage,
  limits: { fileSize: 4 * 1024 * 1024 }, // Batas aman Vercel: 4MB
});

// POST: Upload Foto
router.post("/", (req, res) => {
  upload.any()(req, res, async (err) => {
    // Tangani jika file melebihi limit 4MB
    if (err) {
      if (err.code === "LIMIT_FILE_SIZE") {
        return res.status(400).json({
          error: "Ukuran foto terlalu besar! Maksimal 4 MB.",
        });
      }
      return res.status(500).json({ error: err.message });
    }

    try {
      if (!req.files || req.files.length === 0) {
        return res
          .status(400)
          .json({ error: "Tidak ada file foto yang diunggah." });
      }

      const uploadedFile = req.files[0];

      // Konversi gambar ke Data URL Base64
      const base64Image = `data:${uploadedFile.mimetype};base64,${uploadedFile.buffer.toString("base64")}`;

      // Kembalikan semua variasi properti URL agar cocok dengan kodingan Frontend kamu
      return res.status(200).json({
        success: true,
        message: "Foto berhasil diunggah!",
        url: base64Image,
        imageUrl: base64Image,
        path: base64Image,
        data: base64Image,
      });
    } catch (error) {
      console.error("Error Upload Photo:", error);
      return res
        .status(500)
        .json({ error: "Gagal memproses foto: " + error.message });
    }
  });
});

module.exports = router;
