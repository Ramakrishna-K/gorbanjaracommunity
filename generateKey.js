

// generateJwtSecret.js
const crypto = require("crypto");

// Generate a 64-byte random secret and convert to hex
const secret = crypto.randomBytes(64).toString("hex");

console.log("Your JWT Secret:", secret);
