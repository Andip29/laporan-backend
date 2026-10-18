const db = require("./database");

async function initDb() {
  try {
    // 1. Tabel Users
    await db.query(`CREATE TABLE IF NOT EXISTS users (
      id INT AUTO_INCREMENT PRIMARY KEY,
      name VARCHAR(255) NOT NULL,
      email VARCHAR(255) UNIQUE NOT NULL,
      password VARCHAR(255) NOT NULL,
      role VARCHAR(50) DEFAULT 'technician',
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )`);

    // 2. Tabel Reports (Dengan User ID)
    await db.query(`CREATE TABLE IF NOT EXISTS reports (
      id INT AUTO_INCREMENT PRIMARY KEY,
      user_id INT NOT NULL,
      submitted_by VARCHAR(255) NOT NULL,
      form_data TEXT NOT NULL,
      image_urls TEXT,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )`);

    // 3. Tabel Drive Files (Dengan User ID)
    await db.query(`CREATE TABLE IF NOT EXISTS drive_files (
      id INT AUTO_INCREMENT PRIMARY KEY,
      user_id INT NOT NULL,
      original_name VARCHAR(255) NOT NULL,
      file_name VARCHAR(255) NOT NULL,
      file_url VARCHAR(255) NOT NULL,
      file_size INT NOT NULL,
      mime_type VARCHAR(100),
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )`);

    console.log("✅ Database MySQL & Tabel Multi-User Siap!");
  } catch (err) {
    console.error("❌ Gagal Inisialisasi Database:", err.message);
  }
}

module.exports = initDb;
