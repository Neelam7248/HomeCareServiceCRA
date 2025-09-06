// src/components/SendOfferButton.jsx
import React, { useState, useEffect } from "react";
import axios from "axios";
import { getToken } from "../../utils/auth";

const SendOfferButton = ({
  candidateId,
  jobId,
  offerId, // Pass offerId if responding to negotiation
  maxBudget,
  serviceType,
  currentStatus,
  preferredChargesType,
  disabled = false,
  negotiationCount = 0,
  onStatusChange, // callback to update parent state
  candidateRequestedSalary, // NEW: actual salary requested by candidate
}) => {
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState(currentStatus);
  const [showNegotiationModal, setShowNegotiationModal] = useState(false);
  const [counterAmount, setCounterAmount] = useState("");

  const canNegotiate = negotiationCount < 3; // limit negotiations
  const token = getToken();

  useEffect(() => {
    if (currentStatus) setStatus(currentStatus);
  }, [currentStatus]);

  // Send a new offer to candidate
  const handleSendOffer = async () => {
    if (!token) return alert("User not authenticated");

    setLoading(true);
    try {
      const res = await axios.post(
        "/api/offers",
        { candidateId, jobId, preferredChargesType, serviceType, maxBudget },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      const newStatus = res.data.offer?.status || "Pending";
      setStatus(newStatus);
      onStatusChange?.(newStatus);

      alert("Offer sent successfully!");
    } catch (error) {
      console.error(error.response?.data || error);
      alert("Failed to send offer.");
    } finally {
      setLoading(false);
    }
  };

  // Respond to candidate's counter negotiation
  const handleRespondNegotiation = async (decision) => {
    if (!token) return;

    try {
      const res = await axios.post(
        `/api/offers/${offerId}/respond-negotiation`,
        { decision, counterAmount: decision === "Counter" ? counterAmount : null },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setStatus(res.data.status); // update button status
      onStatusChange?.(res.data.status);

      alert(`Negotiation ${decision.toLowerCase()} successfully!`);
      setShowNegotiationModal(false);
      setCounterAmount(""); // reset counter input
    } catch (err) {
      console.error(err.response?.data || err);
      alert("Failed to respond to negotiation.");
    }
  };

  return (
    <div style={{ display: "inline-block" }}>
      {/* Main Send Offer Button */}
      <button
        className={`btn btn-sm mb-1 ${
          status === "Accepted"
            ? "btn-success"
            : status === "Rejected"
            ? "btn-danger"
            : status === "Pending"
            ? "btn-warning"
            : "btn-primary"
        }`}
        onClick={handleSendOffer}
        disabled={disabled || loading || status === "Pending" || status === "Accepted"}
      >
        {loading ? "Sending..." : status || "Send Offer"}
      </button>

      {/* Show "Respond Negotiation" only if candidate has negotiated */}
      {status === "Negotiating" && (
        <>
          <button
            className="btn btn-sm btn-info ms-1"
            onClick={() => setShowNegotiationModal(true)}
          >
            Respond
          </button>

          {/* Modal for Responding */}
          {showNegotiationModal && (
            <div
              className="modal show d-block"
              style={{ backgroundColor: "rgba(0,0,0,0.3)" }}
            >
              <div className="modal-dialog modal-dialog-centered">
                <div className="modal-content">
                  <div className="modal-header">
                    <h5 className="modal-title">Respond to Negotiation</h5>
                    <button
                      className="btn-close"
                      onClick={() => {
                        setShowNegotiationModal(false);
                        setCounterAmount("");
                      }}
                    ></button>
                  </div>
                  <div className="modal-body">
                    {/* Show actual candidate requested salary */}
                    <p>Candidate requested: Rs {candidateRequestedSalary || "N/A"}</p>

                    {/* Input for client counter amount */}
                    <input
                      type="number"
                      placeholder="Enter counter amount"
                      className="form-control mb-2"
                      value={counterAmount}
                      onChange={(e) => setCounterAmount(e.target.value)}
                    />

                    <div className="d-flex gap-2">
                      <button
                        className="btn btn-success"
                        onClick={() => handleRespondNegotiation("Accepted")}
                      >
                        Accept
                      </button>
                      <button
                        className="btn btn-danger"
                        onClick={() => handleRespondNegotiation("Rejected")}
                      >
                        Reject
                      </button>
                      <button
                        className="btn btn-warning"
                        onClick={() => handleRespondNegotiation("Counter")}
                        disabled={!counterAmount || !canNegotiate}
                      >
                        Counter
                      </button>
                    </div>

                    {!canNegotiate && (
                      <p className="text-danger mt-2">
                        Maximum negotiations reached.
                      </p>
                    )}
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
