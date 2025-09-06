const mongoose = require("mongoose");

const candidateSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  phone: String,
  address: String,
  dob: { type: String, required: true }, // keep only DOB
  gender: String,
  skills: String,
  availability: {
    days: [String],
    hours: String
  },
  chargesType: String,
  charges: Number,
  experience: String,
  resume: String,
    // ✅ Admin approval system
  approved: { type: Boolean, default: false } 
}, { timestamps: true });

module.exports = mongoose.model("Candidate", candidateSchema);
