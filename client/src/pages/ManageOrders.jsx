import React, { useEffect, useState } from "react";
import api from "../api";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

function ManageOrders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [newStatus, setNewStatus] = useState("");

  const token = localStorage.getItem("access_token");

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    setLoading(true);
    try {
      const response = await api.get("/orders", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setOrders(response.data);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to fetch orders");
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateClick = (order) => {
    setSelectedOrder(order);
    setNewStatus(order.status);
    setIsModalOpen(true);
  };

  const handleUpdateSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.put(
        `/orders/${selectedOrder.id}`,
        { status: newStatus },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setIsModalOpen(false);
      fetchOrders();
    } catch (err) {
      alert("Failed to update order status");
    }
  };

  if (loading) return <p className="text-center">Loading orders...</p>;
  if (error) return <p className="text-center text-red-500">{error}</p>;

  return (
    <>
      <Navbar />
      <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 dark:bg-gray-900 px-4">
        <div className="w-full max-w-4xl bg-white dark:bg-gray-800 shadow-lg rounded-xl p-6 border border-gray-200 dark:border-gray-700">
          {/* Page Title */}
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-6 text-center">
            Manage Order Status
          </h2>

          {/* No Orders Message */}
          {orders.length === 0 ? (
            <p className="text-center text-gray-700 dark:text-gray-300">
              No orders found.
            </p>
          ) : (
            <ul className="space-y-4">
              {orders.map((order) => (
                <li
                  key={order.id}
                  className="p-4 border border-gray-300 dark:border-gray-700 rounded-lg shadow-lg bg-gray-50 dark:bg-gray-800"
                >
                  <p className="text-gray-700 dark:text-gray-300">
                    <strong>Order ID:</strong> {order.id}
                  </p>
                  <p className="text-gray-700 dark:text-gray-300">
                    <strong>Product:</strong> {order.product}
                  </p>
                  <p className="text-gray-700 dark:text-gray-300">
                    <strong>Quantity:</strong> {order.quantity}
                  </p>
                  <p className="text-gray-700 dark:text-gray-300">
                    <strong>Status:</strong> {order.status}
                  </p>

                  <button
                    className="mt-2 bg-blue-600 hover:bg-blue-800 transition duration-300 text-white px-4 py-2 rounded-lg shadow-md focus:ring-4 focus:ring-blue-300 dark:focus:ring-blue-900"
                    onClick={() => handleUpdateClick(order)}
                  >
                    Update Status
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>

      {/* Update Order Status Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg max-w-md w-full border border-gray-300 dark:border-gray-700">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
              Update Order Status
            </h2>

            <form onSubmit={handleUpdateSubmit}>
              <label className="block text-gray-700 dark:text-gray-300">
                Status
              </label>
              <select
                value={newStatus}
                onChange={(e) => setNewStatus(e.target.value)}
                className="w-full p-2 border rounded mb-4 bg-gray-50 dark:bg-gray-700 dark:text-white"
              >
                <option value="Pending">Pending</option>
                <option value="Shipped">Shipped</option>
                <option value="Delivered">Delivered</option>
              </select>

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

export default ManageOrders;
