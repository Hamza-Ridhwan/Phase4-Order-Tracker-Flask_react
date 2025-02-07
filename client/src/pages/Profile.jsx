import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

function Profile() {
  const [profile, setProfile] = useState({
    first_name: "",
    last_name: "",
    email: "",
  });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const token = localStorage.getItem("access_token");
        const response = await api.get("/profile", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setProfile(response.data);
      } catch (err) {
        setError("Failed to fetch profile data.");
      }
    };

    fetchProfile();
  }, []);

  const handleChange = (e) => {
    setProfile({ ...profile, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    try {
      const token = localStorage.getItem("access_token");
      await api.put("/update-profile", profile, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setSuccess("Profile updated successfully.");
      setTimeout(() => {
        setIsModalOpen(false);
        navigate("/profile"); 
      }, 1000);
    } catch (err) {
      setError("Failed to update profile.");
    }
  };

  return (
    <>
  <Navbar />
  <div className="flex flex-col items-center justify-center min-h-screen mx-4 px-4">
    <div className="w-full max-w-4xl bg-white dark:bg-gray-800 shadow-lg rounded-xl p-6 border border-gray-200 dark:border-gray-700">
      {/* Page Title */}
      <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-6 text-center">
        Profile Information
      </h2>

      {/* Error & Success Messages */}
      {error && <p className="text-red-500 text-center mb-4">{error}</p>}
      {success && <p className="text-green-500 text-center mb-4">{success}</p>}

      {/* Profile Info */}
      {profile ? (
        <div className="space-y-3 text-gray-700 dark:text-gray-300">
          <p>
            <strong>First Name:</strong> {profile.first_name}
          </p>
          <p>
            <strong>Last Name:</strong> {profile.last_name}
          </p>
          <p>
            <strong>Email:</strong> {profile.email}
          </p>
          <p>
            <strong>Role:</strong> {profile.is_admin ? "Admin" : "User"}
          </p>

          <button
            className="mt-4 bg-blue-600 hover:bg-blue-800 transition duration-300 text-white py-2 px-4 rounded-lg shadow-md focus:ring-4 focus:ring-blue-300 dark:focus:ring-blue-900"
            onClick={() => setIsModalOpen(true)}
          >
            Edit Profile
          </button>
        </div>
      ) : (
        <p className="text-center">Loading profile...</p>
      )}
    </div>
  </div>

  {/* Modal for Editing Profile */}
  {isModalOpen && (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg max-w-sm w-full border border-gray-300 dark:border-gray-700">
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
          Edit Profile
        </h2>

        <form onSubmit={handleSubmit}>
          {/* First Name */}
          <div className="mb-4">
            <label className="block text-gray-700 dark:text-gray-300">First Name</label>
            <input
              type="text"
              name="first_name"
              value={profile.first_name}
              onChange={handleChange}
              className="w-full h-12 px-4 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-900 dark:bg-gray-700 dark:text-white focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Last Name */}
          <div className="mb-4">
            <label className="block text-gray-700 dark:text-gray-300">Last Name</label>
            <input
              type="text"
              name="last_name"
              value={profile.last_name}
              onChange={handleChange}
              className="w-full h-12 px-4 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-900 dark:bg-gray-700 dark:text-white focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Email (Read-Only) */}
          <div className="mb-4">
            <label className="block text-gray-700 dark:text-gray-300">Email</label>
            <input
              type="email"
              name="email"
              value={profile.email}
              readOnly
              className="w-full h-12 px-4 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-200 dark:bg-gray-700 cursor-not-allowed"
            />
          </div>

          {/* Action Buttons */}
          <div className="flex justify-between">
            <button
              type="button"
              className="bg-gray-500 hover:bg-gray-600 transition duration-300 text-white py-2 px-4 rounded-lg"
              onClick={() => setIsModalOpen(false)}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="bg-blue-600 hover:bg-blue-800 transition duration-300 text-white py-2 px-4 rounded-lg"
            >
              Update
            </button>
          </div>
        </form>
      </div>
    </div>
  )}

  <Footer />
</>

  );
}

export default Profile;
