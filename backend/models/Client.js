const mongoose = require("mongoose");

const clientSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  phone: String,
  address: String,
  occupation: String,
  serviceType: String,
  requiredExperience: String,
  preferredChargesType: String, // hourly/daily/weekly
  maxBudget: Number,          // budget in Rs
  preferredAge: Number,
  preferredGender: String,
  isDeleted: { type: Boolean, default: false }
,
    // ✅ Admin approval system
  approved: { type: Boolean, default: false } 
}, { timestamps: true });

module.exports = mongoose.model("Client", clientSchema);
