import { useState } from "react";
import API from "../../services/api";

export default function Sales() {
  const [productId, setProductId] = useState("");
  const [quantity, setQuantity] = useState("");

  const handleSale = async (e) => {
    e.preventDefault();
    try {
      const res = await API.post("/sales", { productId, quantity });
      alert(`Sale recorded: KES ${res.data.amount}`);
    } catch (err) {
      alert("Error: " + (err.response?.data?.error || err.message));
    }
  };

  return (
    <div>
      <h2>Sales</h2>
      <form onSubmit={handleSale}>
        <input
          type="text"
          placeholder="Product ID"
          value={productId}
          onChange={(e) => setProductId(e.target.value)}
        />
        <input
          type="number"
          placeholder="Quantity"
          value={quantity}
          onChange={(e) => setQuantity(e.target.value)}
        />
        <button type="submit">Record Sale</button>
      </form>
    </div>
  );
}
