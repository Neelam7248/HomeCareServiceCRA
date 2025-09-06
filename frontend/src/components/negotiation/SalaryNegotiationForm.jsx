import React, { useState, useEffect } from "react";

const SalaryNegotiationForm = ({ offerId, clientId, candidateId, maxBudget }) => {
  const [offeredSalary, setOfferedSalary] = useState("");
  const [negotiatedSalary, setNegotiatedSalary] = useState("");
  const [finalSalary, setFinalSalary] = useState("");
  const [perHour, setPerHour] = useState(0);
  const [perMonth, setPerMonth] = useState(0);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  // ✅ Calculate perHour & perMonth from maxBudget
  useEffect(() => {
  if (maxBudget) {
    // yahan maxBudget ko perHour maana
    const hourly = parseFloat(maxBudget);
    const monthly = (hourly * 160).toFixed(2);

    setPerHour(hourly);
    setPerMonth(monthly);
    setOfferedSalary(monthly); // Default offer = monthly salary
  }
}, [maxBudget]);


  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    try {
      const response = await fetch("http://localhost:5000/api/offers/negotiate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`, // ✅ JWT auth
        },
        body: JSON.stringify({
          offerId,
          clientId,
          candidateId,
          offeredSalary,
          negotiatedSalary,
          finalSalary,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        setMessage("✅ Negotiation updated successfully!");
      } else {
        setMessage(data.error || "❌ Something went wrong");
      }
    } catch (err) {
      console.error("Negotiation error:", err);
      setMessage("❌ Server error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-4 border rounded-md shadow-md w-full max-w-md">
      <h2 className="text-xl font-semibold mb-3">Salary Negotiation</h2>

      {/* Budget Calculation Info */}
      <div className="mb-4 bg-gray-100 p-3 rounded">
        <p>💰 Max Budget: <b>{maxBudget}</b> PKR</p>
        <p>⏱ Per Hour: <b>{perHour}</b> PKR</p>
        <p>📅 Per Month: <b>{perMonth}</b> PKR</p>
      </div>

      <form onSubmit={handleSubmit}>
        {/* Offered Salary */}
        <label className="block mb-1">Client Offered Salary:</label>
        <input
          type="number"
          value={offeredSalary}
          onChange={(e) => setOfferedSalary(e.target.value)}
          placeholder="e.g. 60000"
          className="border p-2 rounded w-full mb-3"
        />

        {/* Negotiated Salary */}
        <label className="block mb-1">Candidate Negotiated Salary:</label>
        <input
          type="number"
          value={negotiatedSalary}
          onChange={(e) => setNegotiatedSalary(e.target.value)}
          placeholder="e.g. 65000"
          className="border p-2 rounded w-full mb-3"
        />

        {/* Final Salary */}
        <label className="block mb-1">Final Agreed Salary:</label>
        <input
          type="number"
          value={finalSalary}
          onChange={(e) => setFinalSalary(e.target.value)}
          placeholder="e.g. 62000"
          className="border p-2 rounded w-full mb-4"
        />

        {/* Submit Button */}
        <button
          type="submit"
          disabled={loading}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          {loading ? "Submitting..." : "Save Negotiation"}
        </button>
      </form>

      {message && <p className="mt-3 text-sm">{message}</p>}
    </div>
  );
};

export default SalaryNegotiationForm;
