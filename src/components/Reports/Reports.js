import { useEffect, useState, useContext } from "react";
import API from "../../services/api";
import { AuthContext } from "../../context/AuthContext";

export default function Reports() {
  const { user } = useContext(AuthContext);
  const [daily, setDaily] = useState([]);
  const [weekly, setWeekly] = useState([]);
  const [monthly, setMonthly] = useState([]);
  const [alltime, setAlltime] = useState({});

  useEffect(() => {
    if (user?.role === "ADMIN") {
      API.get("/reports/daily").then((res) => setDaily(res.data));
      API.get("/reports/weekly").then((res) => setWeekly(res.data));
      API.get("/reports/monthly").then((res) => setMonthly(res.data));
      API.get("/reports/alltime").then((res) => setAlltime(res.data));
    }
  }, [user]);

  if (user?.role !== "ADMIN") return <p>Reports are admin-only</p>;

  return (
    <div>
      <h2>Reports</h2>
      <h3>Daily</h3>
      <ul>{daily.map((r, i) => <li key={i}>{r.day}: {r.revenue} revenue, {r.items_sold} items</li>)}</ul>
      <h3>Weekly</h3>
      <ul>{weekly.map((r, i) => <li key={i}>{r.week}: {r.revenue} revenue, {r.items_sold} items</li>)}</ul>
      <h3>Monthly</h3>
      <ul>{monthly.map((r, i) => <li key={i}>{r.month}: {r.revenue} revenue, {r.items_sold} items</li>)}</ul>
      <h3>All Time</h3>
      <p>{alltime.revenue} revenue, {alltime.items_sold} items</p>
    </div>
  );
}
