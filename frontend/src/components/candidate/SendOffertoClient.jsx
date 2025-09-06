// src/components/SendOfferButton.jsx
import React, { useState,useEffect } from "react";
import axios from "axios";
import { getToken } from "../../utils/auth";

const SendOffertoClient = ({ clientId, jobId,disabled = false, onStatusChange }) => {
  const [loading, setLoading] = useState(false);
const [status, setStatus] = useState(""); // "" | "Pending" | "Accepted" | "Rejected"
const token=getToken();
//handle fetchstatus of offersend 
useEffect(() => {
    const fetchStatus = async () => {
      if (!token) return;

      try {
        const res = await axios.get(`/api/offers/status`, {
          params: { clientId, jobId },
          headers: { Authorization: `Bearer ${token}` },
        });
        setStatus(res.data.status); // expecting backend returns { status: "Pending" }
      } catch (err) {
        console.error("Failed to fetch offer status", err);
      }
    };
//
    fetchStatus();
  }, [clientId, jobId, token]);
  
  
  //handle send offer
  const handleSendOffer = async () => {
    const token = getToken();
    console.log("Token from getToken():", token); // ← yahan check karein
    if (!token) {
      alert("User not authenticated");
      return;
    }

    setLoading(true);

    try {
const res=      await axios.post("/api/offers",
        { clientId,jobId },

        { headers: { Authorization: `Bearer ${token}` } }
      );

     
     const newStatus = res.data.status || "Pending"; // get status from backend
setStatus(newStatus);
onStatusChange?.(newStatus);
alert("Offer sent successfully to client!");




    } catch (error) {
      console.error(error.response?.data || error);
      alert("Failed to send offer to client.");
    } finally {
      setLoading(false);
    }
  };

  return (
  <button
      className={`btn btn-sm mb-1 ${
        status === "Accepted"
          ? "btn-success"
          : status === "Rejected"
          ? "btn-danger"
          : "btn-primary"
      }`}
      onClick={handleSendOffer}
      disabled={disabled || loading || status === "Pending"} // disable if already pending
    >
      {loading
        ? "Sending..."
        : status
        ? status // shows Pending / Accepted / Rejected
        : "Send Offer"}
    </button>
  );
};

export default SendOffertoClient;
