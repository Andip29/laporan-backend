exports.uploadPhotos = (req, res) => {
  if (!req.files || req.files.length === 0) {
    return res.status(400).json({ error: "Tidak ada foto diupload" });
  }
  const imageUrls = req.files.map((f) => `/uploads/${f.filename}`);
  res.json({ imageUrls });
};
