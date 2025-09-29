// cronJobs.js
const cron = require("node-cron");
const Offer = require("./models/Offer");


function initCronJobs() {
  // Run daily at midnight
  cron.schedule("0 0 * * *", async () => {
    const today = new Date();

    // Reminder for jobs ending in 2 days
    const twoDaysLater = new Date();
    twoDaysLater.setDate(today.getDate() + 2);

    const reminders = await Job.find({
      status: "ongoing",
      endedAt: { $lte: twoDaysLater, $gte: today }
    });

    reminders.forEach(job => {
      console.log(
        `Reminder: Job "${job.title}" is ending on ${job.endedAt}. Please give feedback.`
      );
      // 🔔 Yahan par client ko portal alert, email, SMS bhejo
    });

    // End jobs on the actual end date
    const endedJobs = await Job.find({
      status: "ongoing",
      endedAt: { $lte: today }
    });

    for (let job of endedJobs) {
      job.status = "ended";
      await job.save();
      console.log(`Job "${job.title}" marked as ended.`);
    }
  });
}

module.exports = initCronJobs;
