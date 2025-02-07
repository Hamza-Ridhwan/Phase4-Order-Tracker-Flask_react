import { useState } from "react";
import api from "../api";
import { useNavigate } from "react-router-dom";
import { ACCESS_TOKEN, REFRESH_TOKEN } from "../constants";
import Navbar from "./Navbar";
import Footer from "./Footer";

function Form({ route, method }) {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const name = method === "login" ? "Login" : "Register";

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const payload =
        method === "login"
          ? { email, password }
          : { firstName, lastName, email, password };

      const res = await api.post(route, payload);

      if (method === "login") {
        localStorage.setItem(ACCESS_TOKEN, res.data.access_token);
        localStorage.setItem(REFRESH_TOKEN, res.data.refresh_token);
        navigate("/", { replace: true });
      } else {
        navigate("/login");
      }
    } catch (error) {
      alert("Error: " + (error.response?.data?.message || error.message));
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <div className="min-h-screen flex flex-col">
        <Navbar />

        <div className="flex items-center justify-center flex-grow bg-gray-100 dark:bg-gray-900 px-6 mx-5 rounded-lg">
          <form
            onSubmit={handleSubmit}
            className="w-full max-w-2xl p-8 bg-white shadow-lg rounded-2xl border border-gray-200 dark:bg-gray-800 dark:border-gray-700"
          >
            {/* First & Last Name (ONLY for Register) */}
            {method === "register" && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <div>
                  <label className="block mb-2 text-gray-700 text-sm font-medium dark:text-gray-300">
                    First Name
                  </label>
                  <input
                    type="text"
                    className="block w-full h-12 px-5 border border-gray-300 rounded-lg text-gray-900 focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white dark:border-gray-600"
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                    required
                  />
                </div>
                <div>
                  <label className="block mb-2 text-gray-700 text-sm font-medium dark:text-gray-300">
                    Last Name
                  </label>
                  <input
                    type="text"
                    className="block w-full h-12 px-5 border border-gray-300 rounded-lg text-gray-900 focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white dark:border-gray-600"
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                    required
                  />
                </div>
              </div>
            )}

            {/* Email Field */}
            <div className="mb-6">
              <label className="block mb-2 text-gray-700 text-sm font-medium dark:text-gray-300">
                Email Address
              </label>
              <input
                type="email"
                className="block w-full h-12 px-5 border border-gray-300 rounded-lg text-gray-900 focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white dark:border-gray-600"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            {/* Password & Confirm Password (ONLY for Register) */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <div>
                <label className="block mb-2 text-gray-700 text-sm font-medium dark:text-gray-300">
                  Password
                </label>
                <input
                  type="password"
                  className="block w-full h-12 px-5 border border-gray-300 rounded-lg text-gray-900 focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white dark:border-gray-600"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>
              {method === "register" && (
                <div>
                  <label className="block mb-2 text-gray-700 text-sm font-medium dark:text-gray-300">
                    Confirm Password
                  </label>
                  <input
                    type="password"
                    className="block w-full h-12 px-5 border border-gray-300 rounded-lg text-gray-900 focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white dark:border-gray-600"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    required
                  />
                </div>
              )}
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              className="w-full h-12 shadow-md rounded-lg bg-blue-600 hover:bg-blue-800 transition-all duration-500 text-white text-base font-semibold focus:ring-4 focus:ring-blue-300 dark:focus:ring-blue-900"
              disabled={loading}
            >
              {loading ? "Loading..." : name}
            </button>
          </form>
        </div>

        <Footer />
      </div>
    </>
  );
}

export default Form;
