const express = require("express");
const router = express.Router();
const multer = require("multer");
const path = require("path");
const { applyScholarship } = require("../controllers/scholarshipController");

// Multer setup
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/");
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  },
});
const upload = multer({ storage });

// POST /api/scholarship/apply
router.post("/apply", upload.single("file"), applyScholarship);

module.exports = router;
