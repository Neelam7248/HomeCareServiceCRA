// components/admin/UpdateCandidateModal.jsx
import React, { useState } from "react";
import axios from "axios";
import { getToken } from "../../utils/auth";

const UpdateCandidateModal = () => {
  const [email, setEmail] = useState("");
  const [candidate, setCandidate] = useState(null);
  const [message, setMessage] = useState("");
  const token = getToken();

  const daysOfWeek = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];

  // Fetch candidate by email
  const fetchCandidate = async () => {
    if (!email) return;
    try {
      const res = await axios.get(
        `/api/admin/updateCandidate/by-email/${encodeURIComponent(email)}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setCandidate(res.data);
      setMessage("");
    } catch (err) {
      console.error(err);
      setMessage("Candidate not found or fetch failed");
      setCandidate(null);
    }
  };

  // Handle input change
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    if (type === "checkbox") {
      setCandidate((prev) => ({ ...prev, [name]: checked }));
    } else {
      setCandidate((prev) => ({ ...prev, [name]: value }));
    }
  };

  // Handle availability change
  const handleAvailabilityChange = (e) => {
    const { name, value, checked } = e.target;
    if (name === "days") {
      let newDays = candidate.availability?.days || [];
      if (checked) {
        newDays.push(value);
      } else {
        newDays = newDays.filter((day) => day !== value);
      }
      setCandidate((prev) => ({
        ...prev,
        availability: { ...prev.availability, days: newDays },
      }));
    } else {
      setCandidate((prev) => ({
        ...prev,
        availability: { ...prev.availability, [name]: value },
      }));
    }
  };

  // Save updates
  const handleSave = async () => {
    try {
      await axios.put(`/api/admin/updateCandidate/candidate/${candidate._id}`, candidate, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setMessage("Candidate updated successfully!");
      clearModal();
    } catch (err) {
      console.error(err);
      setMessage(err.response?.data?.error || "Update failed");
    }
  };

  const handleDelete = async () => {
  if (!candidate) return;

  if (candidate.isDeleted) {
    alert("This candidate is already soft deleted!");
    return;
  }

  if (!window.confirm("Are you sure you want to delete this candidate?")) return;

  try {
    // Soft delete via update route
    await axios.put(
      `/api/admin/userDelete/candidate/${candidate._id}`,
      { ...candidate, isDeleted: true },
      { headers: { Authorization: `Bearer ${token}` } }
    );
    setMessage("Candidate soft deleted successfully!");
    clearModal();
  } catch (err) {
    console.error(err);
    setMessage(err.response?.data?.error || "Delete failed");
  }
};

// Clear modal after save or delete
  const clearModal = () => {
    setCandidate(null);
    setEmail("");
    const modalEl = document.getElementById("updateCandidateModal");
    const modal = window.bootstrap.Modal.getInstance(modalEl);
    modal.hide();
  };

// Restore function
const handleRestore = async () => {
  if (!candidate) return;

  if (!candidate.isDeleted) {
    alert("This candidate is not deleted!");
    return;
  }

  try {
    await axios.put(
      `/api/admin/userDelete/candidateRestore/${candidate._id}`, // correct route
      {},
      { headers: { Authorization: `Bearer ${token}` } }
    );
    setMessage("candidate restored successfully!");
    setCandidate((prev) => ({ ...prev, isDeleted: false }));
  } catch (err) {
    console.error(err);
    setMessage(err.response?.data?.error || "Restore failed");
  }
};





  return (
    <div>
      {/* Input to enter email */}
      <div className="mb-3">
        <input
          type="email"
          placeholder="Enter Candidate Email"
          className="form-control mb-2"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <button
          className="btn btn-primary me-2"
          data-bs-toggle="modal"
          data-bs-target="#updateCandidateModal"
          onClick={fetchCandidate}
        >
          Update Candidate
        </button>
      </div>

      {message && <div className="alert alert-info">{message}</div>}

      {/* Bootstrap Modal */}
      <div
        className="modal fade"
        id="updateCandidateModal"
        tabIndex="-1"
        aria-labelledby="updateCandidateModalLabel"
        aria-hidden="true"
      >
        <div className="modal-dialog modal-dialog-scrollable">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title" id="updateCandidateModalLabel">
                Update Candidate
              </h5>
              <button
                type="button"
                className="btn-close"
                data-bs-dismiss="modal"
                aria-label="Close"
              ></button>
            </div>

            <div className="modal-body">
              {candidate ? (
                <>
                  {/* Candidate fields (same as before) */}
                  <div className="mb-2">
                    <label className="form-label">Name:</label>
                    <input
                      type="text"
                      name="name"
                      value={candidate.name || ""}
                      onChange={handleChange}
                      className="form-control"
                    />
                  </div>

                  <div className="mb-2">
                    <label className="form-label">Email:</label>
                    <input
                      type="email"
                      name="email"
                      value={candidate.email || ""}
                      onChange={handleChange}
                      className="form-control"
                    />
                  </div>

                  <div className="mb-2">
                    <label className="form-label">Phone:</label>
                    <input
                      type="text"
                      name="phone"
                      value={candidate.phone || ""}
                      onChange={handleChange}
                      className="form-control"
                    />
                  </div>

                  <div className="mb-2">
                    <label className="form-label">Address:</label>
                    <input
                      type="text"
                      name="address"
                      value={candidate.address || ""}
                      onChange={handleChange}
                      className="form-control"
                    />
                  </div>

                  <div className="mb-2">
                    <label className="form-label">Date of Birth:</label>
                    <input
                      type="date"
                      name="dob"
                      value={candidate.dob || ""}
                      onChange={handleChange}
                      className="form-control"
                    />
                  </div>

                  <div className="mb-2">
                    <label className="form-label">Gender:</label>
                    <select
                      name="gender"
                      value={candidate.gender || ""}
                      onChange={handleChange}
                      className="form-select"
                    >
                      <option value="">Select</option>
                      <option value="Male">Male</option>
                      <option value="Female">Female</option>
                      <option value="Other">Other</option>
                    </select>
                  </div>

                  <div className="mb-2">
                    <label className="form-label">Skills:</label>
                    <input
                      type="text"
                      name="skills"
                      value={candidate.skills || ""}
                      onChange={handleChange}
                      className="form-control"
                    />
                  </div>

                  <div className="mb-2">
                    <label className="form-label">Availability (Days):</label>
                    <div>
                      {daysOfWeek.map((day) => (
                        <div className="form-check form-check-inline" key={day}>
                          <input
                            className="form-check-input"
                            type="checkbox"
                            name="days"
                            value={day}
                            checked={candidate.availability?.days?.includes(day)}
                            onChange={handleAvailabilityChange}
                          />
                          <label className="form-check-label">{day}</label>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="mb-2">
                    <label className="form-label">Availability (Hours):</label>
                    <input
                      type="text"
                      name="hours"
                      value={candidate.availability?.hours || ""}
                      onChange={handleAvailabilityChange}
                      className="form-control"
                    />
                  </div>

                  <div className="mb-2">
                    <label className="form-label">Charges Type:</label>
                    <input
                      type="text"
                      name="chargesType"
                      value={candidate.chargesType || ""}
                      onChange={handleChange}
                      className="form-control"
                    />
                  </div>

                  <div className="mb-2">
                    <label className="form-label">Charges:</label>
                    <input
                      type="number"
                      name="charges"
                      value={candidate.charges || ""}
                      onChange={handleChange}
                      className="form-control"
                    />
                  </div>

                  <div className="mb-2">
                    <label className="form-label">Experience:</label>
                    <input
                      type="text"
                      name="experience"
                      value={candidate.experience || ""}
                      onChange={handleChange}
                      className="form-control"
                    />
                  </div>

                  <div className="mb-2 form-check">
                    <input
                      className="form-check-input"
                      type="checkbox"
                      name="approved"
                      checked={candidate.approved || false}
                      onChange={handleChange}
                    />
                    <label className="form-check-label">Approved</label>
                  </div>
                </>
              ) : (
                <p>Enter a valid email and click Update Candidate.</p>
              )}
            </div>

            <div className="modal-footer">
              <button
                type="button"
                className="btn btn-secondary"
                data-bs-dismiss="modal"
              >
                Cancel
              </button>



  {candidate && (
                <>
                  <button
  type="button"
  className={`btn ${candidate.isDeleted ?  "btn-success" :"btn-secondary"} me-auto`}
  onClick={handleRestore}
  title={candidate.isRestored ? "Already Restored" : "Restore candidate"}
>
  {candidate.isRestored ? "Restored" : "Restore"}
</button></>)}


              {candidate && (
                <>
                  <button
  type="button"
  className={`btn ${candidate.isDeleted ? "btn-secondary" : "btn-danger"} me-auto`}
  onClick={handleDelete}
  title={candidate.isDeleted ? "Already soft deleted" : "Delete candidate"}
>
  {candidate.isDeleted ? "Deleted" : "Delete"}
</button>

                  <button
                    type="button"
                    className="btn btn-primary"
                    onClick={handleSave}
                  >
                    Save Changes
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UpdateCandidateModal;
