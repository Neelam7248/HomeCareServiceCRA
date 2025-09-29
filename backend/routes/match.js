const express = require("express");
const router = express.Router();
const Client = require("../models/Client");
const Offer = require("../models/Offer"); 
const Candidate = require("../models/Candidate");
const auth =require("../middleware/auth");
// GET suggested candidates based on skills
router.get("/suggestions/:userId", async (req, res) => {
  try {
    const userId = req.params.userId; // client id
    const client = await Client.findById(userId);

    console.log("Client ID:", userId);

    if (!client) {
      return res.status(404).json({ message: "Client not found" });
    }

    // Step 1: find candidates matching client's serviceType
    const candidates = await Candidate.find({
      skills: { $regex: client.serviceType, $options: "i" }, // case-insensitive
    });

    if (!candidates.length) {
      return res.status(404).json({ message: "No candidates found with matching skills" });
    }

    // Step 2: attach offer status to each candidate
    const suggestionsWithStatus = await Promise.all(
      candidates.map(async (cand) => {
        const offer = await Offer.findOne({
          candidateId: cand._id,
          clientId: client._id,
        });

        return {
          ...cand.toObject(),
          status: offer ? offer.status : "Not Offered", // Pending / Accepted / Rejected / Not Offered
        };
      })
    );

    // ✅ Step 3: filter out Accepted ones (so they don’t show up in frontend)
    const suggestions = suggestionsWithStatus.filter(
        (s) => s.status !== "Accepted" && s.status !== "Closed"

    );

    res.json(suggestions);
  } catch (err) {
    console.error("Error in suggestions route:", err);
    res.status(500).json({ message: "Server error" });
  }
});

// -- GET suggested clients based on candidate skills
router.get("/suggestions", auth, async (req, res) => {
  try {
    const candidateId = req.user.id; // JWT se candidate id
    const candidate = await Candidate.findById(candidateId);

    if (!candidate) {
      return res.status(404).json({ message: "Candidate not found" });
    }

    // Match clients by preferredSkill === candidate.skill
    const clients = await Client.find({
      serviceType: { $regex: candidate.skills, $options: "i" } // case-insensitive match
    })

    if (!clients.length) {
      return res
        .status(404)
        .json({ message: "No matching clients found for this candidate" });
    }

    res.json(clients);
  } catch (err) {
    console.error("Error fetching suggested clients:", err);
    res.status(500).json({ message: "Server error" });
  }
});



module.exports = router;
