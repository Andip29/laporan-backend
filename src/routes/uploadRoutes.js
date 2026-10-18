const express = require("express");
const router = express.Router();
const upload = require("../middlewares/uploadMiddleware");
const controller = require("../controllers/uploadController");

router.post("/", upload.array("photos", 10), controller.uploadPhotos);

module.exports = router;
