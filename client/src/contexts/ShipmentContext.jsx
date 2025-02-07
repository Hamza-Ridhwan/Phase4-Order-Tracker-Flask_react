import { createContext, useContext, useState, useEffect } from "react";
import api from "../api";

const ShipmentContext = createContext();

export const useShipment = () => useContext(ShipmentContext);

export const ShipmentProvider = ({ children }) => {
  const [shipments, setShipments] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const token = localStorage.getItem("access_token");

  // ✅ Fetch all shipments
  const getShipments = async () => {
    setLoading(true);
    try {
      const response = await api.get("/shipments", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setShipments(response.data);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to fetch shipments");
    } finally {
      setLoading(false);
    }
  };

  // ✅ Fetch shipment by ID
  const getShipmentById = async (shipmentId) => {
    setLoading(true);
    try {
      const response = await api.get(`/shipments/${shipmentId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      return response.data;
    } catch (err) {
      setError(err.response?.data?.message || "Shipment not found");
      return null;
    } finally {
      setLoading(false);
    }
  };

  // Fetch shipments on component mount
  useEffect(() => {
    getShipments();
  }, []);

  return (
    <ShipmentContext.Provider value={{ shipments, loading, error, getShipments, getShipmentById }}>
      {children}
    </ShipmentContext.Provider>
  );
};
