import React, { useEffect, useState } from "react";
import axios from "axios";
import { getToken } from "../../utils/auth";

const OfferList = () => {
  const token = getToken();
  const [offers, setOffers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [negotiatingOffer, setNegotiatingOffer] = useState(null);
  const [newSalaries, setNewSalaries] = useState({});

  // -------------------------
  // Fetch candidate offers
  // -------------------------
  useEffect(() => {
    const fetchOffers = async () => {
     setLoading(true)
      try {
        const res = await axios.get(
          "http://localhost:5000/api/offers/candidate/offers",
          { headers: { Authorization: `Bearer ${token}` } }
        );console.log(res.data);

        if (Array.isArray(res.data)) {
          setOffers(res.data);
        } else if (res.data && Array.isArray(res.data.offers)) {
          setOffers(res.data.offers);
        } else  
          console.warn("Unexpected offers format", res.data);
        
      } catch (err) {
        console.error("Error fetching offers:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchOffers();
  }, [token]);

  // -------------------------
  // Accept / Reject offer
  // -------------------------
  const handleResponse = async (offerId, decision) => {
    try {
      await axios.post(
        "http://localhost:5000/api/offers/decision",
        { offerId, decision },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setOffers((prev) =>
        prev.map((o) =>
          o._id === offerId
            ? { ...o, status: decision, finalSalary: decision === "Accepted" ?o.clientCounterSalary ||o.negotiatedSalary || o.offeredSalary : null }
            : o
        )
      );
    } catch (err) {
      console.error("Error updating offer:", err);
      alert("Failed to update offer.");
    }
  };

  // -------------------------
  // Counter / negotiate offer
  // -------------------------
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
            ? { ...o, status: "Negotiating", candidateRequestedSalary: salary, negotiatedSalary: salary }
            : o
        )
      );

      setNegotiatingOffer(null);
      setNewSalaries((prev) => ({ ...prev, [offerId]: "" }));
      alert("Counter negotiation sent!");
    } catch (err) {
      console.error("Error negotiating:", err);
      alert(err.response?.data?.error || "Failed to negotiate");
    }
  };

  if (loading) return <p>Loading offers...</p>;

  return (
    <div className="container my-4">
      <h2 className="mb-4 text-primary">Your offer</h2>
      <div className="table-responsive">
        <table className="table table-striped table-bordered align-middle">
          <thead className="table-light">
            <tr>
              <th>Client Name</th>
              <th>Client Email</th>
              <th>Salary Offered</th>
              <th>Candidate Requested</th>
              <th>Client Counter</th>
              <th>Final Salary</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {offers.map((offer) => {
              let rowClass = "";
              if (offer.status === "Accepted") rowClass = "table-success";
              if (offer.status === "Rejected") rowClass = "table-danger";
              if (offer.status === "Negotiating") rowClass = "table-warning";

              return (
                <tr key={offer._id} className={rowClass}>
                  <td>{offer.client?.name || "-"}</td>
                  <td>{offer.client?.email || "-"}</td>
                  <td>Rs {offer?.offeredSalary || "-"}</td>
                  <td>Rs {offer?.candidateRequestedSalary || "-"}</td>
                  <td>Rs {offer?.clientCounterSalary || "-"}</td>
                  <td>Rs {offer?.finalSalary || "-"}</td>
                  <td>{offer?.status}</td>
                  <td>
                    {["Pending", "Negotiating"].includes(offer.status) && (
                      <div className="d-flex flex-column gap-1">
                        <button
                          className="btn btn-sm btn-success"
                          onClick={() => handleResponse(offer._id, "Accepted")}
                        >
                          Accept
                        </button>
                        <button
                          className="btn btn-sm btn-danger"
                          onClick={() => handleResponse(offer._id, "Rejected")}
                        >
                          Reject
                        </button>
                        <button
                          className="btn btn-sm btn-warning"
                          onClick={() =>
                            setNegotiatingOffer(
                              negotiatingOffer === offer._id ? null : offer._id
                            )
                          }
                        >
                          Counter
                        </button>
                      </div>
                    )}

                    {negotiatingOffer === offer._id && (
                      <div className="mt-2">
                        <input
                          type="number"
                          className="form-control form-control-sm mb-1"
                          value={newSalaries[offer._id] || ""}
                          onChange={(e) =>
                            setNewSalaries((prev) => ({ ...prev, [offer._id]: e.target.value }))
                          }
                          placeholder="Enter counter salary"
                        />
                        <div className="d-flex gap-2">
                          <button
                            className="btn btn-sm btn-primary"
                            onClick={() => handleNegotiate(offer._id)}
                          >
                            Send Counter
                          </button>
                          <button
                            className="btn btn-sm btn-secondary"
                            onClick={() => setNegotiatingOffer(null)}
                          >
                            Cancel
                          </button>
                        </div>
                      </div>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default OfferList;
