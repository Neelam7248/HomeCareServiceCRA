// routes/admin/offers.js
const express = require("express");
const router = express.Router();
const Offer = require("../../models/Offer");
const auth = require("../../middleware/auth");

// Middleware: only admin
const adminOnly = (req, res, next) => {
  if (req.user.userType !== "admin") return res.status(403).json({ error: "Unauthorized" });
  next();
};

// -------------------------------
// 1️⃣ Admin → Send Offer (already done)
// -------------------------------
router.post("/", auth, adminOnly, async (req, res) => {
  const {
    clientId,
    candidateId,
    clientEmail,
    candidateEmail,
    jobId,
    preferredChargesType,
    serviceType,
    offeredSalary
  } = req.body;

  if (!clientId || !candidateId) return res.status(400).json({ error: "clientId and candidateId required" });

  try {
    const existingOffer = await Offer.findOne({ clientId, candidateId, jobId });
    if (existingOffer) return res.status(400).json({ error: "Offer already exists" });

    const newOffer = new Offer({
      clientId,
      clientEmail,
      candidateEmail,
      candidateId,
      jobId,
      preferredChargesType,
      serviceType,
      offeredSalary,
      candidateRequestedSalary: 0,
      clientCounterSalary: 0,
      finalSalary: 0,
      status: "Pending",
      negotiationCount: 0
    });

    await newOffer.save();
    res.status(201).json({ message: "Offer sent by admin successfully", offer: newOffer });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
});


// -------------------------------
// 3️⃣ Admin → Respond on behalf of client
// -------------------------------
router.post("/:id/respond-client", auth, adminOnly, async (req, res) => {
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

      offer.clientCounterSalary = counterAmount;
      offer.status = "Negotiating";
      offer.negotiationCount = (offer.negotiationCount || 0) + 1;

      offer.negotiations.push({
        by: "client",
        actedBy: "admin",
        action: "Counter",
        salary: counterAmount,
        createdAt: new Date(),
      });
    } else if (decision === "Accepted") {
      offer.finalSalary =
        offer.candidateRequestedSalary ||
        offer.clientCounterSalary ||
        offer.offeredSalary;
      offer.status = "Accepted";

      offer.negotiations.push({
        by: "client",
        actedBy: "admin",
        action: "Accepted",
        salary: offer.finalSalary,
        createdAt: new Date(),
      });
    } else if (decision === "Rejected") {
      offer.status = "Rejected";

      offer.negotiations.push({
        by: "client",
        actedBy: "admin",
        action: "Rejected",
        salary: null,
        createdAt: new Date(),
      });
    } else {
      return res.status(400).json({ error: "Invalid decision" });
    }

    await offer.save();
    res.json({ message: `Offer ${decision} on behalf of client`, offer });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
});

module.exports = router;
