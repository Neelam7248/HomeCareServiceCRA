// src/components/ClientDecisionDate.jsx
import React, { useState } from "react";
import axios from "axios";
import { getToken } from "../../utils/auth";

const ClientDecisionDate = ({ offer, onDecisionMade }) => {
  const token = getToken();
  const [loading, setLoading] = useState(false);

  const isDisabled = !offer.candidateJoiningDate;

  const handleDecision = async (decision) => {
  if (!offer.candidateJoiningDate) return;

  try {
    setLoading(true);
    const res = await axios.post(
      `http://localhost:5000/api/Claccepted-offers/${offer._id}/decision`,
      { decision },
      { headers: { Authorization: `Bearer ${token}` } }
    );

    let updatedOffer = res.data.offer;

    if (decision === "accepted") {
      updatedOffer.finalJoiningDate = updatedOffer.candidateJoiningDate;
    } else if (decision === "rejected") {
      updatedOffer.finalJoiningDate = null; // remove only the joining date
    }

    alert(`Candidate's proposed date ${decision}!`);
    onDecisionMade?.(updatedOffer);
  } catch (err) {
    console.error("Error making decision:", err);
    alert(err.response?.data?.error || "Failed to make decision");
  } finally {
    setLoading(false);
  }
};

  if (!offer.candidateJoiningDate) {
    return <p className="text-muted">Candidate has not proposed a joining date yet.</p>;
  }

  return (
    <div className="mt-2">
      <p>
        <strong>Candidate Proposed Date:</strong>{" "}
        {new Date(offer.candidateJoiningDate).toLocaleDateString()}
      </p>
      <div className="d-flex gap-2">
        <button
          className="btn btn-success btn-sm"
          onClick={() => handleDecision("accepted")}
          disabled={loading || offer.jobStatus === "Ongoing"}
        >
            
          {loading ? "Processing..." : "Accept"}
        </button>
        <button
          className="btn btn-danger btn-sm"
          onClick={() => handleDecision("rejected")}
          disabled={loading || offer.jobStatus === "Rejected"}
        >
          {loading ? "Processing..." : "Reject"}
        </button>
      </div>
      {offer.finalSalary && (
        <p className="mt-2 text-success">
          <strong>Final Salary Confirmed:</strong> Rs {offer.finalSalary}
        </p>
      )}
    </div>
  );
};

export default ClientDecisionDate;
