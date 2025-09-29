const express = require("express");
const router = express.Router();
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const multer = require("multer");
const Candidate = require("../models/Candidate");
const Client = require("../models/Client");
const auth = require("../middleware/auth");

require("dotenv").config(); // at the top of your file, if not already

const JWT_SECRET = process.env.JWT_SECRET; // load secret from .env



// File upload (resume)
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, "uploads/"),
  filename: (req, file, cb) => {
    const unique = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, unique + "-" + file.originalname);
  }
});
const upload = multer({ storage });

/* =============================
   SIGNUP
============================= */
router.post("/", upload.single("resume"), async (req, res) => {
  try {
    const data = req.body;
console.log("Received data:", req.body);
console.log("Uploaded file:", req.file);
console.log("UserType:", data.userType);

    // Check if email exists
    // Check if email exists in either collection
const existingCandidate = await Candidate.findOne({ email: data.email });
const existingClient = await Client.findOne({ email: data.email });

if (existingCandidate || existingClient) {
  return res.status(400).json({ message: "Email already registered" });
}


    // Hash password
    const hashedPassword = await bcrypt.hash(data.password, 10);
//for making the avaialabilty object from string
let availability = {};
if (data.userType === "candidate" && data.availability) {
  availability = typeof data.availability === "string" 
               ? JSON.parse(data.availability) 
               : data.availability;
}

    // Save new user
    let newUser;
if (data.userType === "candidate") {
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

    // JWT Token
    const token = jwt.sign(
      { id: newUser._id, userType: data.userType },
      JWT_SECRET,
      { expiresIn: "1h" }
    );

    res.status(201).json({
      message: "Signup successful",
      token,
      user: {
        id: newUser._id,
        name: newUser.name,
        email: newUser.email,
        userType: data.userType
      }
    });

  } catch (err) {
    console.error("Signup error:", err);
    res.status(500).json({ message: "Server error" });
  }
});

/* =============================
   LOGIN
============================= */
router.post("/signin", async (req, res) => {
  try {
    const { email, password, userType } = req.body;

    if (!userType) {
      return res.status(400).json({ message: "User type is required" });
    }

    let user;

    if (userType === "candidate") {
      user = await Candidate.findOne({ email });
    } else if (userType === "client") {
      user = await Client.findOne({ email });
    } else {
      return res.status(400).json({ message: "Invalid user type" });
    }

    if (!user) {
      return res.status(400).json({ message: "Invalid credentials" });
    }
if (user.isDeleted) {
      return res.status(403).json({ message: "Inactive user. Please contact support." });
    }
    if (!user.approved) {
      return res.status(403).json({ message: "Your account is pending admin approval." });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    const token = jwt.sign({ id: user._id, userType }, JWT_SECRET, { expiresIn: "1h" });

    res.json({
      message: "Login successful",
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        userType
      }
    });
  } catch (err) {
    console.error("Login error:", err);
    res.status(500).json({ message: "Server error" });
  }
});
//for fetching all registered clients
// Get all clients

router.get("/candidates", auth, async (req, res) => {
  try {
    const candidates = await Candidate.find();
    res.json(candidates);
  } catch (err) {
    console.error("Error fetching candidates:", err);
    res.status(500).json({ message: "Server error" });
  }
});

router.get("/clients", auth, async (req, res) => {
  try {
    const clients = await Client.find();
    res.json(clients);
  } catch (err) {
    console.error("Error fetching clients:", err);
    res.status(500).json({ message: "Server error" });
  }
});

/*for use in suggestedcandidate.jsx to send offer ,
it is used to fetch login clientdata to take the maxBudget,
 serviceType then to send them via props into sendofferbutton.jsx*/
router.get("/me", auth, async (req, res) => {
 console.log("Decoded user from token:", req.user);
  try {
    const client = await Client.findById(req.user.id);
    
      console.log("Client fetched:", client);
    if (!client) return res.status(404).json({ message: "Client not found" });

    res.json({
      id: client._id,
      name: client.name,
      email: client.email,
      maxBudget: client.maxBudget,
      serviceType: client.serviceType,
      preferredChargesType: client.preferredChargesType
    });
  } catch (err) {
    console.error("Error fetching client profile:", err);
    res.status(500).json({ message: "Server error" });
  }
});



module.exports = router;
