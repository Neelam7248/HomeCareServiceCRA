// routes/admin.js
const express = require("express");
const router = express.Router();
const Candidate = require("./../../models/Candidate"); // adjust path if needed
const authMiddleware = require("./../../middleware/auth"); // JWT auth middleware

// Fetch candidate by email
router.get("/by-email/:email", authMiddleware, async (req, res) => {
  const email = req.params.email;

  try {
    const candidate = await Candidate.findOne({ email });
    if (!candidate) {
      return res.status(404).json({ error: "Candidate not found" });
    }
    res.json(candidate);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
});

// Update candidate by ID
router.put("/candidate/:id", authMiddleware, async (req, res) => {
  const candidateId = req.params.id;
  const updateData = req.body;

  try {
    const updatedCandidate = await Candidate.findByIdAndUpdate(
      candidateId,
      updateData,
      {
        new: true, // return updated document
        runValidators: true // enforce schema validation
      }
    );

    if (!updatedCandidate) {
      return res.status(404).json({ error: "Candidate not found" });
    }

    res.json({ message: "Candidate updated successfully", candidate: updatedCandidate });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
});

module.exports = router;
