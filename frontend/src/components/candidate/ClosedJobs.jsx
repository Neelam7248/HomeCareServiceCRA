// src/components/candidate/CandidateClosedJobs.jsx
import React, { useEffect, useState } from "react";
import axios from "axios";
import { getToken } from "../../utils/auth";
import CandidateFeedback from "./CandFeedback";
const CandidateClosedJobs = () => {
  const [closedJobs, setClosedJobs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchClosedJobs();
  }, []);

  const fetchClosedJobs = async () => {
    try {
      const token = getToken();
      const res = await axios.get("http://localhost:5000/api/candidate/closedOffers", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setClosedJobs(res.data);
    } catch (err) {
      console.error("Error fetching closed jobs (candidate):", err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <p className="text-center">Loading closed jobs...</p>;

  if (closedJobs.length === 0)
    return <p className="text-center">No closed jobs found.</p>;

  return (
    <div className="container mt-4">
      <h2 className="mb-3">My Closed Jobs</h2>
      <div className="table-responsive">
        <table className="table table-bordered table-striped">
          <thead className="table-dark">
            <tr>
                <th>Your Name</th>
              <th>Client</th>
              <th>Job ID</th>
              <th>Service Type</th>
              <th>Final Salary</th>
              <th>Proposed Joining Dates</th>
              <th>CandProp.JOD </th>
              <th>ClientCounterDate</th>
              <th>Fianl DOJ</th>
              <th>End Date</th>
              <th>Status</th>
              <th>Job Status</th>
              <th>Client Feedback</th>
              <th>Client G.T</th>
              <th>My Feedback</th>
              <th>cand G.T</th>
              <th>Created At</th>
           <th>GiveFeedback</th>
            </tr>
          </thead>
          <tbody>
            {closedJobs.map((job) => (
              <tr key={job._id}>
 <td>
                  {job.candidateId.name} <br />
                  <small>{job.candidateId.email}</small>
                </td>               
                <td>
                  {job.clientId.name} <br />
                  <small>{job.clientId.email}</small>
                </td>
                <td>{job.jobId}</td>
                <td>{job.serviceType}</td>
                <td>{job.finalSalary}</td>
                <td>
                  <div>Proposed: {job.proposedJoiningDate ? new Date(job.proposedJoiningDate).toLocaleDateString() : "N/A"}</div></td>
                 <td> <div>Candidate: {job.candidateJoiningDate ? new Date(job.candidateJoiningDate).toLocaleDateString() : "N/A"}</div></td>
                 <td> <div>Client Counter: {job.clientCounterDate ? new Date(job.clientCounterDate).toLocaleDateString() : "N/A"}</div></td>
                  <td><div>Final: {job.finalJoiningDate ? new Date(job.finalJoiningDate).toLocaleDateString() : "N/A"}</div></td>
                
                <td>{job.endDate ? new Date(job.endDate).toLocaleDateString() : "N/A"}</td>
                <td>{job.status}</td>
                <td>{job.jobStatus}</td>
                <td>
                  {job.clientFeedback?.message} <br />
 </td>                 <td><small>
                    {job.clientFeedback?.givenAt &&
                      new Date(job.clientFeedback.givenAt).toLocaleDateString()}
                  </small>
                </td>
                <td>
                  {job.candidateFeedback?.message} <br /></td>
                  <td>
                  <small>
                    {job.candidateFeedback?.givenAt &&
                      new Date(job.candidateFeedback.givenAt).toLocaleDateString()}
                  </small>  Rating:  {job.candidateFeedback?.rating}
                </td>
<td>{new Date(job.createdAt).toLocaleDateString()}</td>
<td><CandidateFeedback jobId={job._id} />
</td>

              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default CandidateClosedJobs;
