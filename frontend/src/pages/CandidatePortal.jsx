import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { getToken, removeToken } from "../utils/auth";
import LogoutButton from "../components/LogoutButton";
import SuggestedJobs from "../components/candidate/SuggestedClients";
import OfferList from "../components/candidate/OfferList";

const CandidatePortal = () => {
  const [jobs, setJobs] = useState([]);
  const [activeTab, setActiveTab] = useState("suggestions");
  const [selectedJob, setSelectedJob] = useState(null);
  const navigate = useNavigate();

  const candidateId = localStorage.getItem("userId");
  const token = getToken();

  // ✅ Auth & fetch jobs
  useEffect(() => {
    if (!token || !candidateId) {
      navigate("/signin");
      return;
    }

    const fetchJobs = async () => {
      try {
        const res = await axios.get("http://localhost:5000/api/jobs", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setJobs(res.data);
      } catch (error) {
        console.error("Error fetching jobs:", error);
        if (error.response?.status === 401) {
          removeToken();
          localStorage.clear();
          navigate("/signin");
        }
      }
    };

    fetchJobs();
  }, [candidateId, token, navigate]);

  return (
    <div className="container mt-4">
      <div className="d-flex flex-wrap align-items-center mb-4 justify-content-between">
        <h1 className="mb-3 mb-md-0">Candidate Dashboard</h1>
        <LogoutButton />
      </div>

      {/* Tabs */}
      <ul className="nav nav-tabs mb-4">
        <li className="nav-item">
          <button
            className={`nav-link ${activeTab === "suggestions" ? "active" : ""}`}
            onClick={() => setActiveTab("suggestions")}
          >
            Suggestions
          </button>
        </li>
        <li className="nav-item">
          <button
            className={`nav-link ${activeTab === "offers" ? "active" : ""}`}
            onClick={() => setActiveTab("offers")}
          >
            Offer List
          </button>
        </li>
        <li className="nav-item">
          <button
            className={`nav-link ${activeTab === "account" ? "active" : ""}`}
            onClick={() => setActiveTab("account")}
          >
            Update Account
          </button>
        </li>
      </ul>

      {/* Tab Content */}
      {activeTab === "suggestions" && (
        <div>
          <h3>Suggested Jobs</h3>
          {jobs.length === 0 ? (
            <p>No jobs available at the moment.</p>
          ) : (
            <table className="table table-striped table-bordered mt-3">
              <thead className="table-light">
                <tr>
                  <th>Title</th>
                  <th>Location</th>
                  <th>Category</th>
                  <th>Salary</th>
                  <th>Posted By</th>
                  <th>Posted On</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {jobs.map((job) => (
                  <tr key={job._id}>
                    <td>{job.title}</td>
                    <td>{job.location}</td>
                    <td>{job.category}</td>
                    <td>{job.salary}</td>
                    <td>{job.clientName}</td>
                    <td>{new Date(job.createdAt).toLocaleString()}</td>
                    <td>
                      <button
                        className="btn btn-sm btn-primary"
                        onClick={() => setSelectedJob(job)}
                      >
                        View
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      )}

      {activeTab === "offers" && (
        <div>
          <h3>Your Offers</h3>
          <OfferList candidateId={candidateId} token={token} />
        </div>
      )}

      {activeTab === "account" && (
        <div>
          <h3>Update Your Account</h3>
          <p>Form for updating candidate profile, skills, and preferences.</p>
          {/* Add your account update form here */}
        </div>
      )}
    </div>
  );
};

export default CandidatePortal;
