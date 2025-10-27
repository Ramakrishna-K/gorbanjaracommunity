


const db = require("../config/db");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const admin = require("firebase-admin");
const multer = require("multer");

require("dotenv").config();

if (!process.env.JWT_SECRET) {
  throw new Error("JWT_SECRET not found in .env file. Cannot generate JWT tokens.");
}

// Initialize Firebase Admin
const serviceAccount = require("../config/serviceAccountKey.json");
if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
  });
}

// 🧾 Register User
exports.registerUser = async (req, res) => {
  const { name, email, phone, password } = req.body;

  if (!name || !email || !phone || !password)
    return res.status(400).json({ message: "All fields are required" });

  try {
    // Check if user exists
    db.query("SELECT * FROM users WHERE email = ?", [email], async (err, result) => {
      if (err) return res.status(500).json({ message: "DB Error" });
      if (result.length > 0) return res.status(400).json({ message: "User already exists" });

      const hashedPassword = await bcrypt.hash(password, 10);

      // Generate custom user ID based on first and last letter of name
      db.query("SELECT user_id FROM users ORDER BY id DESC LIMIT 1", (err, last) => {
        if (err) return res.status(500).json({ message: "DB Error" });

        const firstLetter = name.charAt(0).toUpperCase();
        const lastLetter = name.charAt(name.length - 1).toUpperCase();

        let number = 1;
        if (last.length > 0 && last[0].user_id) {
          const lastNumber = parseInt(last[0].user_id.slice(-3));
          number = lastNumber + 1;
        }

        const numberPart = number.toString().padStart(3, "0");
        const newUserId = `${firstLetter}${lastLetter}BNJ${numberPart}`;

        // Insert into database
        db.query(
          "INSERT INTO users (user_id, name, email, phone, password) VALUES (?, ?, ?, ?, ?)",
          [newUserId, name, email, phone, hashedPassword],
          (err, insertResult) => {
            if (err) return res.status(500).json({ message: "Insert Error" });

            const token = jwt.sign(
              { id: insertResult.insertId, email },
              process.env.JWT_SECRET,
              { expiresIn: "1h" }
            );

            res.status(201).json({
              message: "Registration successful",
              userId: newUserId,
              token,
              name,
            });
          }
        );
      });
    });
  } catch (err) {
    console.error("Register Error:", err);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

// 🔐 Login User
exports.loginUser = (req, res) => {
  const { emailOrUserId, password } = req.body;
  if (!emailOrUserId || !password)
    return res.status(400).json({ message: "Missing credentials" });

  db.query(
    "SELECT * FROM users WHERE email = ? OR user_id = ?",
    [emailOrUserId, emailOrUserId],
    async (err, results) => {
      if (err) return res.status(500).json({ message: "DB Error" });
      if (results.length === 0)
        return res.status(404).json({ message: "User not found" });

      const user = results[0];

      // ✅ Fix: compare plain password with hashed string
      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch)
        return res.status(401).json({ message: "Invalid password" });

      const token = jwt.sign(
        { id: user.id, email: user.email },
        process.env.JWT_SECRET,
        { expiresIn: "1h" }
      );

      res.status(200).json({
        message: "Login successful",
        token,
        user: {
          id: user.user_id,
          name: user.name,
          email: user.email,
        },
      });
    }
  );
};

// 🔐 Google Login with proper user ID generation
exports.googleLogin = async (req, res) => {
  try {
    const { token } = req.body;
    const decodedToken = await admin.auth().verifyIdToken(token);
    const { email, name, uid } = decodedToken;

    db.query("SELECT * FROM users WHERE email = ?", [email], (err, result) => {
      if (err) return res.status(500).json({ message: "DB error" });

      if (result.length === 0) {
        db.query("SELECT user_id FROM users ORDER BY id DESC LIMIT 1", (err, last) => {
          if (err) return res.status(500).json({ message: "DB error" });

          const firstLetter = name.charAt(0).toUpperCase();
          const lastLetter = name.charAt(name.length - 1).toUpperCase();

          let number = 1;
          if (last.length > 0 && last[0].user_id) {
            const lastNumber = parseInt(last[0].user_id.slice(-3));
            number = lastNumber + 1;
          }

          const numberPart = number.toString().padStart(3, "0");
          const newUserId = `${firstLetter}${lastLetter}BNJ${numberPart}`;

          db.query(
            "INSERT INTO users (user_id, google_uid, name, email) VALUES (?, ?, ?, ?)",
            [newUserId, uid, name, email],
            (err2, insertResult) => {
              if (err2)
                return res.status(500).json({ message: "DB insert error" });

              const appToken = jwt.sign(
                { id: insertResult.insertId, email },
                process.env.JWT_SECRET,
                { expiresIn: "1h" }
              );

              res.status(201).json({
                message: "Google user registered successfully",
                token: appToken,
                userId: newUserId,
                name,
              });
            }
          );
        });
      } else {
        const user = result[0];
        const appToken = jwt.sign(
          { id: user.id, email: user.email },
          process.env.JWT_SECRET,
          { expiresIn: "1h" }
        );

        res.status(200).json({
          message: "Login successful",
          token: appToken,
          userId: user.user_id,
          name: user.name,
        });
      }
    });
  } catch (err) {
    console.error(err);
    res.status(401).json({ message: "Invalid Google token" });
  }
};

// 🔒 Middleware for protected routes
exports.verifyToken = (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader)
    return res.status(401).json({ message: "No token provided" });

  const token = authHeader.split(" ")[1];
  if (!token)
    return res.status(401).json({ message: "No token provided" });

  jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
    if (err)
      return res.status(403).json({ message: "Invalid or expired token" });
    req.user = decoded;
    next();
  });
};

// 👤 Get User Profile
exports.getProfile = (req, res) => {
  const userId = req.user.id;
  db.query(
    "SELECT user_id, name, email, phone, created_at FROM users WHERE id = ?",
    [userId],
    (err, results) => {
      if (err) return res.status(500).json({ message: "Database error" });
      if (results.length === 0)
        return res.status(404).json({ message: "User not found" });
      res.json(results[0]);
    }
  );
};
