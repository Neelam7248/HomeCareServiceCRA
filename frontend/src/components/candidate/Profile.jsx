import React, { useEffect, useState } from "react";
import axios from "axios";
import ProfileModal from "./ProfileModal";
import UpdateProfileModal from "./UpdateProfileModal";

const Profile = () => {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showProfileModal, setShowProfileModal] = useState(false);
  const [showUpdateModal, setShowUpdateModal] = useState(false);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await axios.get("http://localhost:5000/api/profile", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setProfile(res.data);
        setLoading(false);
      } catch (err) {
        console.error(err);
        setError("Failed to load profile");
        setLoading(false);
      }
    };
    fetchProfile();
  }, []);

  // ✅ Callback after profile update
  const handleProfileUpdate = (updatedProfile) => {
    setProfile(updatedProfile);
    setShowUpdateModal(false);
  };

  if (loading) return <p className="text-center">Loading...</p>;
  if (error) return <p className="text-danger">{error}</p>;

  return (
    <div className="container text-center mt-4">
      <h2>Candidate Dashboard</h2>
      <button
        className="btn btn-primary m-2"
        onClick={() => setShowProfileModal(true)}
      >
        Show Profile
      </button>
      <button
        className="btn btn-success m-2"
        onClick={() => setShowUpdateModal(true)}
      >
        Update Profile
      </button>

      {/* ✅ Show Profile Modal */}
      {showProfileModal && (
        <ProfileModal
          profile={profile}
          onClose={() => setShowProfileModal(false)}
        />
      )}

      {/* ✅ Update Profile Modal */}
      {showUpdateModal && (
        <UpdateProfileModal
          profile={profile}
          onClose={() => setShowUpdateModal(false)}
          onUpdate={handleProfileUpdate}
        />
      )}
    </div>
  );
};

export default Profile;
