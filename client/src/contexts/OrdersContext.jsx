import { createContext, useContext, useState, useEffect } from "react";
import api from "../api";
import { ACCESS_TOKEN } from "../constants";

const OrdersContext = createContext();

export const OrdersProvider = ({ children }) => {
  const [orders, setOrders] = useState([]);
  const token = localStorage.getItem(ACCESS_TOKEN);

  // Fetch all orders (Admin gets all, users get their own)
  const fetchOrders = async () => {
    try {
      const response = await api.get("/orders", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setOrders(response.data);
    } catch (error) {
      console.error("Error fetching orders:", error.response?.data?.message);
    }
  };

  // Create a new order
  const createOrder = async (orderData) => {
    try {
      const response = await api.post("/orders", orderData, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setOrders((prev) => [...prev, response.data]); // Add new order to state
      return response.data;
    } catch (error) {
      console.error("Error creating order:", error.response?.data?.message);
      throw error;
    }
  };

  // Get a single order by ID
  const getOrderById = async (orderId) => {
    try {
      const response = await api.get(`/orders/${orderId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      return response.data;
    } catch (error) {
      console.error("Error fetching order:", error.response?.data?.message);
      throw error;
    }
  };

  // Update order (Admins can update status)
  const updateOrder = async (orderId, updatedData) => {
    try {
      const response = await api.put(`/orders/${orderId}`, updatedData, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setOrders((prev) =>
        prev.map((order) => (order.id === orderId ? response.data : order))
      );
      return response.data;
    } catch (error) {
      console.error("Error updating order:", error.response?.data?.message);
      throw error;
    }
  };

  // Rate an order
  const rateOrder = async (orderId, rating) => {
    try {
      await api.put(
        `/orders/${orderId}/rate`,
        { rating },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setOrders((prev) =>
        prev.map((order) =>
          order.id === orderId ? { ...order, rating } : order
        )
      );
    } catch (error) {
      console.error("Error rating order:", error.response?.data?.message);
      throw error;
    }
  };

  // Delete an order
  const deleteOrder = async (orderId) => {
    try {
      await api.delete(`/orders/${orderId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setOrders((prev) => prev.filter((order) => order.id !== orderId));
    } catch (error) {
      console.error("Error deleting order:", error.response?.data?.message);
      throw error;
    }
  };

  useEffect(() => {
    if (token) fetchOrders();
  }, [token]);

  return (
    <OrdersContext.Provider
      value={{
        orders,
        fetchOrders,
        createOrder,
        getOrderById,
        updateOrder,
        rateOrder,
        deleteOrder,
      }}
    >
      {children}
    </OrdersContext.Provider>
  );
};

export const useOrders = () => useContext(OrdersContext);
