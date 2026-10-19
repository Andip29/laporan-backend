const express = require("express");
const router = express.Router();
const controller = require("../controllers/repController");
const authMiddleware = require("../middlewares/authMiddleware");
const db = require("../config/database");

// Pasang authMiddleware di setiap rute
router.get("/", authMiddleware, controller.getReports);
router.post("/", authMiddleware, controller.submitReport);

module.exports = router;
