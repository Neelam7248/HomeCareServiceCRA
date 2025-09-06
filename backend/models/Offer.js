const mongoose = require('mongoose');

const offerSchema = new mongoose.Schema({
  clientId: { type: mongoose.Schema.Types.ObjectId, ref: 'Client', required: true },
  candidateId: { type: mongoose.Schema.Types.ObjectId, ref: 'Candidate', required: true },

  jobId: { type: String, required: false }, // candidate.skills save hoga yahan

  // Client ke fields
  maxBudget: { type: Number, required: false },
  serviceType: { type: String, required: false },
  preferredChargesType: { type: String, required: false },

  // Salary / charges
  offeredSalary: { type: Number },   // client ne pehli baar offer kiya
  candidateRequestedSalary: {type:Number},  // what candidate proposed
clientCounterSalary: {type:Number},    // candidate ne counter offer diya
  finalSalary: { type: Number },     // agar dono agree ho jayein

  status: {
    type: String,
    enum: ['Pending', 'Accepted', 'Rejected', 'Negotiating'],
    default: 'Pending'
  },
negotiationCount: { type: Number, default: 0 },
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model('Offer', offerSchema);
