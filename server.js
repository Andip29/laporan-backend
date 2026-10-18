const express = require("express");
const cors = require("cors");
const path = require("path");
const initDb = require("./src/config/initDb");

const reportRoutes = require("./src/routes/reportRoutes");
const uploadRoutes = require("./src/routes/uploadRoutes");
// 1. Import route drive baru
const driveRoutes = require("./src/routes/driveRoutes");
const authRoutes = require("./src/routes/authRoutes");

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

app.use("/uploads", express.static(path.join(__dirname, "uploads")));

initDb();

app.use("/api/reports", reportRoutes);
app.use("/api/upload", uploadRoutes);
// 2. Daftarkan endpoint /api/drive di sini
app.use("/api/drive", driveRoutes);
app.use("/api/auth", authRoutes);

app.listen(PORT, () => {
  console.log(`🚀 Server Backend Berjalan di http://localhost:${PORT}`);
});
