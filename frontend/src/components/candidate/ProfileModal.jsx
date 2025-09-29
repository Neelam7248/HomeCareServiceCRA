import React from "react";

const ProfileModal = ({ profile, onClose }) => {
  if (!profile) return null;

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
            <h5 className="modal-title">Candidate Profile</h5>
            <button type="button" className="btn-close" onClick={onClose}></button>
          </div>
         
            <form> 
 <div className="modal-body">
              <div className=" mb-3">
                <label className="form-label"><strong>Name</strong></label>
                <input type="text" className="form-control" value={profile.name} readOnly />
              </div>

              <div className=" mb-3">
                <label className="form-label"><strong>Email</strong></label>
                <input type="email" className="form-control" value={profile.email} readOnly />
              </div>

              <div className="  mb-3">
                <label className="form-label"><strong>Phone</strong></label>
                <input type="text" className="form-control" value={profile.phone || "N/A"} readOnly />
              </div>

              <div className=" mb-3">
                <label className="form-label"><strong>Address</strong></label>
                <input type="text" className="form-control" value={profile.address || "N/A"} readOnly />
              </div>

            
                <div className=" mb-3">
                  <label className="form-label"><strong>DOB</strong></label>
                  <input type="text" className="form-control" value={profile.dob || "N/A"} readOnly />
                </div>
                <div className=" mb-3">
                  <label className="form-label"><strong>Gender</strong></label>
                  <input type="text" className="form-control" value={profile.gender || "N/A"} readOnly />
                </div>
            

              <div className=" mb-3">
                <label className="form-label"><strong>Skills</strong></label>
                <input type="text" className="form-control" value={profile.skills || "N/A"} readOnly />
              </div>

              <div className="  mb-3">
                <label className="form-label"><strong>Availability</strong></label>
                <input
                  type="text"
                  className="form-control"
                  value={`${profile.availability?.days?.join(", ") || "N/A"} (${profile.availability?.hours || "N/A"})`}
                  readOnly
                />
              </div>

              
                <div className=" mb-3">
                  <label className="form-label"><strong>Charges</strong></label>
                  <input
                    type="text"
                    className="form-control"
                    value={`${profile.chargesType || "N/A"} - ${profile.charges || "N/A"}`}
                    readOnly
                  />
                </div>
                <div className=" mb-3">
                  <label className="form-label"><strong>Experience</strong></label>
                  <input type="text" className="form-control" value={profile.experience || "N/A"} readOnly />
                </div>
            

              <div className="mb-3">
                <label className="form-label"><strong>Resume</strong></label>
                {profile.resume ? (
                  <a href={profile.resume} target="_blank" rel="noreferrer" className="btn btn-outline-primary btn-sm">
                    View Resume
                  </a>
                ) : (
                  <input type="text" className="form-control" value="Not Uploaded" readOnly />
                )}
              </div>

              <div className="mb-3">
                <label className="form-label"><strong>Status</strong></label>
                <input
                  type="text"
                  className="form-control"
                  value={profile.approved ? "✅ Approved" : "⏳ Pending"}
                  readOnly
                />
              </div>
             </div>
            </form>
         
          <div className="modal-footer">
            <button className="btn btn-secondary" onClick={onClose}>
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfileModal;
