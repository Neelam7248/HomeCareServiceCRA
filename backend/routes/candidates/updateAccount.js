// routes/candidate.js
const express = require("express");
const router = express.Router();
const Candidate = require("./../../models/Candidate");
const auth = require("./../../middleware/auth");
const mongoose=require('mongoose');

// ✅ Fetch logged-in candidate profile
router.get("/", auth, async (req, res) => {
  try {
    if (req.user.userType !== "candidate") {
      return res.status(403).json({ error: "Forbidden: Only candidates can access this" });
    }

    // get candidate from DB
    const candidate = await Candidate.findById(req.user.id).select("-password"); // hide password

    if (!candidate) {
      return res.status(404).json({ error: "Candidate not found" });
    }

    res.json(candidate);
  } catch (error) {
    console.error("Error fetching candidate profile:", error);
    res.status(500).json({ error: "Server error" });
  }
});

// Update Profile
router.put("/updateProfile", auth, async (req, res) => {
  try {
    const userId = new mongoose.Types.ObjectId(req.user.id); // token se aya hoga
    const updatedProfile = await Candidate.findByIdAndUpdate(
      userId,
      { $set: req.body },
      { new: true, runValidators: true }
    );

    if (!updatedProfile) {
      return res.status(404).json({ message: "Profile not found" });
    }

    res.json(updatedProfile);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error while updating profile" });
  }
});
module.exports = router;
