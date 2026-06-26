import React, { useContext } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider, AuthContext } from "./context/AuthContext";
import Login from "./components/Auth/Login";
import Dashboard from "./components/Dashboard/Dashboard";
import Products from "./components/Products/Products";
import Sales from "./components/Sales/Sales";
import Inventory from "./components/Inventory/Inventory";
import Cash from "./components/Cash/Cash";
import Users from "./components/Users/Users";
import Audit from "./components/Audit/Audit";
import Layout from "./components/Layout/Layout";

function AppContent() {
  const { auth } = useContext(AuthContext);

  return (
    <BrowserRouter>
      {!auth ? (
        <Login />
      ) : (
       <Routes>
  <Route path="/" element={<Layout><Dashboard /></Layout>} />
  <Route path="/products" element={<Layout><Products /></Layout>} />
  <Route path="/sales" element={<Layout><Sales /></Layout>} />
  <Route path="/inventory" element={<Layout><Inventory /></Layout>} />
  <Route path="/cash" element={<Layout><Cash /></Layout>} />
  <Route path="/users" element={<Layout><Users /></Layout>} />
  <Route path="/audit" element={<Layout><Audit /></Layout>} />
</Routes>
      )}
    </BrowserRouter>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}
