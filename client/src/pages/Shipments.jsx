import React, { useState } from "react";
import { useShipment } from "../contexts/ShipmentContext";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

function Shipments() {
  const { shipments, loading, error, getShipmentById } = useShipment();
  const [selectedShipment, setSelectedShipment] = useState(null);

  if (loading) return <p className="text-center">Loading shipments...</p>;
  if (error) return <p className="text-center text-red-500">{error}</p>;

  return (
    <>
  <Navbar />
  <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 dark:bg-gray-900 px-4">
    <div className="w-full max-w-4xl bg-white dark:bg-gray-800 shadow-lg rounded-xl p-6 border border-gray-200 dark:border-gray-700">
      {/* Page Title */}
      <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-6 text-center">
        Shipments
      </h2>

      {/* No Shipments Message */}
      {shipments.length === 0 ? (
        <p className="text-center text-gray-700 dark:text-gray-300">No shipments found.</p>
      ) : (
        <ul className="space-y-4">
          {shipments.map((shipment) => (
            <li
              key={shipment.id}
              className="p-4 border border-gray-300 dark:border-gray-700 rounded-lg shadow-lg bg-gray-50 dark:bg-gray-800"
            >
              <p className="text-gray-700 dark:text-gray-300">
                <strong>Shipment ID:</strong> {shipment.id}
              </p>
              <p className="text-gray-700 dark:text-gray-300">
                <strong>Order ID:</strong> {shipment.orderId || "N/A"}
              </p>
              <p className="text-gray-700 dark:text-gray-300">
                <strong>Tracking Number:</strong> {shipment.trackingNumber || "N/A"}
              </p>
              <p className="text-gray-700 dark:text-gray-300">
                <strong>Shipped Date:</strong>{" "}
                {shipment.shippedDate
                  ? new Date(shipment.shippedDate).toLocaleDateString()
                  : "N/A"}
              </p>
              <p className="text-gray-700 dark:text-gray-300">
                <strong>Delivery Date:</strong>{" "}
                {shipment.deliveryDate
                  ? new Date(shipment.deliveryDate).toLocaleDateString()
                  : "N/A"}
              </p>

              <button
                className="mt-2 bg-blue-600 hover:bg-blue-800 transition duration-300 text-white px-4 py-2 rounded-lg shadow-md focus:ring-4 focus:ring-blue-300 dark:focus:ring-blue-900"
                onClick={async () => {
                  const shipmentDetails = await getShipmentById(shipment.id);
                  setSelectedShipment(shipmentDetails);
                }}
              >
                View Details
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  </div>

  {/* Shipment Details Modal */}
  {selectedShipment && (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg max-w-md w-full border border-gray-300 dark:border-gray-700">
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
          Shipment Details
        </h2>

        <p className="text-gray-700 dark:text-gray-300">
          <strong>ID:</strong> {selectedShipment.id}
        </p>
        <p className="text-gray-700 dark:text-gray-300">
          <strong>Order ID:</strong> {selectedShipment.orderId}
        </p>
        <p className="text-gray-700 dark:text-gray-300">
          <strong>Tracking Number:</strong> {selectedShipment.trackingNumber}
        </p>
        <p className="text-gray-700 dark:text-gray-300">
          <strong>Shipped Date:</strong>{" "}
          {new Date(selectedShipment.shippedDate).toLocaleDateString()}
        </p>
        <p className="text-gray-700 dark:text-gray-300">
          <strong>Delivery Date:</strong>{" "}
          {new Date(selectedShipment.deliveryDate).toLocaleDateString()}
        </p>

        <button
          className="mt-4 bg-gray-500 hover:bg-gray-600 transition duration-300 text-white py-2 px-4 rounded-lg"
          onClick={() => setSelectedShipment(null)}
        >
          Close
        </button>
      </div>
    </div>
  )}

  <Footer />
</>

  );
}

export default Shipments;
