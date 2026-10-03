import { BrowserRouter, Routes, Route } from "react-router-dom";

import Login from "./pages/login";
import Register from "./pages/Register";
import ForgotPassword from "./pages/ForgotPassword";
import Dashboard from "./pages/Dashboard";
import Products from "./pages/Products";
import Account from "./pages/Account";
import Inventory from "./pages/Inventory";
import Orders from "./pages/Orders";
import Reports from "./pages/Reports";
import Warehouse from "./pages/Warehouse";

import "./App.css";

function App() {
  return (
    <BrowserRouter>
      <Routes>

        <Route path="/" element={<Login />} />

        <Route path="/login" element={<Login />} />

        <Route path="/register" element={<Register />} />

        <Route
          path="/forgot-password"
          element={<ForgotPassword />}
        />

        <Route
          path="/dashboard"
          element={<Dashboard />}
        />

        <Route
          path="/products"
          element={<Products />}
        />

        <Route
          path="/account"
          element={<Account />}
        />
        <Route 
        path="/inventory" 
        element={<Inventory />} 
        />
        <Route 
        path="/orders" 
        element={<Orders />} 
        />
        <Route 
        path="/reports" 
        element={<Reports />} 
        />
        <Route path="/warehouse" element={<Warehouse />} />

      </Routes>
    </BrowserRouter>
  );
}

export default App;