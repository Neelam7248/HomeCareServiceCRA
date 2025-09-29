// pages/AdminDashboard.js
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { getToken, removeToken } from "../utils/auth";
import OfferList from "../components/admin/OfferListA";
import AcceptedOffer from "./../components/admin/AcceptedOfferL";
import AdminAddUser from "../components/admin/AddCand";
import ApproveCandidate from "../components/admin/CandApprovalModal";
import ApproveClient from "../components/admin/ClientApprovalModal";
import UpdateClientModal from "../components/admin/UpdateClientModal";
import UpdateCandidateModal from "../components/admin/UpdateCandidateModal"
import SuggestedCandidates from "../components/admin/SuggestedCandidateA";
import ClosedJobs from "../components/admin/ClosedJobs";

const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState("addUser");
  const [message, setMessage] = useState("");
  const token = getToken();
  const navigate = useNavigate();

  // Auth check
  useEffect(() => {
    if (!token) navigate("/adminsignin");
  }, [token, navigate]);

  const handleLogout = () => {
    removeToken();
    navigate("/" );
    //hamne replacetrue ker lia ha or signin page men ham useeffect istimal ker rahe ha is lea isko usekerna extra ho ga q k ye bhi wohi kam window.location.reload(); // ensures signin form resets

  };

  // Tabs
  const tabs = [
    { key: "addUser", label: "Add User" },
    { key: "approveCandidate", label: "Approve Candidate" },
    { key: "approveClient", label: "Approve Client" },
    { key: "updateClient", label: "UpdateClient/Delete" },
    { key: "updateCandidate", label: "UpdateCandidate/Delete" },
  {key:"suggestedCandidates",label:"SuggestedCandidates"},
  {key:"offerList",label:"OfferList"},
  
  {key:"acceptedOffer",label:"AcceptedOffer"},
{key:"closedJobs",label:"ClosedJobs"},
    
];

  return (
    <div className="container mt-4 vh-100" style={{ backgroundColor: '#b5d0b3ff' }}>
      <h1>Admin Portal</h1>
      <button className="btn btn-danger mb-3" onClick={handleLogout}>
        Logout
      </button>
      {message && <div className="alert alert-info">{message}</div>}

      {/* Tabs */}
      <ul className="nav nav-tabs mb-4" style={{ backgroundColor: "powderblue" }}>
        {tabs.map((tab) => (
          <li className="nav-item" key={tab.key}>
            <button
              className={`nav-link ${activeTab === tab.key ? "active" : ""}`}
              onClick={() => setActiveTab(tab.key)}
            >
              {tab.label}
            </button>
          </li>
        ))}
      </ul>

      {/* Tab content */}
      <div>
        {activeTab === "addUser" && <AdminAddUser />}
        {activeTab === "approveCandidate" && <ApproveCandidate />}
        {activeTab === "approveClient" && <ApproveClient />}
      

        {activeTab === "updateClient" && (
          <div>
            <h3>Update/Delete Candidate or Client</h3>
           <UpdateClientModal/>
          </div>
        )}
       
       
        {activeTab === "updateCandidate" && (
          <div>
            <h3>Update/Delete Candidate or Client</h3>
           <UpdateCandidateModal/>
          </div>
        )}

       { activeTab === "suggestedCandidates" && <SuggestedCandidates />}
       { activeTab === "offerList" && <OfferList />}
       { activeTab === "acceptedOffer" && <AcceptedOffer />}
       { activeTab === "closedJobs" &&(
        <div>
        <h1>Closed jobs history</h1>
        <ClosedJobs/>

        </div>
        )}
        
      </div>
    </div>
  );
};

export default AdminDashboard;
