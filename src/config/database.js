const mysql = require("mysql2/promise");

const pool = mysql.createPool({
  host:
    process.env.DB_HOST || "gateway01.ap-southeast-1.prod.aws.tidbcloud.com",
  user: process.env.DB_USER || "root",
  password: process.env.DB_PASSWORD || "",
  database: process.env.DB_NAME || "db-laporan-kerja",
  port: process.env.DB_PORT || 4000,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
  ssl: {
    rejectUnauthorized: false, // Wajib untuk koneksi aman ke TiDB Cloud di Vercel
  },
});

module.exports = pool;
