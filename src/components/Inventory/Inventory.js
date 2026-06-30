import { useState, useEffect } from "react";
import API from "../../services/api";
import { type } from "@testing-library/user-event/dist/type";

export default function Inventory() {
  const [movements, setMovements] = useState([]);
  const [form, setForm] = useState({
    productId: "",
    type: "ADD",
    quantity: "",
    remarks: ""
  });

  useEffect(() => {
    const fetchMovements = async () => {
      const res = await API.get("/inventory");
      setMovements(res.data);
    };
    fetchMovements();
  }, []);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await API.post("/inventory", {
        productId:parseInt(form.productId),
        type:form.type.toUpperCase(),
        quantity:parseInt(form.quantity),
        remarks:form.remarks
      });
      alert("Inventory Movement Recorded!");
      const res =await API.get("/inventory");
      setMovements(res.data);}
      catch(err){
        alert("Error:"+(err.response?.data.error||err.message));
      }
      };
  return (
    <div>
      <h2>Inventory Movements</h2>
      <form onSubmit={handleSubmit}>
        <input name="productId" placeholder="Product ID" value={form.productId} onChange={handleChange} />
        <select name="type" value={form.type} onChange={handleChange}>
          <option value="ADD">Add</option>
          <option value="REMOVE">Remove</option>
        </select>
        <input name="quantity" type="number" placeholder="Quantity" value={form.quantity} onChange={handleChange} />
        <input name="remarks" placeholder="Remarks" value={form.remarks} onChange={handleChange} />
        <button type="submit">Record Movement</button>
      </form>

      <ul>
        {movements.map((m) => (
          <li key={m.id}>
            {m.type} {m.quantity} units of {m.productname} — {m.remarks}
          </li>
        ))}
      </ul>
    </div>
  );
}
