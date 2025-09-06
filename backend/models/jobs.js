const mongoose = require('mongoose');

const jobSchema = new mongoose.Schema({
  title: { type: String, required: true },
  location: { type: String, required: true },
  salary: { type: String, required: true },
  timing: { type: String },
  category: { type: String, default: "Full-time" }, // ✅ NEW
  skills: [{ type: String, required: true }],
  description: { type: String, required: true },
  clientId: { type: mongoose.Schema.Types.ObjectId, ref: 'Client', required: true }
}, { timestamps: true }); // ✅ this adds createdAt & updatedAt automatically

module.exports = mongoose.model('Job', jobSchema);
