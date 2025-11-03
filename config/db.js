// const mysql = require("mysql2");

// const db = mysql.createConnection({
//   host: process.env.DB_HOST,
//   user: process.env.DB_USER,
//   password: process.env.DB_PASSWORD,
//   database: process.env.DB_NAME,
// });

// db.connect((err) => {
//   if (err) {
//     console.error("Database connection failed:", err);
//   } else {
//     console.log("✅ Connected to MySQL Database");
//   }
// });

// module.exports = db;


// backend/config/db.js
const mysql = require("mysql2");
require("dotenv").config();

const db = mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  port: process.env.DB_PORT ? parseInt(process.env.DB_PORT, 10) : 3306,
   connectTimeout: 20000
});

// Optional: show connection error when app starts
db.connect((err) => {
  if (err) {
    console.error("❌ Database connection failed:", err);
  } else {
    console.log("✅ Connected to MySQL database!");
  }
});

module.exports = db;



// const mysql = require("mysql2");
// require("dotenv").config();

// const db = mysql.createConnection({
//   host: process.env.DB_HOST || "localhost",
//   user: process.env.DB_USER || "root",
//   password: process.env.DB_PASSWORD || "Ramrk@1811",
//   database: process.env.DB_NAME || "gor_banjara",
// });

// db.connect((err) => {
//   if (err) throw err;
//   console.log("✅ MySQL connected");
// });

// module.exports = db;