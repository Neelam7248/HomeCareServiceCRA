const express = require('express');
const router = express.Router();
const Job = require('../models/jobs');
const Client = require('../models/Client'); // ✅ Make sure this is correct
router.post('/create', async (req, res) => {
  try {
    const job = new Job(req.body);
    await job.save();
    res.status(201).json(job);
  } catch (err) {
    console.error("Error saving job:", err);
    res.status(500).json({ message: 'Failed to post job', error: err.message });
  }
});

router.get('/client/:clientId', async (req, res) => {
  console.log('✅ /api/jobs/client/:clientId route hit');
  try {
    const jobs = await Job.find({ clientId: req.params.clientId })
      .populate('clientId', 'name email');

    const jobsWithClientInfo = jobs.map(job => ({
      ...job._doc,
      clientName: job.clientId?.name || job.clientId?.email || 'Unknown'
    }));

    console.log('✅ Sending to frontend:', jobsWithClientInfo);
    res.json(jobsWithClientInfo); // ✅ send array only
    console.log(jobsWithClientInfo); // check what’s inside

  } catch (err) {
    console.error('❌ Error in GET /client/:clientId', err);
    res.status(500).json({ message: 'Failed to fetch jobs', error: err.message });
  }
});
// ✅ DELETE a job by ID
router.delete('/:id', async (req, res) => {
  try {
    const deletedJob = await Job.findByIdAndDelete(req.params.id);
    if (!deletedJob) {
      return res.status(404).json({ message: 'Job not found' });
    }
    res.json({ message: 'Job deleted successfully' });
  } catch (error) {
    console.error('❌ Error deleting job:', error);
    res.status(500).json({ message: 'Server error while deleting job' });
  }
});
// ✅ GET all jobs (for Candidate Portal)
// ======================= GET all jobs (Candidate Portal with joins) =======================
router.get("/", async (req, res) => {
  try {
    const jobs = await Job.aggregate([
      // 🔹 1. Client info join
      {
        $lookup: {
          from: "clients",             // collection name (mongoose plural lowercase)
          localField: "clientId",
          foreignField: "_id",
          as: "client"
        }
      },
      { $unwind: { path: "$client", preserveNullAndEmptyArrays: true } },

      // 🔹 2. Applications join
      {
        $lookup: {
          from: "applications",        // applications collection
          localField: "_id",           // job ka id
          foreignField: "jobId",       // application me jobId
          as: "applications"
        }
      },

      // 🔹 3. Candidate info join inside applications
      {
        $lookup: {
          from: "candidates",           // candidates collection
          localField: "applications.candidateId",
          foreignField: "_id",
          as: "candidates"
        }
      }
    ]);

    console.log("✅ Jobs with client + applicants:", jobs);
    res.json(jobs);

  } catch (err) {
    console.error("❌ Error in Candidate Portal GET:", err);
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
