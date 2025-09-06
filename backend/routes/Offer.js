const express = require("express");
const router = express.Router();
const Offer = require("../models/Offer");
const auth = require("../middleware/auth");

// ===============================
// 1. Client → Send Offer
// ===============================
router.post("/", auth, async (req, res) => {
  const { candidateId, jobId, preferredChargesType,serviceType,maxBudget } = req.body;
  const clientId = req.user.id; // JWT se client

  if (!clientId || !candidateId) {
    return res.status(400).json({ error: "clientId (from token) and candidateId are required" });
  }

  try {
    const existingOffer = await Offer.findOne({ clientId, candidateId,maxBudget,preferredChargesType,serviceType, jobId });
    if (existingOffer) {
      return res.status(400).json({ error: "Offer already sent to this candidate" });
    }

    const newOffer = new Offer({
      clientId,
      candidateId,
      jobId,
      maxBudget,
      preferredChargesType,
      serviceType,
      status: "Pending",
    });

    await newOffer.save();
    res.status(201).json({ message: "Offer sent successfully", offer: newOffer });
  } catch (err) {
    console.error("Error creating offer:", err);
    res.status(500).json({ error: err.message });
  }
});

// ===============================
// 2. Candidate → Negotiate Offer
// ===============================
router.post("/negotiate", auth, async (req, res) => {
  const { offerId, negotiatedSalary } = req.body;
  const candidateId = req.user.id; // candidate JWT se aayega

  try {
    const offer = await Offer.findById(offerId);

    if (!offer) return res.status(404).json({ error: "Offer not found" });
    if (offer.candidateId.toString() !== candidateId) {
      return res.status(403).json({ error: "Not authorized to negotiate this offer" });
    }

    offer.negotiatedSalary = negotiatedSalary;
    offer.status = "Negotiating";
    await offer.save();

    res.json({ message: "Negotiation started", offer });
  } catch (err) {
    console.error("Error negotiating offer:", err);
    res.status(500).json({ error: err.message });
  }
});

// ===============================
// 3. Candidate → Accept/Reject Offer
// ===============================
router.post("/decision", auth, async (req, res) => {
  const { offerId, decision } = req.body; // Accepted / Rejected
  const candidateId = req.user.id;

  try {
    const offer = await Offer.findById(offerId);
    if (!offer) return res.status(404).json({ error: "Offer not found" });
    if (offer.candidateId.toString() !== candidateId) {
      return res.status(403).json({ error: "Not authorized to update this offer" });
    }

    offer.status = decision;
    if (decision === "Rejected") {
      offer.finalSalary = null;
    }
    if (decision === "Accepted") {
      offer.finalSalary = offer.negotiatedSalary || offer.offeredSalary;
    }

    await offer.save();
    res.json({ message: `Offer ${decision}`, offer });
  } catch (err) {
    console.error("Error updating decision:", err);
    res.status(500).json({ error: err.message });
  }
});

// ===============================
// 4. Client → Accept Negotiation
// ===============================
router.post("/accept-negotiation", auth, async (req, res) => {
  const { offerId } = req.body;
  const clientId = req.user.id;

  try {
    const offer = await Offer.findById(offerId);
    if (!offer) return res.status(404).json({ error: "Offer not found" });
    if (offer.clientId.toString() !== clientId) {
      return res.status(403).json({ error: "Not authorized to accept this negotiation" });
    }

    if (!offer.negotiatedSalary) {
      return res.status(400).json({ error: "No negotiation found to accept" });
    }

    offer.finalSalary = offer.negotiatedSalary;
    offer.status = "Accepted";
    await offer.save();

    res.json({ message: "Negotiation accepted", offer });
  } catch (err) {
    console.error("Error accepting negotiation:", err);
    res.status(500).json({ error: err.message });
  }
});

// ===============================
// 5. Get Offer Status
// ===============================
router.get("/status", auth, async (req, res) => {
  try {
    const { clientId, jobId } = req.query;
    const candidateId = req.user.id;

    const offer = await Offer.findOne({ clientId, candidateId, jobId });
    if (!offer) {
      return res.json({ status: "" });
    }

    res.json({ status: offer.status });
  } catch (err) {
    console.error("Error fetching offer status:", err);
    res.status(500).json({ error: err.message });
  }
});// ===============================
// 6. Candidate → Get All Received Offers
// ===============================
router.get("/candidate/offers", auth, async (req, res) => {
  try {
    const candidateId = req.user.id;
    const offers = await Offer.find({ candidateId })
      .populate("clientId", "name serviceType")
      .sort({ createdAt: -1 });
    res.json(offers);
  } catch (err) {
    console.error("Error fetching candidate offers:", err);
    res.status(500).json({ error: err.message });
  }
});

// ===============================
// 7. Client → Get All Sent Offers
// ===============================
router.get("/client/offers", auth, async (req, res) => {
  try {
    const clientId = req.user.id;
    const offers = await Offer.find({ clientId })
      .populate("candidateId", "name skills")
      .sort({ createdAt: -1 });
    res.json(offers);
  } catch (err) {
    console.error("Error fetching client offers:", err);
    res.status(500).json({ error: err.message });
  }
});// ===============================
// 8. Client → Respond to Negotiation (Counter / Accept / Reject)
// ===============================  
router.post("/:id/respond-negotiation", auth, async (req, res) => {
  const { decision, counterAmount } = req.body;
  const offer = await Offer.findById(req.params.id);
  if (!offer) return res.status(404).send("Offer not found");
  
  // Only the client can respond
  if (offer.clientId.toString() !== req.user.id) return res.status(403).send("Unauthorized");

  // Check negotiation limit
  if (decision === "Counter") {
    if (offer.negotiationCount >= 3) {
      return res.status(400).send("Maximum 3 negotiations allowed");
    }
    offer.negotiatedSalary = counterAmount; // reuse your existing field
    offer.status = "Negotiating";
    offer.negotiationCount += 1;
  } else if (decision === "Accepted") {
    offer.finalSalary = offer.negotiatedSalary || offer.offeredSalary;
    offer.status = "Accepted";
  } else if (decision === "Rejected") {
    offer.status = "Rejected";
  }

  await offer.save();
  res.json(offer);
});

// Candidate responds to negotiation
router.post("/:id/respond-negotiation-candidate", auth, async (req, res) => {
  const { decision, counterAmount } = req.body;
  const offer = await Offer.findById(req.params.id);
  if (!offer) return res.status(404).send("Offer not found");

  // Candidate check
  if (offer.candidateId.toString() !== req.user.id) return res.status(403).send("Unauthorized");

  if (decision === "Counter") {
    offer.negotiatedSalary = counterAmount;
    offer.status = "Negotiating";
    offer.negotiationCount += 1;
  } else if (decision === "Accepted") {
    offer.finalSalary = offer.negotiatedSalary || offer.offeredSalary;
    offer.status = "Accepted";
  } else if (decision === "Rejected") {
    offer.status = "Rejected";
  }

  await offer.save();
  res.json(offer);
});


module.exports = router;
