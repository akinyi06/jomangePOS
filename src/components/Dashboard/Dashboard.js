import { useEffect, useState } from "react";
import API from "../../services/api";

export default function Dashboard() {
  const [inventory, setInventory] = useState({ totalProducts: 0, totalStock: 0, lowStock: [] });
  const [activity, setActivity] = useState([]);
  const [sales, setSales] = useState({ revenue: 0, items: 0 });

  useEffect(() => {
    API.get("/reports/inventorysummary").then(res => setInventory(res.data));
    API.get("/audit").then(res => setActivity(res.data.slice(0,5)));
    API.get("/reports/today").then(res => setSales(res.data));
    API.get("/cash/summary").then(res=>{
      setSales(prev=>({...prev,revenue:res.data.revenue}));
    });
  }, []);
//2550 
  return (
    <div className="dashboard">
      <h2>POS Dashboard</h2>

      {/* Inventory Summary */}
      <h3>Inventory Summary</h3>
      <table className="styled-table">
        <thead>
          <tr>
            <th>Metric</th>
            <th>Value</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>Total Products</td>
            <td>{inventory.totalProducts}</td>
          </tr>
          <tr>
            <td>Total Stock Units</td>
            <td>{inventory.totalStock}</td>
          </tr>
        </tbody>
      </table>

      {/* Low Stock Alerts */}
      <h3>Low Stock Alerts</h3>
      <table className="styled-table">
        <thead>
          <tr>
            <th>Product</th>
            <th>Stock</th>
          </tr>
        </thead>
        <tbody>
          {inventory.lowStock.map(p => (
            <tr key={p.id}>
              <td>{p.name}</td>
              <td>{p.stock}</td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Today’s Sales Snapshot */}
      <h3>Today’s Sales Snapshot</h3>
      <table className="styled-table">
        <thead>
          <tr>
            <th>Metric</th>
            <th>Value</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>Revenue</td>
            <td>KES {sales.revenue}</td>
          </tr>
          <tr>
            <td>Items Sold</td>
            <td>{sales.items}</td>
          </tr>
        </tbody>
      </table>

      {/* Recent Activity */}
      <h3>Recent Activity</h3>
      <table className="styled-table">
        <thead>
          <tr>
            <th>Time</th>
            <th>User</th>
            <th>Action</th>
            <th>Details</th>
          </tr>
        </thead>
        <tbody>
          {activity.map(a => (
            <tr key={a.id}>
              <td>{new Date(a.createdat).toLocaleString()}</td>
              <td>{a.username}</td>
              <td>{a.action}</td>
              <td>{a.details}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
