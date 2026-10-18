const fs = require("fs");
const path = require("path");
const db = require("../config/database");

exports.uploadFile = async (req, res) => {
  try {
    if (!req.file)
      return res.status(400).json({ error: "Tidak ada file diupload" });
    const userId = req.user.id;
    const { originalname, filename, size, mimetype } = req.file;
    const fileUrl = `/uploads/${filename}`;

    const sql =
      "INSERT INTO drive_files (user_id, original_name, file_name, file_url, file_size, mime_type) VALUES (?, ?, ?, ?, ?, ?)";
    const [result] = await db.execute(sql, [
      userId,
      originalname,
      filename,
      fileUrl,
      size,
      mimetype,
    ]);

    res.status(201).json({ id: result.insertId, originalname, fileUrl });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getAllFiles = async (req, res) => {
  try {
    const userId = req.user.id;
    const [rows] = await db.execute(
      "SELECT * FROM drive_files WHERE user_id = ? ORDER BY id DESC",
      [userId],
    );
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.deleteFile = async (req, res) => {
  try {
    const userId = req.user.id;
    const { id } = req.params;

    const [rows] = await db.execute(
      "SELECT * FROM drive_files WHERE id = ? AND user_id = ?",
      [id, userId],
    );
    if (rows.length === 0)
      return res.status(404).json({ error: "File tidak ditemukan" });

    const filePath = path.join(__dirname, "../../uploads", rows[0].file_name);
    if (fs.existsSync(filePath)) fs.unlinkSync(filePath);

    await db.execute("DELETE FROM drive_files WHERE id = ? AND user_id = ?", [
      id,
      userId,
    ]);
    res.json({ message: "File berhasil dihapus" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
