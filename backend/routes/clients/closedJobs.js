// routes/closedOffers.js
const express = require("express");
const router = express.Router();
const Offer = require("../../models/Offer");
const auth = require("../../middleware/auth"); // ✅ your JWT auth middleware
const mongoose=require('mongoose');
/**
 * @route   GET /api/closedOffers/clientClosed
 * @desc    Get all closed offers of a logged-in client
 * @access  Private
 */
router.get("/", auth, async (req, res) => {
  try {
    console.log("User from token:", req.user);

    if (req.user.userType !== "client") {
      return res.status(403).json({ error: "Forbidden: Only clients can access this" });
    }

    const clientId = new mongoose.Types.ObjectId(req.user.id);

    const offers = await Offer.find({ clientId, status: "Closed" })
      .populate("candidateId", "name email charges skills")
      .populate("clientId","name email ")
      .sort({ createdAt: -1 });

    res.json(offers);
  } catch (err) {
    console.error("Error fetching closed offers:", err);
    res.status(500).json({ error: "Server error" });
  }
});
module.exports = router;
