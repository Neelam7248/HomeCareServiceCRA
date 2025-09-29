import React, { useState } from "react";
import axios from "axios";

const UpdateProfileModal = ({ profile, onClose, onUpdate }) => {
  const [formData, setFormData] = useState(profile);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem("token");
      const res = await axios.put("http://localhost:5000/api/profile/updateProfile", formData, {
        headers: { Authorization: `Bearer ${token}` },
      });
      onUpdate(res.data);
    } catch (err) {
      console.error(err);
      alert("Update failed");
    }
  };

  return (
    <div
      className="modal fade show"
      style={{ display: "block", backgroundColor: "white" }}
      tabIndex="-1"
      role="dialog"
    >
      <div className="modal-dialog modal-dialog-centered" role="document">
        <div className="modal-content" style={{backgroundColor:"lightblue"}}>
          <div className="modal-header"style={{backgroundColor:"powderblue"}}>
            <h5 className="modal-title" >Update Profile</h5>
            <button type="button" className="btn-close" onClick={onClose}></button>
          </div>
          <form onSubmit={handleSubmit}>
            <div className="modal-body">
              <div className="mb-3">
                <label className="form-label"><strong>Name</strong></label>
                <input
                  type="text"
                  name="name"
                  value={formData.name || ""}
                  onChange={handleChange}
                  className="form-control"
                  required
                />
              </div>
              <div className="mb-3">
                <label className="form-label"><strong>Phone</strong></label>
                <input
                  type="text"
                  name="phone"
                  value={formData.phone || ""}
                  onChange={handleChange}
                  className="form-control"
                />
              </div>
              <div className="mb-3">
                <label className="form-label"><strong>Address</strong></label>
                <input
                  type="text"
                  name="address"
                  value={formData.address || ""}
                  onChange={handleChange}
                  className="form-control"
                />
              </div>
              <div className="mb-3">
                <label className="form-label"><strong>Skills</strong></label>
                <input
                  type="text"
                  name="skills"
                  value={formData.skills || ""}
                  onChange={handleChange}
                  className="form-control"
                />
              </div>
              <div className="mb-3">
                <label className="form-label"><strong>Experience</strong></label>
                <input
                  type="text"
                  name="experience"
                  value={formData.experience || ""}
                  onChange={handleChange}
                  className="form-control"
                />
              </div>
            </div>
            <div className="modal-footer">
              <button type="submit" className="btn btn-success">
                Save Changes
              </button>
              <button type="button" className="btn btn-secondary" onClick={onClose}>
                Cancel
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default UpdateProfileModal;
