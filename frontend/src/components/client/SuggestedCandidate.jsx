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
const headers = [
  "Job Title",
  "Name",
  "Email",
  "Phone",
  "Experience",
  "Charges",
  "Charges Type",
  "Negotiated Charges",
  "ClConChar",
  "Final Salary",
  "Gender",
  "Status",
  "Action"
];

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
        const res = await axios.get("/api/offers/offers/client", {
          headers: { Authorization: `Bearer ${token}` },
        });

        const offerMap = {};
        res.data.forEach((offer) => {
          offerMap[offer.candidate._id] = offer;
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
    <div className="container mt-4 vh-100" >
      <h4>Suggested Candidates to you {client?.email}</h4>
      
      {suggestions.length > 0 ? (
        <table className="table table-striped" >
          <thead >{/*th ko manually ni likha balk pehle const k zarye uper
           declare kerdia phir neeche .map use kis jsx men*/}
            <tr >{headers.map((h) => (
        <th key={h} style={{ backgroundColor: '#9cbcdfff' }}>{h}</th>
      ))}
              
             </tr>
          </thead>
          <tbody>
            {suggestions.map(cand => 
              
                      (
              <tr key={cand._id}>
  <td>{cand.skills || "N/A"}</td>
  <td>{cand.name}</td>
  <td>{cand.email}</td>
  <td>{cand.phone}</td>
  <td>{cand.experience}</td>
  
  {/* First offer sent by client */}
  <td>Rs{cand.charges || "-"}</td>
  <td>{cand.chargesType}</td>
  {/* Candidate requested salary */}
<td>Rs {offers[cand._id]?.candidateRequestedSalary || "-"}</td>
  {/* Client counter offer */}
  <td>Rs {offers[cand._id]?.clientCounterSalary || "-"}</td>
  
  {/* Final agreed salary */}
  <td>Rs {offers[cand._id]?.finalSalary || "-"}</td>
  
  <td>{cand.gender}</td>
  <td>{offers[cand._id]?.status || "Not Offered"}</td>

  <td>
    {client && (
      <SendOfferButton
        clientId={client._id}
        candidateId={cand._id}
          clientEmail={client.email}
        candidateEmail={cand.email}
        jobId={cand.skills}
        offerId={offers[cand._id]?._id}
        offeredSalary={cand.charges}
        preferredChargesType={client.preferredChargesType}
        serviceType={client.serviceType}
        negotiationCount={offers[cand._id]?.negotiationCount || 0}
        currentStatus={cand.status}
        candidateRequestedSalary={offers[cand._id]?.candidateRequestedSalary || ""}
        clientCounterSalary={offers[cand._id]?.clientCounterSalary || ""}
        finalSalary={offers[cand._id]?.finalSalary || ""}
        //offers={offers} // pass entire offers map for sync  
        onStatusChange={(newStatus) => {
                        setSuggestions(prev =>
                          prev.map(c => c._id === cand._id ? { ...c, status: newStatus } : c)
                        );
                      }}
      />
    )}
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
              
            
          
        
      
    </div>
  );
};

export default SuggestedCandidate;
