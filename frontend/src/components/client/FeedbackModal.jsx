import React, { useState } from "react";
import axios from "axios";
import { getToken } from "../../utils/auth";

const CloseJobModal = ({ offer, onClose, onUpdate }) => {
  const token = getToken();
  const [feedback, setFeedback] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    if (!feedback.trim()) {
      return alert("Feedback cannot be empty!");
    }

    try {
      setLoading(true);
      const res = await axios.post(
        `http://localhost:5000/api/Claccepted-offers/${offer._id}/close`,
        { clientFeedback: feedback },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      onUpdate(res.data.offer); // update parent state
      onClose(); // close modal
    } catch (err) {
      console.error("Error closing job:", err);
      alert("Failed to close job. Try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal show d-block" tabIndex="-1">
      <div className="modal-dialog">
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title">
              Close Job & Feedback for {offer.candidateId?.name}
            </h5>
            <button type="button" className="btn-close" onClick={onClose}></button>
          </div>
          <div className="modal-body">
            <label>Write your feedback:</label>
            <textarea
              className="form-control"
              rows="4"
              value={feedback}
              onChange={(e) => setFeedback(e.target.value)}
              placeholder="Share your feedback about this candidate..."
            />
          </div>
          <div className="modal-footer">
            <button className="btn btn-secondary" onClick={onClose}>
              Cancel
            </button>
            <button
              className="btn btn-danger"
              onClick={handleSubmit}
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
