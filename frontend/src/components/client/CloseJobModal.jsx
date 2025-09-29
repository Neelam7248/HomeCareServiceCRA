import React, { useState } from "react";
import axios from "axios";
import { getToken } from "../../utils/auth";

const CloseJobModal = ({ offer, onClose, onUpdate }) => {
  const token = getToken();
  const [feedback, setFeedback] = useState(offer.feedback || ""); // agar pehle diya ho to dikhayega
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleCloseJob = async () => {
  if (!feedback.trim()) {
    setError("Please provide feedback before closing the job.");
    return;
  }

  try {
    setLoading(true);
    setError("");

    const res = await axios.post(
      `http://localhost:5000/api/Claccepted-offers/${offer._id}/close`,
      { clientFeedback: feedback }, // changed key to match DB
      { headers: { Authorization: `Bearer ${token}` } }
    );

    onUpdate?.(res.data.offer); // update parent state
    onClose();
  } catch (err) {
    console.error(err);
    setError(err.response?.data?.error || "Failed to close job");
  } finally {
    setLoading(false);
  }
};

  return (
    <div className="modal show d-block" tabIndex="-1">
      <div className="modal-dialog">
        <div className="modal-content">
          {/* Header */}
          <div className="modal-header">
            <h5 className="modal-title">Close Job & Give Feedback</h5>
            <button type="button" className="btn-close" onClick={onClose}></button>
          </div>

          {/* Body */}
          <div className="modal-body">
            <label className="form-label">Your Feedback:</label>
            <textarea
              className="form-control"
              rows="4"
              value={feedback}
              onChange={(e) => setFeedback(e.target.value)}
              placeholder="Write your feedback here..."
              required
            />
            {error && <p className="text-danger mt-2">{error}</p>}
          </div>

          {/* Footer */}
          <div className="modal-footer">
            <button
              className="btn btn-secondary"
              onClick={onClose}
              disabled={loading}
            >
              Cancel
            </button>
            <button
              className="btn btn-danger"
              onClick={handleCloseJob}
              disabled={loading}
            >
              {loading ? "Closing..." : "Close Job"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CloseJobModal;
