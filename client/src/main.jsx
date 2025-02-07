import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";
import { BrowserRouter } from "react-router-dom";
import { OrdersProvider } from "./contexts/OrdersContext";
import { ShipmentProvider } from "./contexts/ShipmentContext";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <BrowserRouter>
      <OrdersProvider>
        <ShipmentProvider>
          <App />
        </ShipmentProvider>
      </OrdersProvider>
    </BrowserRouter>
  </StrictMode>
);
