



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

// Middleware
// app.use(cors());
// app.use(cors({ origin: "https://gorbanjara-1.vercel.app/" }));
app.use(cors({
  origin: [
    "http://localhost:5173",        // for local React testing
    "https://gorbanjara185.vercel.app/" // for deployed frontend
  ],
  methods: ["GET", "POST", "PUT", "DELETE"],
  credentials: true
}));

app.use(express.json());
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// Ensure uploads folder exists
const uploadDir = path.join(__dirname, "uploads");
if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir, { recursive: true });

// API Routes
app.use("/api/auth", authRoutes);
app.use("/api/scholarship", scholarshipRoutes); // all scholarship routes
app.use("/api/donations", donationRoutes);

// Test root route
app.get("/", (req, res) => res.send("API Running 🚀"));
app.get("/", (req, res) => {
  res.send("Backend connected with Railway MySQL ✅");
});
// Start server
const PORT = process.env.PORT || 3200;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
