const express = require("express");
const router = express.Router();
const multer = require("multer");

// Memory Storage wajib untuk Serverless Vercel
const storage = multer.memoryStorage();
const upload = multer({
  storage,
  limits: { fileSize: 10 * 1024 * 1024 }, // Maksimal 10MB
});

// POST: Accept field 'image' ATAU 'file' dari Frontend
router.post("/", upload.single("file"), async (req, res) => {
  try {
    if (!req.file) {
      return res
        .status(400)
        .json({ error: "Tidak ada file foto yang diunggah." });
    }

    // Konversi buffer gambar langsung ke Base64 Data URL
    const base64Image = `data:${req.file.mimetype};base64,${req.file.buffer.toString("base64")}`;

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
