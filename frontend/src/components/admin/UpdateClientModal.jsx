import React, { useState, useEffect } from "react";
import axios from "axios";
import { getToken } from "../../utils/auth";

const UpdateClientModal = () => {
  const [email, setEmail] = useState(""); // input to fetch client by email
  const [client, setClient] = useState(null);
  const [message, setMessage] = useState("");
  const token = getToken();

  // Fetch client when email is entered and modal opens
  const fetchClient = async () => {
    if (!email) return;
    try {
      const res = await axios.get(
        `/api/admin/updateClient/by-email/${encodeURIComponent(email)}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setClient(res.data);
      setMessage("");
    } catch (err) {
      console.error(err);
      setMessage("Client not found or fetch failed");
      setClient(null);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setClient((prev) => ({ ...prev, [name]: value }));
  };

  const handleSave = async () => {
    try {
      await axios.put(`/api/admin/UpdateClient/client/${client._id}`, client, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setMessage("Client updated successfully!");
      setClient(null); // clear client after save
      setEmail("");
      // Close modal programmatically
      const modalEl = document.getElementById("updateClientModal");
      const modal = window.bootstrap.Modal.getInstance(modalEl);
      modal.hide();
    } catch (err) {
      console.error(err);
      setMessage(err.response?.data?.error || "Update failed");
    }
  };
  // Soft delete function
  const handleDelete = async () => {
  if (!client) return;

  if (client.isDeleted) {
    alert("This client is already soft deleted!");
    return;
  }

  if (!window.confirm("Are you sure you want to delete this client?")) return;
  try {
      await axios.put(
        `/api/admin/userDelete/client/${client._id}`,
        { isDeleted: true }, // assuming backend marks soft delete via `isDeleted`
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setMessage("Client soft deleted successfully!");
      setClient(null);
      setEmail("");
      const modalEl = document.getElementById("updateClientModal");
      const modal = window.bootstrap.Modal.getInstance(modalEl);
      modal.hide();
    } catch (err) {
      console.error(err);
      setMessage(err.response?.data?.error || "Soft delete failed");
    }
  };

// Restore function
const handleRestore = async () => {
  if (!client) return;

  if (!client.isDeleted) {
    alert("This client is not deleted!");
    return;
  }

  try {
    await axios.put(
      `/api/admin/userDelete/clientRestore/${client._id}`, // correct route
      {},
      { headers: { Authorization: `Bearer ${token}` } }
    );
    setMessage("Client restored successfully!");
    setClient((prev) => ({ ...prev, isDeleted: false }));
  } catch (err) {
    console.error(err);
    setMessage(err.response?.data?.error || "Restore failed");
  }
};


  const fields = [
    "name",
    "email",
    "phone",
    "address",
    "occupation",
    "serviceType",
    "requiredExperience",
    "preferredChargesType",
    "maxBudget",
    "preferredAge",
    "preferredGender",
  ];

  return (
    <div>
      {/* Input and button to open modal */}
      <div className="mb-3">
        <input
          type="email"
          placeholder="Enter Client Email"
          className="form-control mb-2"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <button
          className="btn btn-primary"
          data-bs-toggle="modal"
          data-bs-target="#updateClientModal"
          onClick={fetchClient}
        >
          Update Client
        </button>
      </div>

      {message && <div className="alert alert-info">{message}</div>}

      {/* Bootstrap Modal */}
      <div
        className="modal fade"
        id="updateClientModal"
        tabIndex="-1"
        aria-labelledby="updateClientModalLabel"
        aria-hidden="true"
      >
        <div className="modal-dialog modal-dialog-scrollable">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title" id="updateClientModalLabel">
                Update Client
              </h5>
              <button
                type="button"
                className="btn-close"
                data-bs-dismiss="modal"
                aria-label="Close"
              ></button>
            </div>

            <div className="modal-body">
              {client ? (
                fields.map((field) => (
                  <div className="mb-2" key={field}>
                    <label className="form-label">
                      {field.replace(/([A-Z])/g, " $1")}:
                    </label>
                    <input
                      type="text"
                      name={field}
                      value={client[field] || ""}
                      onChange={handleChange}
                      className="form-control"
                    />
                  </div>
                ))
              ) : (
                <p>Enter a valid email and click Update Client.</p>
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
               {client && (
                <>
                  <button
  type="button"
  className={`btn ${client.isDeleted ? "btn-secondary" : "btn-danger"} me-auto`}
  onClick={handleDelete}
  title={client.isDeleted ? "Already soft deleted" : "Delete candidate"}
>
  {client.isDeleted ? "Deleted" : "Delete"}
</button></>)}


               {client && (
                <>
                  <button
  type="button"
  className={`btn ${client.isDeleted ?  "btn-success" :"btn-secondary"} me-auto`}
  onClick={handleRestore}
  title={client.isRestored ? "Already Restored" : "Restore client"}
>
  {client.isRestored ? "Restored" : "Restore"}
</button></>)}

 <button
                type="button"
                className="btn btn-primary"
                onClick={handleSave}
                disabled={!client}
              >
                Save Changes
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UpdateClientModal;
