const db = require("../config/database");

class ReportService {
  async create({ submittedBy, formData, imageUrls }) {
    const sql =
      "INSERT INTO reports (submitted_by, form_data, image_urls) VALUES (?, ?, ?)";
    const [result] = await db.execute(sql, [
      submittedBy,
      JSON.stringify(formData),
      JSON.stringify(imageUrls || []),
    ]);
    return result.insertId;
  }

  async getAll() {
    const sql = "SELECT * FROM reports ORDER BY id DESC";
    const [rows] = await db.execute(sql);
    return rows.map((row) => ({
      ...row,
      form_data: JSON.parse(row.form_data || "{}"),
      image_urls: JSON.parse(row.image_urls || "[]"),
    }));
  }
}

module.exports = new ReportService();
