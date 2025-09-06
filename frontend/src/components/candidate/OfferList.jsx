import React, { useEffect, useState } from "react";
import axios from "axios";
import { getToken } from "../../utils/auth";

const OfferList = () => {
  const token = getToken();
  const [offers, setOffers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [negotiatingOffer, setNegotiatingOffer] = useState(null);
  const [newSalaries, setNewSalaries] = useState({});

  useEffect(() => {
    const fetchOffers = async () => {
      try {
        const res = await axios.get(
          "http://localhost:5000/api/offers/candidate/offers",
          { headers: { Authorization: `Bearer ${token}` } }
        );
        setOffers(res.data);
      } catch (err) {
        console.error("Error fetching offers:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchOffers();
  }, [token]);

  const handleResponse = async (offerId, decision) => {
    try {
      await axios.post(
        "http://localhost:5000/api/offers/decision",
        { offerId, decision },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setOffers((prev) =>
        prev.map((o) => (o._id === offerId ? { ...o, status: decision } : o))
      );
    } catch (err) {
      console.error("Error updating offer:", err);
      alert("Failed to update offer.");
    }
  };

  const handleNegotiate = async (offerId) => {
    const salary = newSalaries[offerId];
    if (!salary) {
      alert("Please enter a new salary to negotiate.");
      return;
    }

    try {
      await axios.post(
        "http://localhost:5000/api/offers/negotiate",
        { offerId, negotiatedSalary: salary },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setOffers((prev) =>
        prev.map((o) =>
          o._id === offerId
            ? { ...o, status: "Negotiating", candidateRequestedSalary: salary }
            : o
        )
      );

      alert("Counter negotiation sent!");
      setNegotiatingOffer(null);
      setNewSalaries((prev) => ({ ...prev, [offerId]: "" }));
    } catch (err) {
      console.error("Error negotiating:", err);
      alert(err.response?.data?.error || "Failed to negotiate");
    }
  };

  if (loading) return <p>Loading offers...</p>;

  return (
    <div className="container mx-auto p-4">
      <h2 className="text-2xl font-bold mb-4 text-blue-700">Your Offers</h2>
      {offers.length === 0 ? (
        <p className="text-gray-500">No offers yet.</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full table-auto border-collapse border border-gray-300">
            <thead className="bg-blue-100 text-gray-700">
              <tr style={{backgroundColor:"lavender"}}>
                <th className="border px-2 py-1 text-left">Client</th>
                <th className="border px-2 py-.5">Salary Offered</th>
                <th className="border px-2 py-.5">Charges Type</th>
                <th className="border px-2 py-.5">Service Type</th>
                <th className="border px-2 py-.5">Your Requested Salary</th>
                <th className="border px-2 py-.5">Client Counter</th>
                <th className="border px-2 py-.5">Status</th>
                <th className="border px-2 py-.5">Actions</th>
              </tr>
            </thead>
            <tbody>
              {offers.map((offer) => {
                let statusColor = "bg-gray-100";
                if (offer.status === "Accepted") statusColor = "bg-green-200";
                if (offer.status === "Rejected") statusColor = "bg-red-200";
                if (offer.status === "Negotiating") statusColor = "bg-yellow-200";

                return (
                  <tr key={offer._id} className={statusColor}>
                    <td className="border px-4 py-.5">{offer.clientId?.name}</td>
                    <td className="border px-4 py-.5">Rs {offer.maxBudget}</td>
                    <td className="border px-4 py-.5">{offer.preferredChargesType}</td>
                    <td className="border px-4 py-.5">{offer.serviceType}</td>
                    <td className="border px-4 py-.5">
                      {offer.maxBudget || "-"}
                    </td>
                    <td className="border px-4 py-2">
                      {offer.clientCounterSalary || "-"}
                    </td>
                    <td className="border px-4 py-2">{offer.status}</td>
                    <td className="border px-4 py-2">
                      <div className="flex flex-col gap-2">
                        {["Pending", "Negotiating"].includes(offer.status) && (
                          <>
                            <button
                              onClick={() => handleResponse(offer._id, "Accepted")}
                              className="bg-green-500 text-white px-2 py-1 rounded hover:bg-green-600"
                            >
                              Accept
                            </button>
                            <button
                              onClick={() => handleResponse(offer._id, "Rejected")}
                              className="bg-red-500 text-white px-2 py-1 rounded hover:bg-red-600"
                            >
                              Reject
                            </button>
                            <button
                              onClick={() =>
                                setNegotiatingOffer(
                                  negotiatingOffer === offer._id ? null : offer._id
                                )
                              }
                              className="bg-yellow-500 text-white px-2 py-1 rounded hover:bg-yellow-600"
                            >
                              Counter
                            </button>
                          </>
                        )}
                        {negotiatingOffer === offer._id && (
                          <div className="flex flex-col gap-2 mt-2">
                            <input
                              type="number"
                              value={newSalaries[offer._id] || ""}
                              onChange={(e) =>
                                setNewSalaries((prev) => ({
                                  ...prev,
                                  [offer._id]: e.target.value,
                                }))
                              }
                              placeholder="Enter counter salary"
                              className="border px-2 py-1 rounded"
                            />
                            <div className="flex gap-2">
                              <button
                                onClick={() => handleNegotiate(offer._id)}
                                className="bg-blue-500 text-white px-2 py-1 rounded hover:bg-blue-600"
                              >
                                Send Counter
                              </button>
                              <button
                                onClick={() => setNegotiatingOffer(null)}
                                className="bg-gray-400 text-white px-2 py-1 rounded hover:bg-gray-500"
                              >
                                Cancel
                              </button>
                            </div>
                          </div>
                        )}
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default OfferList;
