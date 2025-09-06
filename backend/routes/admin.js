const express = require("express");
const router = express.Router();
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const Admin = require("../models/Admin");
const Candidate = require("../models/Candidate");
const Client = require("../models/Client");

require("dotenv").config();
const JWT_SECRET = process.env.JWT_SECRET;

/* =============================
   ADMIN SIGNUP
============================= */
router.post("/signup", async (req, res) => {
  try {
     console.log("📩 Incoming body:", req.body);
    const { name, email, password } = req.body;

    const existingAdmin = await Admin.findOne({ email });
    if (existingAdmin) {
      return res.status(400).json({ message: "Admin already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const newAdmin = new Admin({ name, email, password: hashedPassword });
    await newAdmin.save();

    res.status(201).json({ message: "Admin registered successfully" });
  } catch (err) {
    console.error("Admin signup error:", err);
    res.status(500).json({ message: "Server error" });
  }
});

/* =============================
   ADMIN LOGIN
============================= */
router.post("/signin", async (req, res) => {
  try { console.log("📩 Incoming body:", req.body);
    const { email, password } = req.body;

    const admin = await Admin.findOne({ email });
    if (!admin) return res.status(400).json({ message: "Invalid credentials" });

    const isMatch = await bcrypt.compare(password, admin.password);
    if (!isMatch) return res.status(400).json({ message: "Invalid credentials" });

    const token = jwt.sign({ id: admin._id, role: "admin" }, JWT_SECRET, { expiresIn: "8h" });

    res.json({
      message: "Login successful",
      token,
      admin: { id: admin._id, name: admin.name, email: admin.email }
    });
  } catch (err) {
    console.error("Admin login error:", err);
    res.status(500).json({ message: "Server error" });
  }
});

/* =============================
   APPROVE / REJECT USER
============================= */
router.put("/approve/:userType/:id", async (req, res) => {
  try {
    const { userType, id } = req.params;
    const { approved } = req.body; // true/false

    let user;
    if (userType === "candidate") {
      user = await Candidate.findByIdAndUpdate(id, { approved }, { new: true });
    } else if (userType === "client") {
      user = await Client.findByIdAndUpdate(id, { approved }, { new: true });
    } else {
      return res.status(400).json({ message: "Invalid user type" });
    }

    if (!user) return res.status(404).json({ message: "User not found" });

    res.json({ message: `User ${approved ? "approved" : "rejected"} successfully`, user });
  } catch (err) {
    console.error("Approval error:", err);
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;
