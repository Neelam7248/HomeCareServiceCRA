// components/admin/ApproveClient.js
import React, { useState, useEffect } from "react";
import axios from "axios";
import { getToken } from "../../utils/auth";

const ApproveClient = () => {
  const [clients, setClients] = useState([]);
  const [message, setMessage] = useState("");
 
  const token = getToken();

  useEffect(() => {
    const fetchClients = async () => {
      try {
        const res = await axios.get("/api/signup/clients", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setClients(res.data);
      } catch (err) {
        console.error(err);
        setMessage("Failed to fetch clients");
      }
    };
    fetchClients();
  }, [token]);

  const handleApprove = async (clientId) => {
    try {
      const res = await axios.put(
        `/api/admin/approve/client/${clientId}`,
        { approved: true },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setClients((prev) =>
        prev.map((c) => (c._id === clientId ? { ...c, approved: true } : c))
      );
      setMessage(res.data.message);
    } catch (err) {
      console.error(err);
      setMessage(err.response?.data?.error || "Action failed");
    }
  };

  const handleReject = async (clientId) => {
    try {
      const res = await axios.put(
        `/api/admin/approve/client/${clientId}`,
        { approved: false },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setClients((prev) =>
        prev.map((c) => (c._id === clientId ? { ...c, approved: false } : c))
      );
      setMessage(res.data.message);
    } catch (err) {
      console.error(err);
      setMessage(err.response?.data?.error || "Action failed");
    }
  };

  return (
    <div>
      <h3>Approve Clients</h3>
      {message && <div className="alert alert-info">{message}</div>}
      {clients.map((c) => (
        <form
          key={c._id}
          className="mb-3 border p-3 rounded"
          style={{ backgroundColor: "powderblue" }}
        >
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
              <label className="form-label">Phone:</label>
              <input type="text" className="form-control" value={c.phone} readOnly />
            </div>
          
            <div className="col-md-4 mb-3">
              <label className="form-label">Address:</label>
              <input type="text" className="form-control" value={c.address} readOnly />
            </div>
          
            <div className="col-md-4 mb-3">
              <label className="form-label">Occupation:</label>
              <input type="text" className="form-control" value={c.occupation} readOnly />
            </div>

            <div className="col-md-4 mb-3">
              <label className="form-label">ServiceType:</label>
              <input type="text" className="form-control" value={c.serviceType} readOnly />
            </div>

            <div className="col-md-4 mb-3">
              <label className="form-label">Required Experience:</label>
              <input type="text" className="form-control" value={c.requiredExperience} readOnly />
            </div>
            <div className="col-md-4 mb-3">
              <label className="form-label">PrefferedChargesType:</label>
              <input type="text" className="form-control" value={c.preferredChargesType} readOnly />
            </div>
            
            <div className="col-md-4 mb-3">
              <label className="form-label">Charges:</label>
              <input type="text" className="form-control" value={c.maxBudget} readOnly />
            </div>
            
            <div className="col-md-4 mb-3">
              <label className="form-label">Preffered Age:</label>
              <input type="text" className="form-control" value={c.preferredAge} readOnly />
            </div> 
            
            <div className="col-md-4 mb-3">
              <label className="form-label">Preffered Gender:</label>
              <input type="text" className="form-control" value={c.preferredGender} readOnly />
            </div>
            <div className="col-md-4 d-flex align-items-end">
              {!c.approved ? (
                <>
                  <button
                    type="button"
                    className="btn btn-success me-2"
                    onClick={() => handleApprove(c._id)}
                  >
                    Approve
                  </button>
   
                  <button
                    type="button"
                    className="btn btn-danger"
                    onClick={() => handleReject(c._id)}
                  >
                    Reject
                  </button> 
              
                </>
              ) : (
                <span className="badge bg-success">Approved</span>
              )}:
            </div>
            {/* Embed UpdateCandidateModal for editing client details */}
      

          </div>
        </form>
      ))}
    </div>
  );
};

export default ApproveClient;
