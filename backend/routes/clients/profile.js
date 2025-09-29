const express = require("express");
const router = express.Router();
const Client = require("./../../models/Client");
const auth = require("./../../middleware/auth"); // ✅ JWT middleware
const mongoose=require('mongoose');
// ===============================
// ✅ GET Client Profile (self or admin)
// ===============================
router.get("/:id", auth, async (req, res) => {
  try {
    const { id } = req.params;

    // ✅ Validate ObjectId
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ error: "Invalid client ID" });
    }

    // Only allow if same user or admin
    if (req.user.id !== id && req.user.userType !== "admin") {
      return res.status(403).json({ error: "Unauthorized access" });
    }

    const client = await Client.findById(id).select("-password");
    if (!client) {
      return res.status(404).json({ error: "Client not found" });
    }

    res.json(client);
  } catch (err) {
    console.error("Error fetching client profile:", err.message);
    res.status(500).json({ error: "Server error" });
  }
});

// ===============================
// ✅ UPDATE Client Profile (self or admin)
// ===============================
router.put("/:id", auth, async (req, res) => {
  try {
    const { id } = req.params;

    // ✅ Validate ObjectId first
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ error: "Invalid client ID" });
    }

    // Only allow updating own profile or if admin
    if (req.user.id !== id && req.user.userType !== "admin") {
      return res.status(403).json({ error: "Unauthorized access" });
    }

    // ✅ Update client
    const updatedClient = await Client.findByIdAndUpdate(
      id,
      { $set: req.body },
      { new: true, runValidators: true }
    ).select("-password");

    if (!updatedClient) {
      return res.status(404).json({ error: "Client not found" });
    }

    res.json(updatedClient);
  } catch (err) {
    console.error("Error updating client profile:", err.message);
    res.status(500).json({ error: "Server error" });
  }
});
module.exports = router;
