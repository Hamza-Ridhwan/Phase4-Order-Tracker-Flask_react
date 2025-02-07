import React, { useEffect } from "react";
import { useOrders } from "../contexts/OrdersContext";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

function OrderHistory() {
  const { orders, fetchOrders } = useOrders();

  useEffect(() => {
    fetchOrders();
  }, []);

  return (
    <>
      <Navbar />
      <div className="max-w-5xl mx-auto p-6 min-h-screen h-full flex flex-col bg-gray-100 dark:bg-gray-900 rounded-lg mx-auto">
        {/* Page Title */}
        <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-6 text-center">
          Order History
        </h2>

        {/* Order History Table */}
        {orders.length === 0 ? (
          <p className="text-lg text-gray-600 dark:text-gray-300 text-center">
            No orders found.
          </p>
        ) : (
          <div className="overflow-x-auto flex-grow">
            <table className="w-full border-collapse shadow-lg rounded-lg bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700">
              <thead>
                <tr className="bg-gray-200 dark:bg-gray-700 text-gray-900 dark:text-white">
                  <th className="border border-gray-300 dark:border-gray-600 p-3">
                    Order ID
                  </th>
                  <th className="border border-gray-300 dark:border-gray-600 p-3">
                    Product
                  </th>
                  <th className="border border-gray-300 dark:border-gray-600 p-3">
                    Quantity
                  </th>
                  <th className="border border-gray-300 dark:border-gray-600 p-3">
                    Status
                  </th>
                  <th className="border border-gray-300 dark:border-gray-600 p-3">
                    Rating
                  </th>
                </tr>
              </thead>
              <tbody>
                {orders.map((order) => (
                  <tr
                    key={order.id}
                    className="border border-gray-300 dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-700 transition"
                  >
                    <td className="border border-gray-300 dark:border-gray-600 p-3 text-gray-900 dark:text-white">
                      {order.id}
                    </td>
                    <td className="border border-gray-300 dark:border-gray-600 p-3 text-gray-700 dark:text-gray-300">
                      {order.product}
                    </td>
                    <td className="border border-gray-300 dark:border-gray-600 p-3 text-gray-700 dark:text-gray-300">
                      {order.quantity}
                    </td>
                    <td
                      className={`border border-gray-300 dark:border-gray-600 p-3 font-semibold ${
                        order.status === "Delivered"
                          ? "text-green-600"
                          : order.status === "Processing"
                          ? "text-yellow-500"
                          : "text-red-500"
                      }`}
                    >
                      {order.status}
                    </td>
                    <td className="border border-gray-300 dark:border-gray-600 p-3 text-gray-700 dark:text-gray-300">
                      {order.rating ? order.rating : "Not Rated"}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
      <Footer />
    </>
  );
}

export default OrderHistory;
