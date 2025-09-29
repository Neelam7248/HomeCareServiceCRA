// routes/admin.js
const express = require("express");
const router = express.Router();
const Client = require("../../models/Client");
const Candidate = require("../../models/Candidate");

const authMiddleware = require("../../middleware/auth");

// Soft delete client
router.put("/client/:id", authMiddleware, async (req, res) => {
  try {
    const client = await Client.findById(req.params.id);
    if (!client) return res.status(404).json({ error: "Client not found" });

    client.isDeleted = true;
    await client.save();

    res.json({ message: "Client soft deleted successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
});
// to restore the client from inactive to active 

router.put("/clientRestore/:id", authMiddleware, async (req, res) => {
  try {
    const client = await Client.findById(req.params.id);
    if (!client) return res.status(404).json({ error: "Client not found" });

    client.isDeleted = false;
    await client.save();

    res.json({ message: "Client restored successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
});
//softDelete Candidate

router.put("/candidate/:id", authMiddleware, async (req, res) => {
  try {
    const candidate = await Candidate.findById(req.params.id);
    if (!candidate) return res.status(404).json({ error: "Candidate not found" });

    // Soft delete logic
    if (req.body.isDeleted) candidate.isDeleted = true;

    // Baaki updates
    Object.assign(candidate, req.body);
    await candidate.save();

    res.json(candidate);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

//restore deleted candidate
router.put("/candidateRestore/:id", authMiddleware, async (req, res) => {
  try {
    const candidate = await Candidate.findById(req.params.id);
    if (!candidate) return res.status(404).json({ error: "Candidate not found" });

    candidate.isDeleted = false;
    await candidate.save();

    res.json({ message: "Candidate restored successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
});



module.exports = router;
