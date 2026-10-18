const db = require("../config/database");

exports.getReports = async (req, res) => {
  try {
    const userId = req.user.id; // Ambil ID user dari Token JWT
    const sql = "SELECT * FROM reports WHERE user_id = ? ORDER BY id DESC";
    const [rows] = await db.execute(sql, [userId]);

    const reports = rows.map((row) => ({
      ...row,
      form_data: JSON.parse(row.form_data || "{}"),
      image_urls: JSON.parse(row.image_urls || "[]"),
    }));

    res.json(reports);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.submitReport = async (req, res) => {
  try {
    const userId = req.user.id; // Ambil ID user dari Token JWT
    const { submitted_by, form_data, image_urls } = req.body;

    const sql =
      "INSERT INTO reports (user_id, submitted_by, form_data, image_urls) VALUES (?, ?, ?, ?)";
    const [result] = await db.execute(sql, [
      userId,
      submitted_by,
      JSON.stringify(form_data),
      JSON.stringify(image_urls || []),
    ]);

    res
      .status(201)
      .json({ id: result.insertId, message: "Laporan berhasil disimpan" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
