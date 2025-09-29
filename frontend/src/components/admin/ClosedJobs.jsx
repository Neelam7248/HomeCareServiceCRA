// components/admin/ClosedOffers.jsx
import React, { useEffect, useState } from "react";
import axios from "axios";
import { getToken } from "../../utils/auth";

const ClosedJobs = () => {
  const [offers, setOffers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchClosedOffers = async () => {
      try {
        const token = getToken();
        const res = await axios.get("http://localhost:5000/api/admin/acceptedOffer/closed", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setOffers(res.data);
      } catch (err) {
        console.error("Error fetching closed offers:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchClosedOffers();
  }, []);

  if (loading) return <p>Loading closed offers...</p>;

  return (
    <div className="p-4">
      <h2 className="text-xl font-bold mb-4">Closed Offers</h2>
      {offers.length === 0 ? (
        <p>No closed offers found.</p>
      ) : (
        <table className="w-full border">
          <thead>
            <tr className="bg-gray-200">
              <th className="p-2 border">Client</th>
              <th className="p-2 border">Candidate</th>
<th className="p-2 border">FinalSalary</th>

              <th className="p-2 border">Job</th>
<th className="p-2 border">D.O.Joining</th>


              <th className="p-2 border">EndDate</th>
<th className="p-2 border">ClientFeedback</th> 
<th className="p-2 border">Cl.FBack.date</th> 

<th className="p-2 border">CandidateFeedback</th>

              <th className="p-2 border">Status</th>
            </tr>
          </thead>
          <tbody>
            {offers.map((offer) => (
              <tr key={offer._id} className="hover:bg-gray-50">
                <td className="p-2 border">{offer.clientId.email}</td>
                <td className="p-2 border">{offer.candidateId.email}</td>
                <td className="p-2 border">{offer.finalSalary}</td>
                                <td className="p-2 border">{offer.serviceType}</td>
                
                                <td className="p-2 border">{offer.finalJoiningDate}</td>
  <th className="p-2 border">{offer.endDate}</th>
<th className="p-2 border">
  {offer.clientFeedback?.message} <br /></th>
  <th className="p-2 border"><small>{new Date(offer.clientFeedback?.givenAt).toLocaleString()}</small>
</th>

<th className="p-2 border">{[offer.candidateFeedback]}</th>

  
                <td className="p-2 border text-red-600 font-semibold">
                  {offer.status}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default ClosedJobs;
