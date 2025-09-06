const express = require('express');
const router = express.Router();

// 👇 Import your Negotiation model here
const Negotiation = require('../models/negotiation');

// POST route to start a negotiation
router.post('/start', async (req, res) => {
  const { jobId, clientId, candidateId, offeredSalary } = req.body;

  try {
    const negotiation = new Negotiation({
      jobId,
      clientId,
      candidateId,
      offeredSalary
    });

    await negotiation.save();
    res.status(200).json({ message: 'Negotiation started successfully', negotiation });
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;
