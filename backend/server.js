// server.js
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const path = require('path');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const initCronJobs = require('./cronsJobs');
initCronJobs(); // Initialize cron jobs 
dotenv.config();

const app = express();

// ✅ Middleware
app.use(cors());
app.use(express.json());
app.use(bodyParser.json());

// CORS configuration to allow requests from frontend
app.use(
  cors({
    origin: "http://localhost:3000", // your frontend
    credentials: true,
    allowedHeaders: ["Content-Type", "Authorization"], // important!
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"]
  })
);
// ✅ Serve uploaded resumes
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
app.use('/api/admin', require('./routes/admin'));
app.use('/api/admin/add-user', require('./routes/admin/addCand'));
app.use('/api/admin/updateClient', require('./routes/admin/updateClientR'));

app.use('/api/admin/updateCandidate', require('./routes/admin/updateCandR'));
app.use('/api/admin/userDelete', require('./routes/admin/userDeleteR'));

app.use('/api/admin/suggestedCandidates', require('./routes/admin/suggestedCand'));

app.use('/api/admin/sendOffer', require('./routes/admin/sendOffer'));

app.use('/api/admin/offerList', require('./routes/admin/offerList'));

app.use('/api/admin/acceptedOffer', require('./routes/admin/acceptedOffers'));
app.use('/api/admin/approve/candidate', require('./routes/admin/approveCandidate'));
app.use('/api/admin/approve/client', require('./routes/admin/approveClient'));

// ✅ Routes (one line each)
app.use('/api/offers', require('./routes/Offer'));
app.use('/api/signup', require('./routes/SignUpRoute'));
app.use('/api/closedOffers', require('./routes/clients/closedJobs'));
app.use('/api/candidate', require('./routes/candidates/closedJobs'));
app.use('/api/candidate/feedback', require('./routes/candidates/candidateFeedbackR'));

app.use('/api/profile', require('./routes/candidates/updateAccount'));

app.use('/api/clProfile',require('./routes/clients/profile'))
app.use("/api/match", require("./routes/match"));
// ✅ Accepted offers (Client side extra routes)

app.use("/api/Claccepted-offers", require("./routes/clients/clAcceptedOffers"));
// ✅ Candidate Accepted Offers & Ongoing Jobs
app.use("/api/accepted-offers", require("./routes/candidates/candidateAcceptedOffersRoute"));


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
