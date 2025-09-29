import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { getToken, removeToken } from "../utils/auth";
import LogoutButton from "../components/LogoutButton";

import OfferList from "../components/candidate/OfferList";
import CandidateAcceptedOffers from "../components/candidate/CandidateAcceptedOffers";
import CandidateClosedJobs from "../components/candidate/ClosedJobs";
import Profile from "../components/candidate/Profile";


const CandidatePortal = () => {
  const [activeTab, setActiveTab] = useState("suggestions");
  const navigate = useNavigate();

  const candidateId = localStorage.getItem("userId");
  const token = getToken();

  // ✅ Auth check
  useEffect(() => {
    if (!token || !candidateId) {
      navigate("/signin");
    }
  }, [token, candidateId, navigate]);

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
            className={`nav-link ${activeTab === "closed" ? "active" : ""}`}
            onClick={() => setActiveTab("closed")}
          >
            Closed Jobs
          </button>
        </li>
        
        
        <li className="nav-item">
          <button
            className={`nav-link ${activeTab === "HiringHistory" ? "active" : ""}`}
            onClick={() => setActiveTab("HiringHistory")}
          >
            hiring history
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
      

      {activeTab === "closed" && (
        <div>
          <CandidateClosedJobs token={token} candidateId={candidateId} />
        </div>
      )}



      {activeTab === "offers" && (
        <div>
          <h3>Your Offers</h3>
          <OfferList candidateId={candidateId} token={token} />
        </div>
      )}
      {activeTab === "HiringHistory" && (
        <div>
          <h3>Candidate Accepted Offers</h3>
          <CandidateAcceptedOffers candidateId={candidateId}  />
        </div>
      )}

      {activeTab === "account" && (
        <div>
          <h1>Your Profile</h1>
         <Profile candidateId={candidateId}/>
        </div>
      )}
    </div>
  );
};

export default CandidatePortal;
