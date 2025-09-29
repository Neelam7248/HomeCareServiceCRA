// src/components/client/ClosedJobs.jsx
import React, { useEffect, useState } from "react";
import axios from "axios";
import { getToken } from "../../utils/auth";

const ClosedJobs = () => {
  const [closedJobs, setClosedJobs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchClosedJobs();
  }, []);

  const fetchClosedJobs = async () => {
    try {
      const token = getToken();
      const res = await axios.get("http://localhost:5000/api/closedOffers", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setClosedJobs(res.data);
    } catch (err) {
      console.error("Error fetching closed jobs:", err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <p className="text-center">Loading closed jobs...</p>;

  if (closedJobs.length === 0) {
    return (
      <div className="container mt-4">
        <h2 className="mb-3">Closed Jobs</h2>
        <div className="alert alert-info text-center">
        No closed jobs found.
      </div>
      </div>
    );
  }
  return (
    <div className="container mt-4">
      <h2 className="mb-3">Closed Jobs</h2>
      <div className="table-responsive">
        <table className="table table-bordered table-striped">
          <thead className="table-dark">
            <tr>
              <th>Client</th>
              <th>Candidate</th>
              <th>Job ID</th>
              <th>Service Type</th>
              <th>Preferred Charges</th>
              <th>Offered Salary</th>
              <th>Requested Salary</th>
              <th>Counter Salary</th>
              <th>Final Salary</th>
              <th>Negotiations</th>
              <th>Proposed Joining Dates</th>
              <th>candidatePro.DOJ</th>
                <th>ClientCounterDate</th>
                <th>Final DOJ</th>        
              <th>End Date</th>
              <th>Status</th>
              <th>Job Status</th>
              <th>Client Feedback</th>
              <th>ClientG.T</th>
              <th>Candidate Feedback</th>
              <th>CandG.T</th>
             < th>Offer.Cr.Date</th>
        
            </tr>
          </thead>
          <tbody>
            {closedJobs.map((job) => (
              <tr key={job._id}>
                <td>
                  {job.clientId?.name} <br />
                  <small>{job.clientId?.email}</small>
                </td>
                <td>
                  {job.candidateId.name} <br />
                  <small>{job.candidateId.email}</small>
                </td>
                <td>{job.jobId}</td>
                <td>{job.serviceType}</td>
                <td>{job.preferredChargesType}</td>
                <td>{job.offeredSalary}</td>
                <td>{job.candidateRequestedSalary}</td>
                <td>{job.clientCounterSalary}</td>
                <td>{job.finalSalary}</td>
                    




                <td>
                  {job.negotiations.length > 0 ? (
                    <ul>
                      {job.negotiations.map((n, idx) => (
                        <li key={idx}>
                          <strong>{n.by}</strong>: {n.salary} |{" "}
                          {n.joiningDate
                            ? new Date(n.joiningDate).toLocaleDateString()
                            : "N/A"}{" "}
                          | {new Date(n.createdAt).toLocaleDateString()}
                        </li>
                      ))}
                    </ul>
                  ) : (
                    "No negotiations"
                  )}
                </td>
                <td>
                  <div>Proposed: {job.proposedJoiningDate ? new Date(job.proposedJoiningDate).toLocaleDateString() : "N/A"}</div></td>
                <td>  <div>Candidate: {job.candidateJoiningDate ? new Date(job.candidateJoiningDate).toLocaleDateString() : "N/A"}</div></td>
                  <td><div>Client Counter: {job.clientCounterDate ? new Date(job.clientCounterDate).toLocaleDateString() : "N/A"}</div></td>
                 <td> <div>Final: {job.finalJoiningDate ? new Date(job.finalJoiningDate).toLocaleDateString() : "N/A"}</div>
                </td>
                <td>{job.endDate ? new Date(job.endDate).toLocaleDateString() : "N/A"}</td>
                <td>{job.status}</td>
                <td>{job.jobStatus}</td>
                <td>
                  {job.clientFeedback?.message} <br /></td>
                  <td>
                  <small>
                    {job.clientFeedback?.givenAt &&
                      new Date(job.clientFeedback.givenAt).toLocaleDateString()}
                  </small>
                </td>
                <td>
                  {job.candidateFeedback?.message} <br />
  </td>
  <td>              
      <small>
                    {job.candidateFeedback?.givenAt &&
                      new Date(job.candidateFeedback.givenAt).toLocaleDateString()}
                  </small> Rating:   {job.candidateFeedback?.rating} <br />
                </td>
                <td>{new Date(job.createdAt).toLocaleDateString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ClosedJobs;
