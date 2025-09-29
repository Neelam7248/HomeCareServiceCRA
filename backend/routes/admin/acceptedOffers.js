const express = require("express");
const router = express.Router();
const Offer = require("./../../models/Offer");
const auth = require("./../../middleware/auth");
const Candidate = require("../../models/Candidate");

// Middleware: only admin can access
const adminOnly = (req, res, next) => {
  if (req.user.userType !== "admin") {
    return res.status(403).json({ error: "Unauthorized" });
  }
  next();
};

// ===============================
// GET all accepted offers
// ===============================
router.get("/", auth, adminOnly, async (req, res) => {
  try {
    const offers = await Offer.find({ status: "Accepted" })
      .populate("clientId", "email name")      // if ref exists
      .populate("candidateId", "email name");  // if ref exists

    res.json(offers);
  } catch (err) {
    console.error("Error fetching accepted offers:", err);
    res.status(500).json({ error: "Server error" });
  }
});
// ===============================
// GET all closed offers
// ===============================
router.get("/closed", auth, adminOnly, async (req, res) => {
  try {
    const Offers = await Offer.find({ status: "Closed" })
    .populate("clientId","name email serviceType")
    .populate("candidateId","name email skills")
    .sort({createdAt: -1});
    res.json(Offers);
  } catch (err) {
    console.error("Error fetching closed offers:", err);
    res.status(500).json({ error: "Server error" });
  }
});


module.exports = router;
