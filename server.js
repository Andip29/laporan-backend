const express = require("express");
const cors = require("cors");
const path = require("path");

const reportRoutes = require("./src/routes/reportRoutes");
const uploadRoutes = require("./src/routes/uploadRoutes");
const driveRoutes = require("./src/routes/driveRoutes");
const authRoutes = require("./src/routes/authRoutes");

const app = express();
const PORT = process.env.PORT || 5000;

// Opsi CORS Terbuka untuk Vercel & Domain Custom
app.use(
  cors({
    origin: "*",
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
  }),
);

app.use(express.json());

// Akses Folder Uploads
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// Rute Endpoint API
app.use("/api/auth", authRoutes);
app.use("/api/reports", reportRoutes);
app.use("/api/upload", uploadRoutes);
app.use("/api/drive", driveRoutes);

// Endpoint Tes Koneksi Server
app.get("/api", (req, res) => {
  res.json({ message: "API Laporan Kerja Serverless Aktif & Terhubung!" });
});

// Jalankan server lokal jika bukan di lingkungan Vercel
if (process.env.NODE_ENV !== "production") {
  app.listen(PORT, () => {
    console.log(`🚀 Server Backend Berjalan di http://localhost:${PORT}`);
  });
}

// Export app khusus Vercel Serverless Function
module.exports = app;
