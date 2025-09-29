import React, { useState, useEffect } from "react";

const UpdateProfileModal = ({ profile, onUpdate }) => {
  const [formData, setFormData] = useState({});

  // When profile changes, prefill form
  useEffect(() => {
    if (profile) setFormData(profile);
  }, [profile]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onUpdate(formData);
  };

  return (
    <div
      className="modal fade"
      id="updateProfileModal"
      tabIndex="-1"
      aria-labelledby="updateProfileLabel"
      aria-hidden="true"
    >
      <div className="modal-dialog modal-dialog-centered">
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title" id="updateProfileLabel">
              Update Profile
            </h5>
            <button
              type="button"
              className="btn-close"
              data-bs-dismiss="modal"
              aria-label="Close"
            ></button>
          </div>
          <form onSubmit={handleSubmit}>
            <div className="modal-body">
              {profile ? (
                <>
                  <div className="mb-3">
                    <label className="form-label"><strong>Name</strong></label>
                    <input
                      name="name"
                      className="form-control"
                      value={formData.name || ""}
                      onChange={handleChange}
                    />
                  </div>
                  <div className="mb-3">
                    <label className="form-label"><strong>Phone</strong></label>
                    <input
                      name="phone"
                      className="form-control"
                      value={formData.phone || ""}
                      onChange={handleChange}
                    />
                  </div>
                  <div className="mb-3">
                    <label className="form-label"><strong>Address</strong></label>
                    <input
                      name="address"
                      className="form-control"
                      value={formData.address || ""}
                      onChange={handleChange}
                    />
                  </div>
                  <div className="mb-3">
                    <label className="form-label"><strong>Occupation</strong></label>
                    <input
                      name="occupation"
                      className="form-control"
                      value={formData.occupation || ""}
                      onChange={handleChange}
                    />
                  </div>
                  <div className="mb-3">
                    <label className="form-label"><strong>Service Type</strong></label>
                    <input
                      name="serviceType"
                      className="form-control"
                      value={formData.serviceType || ""}
                      onChange={handleChange}
                    />
                  </div>

<div className="mb-3">
                    <label className="form-label"><strong>Charges</strong></label>
                    <input
                      name="occupation"
                      className="form-control"
                      value={formData.maxBudget || ""}
                      onChange={handleChange}
                    />
                  </div>
                  <div className="mb-3">
                    <label className="form-label"><strong>Charges Type</strong></label>
                    <input
                      name="occupation"
                      className="form-control"
                      value={formData.preferredChargesType || ""}
                      onChange={handleChange}
                    />
                  </div>
<div className="mb-3">
                    <label className="form-label"><strong>Preffered Age</strong></label>
                    <input
                      name="occupation"
                      className="form-control"
                      value={formData.preferredAge || ""}
                      onChange={handleChange}
                    />
                  </div>
<div className="mb-3">
                    <label className="form-label"><strong>Preffered Gender</strong></label>
                    <input
                      name="occupation"
                      className="form-control"
                      value={formData.preferredGender || ""}
                      onChange={handleChange}
                    />
                  </div>

<div className="mb-3">
                    <label className="form-label"><strong>RequiredExperience</strong></label>
                    <input
                      name="occupation"
                      className="form-control"
                      value={formData.requiredExperience || ""}
                      onChange={handleChange}
                    />
                  </div>
                  {/* Add more fields as needed */}
                </>
              ) : (
                <p>Loading...</p>
              )}
            </div>
            <div className="modal-footer">
              <button type="submit" className="btn btn-success" data-bs-dismiss="modal">
                Save Changes
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default UpdateProfileModal;
