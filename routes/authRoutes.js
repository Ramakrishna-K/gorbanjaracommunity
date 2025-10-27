

const express = require("express");
const router = express.Router();
const multer = require("multer");
const path = require("path");

const { registerUser,getProfile, loginUser, googleLogin, verifyToken,applyScholarship } = require("../controllers/authController");
// const { verifyToken, getProfile } = authController;

router.post("/register", registerUser);
router.post("/login", loginUser);
router.post("/google-login", googleLogin);

// Example protected route
router.get("/protected", verifyToken, (req, res) => {
  res.json({ message: `Hello ${req.user.email}, you are authorized!` });
});
router.get("/profile", verifyToken, getProfile);

module.exports = router;
