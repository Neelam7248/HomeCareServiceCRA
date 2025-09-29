const express = require("express");
const router = express.Router();
const Candidate = require("./../../models/Candidate"); // 👈 apna model import karein
const auth = require("./../../middleware/auth");       // 👈 JWT middleware

// Approve / Reject candidate
router.put("/:id", auth,  async (req, res) => {
  try {
    const { approved } = req.body;

    // Candidate update
    const candidate = await Candidate.findByIdAndUpdate(
      req.params.id,
      { approved },
      { new: true }
    );

    if (!candidate) {
      return res.status(404).json({ error: "Candidate not found" });
    }

    res.json({
      message: `Candidate has been ${approved ? "approved" : "rejected"}.`,
      candidate,
    });
  } catch (err) {
    console.error("Approve candidate error:", err);
    res.status(500).json({ error: "Server error" });
  }
});

module.exports = router;
