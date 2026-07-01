import { useState, useEffect } from "react";
import API from "../../services/api";

export default function Users() {
  const [users, setUsers] = useState([]);
  const [form, setForm] = useState({ username: "", password: "", role: "STAFF" });

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const res = await API.get("/users");
        setUsers(res.data);
      } catch (err) {
        alert("Error: " + (err.response?.data?.error || err.message));
      }
    };
    fetchUsers();
  }, []);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await API.post("/users", form);
      alert("User created!");
      const res = await API.get("/users");
      setUsers(res.data);
    } catch (err) {
      alert("Error: " + (err.response?.data?.error || err.message));
    }
  };

  return (
    <div>
      <h2>User Management</h2>
      <form onSubmit={handleSubmit}>
        <input name="username" placeholder="Username" value={form.username} onChange={handleChange} />
        <input name="password" type="password" placeholder="Password" value={form.password} onChange={handleChange} />
        <select name="role" value={form.role} onChange={handleChange}>
          <option value="STAFF">Staff</option>
          <option value="ADMIN">Admin</option>
        </select>
        <button type="submit">Create User</button>
      </form>

      <table className="styled-table">
  <thead>
    <tr>
      <th>Username</th>
      <th>Role</th>
      <th>Active</th>
    </tr>
  </thead>
  <tbody>
    {users.map((u) => (
      <tr key={u.id}>
        <td>{u.username}</td>
        <td>{u.role}</td>
        <td>{u.active ? "Yes" : "No"}</td>
      </tr>
    ))}
  </tbody>
</table>

    </div>
  );
}
