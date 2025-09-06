import React, { useState } from "react";


const AdminSignup = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: ""
  });
  const [message, setMessage] = useState("");

  const handleChange = (e) => {
  const { name, value } = e.target;  // destructuring
  setFormData({ ...formData, [name]: value });
};


  const handleSubmit = async (e) => {
  e.preventDefault();
  try {
    const response = await fetch("/api/admin/signup", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(formData)  // object ko JSON string me convert karna zaroori hai
    });

    const data = await response.json();

    if (!response.ok) {
      setMessage(data.message || "Error occurred");
    } else {
      setMessage(data.message);
    }
  } catch (err) {
    console.error("Fetch error:", err);
    setMessage("Error occurred");
  }
};

  return (
    <div className="signup-form">
      <h2>Admin Signup</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          name="name"
          placeholder="Name"
          value={formData.name}
          onChange={handleChange}
          required
        />
        <input
          type="email"
          name="email"
          placeholder="Email"
          value={formData.email}
          onChange={handleChange}
          required
        />
        <input
          type="password"
          name="password"
          placeholder="Password"
          value={formData.password}
          onChange={handleChange}
          required
        />
        <button type="submit">Signup</button>
      </form>
      {message && <p>{message}</p>}
    </div>
  );
};

export default AdminSignup;
