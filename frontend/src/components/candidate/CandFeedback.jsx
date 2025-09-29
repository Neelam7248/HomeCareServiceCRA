import React, { useState } from "react";
import axios from "axios";
import { getToken } from "./../../utils/auth";

const CandidateFeedbackModal = ({ jobId }) => {
  const [message, setMessage] = useState("");
  const [rating, setRating] = useState("");
  const [loading, setLoading] = useState(false);

  const token = getToken();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!message.trim()) {
      alert("Feedback message is required.");
      return;
    }
    setLoading(true);
    try {
      await axios.post(
        `http://localhost:5000/api/candidate/feedback/${jobId}/candidate-feedback`,
        { message, rating },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      alert("Feedback submitted successfully!");
      setMessage("");
      setRating("");
      // Close modal programmatically
      const modalEl = document.getElementById("feedbackModal");
      const modal = window.bootstrap.Modal.getInstance(modalEl);
      modal.hide();
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.error || "Failed to submit feedback.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {/* Button trigger modal */}
      <button
        type="button"
        className="btn btn-primary"
        data-bs-toggle="modal"
        data-bs-target="#feedbackModal"
      >
        Give Feedback
      </button>

      {/* Modal */}
      <div
        className="modal fade"
        id="feedbackModal"
        tabIndex="-1"
        aria-labelledby="feedbackModalLabel"
        aria-hidden="true"
      >
        <div className="modal-dialog">
          <div className="modal-content">
            <form onSubmit={handleSubmit}>
              <div className="modal-header">
                <h5 className="modal-title" id="feedbackModalLabel">
                  Submit Feedback
                </h5>
                <button
                  type="button"
                  className="btn-close"
                  data-bs-dismiss="modal"
                  aria-label="Close"
                ></button>
              </div>
              <div className="modal-body">
                <div className="mb-3">
                  <label className="form-label">Feedback Message</label>
                  <textarea
                    className="form-control"
                    rows="4"
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    required
                  />
                </div>
                <div className="mb-3">
                  <label className="form-label">Rating (optional)</label>
                  <input
                    type="number"
                    className="form-control"
                    min="1"
                    max="5"
                    value={rating}
                    onChange={(e) => setRating(e.target.value)}
                  />
                </div>
              </div>
              <div className="modal-footer">
                <button
                  type="button"
                  className="btn btn-secondary"
                  data-bs-dismiss="modal"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="btn btn-success"
                  disabled={loading}
                >
                  {loading ? "Submitting..." : "Submit Feedback"}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </>
  );
};

export default CandidateFeedbackModal;
