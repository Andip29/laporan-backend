const express = require("express");
const router = express.Router();
const multer = require("multer");
const path = require("path");
const xlsx = require("xlsx");

// Konfigurasi Penyimpanan File
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/");
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  },
});

// Filter jenis file yang diperbolehkan
const fileFilter = (req, file, cb) => {
  const allowedTypes = /jpeg|jpg|png|pdf|doc|docx|xls|xlsx|csv/;
  const extname = allowedTypes.test(
    path.extname(file.originalname).toLowerCase(),
  );
  const mimetype =
    allowedTypes.test(file.mimetype) ||
    file.mimetype ===
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" ||
    file.mimetype === "application/vnd.ms-excel";

  if (extname || mimetype) {
    return cb(null, true);
  } else {
    cb(
      new Error(
        "Format file tidak didukung! Format yang diperbolehkan: Images, PDF, Word, Excel, CSV.",
      ),
    );
  }
};

const upload = multer({ storage: storage, fileFilter: fileFilter });

// Endpoint Upload File Umum (Word, Excel, PDF, Foto)
router.post("/", upload.single("file"), (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: "Tidak ada file yang diunggah." });
    }
    const fileUrl = `/uploads/${req.file.filename}`;
    res.json({
      message: "Upload berhasil",
      fileUrl: fileUrl,
      fileName: req.file.originalname,
      mimetype: req.file.mimetype,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Endpoint Khusus Parsing Data Excel/CSV menjadi JSON Grafik
router.post("/parse-excel", upload.single("file"), (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: "File Excel/CSV tidak ditemukan." });
    }

    // Baca Workbook Excel
    const workbook = xlsx.readFile(req.file.path);
    const sheetName = workbook.SheetNames[0]; // Ambil sheet pertama
    const sheetData = xlsx.utils.sheet_to_json(workbook.Sheets[sheetName]);

    res.json({
      message: "Berhasil membaca data Excel",
      fileName: req.file.originalname,
      data: sheetData,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
