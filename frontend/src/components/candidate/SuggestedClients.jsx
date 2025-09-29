
import React, { useEffect, useState } from "react";
import axios from "axios";
import { getToken } from "../../utils/auth";
import SendOffertoClient from "./SendOffertoClient";

const SuggestedClients = () => {
  const [clients, setClients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [suggestions, setSuggestions] = useState([]);

  useEffect(() => {
    const fetchSuggestedClients = async () => {
      try {
        const token = getToken();
        const res = await axios.get("http://localhost:5000/api/match/suggestions", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setClients(res.data);
      } catch (err) {
        console.error("Error fetching suggested clients:", err);
        setError(err.response?.data?.message || "Failed to load client suggestions.");
      } finally {
        setLoading(false);
      }
    };

    fetchSuggestedClients();
  }, []);

  const handleDecision = async (clientId, decision) => {
    try {const token = getToken();
      await axios.post(`http://localhost:5000/api/offers/decision`,
         
         { clientId, decision },
  { headers: { Authorization: `Bearer ${token}` } }
        );

      setSuggestions(prev =>
        prev.map(c => (c._id === clientId ? { ...c, status: decision } : c))
      );

      alert(`Offer ${decision.toLowerCase()} successfully!`);
    } catch (error) {
      console.error(error);
      alert("Failed to update decision.");
    }
  };

  if (loading) return <p>Loading client suggestions...</p>;
  if (error) return <p className="text-danger">{error}</p>;

  return (
    <div className="container mt-3">
      <h2 className="mb-3">Suggested Clients</h2>

      {clients.length === 0 ? (
        <p>No client suggestions available right now.</p>
      ) : (
        <div className="table-responsive">
          <table className="table table-striped table-bordered align-middle">
            <thead className="table-light">
              <tr>
                <th>Client Name</th>
                <th>Email</th>
                <th>Charges</th>
                <th>Preferred Skill</th>
                <th>Negotiated Charges</th>
                <th>Gender</th>
                <th>Status</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {clients.map(client => (
                <tr key={client._id}>
                  <td>{client.name}</td>
                  <td>{client.email}</td>
                  <td>{client.maxBudget}</td>
                  <td>{client.serviceType}</td>
                  <td>{client.negotiatedCharges || "-"}</td>
                  <td>{client.gender}</td>
                  <td>{client.status || "Not Offered"}</td>
                  <td>
                    <SendOffertoClient
                      clientId={client._id}
                      jobId={null}
                      disabled={client.status === "Pending" || client.status === "Accepted"}
                      onStatusChange={newStatus => {
                        setSuggestions(prev =>
                          prev.map(c => (c._id === client._id ? { ...c, status: newStatus } : c))
                        );
                      }}
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default SuggestedClients;
