
const PDFDocument = require("pdfkit");
const fs = require("fs");
const path = require("path");
const db = require("../config/db");

const createDonation = (req, res) => {
  try {
    const { name, email, amount } = req.body;

    if (!name || !email || !amount) {
      return res.status(400).json({ error: "All fields are required" });
    }

    // Save to database
    const query = "INSERT INTO donations (name, email, amount, created_at) VALUES (?, ?, ?, NOW())";
    db.query(query, [name, email, amount], (err, result) => {
      if (err) {
        console.error(err);
        return res.status(500).json({ error: "Database error" });
      }

      // Generate PDF receipt
      const receiptsDir = path.join(__dirname, "../uploads/receipts");
      if (!fs.existsSync(receiptsDir)) fs.mkdirSync(receiptsDir, { recursive: true });

      const pdfPath = path.join(receiptsDir, `receipt_${Date.now()}.pdf`);
      const doc = new PDFDocument();
      doc.pipe(fs.createWriteStream(pdfPath));
      doc.fontSize(20).text("Donation Receipt", { align: "center" });
      doc.moveDown();
      doc.fontSize(16).text("For Gorbanjara Community", { align: "center" });
      doc.moveDown(2);
      doc.fontSize(14).text(`Name: ${name}`);
      doc.text(`Email: ${email}`);
      doc.text(`Amount: ₹${amount}`);
      doc.text(`Date: ${new Date().toLocaleString()}`);
      doc.end();

      res.status(200).json({
        message: "Donation successful!",
        receipt: pdfPath,
      });
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Server error" });
  }
};

module.exports = { createDonation };
