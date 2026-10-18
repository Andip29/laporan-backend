const jwt = require("jsonwebtoken");
const JWT_SECRET = process.env.JWT_SECRET || "laporan_app_secret_key_123";

module.exports = (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res
      .status(401)
      .json({ error: "Akses ditolak. Silakan login terlebih dahulu!" });
  }

  const token = authHeader.split(" ")[1];
  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded; // Menyimpan data user (id, name, email) ke req.user
    next();
  } catch (err) {
    return res
      .status(403)
      .json({ error: "Token tidak valid atau telah kadaluwarsa." });
  }
};
