const express = require("express");
const router = express.Router();
const upload = require("../middlewares/uploadMiddleware");
const controller = require("../controllers/driveController");
const authMiddleware = require("../middlewares/authMiddleware");

// Pasang authMiddleware di setiap rute
router.get("/", authMiddleware, controller.getAllFiles);
router.post("/", authMiddleware, upload.single("file"), controller.uploadFile);
router.delete("/:id", authMiddleware, controller.deleteFile);

module.exports = router;
