import { useEffect, useState } from "react";
import API from "../../services/api";

export default function SalesForm() {
  const [products, setProducts] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState("");
  const [quantity, setQuantity] = useState(1);
  const [sales, setSales] = useState([]); // ✅ add sales state

  useEffect(() => {
    API.get("/products").then(res => setProducts(res.data));
    API.get("/sales").then(res => setSales(res.data)); // ✅ fetch sales
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await API.post("/sales", {
        productId: parseInt(selectedProduct),
        quantity: parseInt(quantity)
      });
      alert("Sale recorded successfully!");
      // ✅ refresh sales after new record
      const res = await API.get("/sales");
      setSales(res.data);
    } catch (err) {
      alert("Error: " + (err.response?.data?.error || err.message));
    }
  };

  return (
    <div>
      <form onSubmit={handleSubmit}>
        <label>Product:</label>
        <select
          value={selectedProduct}
          onChange={(e) => setSelectedProduct(e.target.value)}
          required
        >
          <option value="">-- Select Product --</option>
          {products.map(p => (
            <option key={p.id} value={p.id}>
              {p.name}
            </option>
          ))}
        </select>

        <label>Quantity:</label>
        <input
          type="number"
          value={quantity}
          min="1"
          onChange={(e) => setQuantity(e.target.value)}
          required
        />

        <button type="submit">Record Sale</button>
      </form>

      {/* ✅ Styled table for sales */}
      <h2>Sales Records</h2>
      <table className="styled-table">
        <thead>
          <tr>
            <th>Product</th>
            <th>Quantity</th>
            <th>Amount</th>
            <th>Date</th>
          </tr>
        </thead>
        <tbody>
          {sales.map((s) => (
            <tr key={s.id}>
              <td>{s.productname}</td>
              <td>{s.quantity}</td>
              <td className={s.amount > 5000 ? "income" : ""}>
                KES {s.amount}
              </td>
              <td>{new Date(s.createdat).toLocaleString()}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
