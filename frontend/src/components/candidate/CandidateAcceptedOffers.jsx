import React, { useEffect, useState } from "react";
import axios from "axios";

const CandidateAcceptedOffers = () => {
  const [offers, setOffers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [counterDates, setCounterDates] = useState({});
  const token = localStorage.getItem("token");

  // ✅ Fetch candidate offers
  useEffect(() => {
    const fetchOffers = async () => {
      try {
        const res = await axios.get("http://localhost:5000/api/accepted-offers", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setOffers(res.data);
      } catch (err) {
        console.error("Error fetching offers:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchOffers();
  }, [token]);

  // ✅ Handle Accept / Reject / Counter
  const handleRespond = async (id, action) => {
    try {
      if (action === "Counter") {
        await axios.post(
          "http://localhost:5000/api/accepted-offers/counter",
          { offerId: id, counterDate: counterDates[id] },
          { headers: { Authorization: `Bearer ${token}` } }
        );
        alert(`Your proposed joining date (${counterDates[id]}) has been sent to the client`);
      } else {
        await axios.post(
          "http://localhost:5000/api/accepted-offers/decision",
          { offerId: id, decision: action },
          { headers: { Authorization: `Bearer ${token}` } }
        );
        alert(`You ${action}ed the joining date`);
      }

      // ✅ Update UI state locally
      setOffers((prev) =>
  prev.map((o) =>
    o._id === id
      ? {
          ...o,
          candidateJoiningDate:
            action === "Counter"
              ? counterDates[id]
              : o.candidateJoiningDate,
          finalDateOfJoining:
            action === "Accept"
              ? o.proposedDateOfJoining
              : o.finalDateOfJoining, // sirf accept pe finalize
          jobStatus:
            action === "Accept"
              ? "Ongoing"
              : action === "Reject"
              ? "Terminated"
              : o.jobStatus,
        }
      : o
  )
);

    } catch (err) {
      console.error("Error responding:", err);
      alert(err.response?.data?.error || "Failed to respond");
    }
  };

  if (loading) return <p>Loading offers...</p>;

  return (
    <div className="container my-4">
      <h2 className="mb-4 text-primary">My Job Offers</h2>
      <div className="row">
        {offers.length === 0 && <p>No offers available</p>}
        {offers.map((offer) => (
          <div key={offer._id} className="col-md-6 mb-3">
            <div className="card shadow-sm">
              <div className="card-body">
                <h5 className="card-title">Job: {offer.Job}</h5>
            <p className="card-text"><strong>Client:</strong>  {offer.clientName}({offer.clientEmail})</p>
             <p className="card-text"><strong>Final Salary:</strong>  {offer.finalSalary}</p>
                <p>
                  <strong>Proposed Joining Date:</strong>{" "}
                  {offer.proposedDateOfJoining
                    ? new Date(offer.proposedDateOfJoining).toLocaleDateString()
                    : "Not Provided"}
                </p><p>
  <strong>Your Proposed Date:</strong>{" "}
  {offer.candidateJoiningDate
    ? new Date(offer.candidateJoiningDate).toLocaleDateString()
    : "Not Proposed"}
</p>
 <p>
                  <strong>clientCounter Date:</strong>{" "}
                  {offer.clientCounterDate
                    ? new Date(offer.clientCounterDate).toLocaleDateString()
                    : "Not Decided"}
                </p>
                <p>
  <strong>Final Date of Joining:</strong>{" "}
  {offer.finalDateOfJoining
    ? new Date(offer.finalDateOfJoining).toLocaleDateString()
    : "Not Finalized"}
</p>


                <p>
                  <strong>Status:</strong>{" "}
                  <span
                    className={
                      offer.jobStatus === "Ongoing"
                        ? "text-success"
                        : offer.jobStatus === "Terminated"
                        ? "text-danger"
                        : "text-warning"
                    }
                  >
                    {offer.jobStatus || "Pending"}
                  </span>
                </p>
<p>
  <strong>EndDate:</strong>{" "}
  {offer.endDate    ? new Date(offer.endDate).toLocaleDateString()
    : "Not Finalized"}
</p>
                {/* ✅ Only show if client proposed date */}
                {offer.proposedDateOfJoining ? (
                  offer.jobStatus !== "Ongoing" &&
                  offer.jobStatus !== "Terminated" && (
                    <>
                      {/* Counter Input */}
                      <div className="mb-2">
                        <label className="form-label">Propose Counter Date</label>
                        <input
                          type="date"
                          className="form-control"
                          value={counterDates[offer._id] || ""}
                          onChange={(e) =>
                            setCounterDates({
                              ...counterDates,
                              [offer._id]: e.target.value,
                            })
                          }
                        />
                      </div>

                      {/* Action Buttons */}
                      <div className="d-flex gap-2 mt-2">
                        <button
                          className="btn btn-success"
                          onClick={() => handleRespond(offer._id, "Accept")}
                        >
                          Accept
                        </button>
                        <button
                          className="btn btn-danger"
                          onClick={() => handleRespond(offer._id, "Reject")}
                        >
                          Reject
                        </button>
                        <button
                          className="btn btn-warning"
                          onClick={() => handleRespond(offer._id, "Counter")}
                          disabled={!counterDates[offer._id]}
                        >
                          Counter
                        </button>
                      </div>
                    </>
                  )
                ) : (
                  <p className="text-muted mt-2">⏳ Waiting for client response...</p>
                )}

                {offer.jobStatus === "Ongoing" && (
                  <span className="badge bg-success mt-2">Ongoing</span>
                )}
                {offer.jobStatus === "Terminated" && (
                  <span className="badge bg-danger mt-2">Terminated</span>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CandidateAcceptedOffers;
