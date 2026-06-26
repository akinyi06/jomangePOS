import { useState, useEffect } from "react";
import API from "../../services/api";

export default function Cash() {
  const [transactions, setTransactions] = useState([]);
  const [form, setForm] = useState({
    type: "income",
    amount: "",
    remarks: ""
  });

  useEffect(() => {
    const fetchCash = async () => {
      const res = await API.get("/cash");
      setTransactions(res.data);
    };
    fetchCash();
  }, []);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await API.post("/cash", form);
      alert(`Cash transaction recorded: KES ${form.amount}`);
      const res = await API.get("/cash");
      setTransactions(res.data);
    } catch (err) {
      alert("Error: " + (err.response?.data?.error || err.message));
    }
  };

  return (
    <div>
      <h2>Cash Transactions</h2>
      <form onSubmit={handleSubmit}>
        <select name="type" value={form.type} onChange={handleChange}>
          <option value="income">Income</option>
          <option value="expense">Expense</option>
        </select>
        <input
          name="amount"
          type="number"
          placeholder="Amount (KES)"
          value={form.amount}
          onChange={handleChange}
        />
        <input
          name="remarks"
          placeholder="Remarks"
          value={form.remarks}
          onChange={handleChange}
        />
        <button type="submit">Record Transaction</button>
      </form>

      <ul>
        {transactions.map((t) => (
          <li key={t.id}>
            {t.type.toUpperCase()} — KES {t.amount} ({t.remarks})
          </li>
        ))}
      </ul>
    </div>
  );
}
