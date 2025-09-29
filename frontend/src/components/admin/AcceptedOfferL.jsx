import React, { useEffect, useState } from "react";
import axios from "axios";
import { getToken } from "./../../utils/auth";

const AcceptedOffers = () => {
  const [offers, setOffers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAcceptedOffers = async () => {
      try {
        const token = getToken();
        const res = await axios.get(
          "http://localhost:5000/api/admin/acceptedOffer", // ✅ backend route
          { headers: { Authorization: `Bearer ${token}` } }
        );

        // ✅ Only accepted offers
        const accepted = res.data.filter((offer) => offer.status === "Accepted");
        setOffers(accepted);
        setLoading(false);
      } catch (err) {
        console.error("Error fetching accepted offers:", err);
        setLoading(false);
      }
    };

    fetchAcceptedOffers();
  }, []);

  if (loading) {
    return <p className="text-center">Loading accepted offers...</p>;
  }

  if (offers.length === 0) {
    return (
      <p className="text-center text-gray-500">No accepted offers found.</p>
    );
  }

  return (
    <div className="max-w-4xl mx-auto mt-6">
      <h2 className="text-xl font-bold mb-4">Accepted Offers</h2>
      <table className="w-full border border-gray-200">
        <thead>
          <tr className="bg-gray-100">
            <th className="border px-3 py-2">Client</th>
            <th className="border px-3 py-2">Candidate</th>
            <th className="border px-3 py-2">Job ID</th>
            <th className="border px-3 py-2">FinalSalary</th>
            
            <th className="border px-3 py-2">CahrgesType</th>
            
            <th className="border px-3 py-2">Offer Status</th>
            
            <th className="border px-3 py-2">Job Status</th>

          </tr>
        </thead>
        <tbody>
          {offers.map((offer) => (
            <tr key={offer._id}>
              <td className="border px-3 py-2">{offer.clientId.email}</td>
              <td className="border px-3 py-2">{offer.candidateId.email}</td>
              <td className="border px-3 py-2">{offer.serviceType}</td>
              <td className="border px-3 py-2">{offer.finalSalary}</td>
              
              <td className="border px-3 py-2">{offer.preferredChargesType}</td>
 
              <td className="border px-3 py-2">
                {offer.status ? offer.status : "—"}
              
              </td>
              <td className="border px-3 py-2">{offer.jobStatus}</td>
            
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default AcceptedOffers;
