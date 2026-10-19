exports.uploadPhotos = (req, res) => {
  try {
    if (!req.files || req.files.length === 0) {
      return res.status(400).json({ error: "Tidak ada foto diupload" });
    }

    // Ubah buffer file foto menjadi Data URL Base64
    const imageUrls = req.files.map((f) => {
      return `data:${f.mimetype};base64,${f.buffer.toString("base64")}`;
    });

    // Kembalikan dalam bentuk array imageUrls dan url tunggal agar cocok dengan semua halaman frontend
    res.json({
      message: "Foto berhasil diunggah!",
      imageUrls: imageUrls,
      url: imageUrls[0],
      imageUrl: imageUrls[0],
    });
  } catch (err) {
    console.error("Error uploadPhotos:", err);
    res
      .status(500)
      .json({ error: "Gagal memproses upload foto: " + err.message });
  }
};
