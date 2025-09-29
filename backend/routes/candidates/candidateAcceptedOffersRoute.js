const express = require("express");
const router = express.Router();
const auth = require("../../middleware/auth"); // ✅ JWT middleware
const Offer = require("../../models/Offer");
const mongoose = require("mongoose");

// ===============================
// Candidate → Get Accepted Offers
// ===============================
router.get("/", auth, async (req, res) => {
  try {
    // Make sure only candidates can access
    if (req.user.userType !== "candidate") {
      return res
        .status(403)
        .json({ error: "Only candidates can access accepted offers" });
    }

    // Fetch offers for this candidate
    const offers = await Offer.find({
      candidateId: new mongoose.Types.ObjectId(req.user.id),
      status: "Accepted",
    })
      .populate("clientId", "name email serviceType")
      .sort({ createdAt: -1 });

    // Map offers to include the proposed date of joining
    const formatted = offers.map((o) => ({
      _id: o._id,
      clientName: o.clientId?.name,
      clientEmail: o.clientId?.email,
      Job: o.clientId?.serviceType,

      offeredSalary: o.offeredSalary,
      candidateRequestedSalary: o.candidateRequestedSalary,
      clientCounterSalary: o.clientCounterSalary,
      finalSalary: o.finalSalary,

      proposedDateOfJoining: o.proposedJoiningDate, // client ka pehla proposal
      candidateJoiningDate: o.candidateJoiningDate, // candidate ka proposal
      clientCounterDate: o.clientCounterDate, // client ka counter
      finalJoiningDate: o.finalJoiningDate, // ✅ agreed final date

      negotiationCount: o.negotiationCount,
      negotiationStatus: o.negotiationStatus,

      status: o.status,
      jobStatus: o.jobStatus,
      createdAt: o.createdAt,
    }));

    res.json(formatted);
  } catch (err) {
    console.error("Error fetching accepted offers:", err);
    res.status(500).json({ error: "Server error" });
  }
});

// ===============================
// Candidate → Accept or Reject Offer
// ===============================
router.post("/decision", auth, async (req, res) => {
  try {
    const { offerId, decision } = req.body;

    if (!offerId || !decision) {
      return res
        .status(400)
        .json({ error: "offerId and decision are required" });
    }

    const offer = await Offer.findById(offerId);
    if (!offer) {
      return res.status(404).json({ error: "Offer not found" });
    }

    // ✅ Candidate authorization check
    if (offer.candidateId.toString() !== req.user.id) {
      return res.status(403).json({ error: "Not authorized" });
    }

    // ✅ Decision logic
    if (decision === "Accept") {
      offer.finalJoiningDate = offer.proposedJoiningDate; // ✅ lock agreed date
      offer.jobStatus = "Ongoing";
      offer.status = "Accepted";
      offer.negotiationStatus = "Confirmed";
    } else if (decision === "Reject") {
      offer.jobStatus = "Terminated";
      offer.status = "Rejected";
      offer.negotiationStatus = "Rejected";
    } else {
      return res
        .status(400)
        .json({ error: "Only Accept or Reject allowed" });
    }

    await offer.save();

    res.json({
      message: `Offer ${decision}ed successfully`,
      offer,
    });
  } catch (err) {
    console.error("Decision error:", err);
    res.status(500).json({ error: "Server error" });
  }
});

// ===============================
// Candidate → Counter / Negotiate Joining Date
// ===============================
router.post("/counter", auth, async (req, res) => {
  try {
    const { offerId, counterDate } = req.body;

    if (!offerId || !counterDate) {
      return res
        .status(400)
        .json({ error: "offerId and counterDate are required" });
    }

    const offer = await Offer.findById(offerId);
    if (!offer) return res.status(404).json({ error: "Offer not found" });

    if (offer.candidateId.toString() !== req.user.id) {
      return res.status(403).json({ error: "Not authorized" });
    }

    offer.candidateJoiningDate = new Date(counterDate); // candidate proposes
    offer.negotiationStatus = "CandidateCountered"; // mark pending client response
    offer.negotiationCount = (offer.negotiationCount || 0) + 1;

    await offer.save();

    res.json({
      message: "Counter date sent to client successfully",
      offer,
    });
  } catch (err) {
    console.error("Counter error:", err);
    res.status(500).json({ error: "Server error" });
  }
});
// Client ends the job
// Client ends the job
router.post("/:id/end", auth, async (req, res) => {
  try {
    if (req.user.userType !== "client") {
      return res.status(403).json({ error: "Only clients can end jobs" });
    }

    const { endDate, feedback } = req.body;
    const offer = await Offer.findById(req.params.id);

    if (!offer) return res.status(404).json({ error: "Offer not found" });

    // ✅ store proper end date
    offer.endDate = endDate ? new Date(endDate) : new Date();

    // ✅ store feedback as object (schema compatible)
    offer.clientFeedback = {
      message: feedback || "",
      givenAt: new Date(),
    };

    offer.jobStatus = "Ended";

    await offer.save();

    res.json({ message: "Job ended successfully", offer });
  } catch (err) {
    console.error("End job error:", err);
    res.status(500).json({ error: "Server error" });
  }
});


module.exports = router;
