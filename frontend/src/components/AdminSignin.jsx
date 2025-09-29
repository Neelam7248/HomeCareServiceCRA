import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { setToken } from "./../utils/auth";

const AdminSignin = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [error, setError] = useState("");

  // input handle
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // form submit
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    try {
      const res = await fetch("http://localhost:5000/api/admin/signin", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await res.json();
      if (!res.ok) {
        setError(data.message || "Login failed");
        return;
      }

      // Token save
      setToken(data.token);
      setFormData({ email: "", password: "" });

      // Redirect dashboard
      navigate("/pages/admindashboard");
    } catch (err) {
      console.error("Signin error:", err);
      setError("Server error. Please try again.");
    }
  };

  return (

  <div className="d-flex align-items-center justify-content-center vh-100" style={{ backgroundColor: '#b5d0b3ff' }}>
 <div className="card shadow p-4" style={{ width: "100%", maxWidth: "400px",backgroundColor:'#6faf9bff'}}>
        <h2 className="text-center mb-4">Admin Sign In</h2>

        {error && <p className="text-danger text-center">{error}</p>}

        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label className="form-label">Email</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className="form-control"
              placeholder="Enter your email"
              required
            />
          </div>

          <div className="mb-3">
            <label className="form-label">Password</label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              className="form-control"
              placeholder="Enter your password"
              autoComplete="new-password"
              required
            />
          </div>

          <button type="submit" className="btn btn-success w-100">
            Sign In
          </button>
        </form>
      </div>
    </div>
  );
};

export default AdminSignin;
