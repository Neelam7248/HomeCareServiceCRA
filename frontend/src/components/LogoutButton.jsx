// src/components/LogoutButton.jsx
import React from "react";
import { useNavigate } from "react-router-dom";

const LogoutButton = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    // Remove token from localStorage
    localStorage.removeItem("token");

    // Optionally, you can clear other user data if saved
    localStorage.removeItem("userId");
    localStorage.removeItem("userType");

    // Redirect to login page
    navigate("/login");
  };

  return (
    <button
      className="btn btn-danger"
      onClick={handleLogout}
    >
      Logout
    </button>
  );
};

export default LogoutButton;
