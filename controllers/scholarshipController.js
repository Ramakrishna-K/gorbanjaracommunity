const db = require("../config/db");

exports.applyScholarship = (req, res) => {
  const {
    name,
    fatherName,
    motherName,
    dob,
    aadhar,
    email,
    phone,
    course,
    income,
    marks,
    purpose,
  } = req.body;

  const filePath = req.file ? req.file.filename : null;

  const sql = `
    INSERT INTO scholarship_applications 
    (name, fatherName, motherName, dob, aadhar, email, phone, course, income, marks, purpose, file)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `;

  db.query(
    sql,
    [
      name,
      fatherName,
      motherName,
      dob,
      aadhar,
      email,
      phone,
      course,
      income,
      marks,
      purpose,
      filePath,
    ],
    (err) => {
      if (err) {
        console.error("❌ Database error:", err);
        return res.status(500).json({ message: "Failed to apply. Try again." });
      }
      res.status(200).json({ message: "🎉 Application submitted successfully!" });
    }
  );
};
