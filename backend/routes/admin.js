const express = require("express");
const router = express.Router();
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const Admin = require("../models/Admin");
require("dotenv").config();

const JWT_SECRET = process.env.JWT_SECRET || "yourSecretKey";

/* =============================
   ADMIN SIGNUP
============================= */
router.post("/signup", async (req, res) => {
  try {
    const { name, email, password, adminSecret } = req.body;

    // Check secret code
    if (adminSecret !== process.env.ADMIN_SECRET) {
      return res.status(403).json({ message: "Unauthorized signup attempt" });
    }
    // Check required fields
    if (!name || !email || !password) {
      return res.status(400).json({ message: "All fields are required" });
    }

    // Check if admin already exists
    const existingAdmin = await Admin.findOne({ email });
    if (existingAdmin) {
      return res.status(400).json({ message: "Email already registered" });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create admin
    const newAdmin = new Admin({
      name,
      email,
      password: hashedPassword
    });

    await newAdmin.save();

    // Create JWT token
    const token = jwt.sign(
      { id: newAdmin._id, userType: "admin" },
      JWT_SECRET,
      { expiresIn: "8h" }
    );

    res.status(201).json({
      message: "Admin signup successful",
      token,
      user: {
        id: newAdmin._id,
        name: newAdmin.name,
        email: newAdmin.email,
        userType: "admin"
      }
    });
  } catch (err) {
    console.error("Admin signup error:", err);
    res.status(500).json({ message: "Server error" });
  }
});

/* =============================
   ADMIN SIGNIN
============================= */
router.post("/signin", async (req, res) => {
  try {
    const { email, password } = req.body;

    // Check admin existence
    const admin = await Admin.findOne({ email });
    if (!admin) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    // Compare password
    const isMatch = await bcrypt.compare(password, admin.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    // Create JWT token
    const token = jwt.sign(
      { id: admin._id, userType: "admin" },
      JWT_SECRET,
      { expiresIn: "8h" }
    );

    res.json({
      message: "Admin login successful",
      token,
      user: {
        id: admin._id,
        name: admin.name,
        email: admin.email,
        userType: "admin"
      }
    });
  } catch (err) {
    console.error("Admin login error:", err);
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;
