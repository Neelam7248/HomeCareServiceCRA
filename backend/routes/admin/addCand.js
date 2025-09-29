const express = require("express");
const router = express.Router();
const bcrypt = require("bcrypt");
const Candidate = require("../../models/Candidate");
const Client = require("../../models/Client");
const auth = require("../../middleware/auth");
const multer = require("multer");

require("dotenv").config();

// Multer storage for resume uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, "uploads/"),
  filename: (req, file, cb) => {
    const unique = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, unique + "-" + file.originalname);
  }
});
const upload = multer({ storage });

/* =============================
   ADMIN ADD USER (Candidate / Client)
============================= */
router.post("/", auth, upload.single("resume"), async (req, res) => {
  try {
    // ✅ Only admins allowed
    if (req.user.userType !== "admin") {
      return res.status(403).json({ message: "Access denied. Admins only." });
    }

    const data = req.body;
    console.log("Admin adding user:", data);
    console.log("Uploaded file:", req.file);

    // ✅ Validate
    if (!data.userType) {
      return res.status(400).json({ message: "userType is required" });
    }
    if (!data.email || !data.password) {
      return res.status(400).json({ message: "Email and password required" });
    }

    // ✅ Check existing email
    const existingCandidate = await Candidate.findOne({ email: data.email });
    const existingClient = await Client.findOne({ email: data.email });
    if (existingCandidate || existingClient) {
      return res.status(400).json({ message: "Email already registered" });
    }

    // ✅ Hash password
    const hashedPassword = await bcrypt.hash(data.password, 10);

    let newUser;

    if (data.userType === "candidate") {
      // Parse availability if string
      let availability = {};
      if (data.availability) {
        availability =
          typeof data.availability === "string"
            ? JSON.parse(data.availability)
            : data.availability;
      }

      newUser = new Candidate({
        ...data,
        password: hashedPassword,
        resume: req.file ? req.file.path : null,
        availability
      });
    } else if (data.userType === "client") {
      newUser = new Client({
        name: data.name,
        email: data.email,
        password: hashedPassword,
        phone: data.phone,
        address: data.address,
        occupation: data.occupation,
        serviceType: data.serviceType,
        requiredExperience: data.requiredExperience,
        preferredChargesType: data.preferredChargesType,
        maxBudget: data.maxBudget ? Number(data.maxBudget) : undefined,
        preferredAge: data.preferredAge ? Number(data.preferredAge) : undefined,
        preferredGender: data.preferredGender
      });
    } else {
      return res.status(400).json({ message: "Invalid user type" });
    }

    await newUser.save();

    res.status(201).json({
      message: `${data.userType} created successfully`,
      user: newUser
    });
  } catch (err) {
    console.error("Admin add-user error:", err);
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;
