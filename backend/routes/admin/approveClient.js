const express = require("express");
const router = express.Router();
const Client = require("./../../models/Client");   // 👈 apna Client model import karein
const auth = require("./../../middleware/auth");   // 👈 JWT verify karega
 // 👈 optional, sirf admin ke liye

// Approve Client
router.put("/:id", auth,  async (req, res) => {
  try {
    const { approved } = req.body;

    const client = await Client.findByIdAndUpdate(
      req.params.id,
      { approved },
      { new: true }
    );

    if (!client) {
      return res.status(404).json({ error: "Client not found" });
    }

    res.json({
      message: `Client has been ${approved ? "approved" : "disapproved"}.`,
      client,
    });
  } catch (err) {
    console.error("Approve client error:", err);
    res.status(500).json({ error: "Server error" });
  }
});

module.exports = router;
