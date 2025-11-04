



// const express = require("express");
// const cors = require("cors");
// require("dotenv").config();
// const fs = require("fs");
// const path = require("path");
// const db = require("./config/db");

// // Routes
// const authRoutes = require("./routes/authRoutes");
// const scholarshipRoutes = require("./routes/scholarshipRoutes");
// const donationRoutes = require("./routes/donationRoutes");

// const app = express();



// const allowedOrigins = [
//   "http://localhost:5173",
//   "https://gorbanjara08.vercel.app"
// ];

// app.use(
//   cors({
//     origin: function (origin, callback) {
//       if (!origin || allowedOrigins.includes(origin)) {
//         callback(null, true);
//       } else {
//         console.log("❌ Blocked by CORS:", origin);
//         callback(new Error("CORS policy: This origin is not allowed."));
//       }
//     },
//     methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
//     credentials: true,
//   })
// );


// app.use(express.json());
// app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// // Ensure uploads folder exists
// const uploadDir = path.join(__dirname, "uploads");
// if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir, { recursive: true });

// // API Routes
// app.use("/api/auth", authRoutes);
// app.use("/api/scholarship", scholarshipRoutes); // all scholarship routes
// app.use("/api/donations", donationRoutes);

// // Test root route
// app.get("/", (req, res) => res.send("API Running 🚀"));
// app.get("/", (req, res) => {
//   res.send("Backend connected with Railway MySQL ✅");
// });
// // Start server
// const PORT = process.env.PORT || 3200;
// app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));



// require("dotenv").config(); // Load .env
// const express = require("express");
// const cors = require("cors");
// const helmet = require("helmet");
// const morgan = require("morgan");
// const fs = require("fs");
// const path = require("path");

// // Database connection
// const db = require("./config/db");

// // Routes
// const authRoutes = require("./routes/authRoutes");
// const scholarshipRoutes = require("./routes/scholarshipRoutes");
// const donationRoutes = require("./routes/donationRoutes");

// const app = express();

// // =======================
// // 🔒 Security + Middleware
// // =======================
// app.use(helmet()); // Adds security headers
// app.use(morgan("dev")); // Logs incoming requests
// app.use(express.json()); // Parses JSON requests

// // =======================
// // 🌐 CORS Configuration
// // =======================
// const allowedOrigins = [
//   "http://localhost:5173",
//   "https://gorbanjara08.vercel.app", // your deployed frontend
// ];

// const corsOptions = {
//   origin: function (origin, callback) {
//     if (!origin || allowedOrigins.includes(origin)) {
//       callback(null, true);
//     } else {
//       console.log("❌ Blocked by CORS:", origin);
//       callback(new Error("CORS policy: This origin is not allowed."));
//     }
//   },
//   methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
//   credentials: true,
//   optionsSuccessStatus: 204,
// };

// app.use(cors(corsOptions));
// app.options(/.*/, cors(corsOptions));

// // =======================
// // 📁 Static Uploads Setup
// // =======================
// const uploadDir = path.join(__dirname, "uploads");
// if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir, { recursive: true });
// app.use("/uploads", express.static(uploadDir));

// // =======================
// // 🚀 API Routes
// // =======================
// app.use("/api/auth", authRoutes);
// app.use("/api/scholarship", scholarshipRoutes);
// app.use("/api/donations", donationRoutes);

// // =======================
// // ❤️ Health / Root Endpoints
// // =======================
// app.get("/health", (req, res) => {
//   res.json({ ok: true, uptime: process.uptime(), env: process.env.NODE_ENV || "development" });
// });

// app.get("/", (req, res) => {
//   res.send("Backend connected with Railway MySQL ✅");
// });

// // =======================
// // ⚠️ 404 & Error Handling
// // =======================
// app.use((req, res, next) => {
//   res.status(404).json({ error: "Not found" });
// });

// app.use((err, req, res, next) => {
//   console.error("Server error:", err && err.message ? err.message : err);
//   if (err.message && err.message.startsWith("CORS policy")) {
//     return res.status(403).json({ error: err.message });
//   }
//   res.status(500).json({ error: "Internal server error" });
// });

// // =======================
// // 🟢 Start Server
// // =======================
// const PORT = parseInt(process.env.PORT || "3200", 10);
// const HOST = process.env.HOST || "0.0.0.0";

// app.listen(PORT, HOST, () => {
//   console.log(`🚀 Server running on http://${HOST}:${PORT} (NODE_ENV=${process.env.NODE_ENV || "development"})`);});




require("dotenv").config(); // Load environment variables

const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const morgan = require("morgan");
const fs = require("fs");
const path = require("path");

// Database connection
const db = require("./config/db");

// Routes
const authRoutes = require("./routes/authRoutes");
const scholarshipRoutes = require("./routes/scholarshipRoutes");
const donationRoutes = require("./routes/donationRoutes");

const app = express();

// =======================
// 🔒 Security + Middleware
// =======================
app.use(helmet());
app.use(morgan("dev"));
app.use(express.json());

// =======================
// 🌐 CORS Configuration
// =======================
const allowedOrigins = [
  "http://localhost:5173",
  "https://gorbanjara01.vercel.app", // ✅ your frontend deployed
  "https://gorbanjara08.vercel.app", // ✅ optional other frontend version
];

app.use((req, res, next) => {
  const origin = req.headers.origin;
  if (allowedOrigins.includes(origin)) {
    res.setHeader("Access-Control-Allow-Origin", origin);
  }
  res.setHeader("Access-Control-Allow-Methods", "GET,POST,PUT,DELETE,OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");
  res.setHeader("Access-Control-Allow-Credentials", "true");
  if (req.method === "OPTIONS") {
    return res.sendStatus(200);
  }
  next();
});

// =======================
// 📁 Static Uploads Setup
// =======================
const uploadDir = path.join(__dirname, "uploads");
if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir, { recursive: true });
app.use("/uploads", express.static(uploadDir));

// =======================
// 🚀 API Routes
// =======================
app.use("/api/auth", authRoutes);
app.use("/api/scholarship", scholarshipRoutes);
app.use("/api/donations", donationRoutes);

// =======================
// ❤️ Health Check + Root
// =======================
app.get("/health", (req, res) => {
  res.json({
    ok: true,
    uptime: process.uptime(),
    env: process.env.NODE_ENV || "development",
  });
});

app.get("/", (req, res) => {
  res.send("Backend connected with Railway MySQL ✅");
});

// =======================
// ⚠️ Error Handling
// =======================
app.use((req, res, next) => {
  res.status(404).json({ error: "Not found" });
});

app.use((err, req, res, next) => {
  console.error("Server error:", err && err.message ? err.message : err);
  if (err.message && err.message.startsWith("CORS policy")) {
    return res.status(403).json({ error: err.message });
  }
  res.status(500).json({ error: "Internal server error" });
});

// =======================
// 🟢 Start Server
// =======================
const PORT = parseInt(process.env.PORT || "3200", 10);
const HOST = process.env.HOST || "0.0.0.0";

app.listen(PORT, HOST, () => {
  console.log(
    `🚀 Server running on http://${HOST}:${PORT} (NODE_ENV=${
      process.env.NODE_ENV || "development"
    })`
  );
});
