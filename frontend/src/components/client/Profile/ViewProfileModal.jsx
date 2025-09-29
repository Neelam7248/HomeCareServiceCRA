import React from "react";

const ViewProfileModal = ({ profile }) => {
  return (
    <div
      className="modal fade"
      id="viewProfileModal"
      tabIndex="-1"
      aria-labelledby="viewProfileLabel"
      aria-hidden="true"
    >
      <div className="modal-dialog modal-dialog-centered">
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title" id="viewProfileLabel">
              Client Profile
            </h5>
            <button
              type="button"
              className="btn-close"
              data-bs-dismiss="modal"
              aria-label="Close"
            ></button>
          </div>
          <div className="modal-body">
            {profile ? (
              <ul className="list-group">
                <li className="list-group-item">
                  <i className="bi bi-tools me-2"></i>
                  <strong>Name:</strong> {profile.name}</li>
                <li className="list-group-item">
                  
                  <i className="bi bi-tools me-2"></i>
                <strong>Email:</strong> {profile.email}</li>
                <li className="list-group-item">
                  <i className="bi bi-tools me-2"></i>
                  <strong>Phone:</strong> {profile.phone}</li>
                <li className="list-group-item">
                  <i className="bi bi-tools me-2"></i>
                  <strong>Address:</strong> {profile.address}</li>
                <li className="list-group-item">
                  <i className="bi bi-tools me-2"></i>
                  <strong>Occupation: </strong>{profile.occupation}</li>
                <li className="list-group-item">
                  <i className="bi bi-tools me-2"></i>
                  <strong>Service Type: </strong>{profile.serviceType}</li>
                <li className="list-group-item">
                  <i className="bi bi-tools me-2"></i>
                  <strong>Required Experience:</strong> {profile.requiredExperience}
                </li>
                <li className="list-group-item">
                  <i className="bi bi-tools me-2"></i>
                <strong>  Charges Type: </strong>{profile.preferredChargesType}
                </li>
                <li className="list-group-item">
                  <i className="bi bi-tools me-2"></i>
                  <strong>Budget:</strong> {profile.maxBudget}</li>
                <li className="list-group-item">
                  <i className="bi bi-tools me-2"></i>
                  <strong>Preferred Age:</strong> {profile.preferredAge}</li>

                <li className="list-group-item">
                  <i className="bi bi-tools me-2"></i>
                  <strong>Gender:</strong> {profile.preferredGender}</li>
              </ul>
            ) : (
              <p>Loading profile...</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ViewProfileModal;
