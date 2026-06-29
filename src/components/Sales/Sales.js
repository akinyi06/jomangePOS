import { useEffect, useState } from "react";
import API from "../../services/api";

export default function SalesForm() {
  const [products, setProducts] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState("");
  const [quantity, setQuantity] = useState(1);

  useEffect(() => {
    API.get("/products").then(res => setProducts(res.data));
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    await API.post("/sales", {
      product_id: selectedProduct,
      quantity: quantity
    });
    alert("Sale recorded successfully!");
  };

  return (
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
  );
}
