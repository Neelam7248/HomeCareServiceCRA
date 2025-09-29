import React, { useState } from "react";
import axios from "axios";
import { getToken } from "../../utils/auth";

const ProbationEndDateModal = ({ finalJoiningDate, offer, onClose, onUpdate }) => {
  const token = getToken();
  const initialEndDate = offer && offer.endDate ? offer.endDate.split("T")[0] : "";
  const [endDate, setEndDate] = useState(initialEndDate);
  const [loading, setLoading] = useState(false);

  if (!offer) return null;

  // ---------------- handleChange for input ----------------
 // ---------------- handleChange for input ----------------
const handleChange = (e) => {
  const selected = e.target.value;
  const minDate = new Date(finalJoiningDate).toISOString().split("T")[0];

  if (selected < minDate) {
    alert(`End date cannot be before final joining date (${finalJoiningDate})`);
    // ❌ Reset invalid input
    setEndDate(minDate);
    return;
  }

  setEndDate(selected);
};


  // ---------------- handleSave ----------------
  const handleSave = async () => {
    if (!endDate) {
      alert("Please select an end date!");
      return;
    }
    try {
      setLoading(true);
      const res = await axios.post(
        `http://localhost:5000/api/Claccepted-offers/${offer._id}/end`,
        { endDate },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      onUpdate(res.data.offer);
      onClose();
    } catch (err) {
      console.error("Error saving end date:", err);
      alert("Failed to save end date");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="modal fade show"
      style={{ display: "block", backgroundColor: "rgba(0,0,0,0.5)" }}
      tabIndex="-1"
    >
      <div className="modal-dialog modal-dialog-centered">
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title">
              {offer.endDate ? "Update End Date" : "Set End Date"}
            </h5>
            <button type="button" className="btn-close" onClick={onClose}></button>
          </div>

          <div className="modal-body">
            <label className="form-label">Probation End Date</label>
            <input
              type="date"
              min={new Date(finalJoiningDate).toISOString().split("T")[0]}
              value={endDate}
              onChange={handleChange}  // ✅ separate handleChange function
              className="form-control"
            />
          </div>

          <div className="modal-footer">
            <button className="btn btn-secondary" onClick={onClose}>
              Cancel
            </button>
            <button
              className="btn btn-primary"
              onClick={handleSave}
              disabled={loading}
            >
              {loading ? "Saving..." : offer.endDate ? "Update End Date" : "Set End Date"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProbationEndDateModal;
