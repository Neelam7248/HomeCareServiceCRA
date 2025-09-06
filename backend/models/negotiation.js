// models/Negotiation.js
const mongoose = require('mongoose');

const negotiationSchema = new mongoose.Schema(
  {
    jobId: { type: mongoose.Schema.Types.ObjectId, ref: 'Job', required: true },
    clientId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    candidateId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    offeredSalary: { type: String, required: true },
    candidateResponse: { type: String, enum: ['Pending', 'Accepted', 'Countered'], default: 'Pending' },
    finalAgreedSalary: { type: String },
    status: { type: String, enum: ['Pending', 'Confirmed', 'Rejected'], default: 'Pending' }
  },
  { timestamps: true }
);

module.exports = mongoose.model('Negotiation', negotiationSchema);
