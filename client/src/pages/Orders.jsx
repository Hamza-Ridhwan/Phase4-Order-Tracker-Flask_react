import React, { useEffect, useState } from "react";
import api from "../api";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

function Orders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [newProduct, setNewProduct] = useState("");
  const [newQuantity, setNewQuantity] = useState(1);
  const [rating, setRating] = useState(1);

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
    setNewProduct(order.product);
    setNewQuantity(order.quantity);
    setRating(order.rating || 1);
    setIsUpdateModalOpen(true);
  };

  const handleUpdateSubmit = async (e) => {
    e.preventDefault();
    try {
      const updateData = {
        product: newProduct,
        quantity: newQuantity,
      };

      // Include rating only if the order is Delivered
      if (selectedOrder.status === "Delivered") {
        updateData.rating = rating;
      }

      await api.put(`/orders/${selectedOrder.id}`, updateData, {
        headers: { Authorization: `Bearer ${token}` },
      });

      setIsUpdateModalOpen(false);
      fetchOrders();
    } catch (err) {
      alert("Failed to update order");
    }
  };

  const handleDeleteOrder = async (orderId) => {
    if (!window.confirm("Are you sure you want to delete this order?")) return;

    try {
      await api.delete(`/orders/${orderId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      fetchOrders();
    } catch (err) {
      alert("Failed to delete order");
    }
  };

  if (loading) return <p className="text-center">Loading orders...</p>;
  if (error) return <p className="text-center text-red-500">{error}</p>;

  return (
    <>
      <Navbar />
      <div className="max-w-4xl mx-auto p-6 min-h-screen bg-gray-100 dark:bg-gray-900 rounded-lg">
        <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-6 text-center">
          Your Orders
        </h2>

        {orders.length === 0 ? (
          <p className="text-lg text-gray-600 dark:text-gray-300 text-center">
            No orders found.
          </p>
        ) : (
          <ul className="space-y-6">
            {orders.map((order) => (
              <li
                key={order.id}
                className="p-6 border border-gray-300 dark:border-gray-700 rounded-lg shadow-lg bg-white dark:bg-gray-800"
              >
                <p className="text-lg font-semibold text-gray-800 dark:text-white">
                  <strong>Order ID:</strong> {order.id}
                </p>
                <p className="text-gray-700 dark:text-gray-300">
                  <strong>Product:</strong> {order.product}
                </p>
                <p className="text-gray-700 dark:text-gray-300">
                  <strong>Quantity:</strong> {order.quantity}
                </p>
                <p
                  className={`font-semibold ${
                    order.status === "Delivered"
                      ? "text-green-600"
                      : order.status === "Processing"
                      ? "text-yellow-500"
                      : "text-red-500"
                  }`}
                >
                  <strong>Status:</strong> {order.status}
                </p>
                {order.rating && (
                  <p className="text-yellow-500 font-semibold">
                    <strong>Rating:</strong> {order.rating} ⭐
                  </p>
                )}

                <div className="flex space-x-3 mt-4">
                  <button
                    className="w-32 py-2 rounded-lg bg-blue-600 hover:bg-blue-800 transition text-white font-medium"
                    onClick={() => handleUpdateClick(order)}
                  >
                    Update Order
                  </button>
                  <button
                    className="w-32 py-2 rounded-lg bg-red-600 hover:bg-red-800 transition text-white font-medium"
                    onClick={() => handleDeleteOrder(order.id)}
                  >
                    Delete Order
                  </button>
                </div>
              </li>
            ))}
          </ul>
        )}

        {/* Update Order Modal */}
        {isUpdateModalOpen && selectedOrder && (
          <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
            <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg w-full max-w-md">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
                Update Order
              </h2>
              <form onSubmit={handleUpdateSubmit}>
                <label className="block text-gray-700 dark:text-gray-300 mb-1">
                  Product
                </label>
                <input
                  type="text"
                  value={newProduct}
                  onChange={(e) => setNewProduct(e.target.value)}
                  className="w-full p-3 border border-gray-300 dark:border-gray-700 rounded-lg dark:bg-gray-700 dark:text-white mb-4"
                  required
                />

                <label className="block text-gray-700 dark:text-gray-300 mb-1">
                  Quantity
                </label>
                <input
                  type="number"
                  value={newQuantity}
                  onChange={(e) => setNewQuantity(e.target.value)}
                  className="w-full p-3 border border-gray-300 dark:border-gray-700 rounded-lg dark:bg-gray-700 dark:text-white mb-4"
                  required
                />

                {/* Rating Dropdown - Only for Delivered Orders */}
                {selectedOrder.status === "Delivered" && (
                  <>
                    <label className="block text-gray-700 dark:text-gray-300 mb-1">
                      Rate Order
                    </label>
                    <select
                      value={rating}
                      onChange={(e) => setRating(parseInt(e.target.value))}
                      className="w-full p-3 border border-gray-300 dark:border-gray-700 rounded-lg dark:bg-gray-700 dark:text-white mb-4"
                    >
                      {[1, 2, 3, 4, 5].map((num) => (
                        <option key={num} value={num}>
                          {num} ⭐
                        </option>
                      ))}
                    </select>
                  </>
                )}

                <div className="flex justify-between">
                  <button
                    type="button"
                    className="bg-gray-500 text-white py-2 px-4 rounded-lg hover:bg-gray-600"
                    onClick={() => setIsUpdateModalOpen(false)}
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-800"
                  >
                    Update Order
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
      <Footer />
    </>
  );
}

export default Orders;
