import React, { useState } from "react";

const AdminSignin = () => {
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [message, setMessage] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage(""); // clear previous message

    try {
      const res = await fetch("/api/admin/signin", { // relative path, proxy ke liye
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData)
      });

      const data = await res.json();

      if (!res.ok) {
        setMessage(data.message || "Login failed");
      } else {
        setMessage(data.message);
        console.log("Admin logged in:", data.user);
        console.log("Token:", data.token);

        // Save token in localStorage or context for further use
        localStorage.setItem("token", data.token);
        localStorage.setItem("userType", "admin");

        // Redirect to admin dashboard
        window.location.href = "/pages/admindashboard";
      }
    } catch (err) {
      console.error("Fetch error:", err);
      setMessage("Network error. Try again.");
    }
  };

  return (
    <div className="signin-form">
      <h2>Admin Sign In</h2>
      <form onSubmit={handleSubmit}>
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
        <button type="submit">Login</button>
      </form>
      {message && <p style={{ color: "red" }}>{message}</p>}
    </div>
  );
};

export default AdminSignin;
