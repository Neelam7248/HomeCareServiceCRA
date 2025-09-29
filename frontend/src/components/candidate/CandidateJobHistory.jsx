import React, { useEffect, useState } from "react";
import axios from "axios";
import { getToken } from "../../utils/auth";

const JobHistory = () => {
  const [jobHistory, setJobHistory] = useState([]);
  const token = getToken();

  useEffect(() => {
    const fetchJobHistory = async () => {
      try {
        // GET request to fetch candidate's accepted offers
        const res = await axios.get("/api/offers/candidate/history", {
          headers: { Authorization: `Bearer ${token}` },
        });


        const acceptedOffers = res.data;

        setJobHistory(acceptedOffers);
      } catch (err) {
        console.error("Failed to fetch job history:", err);
      }
    };

    fetchJobHistory();
  }, [token]);

  const handleJobStatus = async (offerId, action) => {
    try {
      const res = await axios.post(
        `/api/offers/${offerId}/jobstatus`,
        { action },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setJobHistory(prev =>
        prev.map(j => (j._id === offerId ? { ...j, jobStatus: res.data.jobStatus } : j))
      );

      if (action === "Completed") {
        const feedback = prompt("Please give feedback for this client:");
        if (feedback) {
          await axios.post(
            `/api/offers/${offerId}/feedback`,
            { feedback },
            { headers: { Authorization: `Bearer ${token}` } }
          );
          alert("Feedback sent successfully!");
        }
      }
    } catch (err) {
      console.error(err);
      alert("Failed to update job status");
    }
  };

  return (
    <div className="container mt-3">
      <h2 className="mb-3">Job History</h2>
      {jobHistory.length === 0 ? (
        <p>No accepted jobs yet.</p>
      ) : (
        <div className="table-responsive">
          <table className="table table-striped table-bordered align-middle">
            <thead className="table-light">
              <tr>
                <th>Client</th>
                <th>Service Type</th>
                <th>Charges</th>
                <th>Status</th>
                <th>Job Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {jobHistory.map(job => (
                <tr key={job._id}>
                  <td>{job.clientId?.name}</td>
                  <td>{job.serviceType}</td>
                  <td>{job.negotiatedCharges || job.maxBudget}</td>
                  <td>{job.status}</td>
                  <td>{job.jobStatus || "Not Started"}</td>
                  <td>
                    {job.jobStatus !== "Completed" && (
                      <>
                        {job.jobStatus !== "Ongoing" && (
                          <button
                            className="btn btn-sm btn-primary me-2"
                            onClick={() => handleJobStatus(job._id, "Ongoing")}
                          >
                            Start Job
                          </button>
                        )}
                        {job.jobStatus === "Ongoing" && (
                          <button
                            className="btn btn-sm btn-success"
                            onClick={() => handleJobStatus(job._id, "Completed")}
                          >
                            End Job
                          </button>
                        )}
                      </>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default JobHistory;
