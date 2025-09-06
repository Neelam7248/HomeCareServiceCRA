// src/components/AdminDashboard.jsx
import React, { useEffect, useState } from "react";

const AdminDashboard = () => {
  const [candidates, setCandidates] = useState([]);
  const [clients, setClients] = useState([]);
  const [message, setMessage] = useState("");

  const token = localStorage.getItem("token");

  // Fetch all users (Candidates & Clients)
  useEffect(() => {
    if (!token) return;

    const fetchUsers = async () => {
      try {
        const [cRes, clRes] = await Promise.all([
          fetch("/api/signup/candidates", {
            headers: { Authorization: `Bearer ${token}` },
          }),
          fetch("/api/signup/clients", {
            headers: { Authorization: `Bearer ${token}` },
          }),
        ]);

        const cData = await cRes.json();
        const clData = await clRes.json();

        setCandidates(cData);
        setClients(clData);
      } catch (err) {
        console.error(err);
        setMessage("Failed to fetch users");
      }
    };

    fetchUsers();
  }, [token]);

  const handleApproval = async (userType, id, approve) => {
    try {
      const res = await fetch(`/api/admin/approve/${userType}/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ approved: approve }),
      });
      const data = await res.json();

      if (!res.ok) throw new Error(data.message);

      setMessage(data.message);

      // Update UI
      if (userType === "candidate") {
        setCandidates((prev) =>
          prev.map((u) => (u._id === id ? { ...u, approved: approve } : u))
        );
      } else if (userType === "client") {
        setClients((prev) =>
          prev.map((u) => (u._id === id ? { ...u, approved: approve } : u))
        );
      }
    } catch (err) {
      console.error(err);
      setMessage(err.message || "Action failed");
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("userType");
    window.location.href = "/admin/signin";
  };

  return (
    <div>
      <h2>Admin Dashboard</h2>
      <button onClick={handleLogout}>Logout</button>
      {message && <p style={{ color: "green" }}>{message}</p>}

      <h3>Candidates</h3>
      <table border="1">
        <thead>
          <tr>
            <th>Name</th>
            <th>Email</th>
            <th>Approved</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {candidates.map((c) => (
            <tr key={c._id}>
              <td>{c.name}</td>
              <td>{c.email}</td>
              <td>{c.approved ? "Yes" : "No"}</td>
              <td>
                {!c.approved && (
                  <>
                    <button onClick={() => handleApproval("candidate", c._id, true)}>Approve</button>
                    <button onClick={() => handleApproval("candidate", c._id, false)}>Reject</button>
                  </>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <h3>Clients</h3>
      <table border="1">
        <thead>
          <tr>
            <th>Name</th>
            <th>Email</th>
            <th>Approved</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {clients.map((c) => (
            <tr key={c._id}>
              <td>{c.name}</td>
              <td>{c.email}</td>
              <td>{c.approved ? "Yes" : "No"}</td>
              <td>
                {!c.approved && (
                  <>
                    <button onClick={() => handleApproval("client", c._id, true)}>Approve</button>
                    <button onClick={() => handleApproval("client", c._id, false)}>Reject</button>
                  </>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default AdminDashboard;
