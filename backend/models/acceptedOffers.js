const mongoose = require('mongoose');

const acceptedOfferSchema = new mongoose.Schema({
  offerId: { type: mongoose.Schema.Types.ObjectId, ref: 'Offer', required: true },
  clientId: { type: mongoose.Schema.Types.ObjectId, ref: 'Client', required: true },
  candidateId: { type: mongoose.Schema.Types.ObjectId, ref: 'Candidate', required: true },

  startDate: { type: Date, default: Date.now }, // candidate joins
  endDate: { type: Date }, // job completed date
  workCompleted: { type: Boolean, default: false },

  clientFeedback: { rating: Number, comments: String },
  candidateFeedback: { rating: Number, comments: String },

  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('AcceptedOffer', acceptedOfferSchema);
