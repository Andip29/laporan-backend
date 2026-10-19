const multer = require("multer");

// Gunakan Memory Storage (Wajib untuk Vercel Serverless)
const storage = multer.memoryStorage();

const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // Maksimal 5MB per file
});

module.exports = upload;
