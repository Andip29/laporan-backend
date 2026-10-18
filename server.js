const express = require("express");
const cors = require("cors");
const path = require("path");
const initDb = require("./src/config/initDb");

const reportRoutes = require("./src/routes/reportRoutes");
const uploadRoutes = require("./src/routes/uploadRoutes");
const driveRoutes = require("./src/routes/driveRoutes");
const authRoutes = require("./src/routes/authRoutes");

const app = express();
const PORT = process.env.PORT || 5000;

app.use(
  cors({
    origin: "*",
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
  }),
);

app.use(express.json());
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

app.use("/api/auth", authRoutes);
app.use("/api/reports", reportRoutes);
app.use("/api/upload", uploadRoutes);
app.use("/api/drive", driveRoutes);

// Endpoint khusus manual untuk inisialisasi tabel TiDB Cloud
app.get("/api/init-db", async (req, res) => {
  try {
    await initDb();
    res.json({
      message: "Database dan Tabel Berhasil Diinisialisasi di TiDB!",
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.get("/api", (req, res) => {
  res.json({ message: "API Laporan Kerja Serverless Aktif!" });
});

if (process.env.NODE_ENV !== "production") {
  app.listen(PORT, () => {
    console.log(`🚀 Server Backend Berjalan di http://localhost:${PORT}`);
  });
}

module.exports = app;
