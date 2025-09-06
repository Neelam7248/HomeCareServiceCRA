const OfferSchema = new mongoose.Schema({
  clientId: { type: mongoose.Schema.Types.ObjectId, ref: "Client" },
  candidateId: { type: mongoose.Schema.Types.ObjectId, ref: "Candidate" },
  jobTitle: String,
  salaryOffered: String,
  status: { type: String, enum: ["Pending", "Accepted", "Rejected"], default: "Pending" }
}, { timestamps: true });

module.exports = mongoose.model("Offer", OfferSchema);
