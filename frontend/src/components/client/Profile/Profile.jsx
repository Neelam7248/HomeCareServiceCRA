import React, { useEffect, useState } from "react";
import axios from "axios";
import ViewProfileModal from "./ViewProfileModal";
import UpdateProfileModal from "./UpdateProfileModal";

const Profile = ({ userId }) => {
  const [profile, setProfile] = useState(null);
const [successMsg, setSuccessMsg] = useState("");
  // ✅ Add token from localStorage/sessionStorage
  const token = localStorage.getItem("token");

  useEffect(() => {
    if (!userId) return;
    axios
      .get(`/api/clProfile/${userId}`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => setProfile(res.data))
      .catch((err) => console.error(err));
  }, [userId]);

  const handleUpdate = async (updatedProfile) => {
    try {
      const res = await axios.put(
        `/api/clProfile/${userId}`,
        updatedProfile,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setProfile(res.data);
     setSuccessMsg("Profile updated successfully!");
    setTimeout(() => setSuccessMsg(""), 3000); // auto-hide after 3s
    } catch (err) {
      console.error("Update failed:", err);
    }
  };

  return (
    <div className="container mt-4">
      
      {/* ✅ Success message */}
      {successMsg && (
        <div className="alert alert-success" role="alert">
          {successMsg}
        </div>
      )}
      
      <button
        className="btn btn-primary me-3"
        data-bs-toggle="modal"
        data-bs-target="#viewProfileModal"
      >
        View Profile
      </button>

      <button
        className="btn btn-success"
        data-bs-toggle="modal"
        data-bs-target="#updateProfileModal"
      >
        Update Profile
      </button>

      {/* Modals */}
      <ViewProfileModal profile={profile} />
      <UpdateProfileModal profile={profile} onUpdate={handleUpdate} />
    </div>
  );
};

export default Profile;
