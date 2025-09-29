const express = require("express");
const router = express.Router();
const Offer = require("../../models/Offer");
const auth = require("../../middleware/auth");
const mongoose = require("mongoose");

// =============================
// ✅ Get all accepted offers (CLIENT dashboard only)
// =============================
router.get("/", auth, async (req, res) => {
  try {console.log(req.user)
    if (req.user.userType !== "client") {
      return res.status(403).json({ error: "Forbidden: Only clients can access this" });
    }

    const clientId = new mongoose.Types.ObjectId(req.user.id);
    const offers = await Offer.find({ clientId, status: "Accepted" })
      .populate("candidateId", "name email charges skills")
      .sort({ createdAt: -1 });

    res.json(offers);
  } catch (err) {
    console.error("Error fetching accepted offers:", err);
    res.status(500).json({ error: "Server error" });
  }
});

// =============================
// ✅ Client proposes joining date

// =============================
// ✅ Propose Joining Date (Client → Candidate)
// =============================
router.post("/:id/propose-joining", auth, async (req, res) => {
  try {
    const { proposedJoiningDate } = req.body;
    const offerId = req.params.id;

    if (!proposedJoiningDate) {
      return res.status(400).json({ error: "Joining date is required" });
    }

    // Sirf client hi propose kar sake
    if (req.user.userType !== "client") {
      return res.status(403).json({ error: "Only clients can propose joining date" });
    }

    const offer = await Offer.findById(offerId);
    if (!offer) {
      return res.status(404).json({ error: "Offer not found" });
    }

    // Update offer
    offer.proposedJoiningDate = proposedJoiningDate;
    offer.jobStatus = "NotStarted"; // ya "Ongoing" aapka business rule ke hisaab se
    await offer.save();

    res.json(offer);
  } catch (err) {
    console.error("Error in propose-joining:", err);
    res.status(500).json({ error: "Server error" });
  }
});


///**
 /* @route   POST /api/Claccepted-offers/:id/counter
 * @desc    Client sends a counter joining date to candidate
 * @access  Private (client only)
 */
router.post("/:id/counter", auth, async (req, res) => {
  try {
    const { id } = req.params;
    const { joiningDate } = req.body;

    if (req.user.userType !== "client") {
      return res.status(403).json({ error: "Only clients can send counter dates" });
    }

    if (!joiningDate) {
      return res.status(400).json({ error: "Joining date is required" });
    }

    // Find offer
    const offer = await Offer.findById(id);
    if (!offer) {
      return res.status(404).json({ error: "Offer not found" });
    }

    // Update with counter date
    offer.clientCounterDate = joiningDate;
    offer.negotiationCount = (offer.negotiationCount || 0) + 1;
    offer.jobStatus = "NotStarted"; // mark as negotiation

    await offer.save();

    res.json({
      message: "Counter date sent to candidate",
      offer,
    });
  } catch (err) {
    console.error("Error in client counter route:", err);
    res.status(500).json({ error: "Server error" });
  }
});

// =============================
// Accept / Reject candidate proposed joining date
// POST /api/Claccepted-offers/:offerId/decision
router.post("/:offerId/decision", auth, async (req, res) => {
  const { offerId } = req.params;
  const { decision } = req.body; // "accepted" or "rejected"

  try {
    const offer = await Offer.findById(offerId);
    if (!offer) return res.status(404).json({ error: "Offer not found" });

    if (decision === "accepted") {
      // Accept candidate's proposed joining date
      offer.finalJoiningDate = offer.candidateJoiningDate;
      offer.jobStatus = "Probation"; // Starts probation
      // Set final salary if not already set
      offer.finalSalary = offer.finalSalary || offer.clientCounterSalary || offer.offeredSalary;
    } else if (decision === "rejected") {
      // Reject candidate's proposed date
      offer.finalJoiningDate = null;  // Remove joining date
      offer.jobStatus = "NotStarted"; // Offer still accepted but joining rejected
    }

    await offer.save();
    res.json({ offer, message: `Candidate's proposed date ${decision}` });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
});
// ================================
// Client → End Job
// ================================
// client sets end date
router.post("/:id/end", auth, async (req, res) => {
  try {
    const { endDate } = req.body;

    if (!endDate) {
      return res.status(400).json({ error: "End date is required" });
    }

    const offer = await Offer.findById(req.params.id);
    if (!offer) {
      return res.status(404).json({ error: "Offer not found" });
    }

    // Sirf client apne offers update kar sake
    if (offer.clientId.toString() !== req.user.id) {
      return res.status(403).json({ error: "Not authorized to update this offer" });
    }

    let message = "";

    if (offer.endDate) {
      // Agar pehle se hai to update karega
      offer.endDate = new Date(endDate);
      message = "End date updated successfully";
    } else {
      // Pehli dafa set karega
      offer.endDate = new Date(endDate);
      message = "End date scheduled successfully";
    }

    // Status ko ongoing hi rakhe jab tak reject nahi hota
    if (!offer.jobStatus || offer.jobStatus !== "Rejected") {
      offer.jobStatus = "Ongoing";
    }

    await offer.save();

    res.json({ message, offer });
  } catch (err) {
    console.error("Error setting end date:", err);
    res.status(500).json({ error: "Server error" });
  }
});
//update/ Set End Date (status stays Ongoing)
// ===============================
//  Close Job & Save Client Feedback
// ===============================
router.post("/:id/close", auth, async (req, res) => {
  try {
    const { id } = req.params;
    const { clientFeedback } = req.body; // frontend se string aa rahi hai

    if (!clientFeedback || clientFeedback.trim() === "") {
      return res.status(400).json({ error: "Feedback is required to close the job." });
    }

    const offer = await Offer.findById(id);
    if (!offer) {
      return res.status(404).json({ error: "Offer not found" });
    }

    if (offer.clientId.toString() !== new mongoose.Types.ObjectId(req.user.id).toString()) {
      return res.status(403).json({ error: "Not authorized to close this job." });
    }

    // ✅ status aur feedback sahi format me save karo
    offer.status = "Closed";
    offer.jobStatus = "Closed"; // agar dono track karna hai
    offer.clientFeedback = {
      message: clientFeedback,
      givenAt: new Date()
    };
    offer.closedAt = new Date();

    await offer.save();

    res.json({ message: "Job closed successfully", offer });
  } catch (err) {
    console.error("Error closing job:", err);
    res.status(500).json({ error: "Server error" });
  }
});


module.exports = router;
