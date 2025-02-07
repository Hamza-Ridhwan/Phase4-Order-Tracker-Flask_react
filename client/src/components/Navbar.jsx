import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../api";
import { ACCESS_TOKEN } from "../constants";

function Navbar() {
  const navigate = useNavigate();
  const isAuthenticated = localStorage.getItem(ACCESS_TOKEN);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [showChangePassword, setShowChangePassword] = useState(false);
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    const fetchUserRole = async () => {
      if (isAuthenticated) {
        try {
          const response = await api.get("/user/me", {
            headers: {
              Authorization: `Bearer ${isAuthenticated}`,
            },
          });
          setIsAdmin(response.data.is_admin);
        } catch (error) {
          console.error("Error fetching user role", error);
        }
      }
    };
    fetchUserRole();
  }, [isAuthenticated]);

  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  const handleLogout = () => {
    localStorage.removeItem(ACCESS_TOKEN);
    navigate("/login", { replace: true });
  };

  const handleChangePassword = async () => {
    setError("");
    setSuccess("");
    try {
      await api.put(
        "/change-password",
        { current_password: currentPassword, new_password: newPassword },
        { headers: { Authorization: `Bearer ${isAuthenticated}` } }
      );
      setSuccess("Password updated successfully! Redirecting to login...");
      setTimeout(() => {
        handleLogout();
      }, 2000);
    } catch (error) {
      setError(error.response?.data?.message || "Failed to change password");
    }
  };

  return (
    <nav className="bg-white shadow-md dark:bg-gray-900 p-4 rounded-lg m-4">
      <div className="max-w-screen-xl mx-auto flex justify-between items-center">
        {/* Logo */}
        <Link to="/" className="text-2xl font-bold text-blue-600 dark:text-white">
          OrderTracker
        </Link>

        {/* Navigation Links */}
        <div className="flex space-x-6 items-center">
          {isAuthenticated ? (
            <>
              <Link to="/" className="text-gray-700 hover:text-blue-600 dark:text-gray-300 dark:hover:text-blue-400">
                Dashboard
              </Link>
              <Link to="/orders" className="text-gray-700 hover:text-blue-600 dark:text-gray-300 dark:hover:text-blue-400">
                Orders
              </Link>
              <Link to="/order-history" className="text-gray-700 hover:text-blue-600 dark:text-gray-300 dark:hover:text-blue-400">
                Order History
              </Link>
              <Link to="/place-order" className="text-gray-700 hover:text-blue-600 dark:text-gray-300 dark:hover:text-blue-400">
                Place Order
              </Link>

              {/* Add Shipments Link */}
              <Link to="/shipments" className="text-gray-700 hover:text-blue-600 dark:text-gray-300 dark:hover:text-blue-400">
                Shipments
              </Link>

              {/* Show "Manage Orders" if the user is an admin */}
              {isAdmin && (
                <Link to="/admin/orders" className="text-gray-700 hover:text-blue-600 dark:text-gray-300 dark:hover:text-blue-400">
                  Manage Orders
                </Link>
              )}

              {/* Profile Dropdown */}
              <div className="relative">
                <button onClick={toggleDropdown} className="flex text-sm bg-gray-800 rounded-full focus:ring-4 focus:ring-gray-300 dark:focus:ring-gray-600">
                  <img className="w-8 h-8 rounded-full" src="/images/user-placeholder.png" alt="User" />
                </button>
                {isDropdownOpen && (
                  <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-700 rounded-lg shadow-lg py-2">
                    <Link to="/profile" className="block px-4 py-2 text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-600">
                      Profile
                    </Link>
                    <button
                      onClick={() => setShowChangePassword(true)}
                      className="block w-full text-left px-4 py-2 text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-600"
                    >
                      Change Password
                    </button>
                    <button
                      onClick={handleLogout}
                      className="block w-full text-left px-4 py-2 text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-600"
                    >
                      Logout
                    </button>
                  </div>
                )}
              </div>
            </>
          ) : (
            <>
              <Link to="/login" className="text-gray-700 hover:text-blue-600 dark:text-gray-300 dark:hover:text-blue-400">
                Login
              </Link>
              <Link to="/register" className="text-gray-700 hover:text-blue-600 dark:text-gray-300 dark:hover:text-blue-400">
                Register
              </Link>
            </>
          )}
        </div>
      </div>

      {/* Change Password Modal */}
      {showChangePassword && (
        <div className="fixed inset-0 flex items-center justify-center bg-gray-900 bg-opacity-50">
          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg w-96">
            <h2 className="text-xl font-semibold text-gray-800 dark:text-white mb-4">Change Password</h2>
            {error && <p className="text-red-500 text-sm mb-2">{error}</p>}
            {success && <p className="text-green-500 text-sm mb-2">{success}</p>}
            <input
              type="password"
              placeholder="Current Password"
              className="w-full p-2 mb-3 border rounded dark:bg-gray-700 dark:text-white"
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
            />
            <input
              type="password"
              placeholder="New Password"
              className="w-full p-2 mb-3 border rounded dark:bg-gray-700 dark:text-white"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
            />
            <div className="flex justify-end space-x-2">
              <button
                onClick={() => setShowChangePassword(false)}
                className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600"
              >
                Cancel
              </button>
              <button
                onClick={handleChangePassword}
                className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
              >
                Update
              </button>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
}

export default Navbar;
