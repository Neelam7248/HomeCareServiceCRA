import React, { useState, useEffect } from "react";
import axios from "axios";
import { getToken } from "../../utils/auth";

const ApproveCandidate = () => {
  const [candidates, setCandidates] = useState([]);
  const token = getToken();
  const daysOfWeek = ["Monday","Tuesday","Wednesday","Thursday","Friday","Saturday","Sunday"];

  // Fetch candidates from API
  useEffect(() => {
    const fetchCandidates = async () => {
      try {
        const res = await axios.get("/api/signup/candidates", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setCandidates(res.data);
      } catch (err) {
        console.error("Failed to fetch candidates:", err);
      }
    };
    fetchCandidates();
  }, [token]);

  // Remove a day
  const removeDay = (candidateId, day) => {
    setCandidates(prev =>
      prev.map(u =>
        u._id === candidateId
          ? { ...u, availability: { ...u.availability, days: u.availability.days.filter(d => d !== day) } }
          : u
      )
    );
  };

  // Update hours
  const handleHoursChange = (candidateId, hours) => {
    setCandidates(prev =>
      prev.map(u =>
        u._id === candidateId
          ? { ...u, availability: { ...u.availability, hours } }
          : u
      )
    );
  };

  // Approve or Reject
  const handleApprove = async (candidateId, approve) => {
    try {
      const res = await axios.put(
        `/api/admin/approve/candidate/${candidateId}`,
        { approved: approve },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      alert(res.data.message);
      setCandidates(prev =>
        prev.map(u => (u._id === candidateId ? { ...u, approved: approve } : u))
      );
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.error || "Action failed");
    }
  };

  return (
    <div>
      <h3>Approve Candidates</h3>
      {candidates.map(c => (
        <form key={c._id} className="mb-3 border p-3 rounded" style={{ backgroundColor: "powderblue" }}>
          <div className="row">
            <div className="col-md-4 mb-3">
              <label className="form-label">Name:</label>
              <input type="text" className="form-control" value={c.name} readOnly />
            </div>
            <div className="col-md-4 mb-3">
              <label className="form-label">Email:</label>
              <input type="email" className="form-control" value={c.email} readOnly />
            </div> 
            
            
            <div className="col-md-4 mb-3">
              <label className="form-label">Address:</label>
              <input type="email" className="form-control" value={c.address} readOnly />
            </div>

 <div className="col-md-4 mb-3">
              <label className="form-label">Phone:</label>
              <input type="email" className="form-control" value={c.phone} readOnly />
            </div>
             <div className="col-md-4 mb-3">
              <label className="form-label">Gender:</label>
              <input type="email" className="form-control" value={c.gender} readOnly />
            </div>
 <div className="col-md-4 mb-3">
              <label className="form-label">skills:</label>
              <input type="email" className="form-control" value={c.skill} readOnly />
            </div>
             <div className="col-md-4 mb-3">
              <label className="form-label">Charges:</label>
              <input type="email" className="form-control" value={c.charges} readOnly />
            </div>
 <div className="col-md-4 mb-3">
              <label className="form-label">ChargesType:</label>
              <input type="email" className="form-control" value={c.chargesType} readOnly />
            </div>
            <div className="col-md-4 mb-3">
  <label className="form-label">Resume:</label>
  {c.resume ? (
    <a
      href={`http://localhost:5000/${c.resume.replace(/\\/g, "/")}`}
      className="btn btn-sm btn-outline-primary"
      target="_blank"
      rel="noopener noreferrer"
      download
    >
      Download Resume
    </a>
  ) : (
    <span>No Resume Uploaded</span>
  )}
</div>


            <div className="col-md-4 mb-3">
              <label className="form-label">DoB:</label>
              <input type="date" className="form-control" value={c.dob} readOnly />
            </div>

            <div className="col-md-6 mb-3">
              <label className="form-label">Available Days:</label>
              <div className="mt-2">
                {c.availability?.days?.map((day, index) => (
                  <span
                    key={index}
                    className="badge bg-primary me-1"
                    style={{ cursor: "pointer" }}
                    onClick={() => removeDay(c._id, day)}
                  readOnly
                  >
                    {day} &times;
                  </span>
                ))}
              </div>
            </div>

            <div className="col-md-6 mb-3">
              <label className="form-label">Available Hours:</label>
              <input
                type="text"
                className="form-control"
                value={c.availability?.hours || ""}
                onChange={e => handleHoursChange(c._id, e.target.value)}
                placeholder="e.g., 9am-5pm"
             readOnly />
            </div>

            <div className="col-md-4 d-flex align-items-end">
              {!c.approved ? (
                <>
                  <button type="button" className="btn btn-success me-2" onClick={() => handleApprove(c._id, true)}>
                    Approve
                  </button>
                  <button type="button" className="btn btn-danger" onClick={() => handleApprove(c._id, false)}>
                    Reject
                  </button>
                </>
              ) : (
                <span className="badge bg-success">Approved</span>
              )}
            </div>
          </div>
        </form>
      ))}
    </div>
  );
};

export default ApproveCandidate;
