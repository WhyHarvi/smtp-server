// ✅ Log when server starts loading
console.log("✅ server.js is initializing...");

// ✅ Imports
const express = require("express");
const nodemailer = require("nodemailer");
const cors = require("cors");
const path = require("path");
require("dotenv").config();

// ✅ App setup
const app = express();
app.use(cors());
app.use(express.json());

// ✅ Health check route
app.get("/", (req, res) => {
  res.send("✅ Backend is live and running.");
});

// ✅ POST route for form submission
app.post("/send", async (req, res) => {
  const { name, email, phone, subject, message } = req.body;
  console.log("📬 Contact form submitted:", { name, email, phone, subject });

  try {
    const transporter = nodemailer.createTransport({
      host: "smtp.gmail.com",
      port: 587,
      secure: false,
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    await transporter.sendMail({
      from: `"${name}" <${email}>`,
      to: process.env.EMAIL_USER,
      subject: subject || "New Message from Portfolio",
      html: `
        <h2>Contact Form Message</h2>
        <p><strong>Name:</strong> ${name}</p>
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>Phone:</strong> ${phone}</p>
        <p><strong>Message:</strong><br/>${message}</p>
      `,
    });

    console.log("✅ Email sent successfully.");
    res.status(200).json({ success: true, message: "Email sent successfully!" });
  } catch (error) {
    console.error("❌ Email failed to send:", error);
    res.status(500).json({ success: false, message: "Failed to send email." });
  }
});

// ❗ Optional: remove if you're not serving a frontend
// Handles all other GET requests to prevent crash
app.get("*", (req, res) => {
  res.status(404).send("❌ 404: Not Found");
});

// ✅ Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
