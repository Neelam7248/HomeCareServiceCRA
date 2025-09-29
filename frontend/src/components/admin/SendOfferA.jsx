// src/components/AdminSendOfferButton.jsx
import React, { useState, useEffect } from "react";
import axios from "axios";
import { getToken } from "../../utils/auth";

const AdminSendOfferButton = ({
  clientId,
  candidateId,
  jobId,
  offerId,
  offeredSalary,
  preferredChargesType,
  serviceType,
  negotiationCount,
  clientCounterSalary,
    finalSalary,  
  
  currentStatus,
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
  // Send initial offer (Admin)
  // -------------------------
  const handleSendOffer = async () => {
    try {
      setLoading(true);
       if (!clientId || !candidateId) {
    alert("Client ID or Candidate ID is missing!");
    return;
  }
      const res = await axios.post(
        "http://localhost:5000/api/admin/sendOffer",
        {
          clientId,
          candidateId,
          jobId,
          offeredSalary,
          preferredChargesType,
          serviceType

        },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      const newOffer = res.data.offer;
   onStatusChange?.(newOffer);

      setStatus(newOffer.status || "Pending");
      setCounterSalary(newOffer.candidateRequestedSalary || "");
   
      alert("Offer sent successfully by Admin!");
    } catch (err) {
      console.error("Error sending offer:", err);
      alert("Failed to send offer");
    } finally {
      setLoading(false);
    }
  };

  // -------------------------
  // Respond to candidate negotiation (Admin)
  // -------------------------
  const handleRespondCandidate = async (decision) => {
    try {
      setLoading(true);
      const payload = { decision };
      if (decision === "Counter") payload.counterAmount = counterSalary;

      const res = await axios.post(
        `http://localhost:5000/api/admin/sendOffer/${offerId}/respond-client`,
        payload,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      const updatedOffer = res.data.offer || res.data;
      setStatus(updatedOffer.status);
      onStatusChange?.(updatedOffer);
      setShowModal(false);

      alert(`Negotiation ${decision.toLowerCase()} sent on behalf of candidate!`);
    } catch (err) {
      console.error("Error responding negotiation:", err);
      alert("Failed to respond to negotiation");
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

      {status === "Pending" && <span className="badge bg-info">Offer Sent</span>}
      {status === "Accepted" && <span className="badge bg-success">Accepted</span>}
      {status === "Rejected" && <span className="badge bg-danger">Rejected</span>}

      {status === "Negotiating" && (
        <>
          <button
            className="btn btn-warning btn-sm"
            onClick={() => setShowModal(true)}
          >
            Respond to Negotiation
          </button>

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
                      <label className="form-label">Counter Salary</label>
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
                      onClick={() => handleRespondCandidate("Rejected")}
                      disabled={loading}
                    >
                      Reject
                    </button>
                    <button
                      className="btn btn-success"
                      onClick={() => handleRespondCandidate("Accepted")}
                      disabled={loading}
                    >
                      Accept
                    </button>
                    <button
                      className="btn btn-primary"
                      onClick={() => handleRespondCandidate("Counter")}
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

export default AdminSendOfferButton;
