import { useState, useEffect } from "react";
import API from "../../services/api";

export default function Audit() {
  const [logs, setLogs] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchLogs = async () => {
      try {
        const res = await API.get("/audit");
        setLogs(res.data);
      } catch (err) {
        setError(err.response?.data?.error || "Failed to load audit logs");
      }
    };
    fetchLogs();
  }, []);

  if (error) return <div>Error: {error}</div>;

  return (
    <div>
      <h2>Audit Logs</h2>
      <ul>
        {logs.map((log) => (
          <li key={log.id}>
            [{new Date(log.createdat).toLocaleString()}] {log.username} — {log.action}: {log.details}
          </li>
        ))}
      </ul>
    </div>
  );
}
