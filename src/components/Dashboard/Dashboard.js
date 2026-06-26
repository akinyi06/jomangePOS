import { useEffect, useState } from "react";
import API from "../../services/api";
import { Line } from "react-chartjs-2";
import "chart.js/auto";

export default function Dashboard() {
  const [summary, setSummary] = useState({ revenue: 0, items_sold: 0 });
  const [daily, setDaily] = useState([]);
  const [cash, setCash] = useState(0);
  const [lowStock, setLowStock] = useState([]);
  const [audit, setAudit] = useState([]);

  useEffect(() => {
    API.get("/reports/alltime").then(res => setSummary(res.data));
    API.get("/reports/daily").then(res => setDaily(res.data));
    API.get("/reports/cashbalance").then(res => setCash(res.data.balance));
    API.get("/products").then(res => setLowStock(res.data.filter(p => p.stock < 5)));
    API.get("/audit").then(res => setAudit(res.data.slice(0,5)));
  }, []);

  const chartData = {
    labels: daily.map(d => d.day),
    datasets: [
      {
        label: "Daily Sales (KES)",
        data: daily.map(d => d.revenue),
        borderColor: "#4CAF50",
        backgroundColor: "rgba(76, 175, 80, 0.2)",
        fill: true,
      },
    ],
  };

  return (
    <div className="dashboard">
      <h2>POS Dashboard</h2>
      <div className="cards">
        <div className="card">Total Revenue: KES {summary.revenue}</div>
        <div className="card">Items Sold: {summary.items_sold}</div>
        <div className="card">Cash Balance: KES {cash}</div>
      </div>

      <div className="chart">
        <Line data={chartData} />
      </div>

      <h3>Low Stock Alerts</h3>
      <ul>
        {lowStock.map(p => (
          <li key={p.id}>{p.name} — Stock: {p.stock}</li>
        ))}
      </ul>

      <h3>Recent Audit Logs</h3>
      <ul>
        {audit.map(a => (
          <li key={a.id}>
            [{new Date(a.createdat).toLocaleString()}] {a.username} — {a.action}: {a.details}
          </li>
        ))}
      </ul>
    </div>
  );
}
