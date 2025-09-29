// src/components/SendOfferButton.jsx
import React, { useState, useEffect } from "react";
import axios from "axios";
import { getToken } from "../../utils/auth";

const SendOfferButton = ({
  clientId,
  candidateId,
  jobId,
  offerId,
  offeredSalary,
  preferredChargesType,
  serviceType,
   clientCounterSalary,
    finalSalary,  
  negotiationCount,
  currentStatus,
  //offers, // map of all offers keyed by candidateId
  onStatusChange // callback to update parent offers
}) => {
  const token = getToken();
  const [status, setStatus] = useState(currentStatus || "Not Offered");
  const [showModal, setShowModal] = useState(false);
  const [counterSalary, setCounterSalary] = useState("");
  const [loading, setLoading] = useState(false);


  useEffect(() => {
    if (currentStatus) setStatus(currentStatus);
  }, [currentStatus]);

  // -------------------------
  // Sync status and counterSalary from offers map
  // -------------------------
  // -------------------------
  // Send initial offer
  // -------------------------
  const handleSendOffer = async () => {
    try {
      setLoading(true);
      const res = await axios.post(
        "http://localhost:5000/api/offers",
        {
          clientId,
          candidateId,
          jobId,
          offeredSalary,
          preferredChargesType,
          serviceType,
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      const newOffer = res.data.offer;

      // Update parent offers map
      onStatusChange?.(newOffer);

      setStatus(newOffer.status || "Pending");
      setCounterSalary(newOffer.candidateRequestedSalary || "");
      alert("Offer sent successfully!");
    } catch (err) {
      console.error("Error sending offer:", err);
      alert("Failed to send offer");
    } finally {
      setLoading(false);
    }
  };

  // -------------------------
  // Respond to negotiation (Counter / Accept / Reject)
  // -------------------------
  const handleRespondNegotiation = async (decision) => {
    try {
      setLoading(true);
      const payload = { decision };

      // Only send counterAmount if decision is "Counter"
      if (decision === "Counter") {
        payload.counterAmount = counterSalary;
      }

      const res = await axios.post(
        `http://localhost:5000/api/offers/${offerId}/respond-negotiation`,
        payload,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      const updatedOffer = res.data;

      setStatus(updatedOffer.status);
      onStatusChange?.(updatedOffer);
      setShowModal(false);
      alert(`Negotiation ${decision.toLowerCase()} sent!`);
    } catch (err) {
      console.error("Error responding negotiation:", err);
      alert("Failed to respond negotiation");
    } finally {
      setLoading(false);
    }
  };

  // -------------------------
  // Render Button
  // -------------------------
  return (
    <div>
      {status === "Not Offered" && (
        <button
          className="btn btn-primary btn-sm"
          onClick={handleSendOffer}
          disabled={loading}
        >
          {loading ? "Sending..." : "Send Offer"}
        </button>
      )}

      {status === "Pending" && (
        <span className="badge bg-info">Offer Sent  </span>
      )}

      {status === "Accepted" && (
        <span className="badge bg-success">Accepted</span>
      )}

      {status === "Rejected" && (
        <span className="badge bg-danger">Rejected</span>
      )}

      {status === "Negotiating" && (
        <>
          <button
            className="btn btn-warning btn-sm"
            onClick={() => setShowModal(true)}
          >
            Respond to Negotiation
          </button>

          {/* Negotiation Modal */}
          {showModal && (
            <div
              className="modal show fade d-block"
              tabIndex="-1"
              style={{ backgroundColor: "rgba(0,0,0,0.5)" }}
            >
              <div className="modal-dialog modal-md">
                <div className="modal-content">
                  <div className="modal-header">
                    <h5 className="modal-title">Respond to Candidate Negotiation</h5>
                    <button
                      type="button"
                      className="btn-close"
                      onClick={() => setShowModal(false)}
                    ></button>
                  </div>
                  <div className="modal-body">
                    <div className="mb-3">
                      <label className="form-label">Your Counter Salary</label>
                      <input
                        type="number"
                        className="form-control"
                        value={counterSalary}
                        onChange={(e) => setCounterSalary(e.target.value)}
                      />
                    </div>
                  </div>
                  <div className="modal-footer">
                    <button
                      className="btn btn-secondary"
                      onClick={() => setShowModal(false)}
                    >
                      Cancel
                    </button>
                    <button
                      className="btn btn-danger"
                      onClick={() => handleRespondNegotiation("Rejected")}
                      disabled={loading}
                    >
                      Reject
                    </button>
                    <button
                      className="btn btn-success"
                      onClick={() => handleRespondNegotiation("Accepted")}
                      disabled={loading}
                    >
                      Accept
                    </button>
                    <button
                      className="btn btn-primary"
                      onClick={() => handleRespondNegotiation("Counter")}
                      disabled={loading}
                    >
                      Counter
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default SendOfferButton;
