import React, { useState, useEffect } from "react";



import SuggestedCandidate from "../components/client/SuggestedCandidate";
import { setToken,getToken,removeToken } from "../utils/auth";
import { useNavigate } from "react-router-dom"; // ✅ for navigation
import axios from "axios"; // ✅ using axios consistently
import LogoutButton from "../components/LogoutButton";
 import AcceptedOffers from "../components/client/AcceptedOffers";
import ClosedJobs from "../components/client/ClosedJobs";
import Profile from "../components/client/Profile/Profile";


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

  return (
    <div className="container mt-4">
      <h1 className="mb-4">Client Dashboard</h1>
<ul className="nav nav-tabs mb-4" style={{ backgroundColor: "powderblue" }}>
        <li className="nav-item">
          <button
            className={`nav-link ${activeTab === "ongoing" ? "active" : ""}`}
            onClick={() => setActiveTab("ongoing")}
          >
            OngoingJobs
          </button>
        </li>
        <li className="nav-item">
          <button
            className={`nav-link ${activeTab === "suggestions" ? "active" : ""}`}
            onClick={() => setActiveTab("suggestions")}
          >
            Suggested Candidates
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
        <li className="nav-item">
          <button
            className={`nav-link ${activeTab === "closed" ? "active" : ""}`}
            onClick={() => setActiveTab("closed")}
          >
           Closed Jobs History
          </button>
        </li>
        
        

        
        <li className="nav-item ms-auto">
        
            <LogoutButton/>
          
        </li>
      </ul>

             {/* ✅ Update Account */}
      {activeTab === "closed" && (
        <div>
                 <ClosedJobs userId={userId} /> 
        </div>
      )}
        
          {/* ✅ Hiring History */}
      {activeTab === "ongoing" && (
        <div>
          <h3>Ongoing Jobs</h3>
    <AcceptedOffers userId={userId} />     </div>
      )}

   
      
         {/* ✅ Suggestions */}
{activeTab === "suggestions" && (
  <div>

    <SuggestedCandidate userId={userId} />
  </div>
)}

     
 

      {/* ✅ Update Account */}
      {activeTab === "account" && (
        <div>
          <h3>Update Your Account</h3>
          <Profile userId={userId}/>
        </div>
      )}
    </div>
  );
};

export default ClientPortal;
