import React, { useState, useEffect } from "react";
import SalaryNegotiationForm from "../components/negotiation/SalaryNegotiationForm";
import PostJobForm from "../components/client/PostJobForm";
import EditJobModal from "../components/client/EditJobModal";
import SuggestedCandidate from "../components/client/SuggestedCandidate";
import { setToken,getToken,removeToken } from "../utils/auth";
import { useNavigate } from "react-router-dom"; // ✅ for navigation
import axios from "axios"; // ✅ using axios consistently
import LogoutButton from "../components/LogoutButton";
 




  const ClientPortal = ({ onLogout }) => {
  const [jobs, setJobs] = useState([]);
  const [selectedJob, setSelectedJob] = useState(null);
  const [applicants, setApplicants] = useState([]);
  const [editJob, setEditJob] = useState(null);
  const [activeTab, setActiveTab] = useState("hire");
  const navigate = useNavigate(); // ✅ useNavigate hook
  const clientId = localStorage.getItem("userId"); // ✅ from signin
  const userId = localStorage.getItem("userId");   // ✅ for suggestions
  const token = getToken(); // ✅ JWT token
  // ✅ Fetch jobs
  useEffect(() => {
    // agar login na ho to signin par bhej do
    if (!token || !clientId) {
      navigate("/signin");
      return;
    }
     const fetchJobs = async () => {
      try {
        const res = await axios.get(
          `http://localhost:5000/api/jobs/client/${clientId}`,
          {
            headers: {
              Authorization: `Bearer ${token}`, // send token
            },
          }
        );
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
  }, [clientId, token, navigate]);

  // ✅ Fetch applicants for a job
 useEffect(() => {
    if (selectedJob) {
      fetch(`http://localhost:5000/api/applicants/${selectedJob._id}`)
        .then((res) => res.json())
        .then((data) => setApplicants(data))
        .catch((err) => console.error(err));
    }
  }, [selectedJob]);

  // ✅ Delete job
  const handleDeleteJob = async (jobId) => {
    const confirmDelete = window.confirm("Are you sure you want to delete this job?");
    if (!confirmDelete) return;

    try {
      const res = await fetch(`http://localhost:5000/api/jobs/${jobId}`, {
        method: "DELETE",
      });

      const result = await res.json();

      if (res.ok) {
        alert("Job deleted successfully!");
        setJobs((prev) => prev.filter((j) => j._id !== jobId));
        setEditJob(null);
      } else {
        alert(result.message || "Delete failed.");
      }
    } catch (error) {
      console.error("❌ Error deleting job:", error);
      alert("Server error while deleting.");
    }
  };

  return (
    <div className="container mt-4">
      <h1 className="mb-4">Client Dashboard</h1>

      {/* ✅ Navigation Tabs */}
      <ul className="nav nav-tabs mb-4">
        <li className="nav-item">
          <button
            className={`nav-link ${activeTab === "post" ? "active" : ""}`}
            onClick={() => setActiveTab("post")}
          >
            Post a Job
          </button>
        </li>
        <li className="nav-item">
          <button
            className={`nav-link ${activeTab === "hire" ? "active" : ""}`}
            onClick={() => setActiveTab("hire")}
          >
            Hire a Candidate
          </button>
        </li>
        <li className="nav-item">
          <button
            className={`nav-link ${activeTab === "history" ? "active" : ""}`}
            onClick={() => setActiveTab("history")}
          >
            Your Hiring History
          </button>
        </li>
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
            className={`nav-link ${activeTab === "account" ? "active" : ""}`}
            onClick={() => setActiveTab("account")}
          >
            Update Account
          </button>
        </li>
        <li className="nav-item ms-auto">
        
            <LogoutButton/>
          
        </li>
      </ul>

      {/* ✅ Post a Job */}
      {activeTab === "post" && (
        <div>
          <h3>Post a Job</h3>
          <PostJobForm clientId={clientId} />
        </div>
      )}

      {/* ✅ Hire a Candidate */}
      {activeTab === "hire" && (
  <div>
    <h3>Your Posted Jobs</h3>
    {jobs.length === 0 ? (
      <p>No jobs posted yet.</p>
    ) : (
      <table className="table table-striped table-bordered mt-3">
        <thead className="table-light">
          <tr>
            <th>Title</th>
            <th>Location</th>
            <th>Category</th>
            <th>Timing</th>
            <th>Salary</th>
            <th>Posted By</th>
            <th>Posted On</th>
            <th>Applicants</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {jobs.map((job) => (
            <tr key={job._id}>
              <td>{job.title}</td>
              <td>{job.location}</td>
              <td>{job.category}</td>
              <td>{job.timing || "N/A"}</td>
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
              <td>
                <button
                  className="btn btn-sm btn-success me-2"
                  onClick={() => setEditJob(job)}
                >
                  Edit
                </button>
                <button
                  className="btn btn-sm btn-danger"
                  onClick={() => handleDeleteJob(job._id)}
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    )}

</div>
     )
       }
          {/* ✅ Hiring History */}
      {activeTab === "history" && (
        <div>
          <h3>Your Hiring History</h3>
          <p>Show jobs marked as "Filled" and hired candidates here.</p>
        </div>
      )}

   
      
         {/* ✅ Suggestions */}
{activeTab === "suggestions" && (
  <div>
    <h3>Candidate Suggestions</h3>
    <SuggestedCandidate userId={userId} />
  </div>
)}

     
 

      {/* ✅ Update Account */}
      {activeTab === "account" && (
        <div>
          <h3>Update Your Account</h3>
          <p>Form for updating client details and requirements.</p>
        </div>
      )}
    </div>
  );
};

export default ClientPortal;
