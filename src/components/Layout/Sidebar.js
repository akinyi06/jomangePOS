import React from "react";
import { Link } from "react-router-dom";

export default function Sidebar() {
  return (
    <div className="sidebar">
      <h2>Liquor POS</h2>
      <nav>
        <Link to="/">Dashboard</Link>
        <Link to="/products">Products</Link>
        <Link to="/sales">Sales</Link>
        <Link to="/inventory">Inventory</Link>
        <Link to="/cash">Cash</Link>
        <Link to="/users">Users</Link>
        <Link to="/audit">Audit</Link>
      </nav>
    </div>
  );
}
