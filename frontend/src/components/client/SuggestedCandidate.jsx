import React, { useEffect, useState } from "react";
import axios from "axios";
import SalaryNegotiationForm from "../negotiation/SalaryNegotiationForm"; // Modal form for negotiation
import { getToken } from "../../utils/auth";
import SendOfferButton from "./SendOfferButton";
import '../../App.css';

const SuggestedCandidate = ({ userId, jobId }) => {
  // -------------------------
  // State variables
  // -------------------------
  const [offers, setOffers] = useState({}); // Store offers keyed by candidateId
  const [suggestions, setSuggestions] = useState([]); // Suggested candidates
  const [selectedCandidate, setSelectedCandidate] = useState(null); // Candidate selected for negotiation
  const [showNegotiation, setShowNegotiation] = useState(false); // Show/hide modal
  const [client, setClient] = useState(null); // Logged-in client
  const token = getToken();

  // -------------------------
  // Fetch suggested candidates every 5 seconds
  // -------------------------
  useEffect(() => {
    const fetchSuggestions = async () => {
      try {
        const res = await axios.get(`http://localhost:5000/api/match/suggestions/${userId}`);
        setSuggestions(res.data);
      } catch (err) {
        console.error("Error fetching suggestions:", err);
      }
    };

    fetchSuggestions(); // Initial fetch
    const interval = setInterval(fetchSuggestions, 5000); // Refresh every 5 sec

    return () => clearInterval(interval); // Cleanup on unmount
  }, [userId]);

  // -------------------------
  // Fetch logged-in client info
  // -------------------------
  useEffect(() => {
    const fetchClient = async () => {
      try {
        const res = await axios.get("/api/signup/me", {
          headers: { Authorization: `Bearer ${token}` }
        });
        setClient(res.data);
      } catch (err) {
        console.error("Error fetching client:", err);
      }
    };
    fetchClient();
  }, [token]);

  // -------------------------
  // Fetch all offers sent by client
  // Map them by candidateId for easy access
  // -------------------------
  useEffect(() => {
    const fetchOffers = async () => {
      if (!client) return; // Wait for client data
      try {
        const res = await axios.get("/api/offers/client/offers", {
          headers: { Authorization: `Bearer ${token}` },
        });

        const offerMap = {};
        res.data.forEach((offer) => {
          offerMap[offer.candidateId._id] = offer;
        });

        setOffers(offerMap);
      } catch (err) {
        console.error("Error fetching offers:", err);
      }
    };
    fetchOffers();
  }, [client]);

  // -------------------------
  // Handle candidate's accept/reject decision
  // -------------------------
  const handleDecision = async (candidateId, decision) => {
    try {
      await axios.post(`http://localhost:5000/api/offers/decision`, { candidateId, decision });

      // Update status in suggestions state
      setSuggestions(prev =>
        prev.map(c =>
          c._id === candidateId ? { ...c, status: decision } : c
        )
      );

      alert(`Offer ${decision.toLowerCase()} successfully!`);
    } catch (error) {
      console.error(error);
      alert("Failed to update decision.");
    }
  };

  // -------------------------
  // Render component
  // -------------------------
  return (
    <div className="container mt-4">
      <h2>Suggested Candidates</h2>
      {suggestions.length > 0 ? (
        <table className="table table-striped">
          <thead>
            <tr>
              <th>Job Title</th>
              <th>Name</th>
              <th>Email</th>
              <th>Phone</th>
              <th>Experience</th>
              <th>Charges</th>
              <th>Charges Type</th>
              <th>Negotiated Charges</th>
              <th>Gender</th>
              <th>Status</th>
              <th>Action</th>
              <th>Negotiation</th>
            </tr>
          </thead>
          <tbody>
            {suggestions.map(cand => (
              <tr key={cand._id}>
                <td>{cand.skills || "N/A"}</td>
                <td>{cand.name}</td>
                <td>{cand.email}</td>
                <td>{cand.phone}</td>
                <td>{cand.experience}</td>
                <td>{cand.charges}</td>
                <td>{cand.chargesType}</td>
                {/* Display negotiated salary if available, else "-" */}
                <td>{offers[cand._id]?.negotiatedSalary || "-"}</td>
                <td>{cand.gender}</td>
                <td>{cand.status || "Not Offered"}</td>

                {/* -------------------------
                     Send Offer Button (for client)
                     ------------------------- */}
                <td>
                  {client ? (
                    <SendOfferButton
                      candidateId={cand._id}
                      jobId={cand.skills}
                      offerId={offers[cand._id]?._id}  // Add offerId here
  
                      maxBudget={client.maxBudget}
                      preferredChargesType={client.preferredChargesType}
                      negotiationCount={cand.negotiationCount || 0}
                      serviceType={client.serviceType}
                      disabled={cand.status === "Pending" || cand.status === "Accepted"}
                      currentStatus={cand.status}
                      onStatusChange={(newStatus) => {
                        setSuggestions(prev =>
                          prev.map(c => c._id === cand._id ? { ...c, status: newStatus } : c)
                        );
                      }}
                    />
                  ) : (
                    <p>Loading...</p>
                  )}
                </td>

                {/* -------------------------
                     Open negotiation modal
                     ------------------------- */}
                <td>
                  <button
                    className="btn btn-sm btn-warning"
                    onClick={() => {
                      setSelectedCandidate(cand);
                      setShowNegotiation(true);
                    }}
                  >
                    Negotiate
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <p>No matching candidates found.</p>
      )}

      {/* -------------------------
           Negotiation Modal
           ------------------------- */}
      {showNegotiation && selectedCandidate && (
        <div className="modal show fade d-block" tabIndex="-1" style={{ backgroundColor: "powderblue" }}>
          <div className="modal-dialog modal-lg" style={{ backgroundColor: "blue" }}>
            <div className="modal-content custom-bg" style={{ backgroundColor: "lavender" }}>
              <div className="modal-header">
                <h5 className="modal-title" style={{ backgroundColor: "peachpuff" }}>
                  Negotiation with {selectedCandidate.name}
                </h5>
                <button
                  type="button"
                  className="btn-close"
                  onClick={() => setShowNegotiation(false)}
                  style={{ backgroundColor: "peachpuff" }}
                ></button>
              </div>
              <div className="modal-body" style={{ backgroundColor: "peachpuff" }}>
                <SalaryNegotiationForm
                  candidateId={selectedCandidate._id}
                  clientId={localStorage.getItem("userId")}
                  jobId={jobId}
                />
              </div>
              <div className="modal-footer">
                <button
                  className="btn btn-secondary"
                  onClick={() => setShowNegotiation(false)}
                  style={{ backgroundColor: "lightblue" }}
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SuggestedCandidate;
