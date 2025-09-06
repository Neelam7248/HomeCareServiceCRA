import React, { useEffect, useState } from "react";
import axios from "axios";

const ClientAcceptedOffers = ({ token }) => {
  const [acceptedOffers, setAcceptedOffers] = useState({});
  const [feedbackOfferId, setFeedbackOfferId] = useState(null);
  const [rating, setRating] = useState(5);
  const [comments, setComments] = useState("");

  // Fetch accepted offers grouped by job
  useEffect(() => {
    const fetchAcceptedOffers = async () => {
      try {
        const res = await axios.get("/api/accepted-offers/client", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setAcceptedOffers(res.data);
      } catch (err) {
        console.error(err);
      }
    };
    fetchAcceptedOffers();
  }, [token]);

  // Submit client feedback
  const submitFeedback = async () => {
    try {
      await axios.post(
        `/api/accepted-offers/${feedbackOfferId}/client-feedback`,
        { rating, comments },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      // Reset modal state
      setFeedbackOfferId(null);
      setRating(5);
      setComments("");

      // Refresh accepted offers
      const res = await axios.get("/api/accepted-offers/client", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setAcceptedOffers(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div>
      <h2>Accepted Offers</h2>

      {Object.keys(acceptedOffers).length === 0 && <p>No accepted offers yet.</p>}

      {Object.entries(acceptedOffers).map(([jobId, offers]) => (
        <div key={jobId} style={{ border: "1px solid #ccc", padding: "10px", marginBottom: "15px" }}>
          <h3>Job ID: {jobId}</h3>
          {offers.map((offer) => (
            <div key={offer._id} style={{ margin: "10px 0", padding: "5px", borderBottom: "1px dashed #aaa" }}>
              <p>
                <strong>Candidate:</strong> {offer.candidateId.name} ({offer.candidateId.email})
              </p>
              <p>
                <strong>Start Date:</strong>{" "}
                {offer.startDate ? new Date(offer.startDate).toLocaleDateString() : "Not started"}
              </p>
              <p>
                <strong>End Date:</strong>{" "}
                {offer.endDate ? new Date(offer.endDate).toLocaleDateString() : "In progress"}
              </p>
              <p>
                <strong>Status:</strong> {offer.workCompleted ? "Completed" : "Ongoing"}
              </p>

              {/* Show feedback button if work completed and client hasn't given feedback */}
              {offer.workCompleted && !offer.clientFeedback?.rating && (
                <button onClick={() => setFeedbackOfferId(offer._id)}>Give Feedback</button>
              )}
            </div>
          ))}
        </div>
      ))}

      {/* Feedback Modal */}
      {feedbackOfferId && (
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            background: "#00000055",
          }}
        >
          <div
            style={{
              background: "#fff",
              padding: "20px",
              width: "400px",
              margin: "100px auto",
              borderRadius: "8px",
            }}
          >
            <h3>Give Feedback</h3>
            <label>
              Rating (1-5):
              <input
                type="number"
                min={1}
                max={5}
                value={rating}
                onChange={(e) => setRating(Number(e.target.value))}
              />
            </label>
            <br />
            <label>
              Comments:
              <textarea
                value={comments}
                onChange={(e) => setComments(e.target.value)}
                rows={4}
                style={{ width: "100%" }}
              />
            </label>
            <br />
            <button onClick={submitFeedback}>Submit</button>
            <button onClick={() => setFeedbackOfferId(null)} style={{ marginLeft: "10px" }}>
              Cancel
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ClientAcceptedOffers;
