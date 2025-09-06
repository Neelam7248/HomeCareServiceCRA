const express = require("express");
const router = express.Router();
const AcceptedOffer = require("../models/AcceptedOffer");
const Offer = require("../models/Offer");
const auth = require("../middleware/auth");

// 1️⃣ Create AcceptedOffer when candidate accepts an offer
router.post("/create/:offerId", auth, async (req, res) => {
  try {
    const offer = await Offer.findById(req.params.offerId);
    if (!offer) return res.status(404).send("Offer not found");

    if (offer.status !== "Accepted") return res.status(400).send("Offer not accepted yet");

    const existing = await AcceptedOffer.findOne({ offerId: offer._id });
    if (existing) return res.status(400).send("AcceptedOffer already exists");

    const acceptedOffer = new AcceptedOffer({
      offerId: offer._id,
      clientId: offer.clientId,
      candidateId: offer.candidateId,
      startDate: new Date()
    });

    await acceptedOffer.save();
    res.json(acceptedOffer);
  } catch (err) {
    res.status(500).send(err.message);
  }
});

// 2️⃣ Get all accepted offers for client, optionally group by jobId
router.get("/client", auth, async (req, res) => {
  try {
    const acceptedOffers = await AcceptedOffer.find({ clientId: req.user.id })
      .populate("candidateId", "name email")
      .populate("offerId", "offeredSalary finalSalary status jobId")
      .lean();

    // Optional: group by jobId for frontend display
    const groupedByJob = acceptedOffers.reduce((acc, offer) => {
      const jobId = offer.offerId.jobId || offer.offerId._id;
      if (!acc[jobId]) acc[jobId] = [];
      acc[jobId].push(offer);
      return acc;
    }, {});

    res.json(groupedByJob);
  } catch (err) {
    res.status(500).send(err.message);
  }
});

// 3️⃣ Candidate marks work as completed
router.patch("/:id/complete", auth, async (req, res) => {
  try {
    const acceptedOffer = await AcceptedOffer.findById(req.params.id);
    if (!acceptedOffer) return res.status(404).send("AcceptedOffer not found");

    if (acceptedOffer.candidateId.toString() !== req.user.id)
      return res.status(403).send("Unauthorized");

    acceptedOffer.workCompleted = true;
    acceptedOffer.endDate = new Date();
    await acceptedOffer.save();

    res.json(acceptedOffer);
  } catch (err) {
    res.status(500).send(err.message);
  }
});

// 4️⃣ Client submits feedback
router.post("/:id/client-feedback", auth, async (req, res) => {
  try {
    const { rating, comments } = req.body;
    const acceptedOffer = await AcceptedOffer.findById(req.params.id);
    if (!acceptedOffer) return res.status(404).send("AcceptedOffer not found");

    if (acceptedOffer.clientId.toString() !== req.user.id)
      return res.status(403).send("Unauthorized");

    acceptedOffer.clientFeedback = { rating, comments };
    await acceptedOffer.save();
    res.json(acceptedOffer);
  } catch (err) {
    res.status(500).send(err.message);
  }
});

// 5️⃣ Candidate submits feedback
router.post("/:id/candidate-feedback", auth, async (req, res) => {
  try {
    const { rating, comments } = req.body;
    const acceptedOffer = await AcceptedOffer.findById(req.params.id);
    if (!acceptedOffer) return res.status(404).send("AcceptedOffer not found");

    if (acceptedOffer.candidateId.toString() !== req.user.id)
      return res.status(403).send("Unauthorized");

    acceptedOffer.candidateFeedback = { rating, comments };
    acceptedOffer.workCompleted = true; // ensure work marked completed
    acceptedOffer.endDate = acceptedOffer.endDate || new Date();

    await acceptedOffer.save();
    res.json(acceptedOffer);
  } catch (err) {
    res.status(500).send(err.message);
  }
});

module.exports = router;
