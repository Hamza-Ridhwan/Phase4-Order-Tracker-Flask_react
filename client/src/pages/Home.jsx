import React from "react";
import { Link } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

function Home() {
  return (
    <>
      <div className="min-h-screen flex flex-col">
        <Navbar />

        {/* Main Content */}
        <main className="flex-grow">
          {/* Hero Section */}
          <section className="bg-gray-100 dark:bg-gray-900 py-16 text-center mx-4 my-8 rounded-lg">
            <div className="max-w-4xl mx-auto px-4">
              <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
                Welcome to Flowbite Order Tracker
              </h1>
              <p className="text-lg text-gray-600 dark:text-gray-300 mb-6">
                Track your orders seamlessly with our efficient and easy-to-use
                order tracking system.
              </p>
              <Link
                to="/place-order"
                className="bg-blue-600 text-white px-6 py-3 rounded-lg text-lg font-medium hover:bg-blue-700 transition"
              >
                Get Started
              </Link>
            </div>
          </section>

          {/* Features Section */}
          <section className="py-16 px-4">
            <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8">
              {/* Feature 1 */}
              <div className="bg-white dark:bg-gray-900 p-6 rounded-lg shadow-lg text-center">
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                  Real-time Tracking
                </h3>
                <p className="text-gray-600 dark:text-gray-400">
                  Stay updated with real-time tracking of your orders.
                </p>
              </div>

              {/* Feature 2 */}
              <div className="bg-white dark:bg-gray-900 p-6 rounded-lg shadow-lg text-center">
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                  Order History
                </h3>
                <p className="text-gray-600 dark:text-gray-400">
                  View and manage your past orders with ease.
                </p>
              </div>

              {/* Feature 3 */}
              <div className="bg-white dark:bg-gray-900 p-6 rounded-lg shadow-lg text-center">
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                  Secure & Reliable
                </h3>
                <p className="text-gray-600 dark:text-gray-400">
                  Your order details are safe with our secure system.
                </p>
              </div>

              {/* Feature 4 */}
              <div className="bg-white dark:bg-gray-900 p-6 rounded-lg shadow-lg text-center">
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                  Order Notifications
                </h3>
                <p className="text-gray-600 dark:text-gray-400">
                  Get instant alerts and notifications about your order status.
                </p>
              </div>

              {/* Feature 5 */}
              <div className="bg-white dark:bg-gray-900 p-6 rounded-lg shadow-lg text-center">
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                  Easy Order Modifications
                </h3>
                <p className="text-gray-600 dark:text-gray-400">
                  Modify or cancel your order hassle-free before it ships.
                </p>
              </div>

              {/* Feature 6 */}
              <div className="bg-white dark:bg-gray-900 p-6 rounded-lg shadow-lg text-center">
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                  Multi-device Access
                </h3>
                <p className="text-gray-600 dark:text-gray-400">
                  Track your orders from any device, anytime, anywhere.
                </p>
              </div>
            </div>
          </section>
        </main>

        <Footer />
      </div>
    </>
  );
}

export default Home;
