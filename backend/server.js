// server.js
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const path = require('path');
const mongoose = require('mongoose');
const dotenv = require('dotenv');

dotenv.config();

const app = express();

// ✅ Middleware
app.use(cors());
app.use(express.json());
app.use(bodyParser.json());

// ✅ Serve uploaded resumes
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
app.use('/api/admin', require('./routes/admin'));
// ✅ Routes (one line each)
app.use('/api/offers', require('./routes/Offer'));
app.use('/api/signup', require('./routes/SignUpRoute'));
app.use('/api/jobs', require('./routes/jobs'));
app.use('/api/negotiation', require('./routes/negotiation'));
app.use("/api/match", require("./routes/match"));

// ✅ Database Connection (LOCAL only for now)
mongoose.connect(process.env.DATABASE_URL)
.then(() => console.log("✅ Connected to Local MongoDB"))
.catch(err => console.error("❌ MongoDB connection error:", err));

const PORT = process.env.PORT || 5000;
const JWT_SECRET = process.env.JWT_SECRET; // use this in auth logic

// ✅ Start server
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});
