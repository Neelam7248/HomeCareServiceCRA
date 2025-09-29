// src/components/ClientCounterDate.jsx
import React, { useState } from "react";
import axios from "axios";
import { getToken } from "../../utils/auth";

const ClientCounterDate = ({ offer, onCounterSent }) => {
  const token = getToken();
  const [showInput, setShowInput] = useState(false);
  const [counterDate, setCounterDate] = useState("");
  const [loading, setLoading] = useState(false);

  // Disable if negotiationCount >= 3 or candidate hasn't proposed a date
  const isDisabled = !offer.candidateJoiningDate || (offer.negotiationCount >= 5);

  const handleSendCounter = async () => {
    if (!counterDate) return alert("Please select a counter joining date.");

    try {
      setLoading(true);
      const res = await axios.post(
        `http://localhost:5000/api/Claccepted-offers/${offer._id}/counter`,
        { joiningDate: counterDate },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      alert("Counter date sent to candidate successfully!");

      // Update parent
      onCounterSent?.(res.data.offer);

      setShowInput(false);
      setCounterDate("");
    } catch (err) {
      console.error("Error sending counter date:", err);
      alert(err.response?.data?.error || "Failed to send counter date");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mt-2">
      <button
        className="btn btn-warning btn-sm"
        onClick={() => setShowInput(true)}
        disabled={isDisabled || loading}
      >
        {offer.negotiationCount >= 6
          ? "Negotiation Limit Reached"
          : "Send Counter Date"}
      </button>

      {showInput && (
        <div className="mt-2">
          <label className="form-label"><strong>Counter Joining Date:</strong></label>
          <input
            type="date"
            className="form-control mb-2"
            value={counterDate}
            min={new Date().toISOString().split("T")[0]}
            onChange={(e) => setCounterDate(e.target.value)}
          />
          <div className="d-flex gap-2">
            <button
              className="btn btn-success btn-sm"
              onClick={handleSendCounter}
              disabled={loading}
            >
              {loading ? "Sending..." : "Send"}
            </button>
            <button
              className="btn btn-secondary btn-sm"
              onClick={() => setShowInput(false)}
              disabled={loading}
            >
              Cancel
            </button>
          </div>
          <p className="text-muted mt-1">
            Negotiations used: {offer.negotiationCount} / 6
          </p>
        </div>
      )}
    </div>
  );
};

export default ClientCounterDate;
