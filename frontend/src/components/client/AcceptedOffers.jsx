import React, { useEffect, useState } from "react";
import axios from "axios";
import { getToken } from "../../utils/auth";
import ClientCounterDate from "./ClientCounterDate";
import ClientDecisionDate from "./ClientAcc-rejDecision";
import ProbationEndDateModal from "./ProbationEndDate";
import UpdateEndDateModal from "./UpdateEndDateModal";
import CloseJobModal from "./CloseJobModal";


const ClientAcceptedOffers = () => {
  const token = getToken();
  const [offers, setOffers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedOffer, setSelectedOffer] = useState(null); // which input is open
  const [selectedOfferForClosed, setSelectedOfferForClosed] = useState(null); // which input is open
  
  const [joiningDateInput, setJoiningDateInput] = useState({}); // temporary input
const [selectedOfferForEndDate, setSelectedOfferForEndDate] = useState(null); // for probation end date modal
  


// Log whenever selectedOfferForEndDate changes

useEffect(() => {
  if (selectedOfferForEndDate) {
    console.log("Updated finalJoiningDate:", selectedOfferForEndDate.finalJoiningDate);
  }
}, [selectedOfferForEndDate]);


// -------------------------
  // Fetch accepted offers
  // -------------------------
  const fetchOffers = async () => {
    try {
      const res = await axios.get(
        "http://localhost:5000/api/Claccepted-offers",
        { headers: { Authorization: `Bearer ${token}` } }
      ); console.log(res.data);
      setOffers(res.data);
    } catch (err) {
      console.error("Error fetching offers:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOffers();
  }, []);

  // -------------------------
  // Handle propose joining date
  // -------------------------
  const handlePropose = async (offerId) => {
    const date = joiningDateInput[offerId];
    if (!date) return alert("Please select a joining date.");

    try {
      const res = await axios.post(
        `http://localhost:5000/api/Claccepted-offers/${offerId}/propose-joining`,
        { proposedJoiningDate: date },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      const updatedOffer = res.data;

      // Update UI instantly
      setOffers((prev) =>
        prev.map((o) => (o._id === offerId ? updatedOffer : o))
      );

      setSelectedOffer(null);
      setJoiningDateInput((prev) => ({ ...prev, [offerId]: "" }));
    } catch (err) {
      console.error("Error proposing joining date:", err);
      alert(err.response?.data?.error || "Failed to propose joining date");
    }
  };


// Update an offer in the state after any change (counter date, decision, etc.)
const handleOfferUpdate = (updatedOffer) => {
  setOffers((prev) =>
    prev.map((offer) =>
      offer._id === updatedOffer._id ? updatedOffer : offer
    )
  );
};
const handleUpdateOffer = (updatedOffer) => {
    setOffers((prev) =>
      prev.map((o) => (o._id === updatedOffer._id ? updatedOffer : o))
    );
  };

  if (loading) return <p>Loading accepted offers...</p>;

  return (
    <div className="container my-5">
      <h2 className="mb-4 text-primary text-center">Accepted Offers</h2>
      <div className="row g-4">
        {offers.length === 0 && (
          <p className="text-center">No accepted offers yet.</p>
        )}

        {offers.map((offer) => {
          const proposedDate = offer.proposedJoiningDate
            ? new Date(offer.proposedJoiningDate).toLocaleDateString()
            : null;
          const candidateDate = offer.candidateJoiningDate
            ? new Date(offer.candidateJoiningDate).toLocaleDateString()
            : null;
          const clientCounter = offer.clientCounterDate
            ? new Date(offer.clientCounterDate).toLocaleDateString()
            : null;
          const finalJoining = offer.finalJoiningDate
            ? new Date(offer.finalJoiningDate).toLocaleDateString()
            : null;

          return (
            <div key={offer._id} className="col-md-6">
              <div className="card border-primary h-100 shadow-sm">
                <div className="card-header bg-primary text-white">
                  <h5 className="mb-0">{offer.candidateId?.name}</h5>
                </div>
                <div className="card-body">
                  <p>
                    <strong>Email:</strong> {offer.candidateId?.email}
                  </p>
                  <p>
                    <strong>Skills:</strong> {offer.candidateId?.skills}
                  </p>
                  <p>
                    <strong>Final Salary:</strong> Rs {offer.finalSalary || offer.offeredSalary}
                  </p>

                  <p>
                    <strong>Proposed Joining:</strong> {proposedDate || "Not Proposed"}
                  </p>
                  <p>
                    <strong>Candidate Proposed Date:</strong> {candidateDate || "Not Proposed"}
                  </p>
                  <p>
                    <strong>Client Counter Date:</strong> {clientCounter || "Not Proposed"}
                  </p>
                  <p>
                    <strong>Final Joining Date:</strong> {finalJoining || "Not Set"}
                  </p>

                  <p>
                    <strong>Probation Period:</strong> The Probation Period is start and end till  {offer.endDate || "Not Set"}
                  </p>
                  

{/*//  --------------------------------------------------------- //*/}

 {/* Accept / Reject Candidate Joining Date */}
      <ClientDecisionDate offer={offer} onDecisionMade={handleOfferUpdate} disabled={!!offer.finalJoiningDate} />
 

{/*------------------code of button for entering end datefrom ProbationEndDAteModal---------------------------------------------------- */}

{offer.finalJoiningDate && (
  <div className="mt-2">
    <button
      className="btn btn-warning btn-sm"
      onClick={() => {console.log("Offer being set:", offer); 
        setSelectedOfferForEndDate(offer)
      }
      }
      // set the offer to open moda
     disabled={!!offer.clientFeedback}
    >
      {offer.endDate ? "End Date Set" : "Set End Date"}
    </button>
  </div>
)}



{/*/--------------------------------------------------------------------//*/}
                  {/* Propose Joining Date Button */}
                  {offer.status === "Accepted" && (
                    <div className="mt-2">
                      <button
                        className="btn btn-primary btn-sm"
                        disabled={!!proposedDate} // disables after proposing
                        onClick={() => setSelectedOffer(offer._id)}
                      >
                        {proposedDate ? "Already Proposed" : "Propose Joining Date"}
                      </button>

                      {/* Show input only if button clicked and not already proposed */}
                      {selectedOffer === offer._id && !proposedDate && (
                        <div className="mt-2">
                          <label className="form-label">
                            <strong>Select Joining Date:</strong>
                          </label>
                          <input
                            type="date"
                            className="form-control mb-2"
                            value={joiningDateInput[offer._id] || ""}
                            min={new Date().toISOString().split("T")[0]}
                            onChange={(e) =>
                              setJoiningDateInput((prev) => ({
                                ...prev,
                                [offer._id]: e.target.value,
                              }))
                            }
                          />
                          <div className="d-flex gap-2">
                            <button
                              className="btn btn-success btn-sm"
                              onClick={() => handlePropose(offer._id)}
                            >
                              Send Proposal
                            </button>
                            <button
                              className="btn btn-secondary btn-sm"
                              onClick={() => setSelectedOffer(null)}
                            >
                              Cancel
                            </button>
                          </div>
                        </div>
                      )}
                    </div>
                  )}




{/*------------------code of button for entering feedback modal---------------------------------------------------- */}
<div className="mt-2">
<button
                      className="btn btn-danger btn-sm"
                      onClick={() => setSelectedOfferForClosed(offer)}
                    >
                      Close Job
                    </button>

</div>



{/* ------------------{offer.status === "Accepted" 
&& offer.candidateJoiningDate && offer.negotiationCount < 3
 && !offer.finalJoiningDate && (-----this code is for disabling the button when its work has done------------*/}
<ClientCounterDate
  offer={offer}
  disabled={!!offer.clientCounterDate || offer.negotiationCount >= 5 || !!offer.finalJoiningDate}
  onCounterSent={(updatedOffer) => {
    setOffers((prev) =>
      prev.map((o) => (o._id === updatedOffer._id ? updatedOffer : o))
    
    );
  }}
/>
{/*--code forrendering FeedbackModal---*/}

{selectedOfferForClosed && (
        <CloseJobModal
          offer={selectedOfferForClosed}
          onClose={() => setSelectedOfferForClosed(null)}
          onUpdate={handleOfferUpdate}
        />
      )}


{/*---------------------------   ending code of return    ------------------------------------------------*/}


                </div>
              </div>
            </div>
          );






        })}
      </div>
{/*--rendering CodeFor probationEndDateModal-*/}
<ProbationEndDateModal
  offer={selectedOfferForEndDate}
  onClose={() => setSelectedOfferForEndDate(null)}
  onUpdate={handleUpdateOffer}
  finalJoiningDate={
    selectedOfferForEndDate?.finalJoiningDate ||
    new Date().toISOString().split("T")[0] // fallback = today
  }
/>
    </div>

);
};

export default ClientAcceptedOffers;
