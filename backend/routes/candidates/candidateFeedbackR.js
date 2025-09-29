const express = require("express");
const router = express.Router();
const Offer = require("./../../models/Offer");
const auth = require("./../../middleware/auth");

// Candidate submits feedback after job is closed
router.post("/:id/candidate-feedback", auth, async (req, res) => {
  try {
    const { id } = req.params;
    const { message, rating } = req.body; // feedback message + optional rating

    if (!message || message.trim() === "") {
      return res.status(400).json({ error: "Feedback message is required." });
    }

    const offer = await Offer.findById(id);
    if (!offer) return res.status(404).json({ error: "Offer not found." });

    // Ensure only candidate can submit feedback
    if (offer.candidateId.toString() !== req.user.id) {
      return res.status(403).json({ error: "Not authorized to submit feedback for this job." });
    }

    if (offer.status !== "Closed") {
      return res.status(400).json({ error: "Job must be closed before submitting feedback." });
    }

    // Save candidate feedback
    offer.candidateFeedback = {
      message,
      rating: rating || null,
      givenAt: new Date()
    };

    await offer.save();

    res.json({ message: "Feedback submitted successfully", candidateFeedback: offer.candidateFeedback });
  } catch (err) {
    console.error("Error submitting candidate feedback:", err);
    res.status(500).json({ error: "Server error" });
  }
});

module.exports = router;
