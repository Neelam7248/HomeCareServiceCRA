// src/components/AdminCandidateOffers.jsx
import React, { useState } from "react";
import axios from "axios";
import { getToken } from "./../../utils/auth";

const OfferList = () => {
  const token = getToken();
  const [searchEmail, setSearchEmail] = useState("");
  const [offers, setOffers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [modalOffer, setModalOffer] = useState(null);
  const [counterSalary, setCounterSalary] = useState("");

  // 🌟 Fetch offers for a specific candidate by email
  const handleSearch = async () => {
    if (!searchEmail) return alert("Enter candidate email to search!");
    try {
      setLoading(true);
      const res = await axios.get(
        `http://localhost:5000/api/admin/offerList/candidate/${searchEmail}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setOffers(res.data.offers || []);
    } catch (err) {
      console.error("Error fetching offers:", err);
      alert("No offers found for this candidate");
    } finally {
      setLoading(false);
    }
  };

  const handleRespond = async (offerId, decision) => {
    try {
      setLoading(true);
      const payload = { decision };
      if (decision === "Counter") payload.counterAmount = counterSalary;

      const res = await axios.post(
        `http://localhost:5000/api/admin/offerList/${offerId}/respond-candidate`,
        payload,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setOffers((prev) =>
        prev.map((o) => (o._id === offerId ? res.data.offer : o))
      );

      setModalOffer(null);
      setCounterSalary("");
      alert(`Offer ${decision} successfully`);
    } catch (err) {
      console.error("Error responding to offer:", err);
      alert("Failed to respond");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 bg-gray-100 rounded-lg shadow-md">
      <h2 className="text-xl font-bold mb-4">Search Candidate Offers</h2>

      {/* 🌟 Search Input */}
      <div className="mb-4 flex gap-2">
        <input
          type="email"
          placeholder="Enter candidate email..."
          className="form-control"
          value={searchEmail}
          onChange={(e) => setSearchEmail(e.target.value)}
        />
        <button className="btn btn-primary" onClick={handleSearch}>
          Search
        </button>
      </div>

      {loading && <p>Loading...</p>}

      {offers.length > 0 && (
        <table className="w-full border">
          <thead>
            <tr className="bg-gray-200 text-center">
              <th className="p-2 border">Candidate</th>
              <th className="p-2 border">Client</th>
              <th className="p-2 border">Job</th>
              <th className="p-2 border">Offered Salary</th>
              <th className="p-2 border">CandidateRequestedSalary</th>
              <th className="p-2 border">Client Counter Salary</th>
              <th className="p-2 border">Final Salary</th>
              
              <th className="p-2 border">Status</th>
              <th className="p-2 border">Action</th>
            </tr>
          </thead>
          <tbody>
            {offers.map((offer) => (
              <tr key={offer._id} className="text-center">
                <td className="border p-2">{offer.candidateId.name}</td>
                <td className="border p-2">{offer.clientId.email}</td>
                <td className="border p-2">{offer.jobId}</td>
                <td className="border p-2">{offer.offeredSalary}</td>
                <td className="border p-2">{offer.candidateRequestedSalary}</td>
                <td className="border p-2">{offer.clientCounterSalary}</td>
                <td className="border p-2">{offer.finalSalary}</td>
                
                
                <td className="border p-2">{offer.status}</td>
                <td className="border p-2">
                  {(offer.status === "Pending" || offer.status === "Negotiating") ? (
                    <button
                      className="btn btn-warning btn-sm"
                      onClick={() => setModalOffer(offer)}
                    >
                      Respond
                    </button>
                  ) : (
                    <span className="text-gray-500">No Action</span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      {/* Modal */}
      {modalOffer && (
        <div className="modal show fade d-block" style={{ backgroundColor: "rgba(0,0,0,0.5)" }}>
          <div className="modal-dialog modal-md">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">
                  Respond to {modalOffer.candidateName}'s Offer
                </h5>
                <button className="btn-close" onClick={() => setModalOffer(null)}></button>
              </div>
              <div className="modal-body">
                <label className="form-label">Counter Salary</label>
                <input
                  type="number"
                  className="form-control"
                  value={counterSalary}
                  onChange={(e) => setCounterSalary(e.target.value)}
                />
              </div>
              <div className="modal-footer">
                <button className="btn btn-secondary" onClick={() => setModalOffer(null)}>Cancel</button>
                <button className="btn btn-danger" onClick={() => handleRespond(modalOffer._id, "Rejected")}>Reject</button>
                <button className="btn btn-success" onClick={() => handleRespond(modalOffer._id, "Accepted")}>Accept</button>
                <button className="btn btn-primary" onClick={() => handleRespond(modalOffer._id, "Counter")}>Counter</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default OfferList;
