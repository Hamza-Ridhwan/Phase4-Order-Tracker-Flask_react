import React, { useState } from "react";
import { useOrders } from "../contexts/OrdersContext";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

function PlaceOrder() {
  const { createOrder } = useOrders();
  const navigate = useNavigate();
  const [product, setProduct] = useState("");
  const [quantity, setQuantity] = useState(1);
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await createOrder({ product, quantity });
      navigate("/orders");
    } catch (error) {
      setError("Failed to place order.");
    }
  };

  return (
    <>
      <Navbar />
      <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 dark:bg-gray-900 px-4 mx-4 rounded-lg">
        <div className="w-full max-w-4xl bg-white dark:bg-gray-800 shadow-lg rounded-xl p-6 border border-gray-200 dark:border-gray-700">
          {/* Page Title */}
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-6 text-center">
            Place Order
          </h2>

          {/* Error Message */}
          {error && <p className="text-red-500 text-center mb-4">{error}</p>}

          {/* Order Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Product Name Input */}
            <div>
              <label className="block text-gray-700 dark:text-gray-300 font-medium mb-1">
                Product Name
              </label>
              <input
                type="text"
                placeholder="Enter product name"
                className="w-full h-12 px-4 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-900 dark:bg-gray-700 dark:text-white focus:ring-2 focus:ring-blue-500"
                value={product}
                onChange={(e) => setProduct(e.target.value)}
                required
              />
            </div>

            {/* Quantity Input */}
            <div>
              <label className="block text-gray-700 dark:text-gray-300 font-medium mb-1">
                Quantity
              </label>
              <input
                type="number"
                placeholder="Enter quantity"
                className="w-full h-12 px-4 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-900 dark:bg-gray-700 dark:text-white focus:ring-2 focus:ring-blue-500"
                value={quantity}
                onChange={(e) => setQuantity(e.target.value)}
                required
              />
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              className="w-full h-12 rounded-lg bg-blue-600 hover:bg-blue-800 transition duration-300 text-white text-lg font-semibold shadow-md focus:ring-4 focus:ring-blue-300 dark:focus:ring-blue-900"
            >
              Place Order
            </button>
          </form>
        </div>
      </div>
      <Footer />
    </>
  );
}

export default PlaceOrder;
