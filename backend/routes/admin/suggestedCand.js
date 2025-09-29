// routes/admin/suggestedCandidates.js
const express = require("express");
const router = express.Router();
const Client = require("../../models/Client");
const Candidate = require("../../models/Candidate");
const Offer = require("../../models/Offer");

// routes/admin/suggestedCandidates.js

// GET suggested candidates + their offers for a client
router.get("/:email", async (req, res) => {
  try {
    // 1️⃣ Find client by email
    const client = await Client.findOne({ email: req.params.email });
    if (!client) return res.status(404).json({ error: "Client not found" });

    // 2️⃣ Aggregate candidates with their offers for this client
    const suggestedCandidates = await Candidate.aggregate([
      { 
        $match: { 
          approved: true,
          isDeleted: false,
          skills: client.serviceType // 🎯 filter by serviceType
        }
      },
      {
        $lookup: {
          from: "offers",            // Offer collection in MongoDB
          let: { candidateId: "$_id" },
          pipeline: [
            {
              $match: {
                $expr: {
                  $and: [
                    { $eq: ["$candidateId", "$$candidateId"] },
                    { $eq: ["$clientId", client._id] }
                  ]
                }
              }
            }
          ],
          as: "offer"
        }
      },
      { $unwind: { path: "$offer", preserveNullAndEmptyArrays: true } },
      {
        $project: {
          _id: 1,
          name: 1,
          email: 1,
          skills: 1,
          charges: 1,
          chargesType: 1,
          experience: 1,
          gender: 1,
          offer: 1 // includes offer info if exists
        }
      }
    ]);

    // 3️⃣ Send response to frontend
    res.json({
      client: {
        id: client._id,
        name: client.name,
        email: client.email,
        serviceType: client.serviceType,
        preferredChargesType: client.preferredChargesType
      },
      suggestedCandidates
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
});

// for sending offer
// routes/admin/suggestedCandidates.js


// Admin send offer on behalf of client
router.post("/sendOffer", async (req, res) => {
  try {
    const { clientId, candidateId, sentBy, jobId, offeredSalary } = req.body;

    // Validate required fields
    if (!clientId || !candidateId || !sentBy || !jobId || !offeredSalary) {
      return res.status(400).json({ error: "All fields are required" });
    }

    // Fetch client and candidate
    const client = await Client.findById(clientId).select("name email serviceType");
    const candidate = await Candidate.findById(candidateId).select(
      "name email skills chargesType charges experience gender"
    );

    if (!client || !candidate) {
      return res.status(404).json({ error: "Client or Candidate not found" });
    }

    // Create new offer
    const newOffer = new Offer({
      clientId,
      candidateId,
      clientName: client.name,
      clientEmail: client.email,
      candidateName: candidate.name,
      candidateEmail: candidate.email,
      jobId,
      serviceType: client.serviceType, // client serviceType se match
      sentBy, // "admin"
      offeredSalary,
      candidateRequestedSalary: 0,
      clientCounterSalary: 0,
      finalSalary: offeredSalary,
      status: "Pending",
      jobStatus: "NotStarted",
    });

    await newOffer.save();

    // Populate client & candidate info for response
    const populatedOffer = await Offer.findById(newOffer._id)
      .populate("clientId", "name email serviceType")
      .populate("candidateId", "name email skills chargesType charges experience gender");

    res.json({ message: "Offer sent successfully", offer: populatedOffer });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
});


module.exports = router;
