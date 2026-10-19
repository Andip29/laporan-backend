const express = require("express");
const router = express.Router();
const multer = require("multer");

// Memory Storage wajib untuk Vercel Serverless
const storage = multer.memoryStorage();
const upload = multer({
  storage,
  limits: { fileSize: 10 * 1024 * 1024 }, // Maksimal 10MB
});

// POST: Terima file dari FIELD NAMA APA PUN (upload.any)
router.post("/", upload.any(), async (req, res) => {
  try {
    // Cek apakah ada file yang terunggah
    if (!req.files || req.files.length === 0) {
      return res
        .status(400)
        .json({ error: "Tidak ada file foto yang diunggah." });
    }

    const uploadedFile = req.files[0]; // Ambil file pertama

    // Konversi buffer gambar langsung ke Base64 Data URL
    const base64Image = `data:${uploadedFile.mimetype};base64,${uploadedFile.buffer.toString("base64")}`;

    res.json({
      message: "Foto berhasil diunggah!",
      imageUrl: base64Image,
      url: base64Image,
      path: base64Image,
    });
  } catch (err) {
    console.error("Error Upload Photo:", err);
    res.status(500).json({ error: "Gagal mengunggah foto: " + err.message });
  }
});

module.exports = router;
