// routes/admin/offers.js
const express = require("express");
const router = express.Router();
const Offer = require("../../models/Offer");
const auth = require("../../middleware/auth");
const Candidate=require("./../../models/Candidate")
const Client=require("./../../models/Client")
// Middleware: only admin
const adminOnly = (req, res, next) => {
  if (req.user.userType !== "admin") return res.status(403).json({ error: "Unauthorized" });
  next();
};

// -------------------------------
// GET all offers for a candidate by email
// -------------------------------
router.get("/candidate/:email", auth, adminOnly, async (req, res) => {
  try {
    const candidateEmail = req.params.email;

    if (!candidateEmail) {
      return res.status(400).json({ error: "Candidate email is required" });
    }

    // First, find the candidate by email
    const candidate = await Candidate.findOne({ email: candidateEmail });
    if (!candidate) return res.status(404).json({ error: "Candidate not found" });

    // Then fetch all offers using candidateId
    const offers = await Offer.find({ candidateId: candidate.id })
      .populate("clientId", "name email serviceType")
      .populate("candidateId", "name email skills chargesType charges experience gender")
      .sort({ createdAt: -1 });

    res.json({ offers });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
});
// ===============================
// Admin → Negotiate / Accept / Reject on behalf of Candidate
// ===============================
router.post("/:id/respond-candidate", auth, adminOnly, async (req, res) => {
  try {
    const { decision, counterAmount } = req.body; // "Counter" | "Accepted" | "Rejected"
    const offer = await Offer.findById(req.params.id);
    if (!offer) return res.status(404).json({ error: "Offer not found" });

    // Admin is allowed, no need to check req.user.id === clientId
    offer.negotiations = offer.negotiations || [];

    if (decision === "Counter") {
      if (!counterAmount) {
        return res.status(400).json({ error: "Counter amount is required" });
      }

      offer.candidateRequestedSalary= counterAmount;
      offer.status = "Negotiating";
      offer.negotiationCount = (offer.negotiationCount || 0) + 1;

      offer.negotiations.push({
        by: "candidate",
        actedBy: "admin",
        action: "Counter",
        salary: counterAmount,
        createdAt: new Date(),
      });
    } else if (decision === "Accepted") {
      offer.finalSalary =
        offer.clientCounterSalary || offer.candidateRequestedSalary ||
       
        offer.offeredSalary;
      offer.status = "Accepted";

      offer.negotiations.push({
        by: "candidate",
        actedBy: "admin",
        action: "Accepted",
        salary: offer.finalSalary,
        createdAt: new Date(),
      });
    } else if (decision === "Rejected") {
      offer.status = "Rejected";

      offer.negotiations.push({
        by: "candidate",
        actedBy: "admin",
        action: "Rejected",
        salary: null,
        createdAt: new Date(),
      });
    } else {
      return res.status(400).json({ error: "Invalid decision" });
    }

    await offer.save();
    res.json({ message: `Offer ${decision} on behalf of candidate`, offer });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
});




module.exports = router;
