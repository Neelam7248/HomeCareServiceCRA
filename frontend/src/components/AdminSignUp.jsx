import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { setToken } from "./../utils/auth";

const AdminSignup = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    adminSecret: ""
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await fetch("http://localhost:5000/api/admin/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData)
      });

      const data = await res.json();
      if (res.ok) {
        setToken(data.token);
        alert("Admin Signup Successful ✅");
        navigate("/pages/admindashboard");
      } else {
        alert(data.message || "Signup failed");
      }
    } catch (err) {
      console.error("Signup error:", err);
    }
  };

  return (
    <div className="container mt-5">
      <h2>Admin Signup</h2>
      <form onSubmit={handleSubmit}>
        <div className="mb-3">
          <label>Name</label>
          <input
            type="text"
            className="form-control"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
          />
        </div>
        <div className="mb-3">
          <label>Email</label>
          <input
            type="email"
            className="form-control"
            name="email"
            value={formData.email}
            onChange={handleChange}
            required
          />
        </div>
        <div className="mb-3">
          <label>Password</label>
          <input
            type="password"
            className="form-control"
            name="password"
            value={formData.password}
            onChange={handleChange}
           autoComplete="new-password"  // ✅ disable autofill for password
            required
          />
        </div>

        {/* ✅ Admin Secret Key Field */}
        <div className="mb-3">
          <label>Admin Secret Key</label>
          <input
            type="password"
            className="form-control"
            name="adminSecret"
            value={formData.adminSecret}
            onChange={handleChange}
            placeholder="Enter admin secret key"
            autoComplete="new-password"  // ✅ disable autofill for password
            required
          />
        </div>
        <button type="submit" className="btn btn-primary">
          Signup
        </button>
      </form>
    </div>
  );
};

export default AdminSignup;
