import { useState, useEffect } from "react";
import API from "../../services/api";

export default function Products() {
  const [products, setProducts] = useState([]);
  const [form, setForm] = useState({
    name: "",
    category: "",
    unit: "",
    stock: 0,
    buyingPrice: "",
    sellingPrice: ""
  });

  useEffect(() => {
    const fetchProducts = async () => {
      const res = await API.get("/products");
      setProducts(res.data);
    };
    fetchProducts();
  }, []);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await API.post("/products", form);
      alert("Product added!");
      setForm({ name: "", category: "", unit: "", stock: 0, buyingPrice: "", sellingPrice: "" });
      const res = await API.get("/products");
      setProducts(res.data);
    } catch (err) {
      alert("Error: " + (err.response?.data?.error || err.message));
    }
  };

  return (
    <div>
      <h2>Products</h2>
      <form onSubmit={handleSubmit}>
        <input name="name" placeholder="Name" value={form.name} onChange={handleChange} />
        <input name="category" placeholder="Category" value={form.category} onChange={handleChange} />
        <input name="unit" placeholder="Unit" value={form.unit} onChange={handleChange} />
        <input name="stock" type="number" placeholder="Stock" value={form.stock} onChange={handleChange} />
        <input name="buyingPrice" type="number" placeholder="Buying Price (KES)" value={form.buyingPrice} onChange={handleChange} />
        <input name="sellingPrice" type="number" placeholder="Selling Price (KES)" value={form.sellingPrice} onChange={handleChange} />
        <button type="submit">Add Product</button>
      </form>

      <table className="styled-table">
  <thead>
    <tr>
      <th>Name</th>
      <th>Category</th>
      <th>Unit</th>
      <th>Stock</th>
      <th>Buying Price</th>
      <th>Selling Price</th>
    </tr>
  </thead>
  <tbody>
    {products.map((p) => (
      <tr key={p.id}>
        <td>{p.name}</td>
        <td>{p.category}</td>
        <td>{p.unit}</td>
        <td className={p.stock<5?"low-stock":""}>
          {p.stock}
        </td>
        <td>KES {p.buyingprice}</td>
        <td>KES {p.sellingprice}</td>
      </tr>
    ))}
  </tbody>
</table>

    </div>
  );
}
