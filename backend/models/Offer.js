const mongoose = require('mongoose');

const offerSchema = new mongoose.Schema({
  clientId: { type: mongoose.Schema.Types.ObjectId, ref: 'Client', required: true },
  candidateId: { type: mongoose.Schema.Types.ObjectId, ref: 'Candidate', required: true },

  clientName: String,
  clientEmail: String,
  candidateEmail: String,
  candidateName: String,

  jobId: { type: String }, // candidate.skills save hoga yahan

  serviceType: String,
  preferredChargesType: String,

  // Salary
  offeredSalary: Number,
  candidateRequestedSalary: Number,
  clientCounterSalary: Number,
  finalSalary: Number,
sentBy: { type: String, enum: ["client", "admin"], default: "client" },
  // Negotiation history 🔄
  negotiations: [
  {
    by: { type: String, enum: ["client", "candidate", "candidateCounter"], required: true },
    actedBy: { type: String, enum: ["self", "admin"], default: "self" },
    action: { type: String, enum: ["Counter", "Accepted", "Rejected"] }, // 👈 Add this
    salary: Number,
    joiningDate: Date,
    createdAt: { type: Date, default: Date.now }
  }
]
,

  // ✅ Dates
  proposedJoiningDate: Date,      // Client proposes joining
  candidateJoiningDate: Date,     // Candidate proposes joining
  clientCounterDate: Date,        // Client sends counter date
  endDate: Date,                  // End date of job
  finalJoiningDate: Date,         // Final joining date after agreement

  status: {
    type: String,
    enum: ['Pending', 'Accepted', 'Rejected','Closed', 'Negotiating'],
    default: 'Pending'
  },

  jobStatus: {
    type: String,
    enum: ["NotStarted", "Ongoing", "Probation", "Permanent","Closed"],
    default: "NotStarted"
  },

  clientFeedback: {
    message: String,
    givenAt: Date
  },
  candidateFeedback: {
    message: String,
    rating:Number,
    givenAt: Date
  },

  negotiationCount: { type: Number, default: 0 },
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model('Offer', offerSchema);
