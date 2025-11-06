



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


const express = require("express");
const cors = require("cors");
require("dotenv").config();
const fs = require("fs");
const path = require("path");
const db = require("./config/db");

// Routes
const authRoutes = require("./routes/authRoutes");
const scholarshipRoutes = require("./routes/scholarshipRoutes");
const donationRoutes = require("./routes/donationRoutes");

const app = express();

// ✅ Allowed origins (frontend URLs)
const allowedOrigins = [
  "https://gorbanjaracommunity1.vercel.app", // your Vercel frontend
  "http://localhost:5173"            // local development
];

// ✅ Proper CORS setup
app.use(
  cors({
    origin: function (origin, callback) {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        console.log("❌ Blocked by CORS:", origin);
        callback(new Error("Not allowed by CORS"));
      }
    },
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true,
  })
);

// ✅ Handle preflight requests globally (Express 5+ safe)
app.options(/.*/, cors());

// ✅ Middleware
app.use(express.json());
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// ✅ Ensure uploads folder exists
const uploadDir = path.join(__dirname, "uploads");
if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir, { recursive: true });

// ✅ API routes
app.use("/api/auth", authRoutes);
app.use("/api/scholarship", scholarshipRoutes);
app.use("/api/donations", donationRoutes);

// ✅ Root route (for quick check)
app.get("/", (req, res) => {
  res.send("Backend connected with Railway MySQL ✅");
});

// ✅ Start server
const PORT = process.env.PORT || 3200;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));


