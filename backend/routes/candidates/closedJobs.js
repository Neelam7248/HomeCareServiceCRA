// routes/candidates/candidateClosedOffers.js
const express = require("express");
const router = express.Router();
const Offer = require("../../models/Offer");
const auth = require("../../middleware/auth");
const mongoose =require('mongoose');
router.get("/closedOffers", auth, async (req, res) => {
  try {
    
    console.log("User from token:", req.user);
    if (req.user.userType !== "candidate") {
      return res.status(403).json({ error: "Forbidden: Only candidates can access this" });
    }

    const candidateId = new mongoose.Types.ObjectId(req.user.id);
    const offers = await Offer.find({ candidateId, jobStatus: "Closed" })
          .populate("candidateId", "name email charges skills")
      .populate("clientId","name email ")
      .sort({ createdAt: -1 });
;
    res.json(offers);
  } catch (err) {
    console.error("Error fetching candidate closed offers:", err);
    res.status(500).json({ error: "Server error" });
  }
});

module.exports = router;
