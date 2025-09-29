// components/admin/SuggestedCandidates.jsx
import React, { useState } from "react";
import axios from "axios";
import { getToken } from "../../utils/auth";
import AdminSendOfferButton from "./SendOfferA";

const SuggestedCandidates = () => {
  const [clientEmail, setClientEmail] = useState("");
  const [clientInfo, setClientInfo] = useState(null);
  const [candidates, setCandidates] = useState([]);
  const [error, setError] = useState("");
  const token = getToken();

  // -------------------------
  // Fetch suggested candidates by client email
  // -------------------------
  const fetchSuggested = async () => {
    setError("");
    setClientInfo(null);
    setCandidates([]);

    if (!clientEmail) {
      setError("Please enter client email");
      return;
    }

    try {
      const res = await axios.get(
        `http://localhost:5000/api/admin/suggestedCandidates/${clientEmail}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setClientInfo(res.data.client);
      setCandidates(res.data.suggestedCandidates || []);
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.error || "Something went wrong");
    }
  };

  // -------------------------
  // Render table of candidates
  // -------------------------
  return (
    <div className="p-6 bg-gray-100 rounded-lg shadow-md">
      <h2 className="text-xl font-bold mb-4">Find Suggested Candidates</h2>

      {/* Search bar */}
      <div className="flex gap-2 mb-4">
        <input
          type="email"
          placeholder="Enter client email"
          value={clientEmail}
          onChange={(e) => setClientEmail(e.target.value)}
          className="border px-3 py-2 rounded w-80"
        />
        <button onClick={fetchSuggested} className="btn btn-primary">
          Search
        </button>
      </div>

      {error && <p className="text-red-500 mb-4">{error}</p>}

      {/* Client info */}
      {clientInfo && (
        <div className="mb-4 bg-white p-4 rounded shadow">
          <h3 className="font-semibold">Client Info</h3>
          <p><strong>Name:</strong> {clientInfo.name}</p>
          <p><strong>Email:</strong> {clientInfo.email}</p>
          <p><strong>Service Type:</strong> {clientInfo.serviceType}</p>
        </div>
      )}

      {/* Suggested candidates */}
      {candidates.length > 0 ? (
        <div>
          <h3 className="font-semibold mb-2">Suggested Candidates</h3>
          <table className="w-full border text-center">
            <thead>
              <tr className="bg-gray-200">
                <th className="p-2 border">Name</th>
                <th className="p-2 border">Email</th>
                <th className="p-2 border">Skills</th>
                <th className="p-2 border">Charges</th>
                <th className="p-2 border">Experience</th>
                <th className="p-2 border">Offered Salary</th>
                <th className="p-2 border">Candidate Requested Salary</th>
                <th className="p-2 border">Client Counter Salary</th>
                <th className="p-2 border">Final Salary</th>
                <th className="p-2 border">Action</th>
              </tr>
            </thead>
            <tbody>
              {candidates.map((cand) => {
                const offer = cand.offer; // from aggregation
                return (
                  <tr key={cand._id}>
                    <td className="border p-2">{cand.name}</td>
                    <td className="border p-2">{cand.email}</td>
                    <td className="border p-2">{cand.skills}</td>
                    <td className="border p-2">{cand.charges} ({cand.chargesType})</td>
                    <td className="border p-2">{cand.experience}</td>
                    <td className="border p-2">{offer?.offeredSalary || "-"}</td>
                    <td className="border p-2">{offer?.candidateRequestedSalary || "-"}</td>
                    <td className="border p-2">{offer?.clientCounterSalary || "-"}</td>
                    <td className="border p-2">{offer?.finalSalary || "-"}</td>
                    <td className="border p-2">
                      <AdminSendOfferButton
                        clientId={clientInfo.id}
                        candidateId={cand._id}
                        offerId={offer?._id}
                        offeredSalary={cand.charges}
                        preferredChargesType={clientInfo.preferredChargesType}
                        serviceType={clientInfo.serviceType}
                        currentStatus={offer?.status || "Not Offered"}
                        onStatusChange={(updatedOffer) => {
                          setCandidates(prev =>
                            prev.map(c => c._id === cand._id ? { ...c, offer: updatedOffer } : c)
                          );
                        }}
                      />
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      ) : (
        clientInfo && <p className="mt-4 text-gray-500">No matching candidates found.</p>
      )}
    </div>
  );
};

export default SuggestedCandidates;
