// routes/clientRoutes.js
const express = require("express");
const router = express.Router();
const Client = require("./../../models/Client");
const authMiddleware = require("./../../middleware/auth");

// GET single client by email
router.get("/by-email/:email", authMiddleware, async (req, res) => {
  try {
    const email = req.params.email;
    const client = await Client.findOne({ email: email });
    if (!client) {
      return res.status(404).json({ error: "Client not found" });
    }
    res.json(client);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
});// routes/admin.js
router.put("/client/:id", authMiddleware, async (req, res) => {
  const clientId = req.params.id;
  const updateData = req.body;

  try {
    const updatedClient = await Client.findByIdAndUpdate(clientId, updateData, {
      new: true,
      runValidators: true,
    });

    if (!updatedClient) {
      return res.status(404).json({ error: "Client not found" });
    }

    res.json({ message: "Client updated successfully", client: updatedClient });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
});

// Update client by ID



module.exports = router;
