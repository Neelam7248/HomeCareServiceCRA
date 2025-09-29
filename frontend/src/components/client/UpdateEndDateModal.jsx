// src/components/UpdateEndDateModal.jsx
import React, { useState } from "react";
import axios from "axios";
import { getToken } from "../../utils/auth";

const UpdateEndDateModal = ({ offer, onClose, onUpdate }) => {
  const token = getToken();
  const initialEndDate = offer?.endDate ? offer.endDate.split("T")[0] : "";
  const [newEndDate, setNewEndDate] = useState(initialEndDate);
  const [loading, setLoading] = useState(false);

  if (!offer) return null;

  const handleSave = async () => {
    if (!newEndDate) return alert("Please select a new end date!");

    try {
      setLoading(true);

      // Call backend API
      const res = await axios.put(
        `http://localhost:5000/api/Claccepted-offers/${offer._id}/update-end-date`,
        { endDate: newEndDate },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      // Update parent state
      onUpdate(res.data.offer);

      // Close modal
      onClose();
      alert("End Date updated successfully!");
    } catch (err) {
      console.error("Error updating end date:", err);
      alert("Failed to update end date");
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
            <label className="form-label">New End Date</label>
            <input
              type="date"
              className="form-control"
              value={newEndDate}
              min={offer.finalJoiningDate?.split("T")[0]} // optional: cannot set before joining
              onChange={(e) => setNewEndDate(e.target.value)}
            />
          </div>

          <div className="modal-footer">
            <button className="btn btn-secondary" onClick={onClose}>
              Cancel
            </button>
            <button
              className="btn btn-success"
              onClick={handleSave}
              disabled={loading}
            >
              {loading ? "Updating..." : "Update End Date"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UpdateEndDateModal;
