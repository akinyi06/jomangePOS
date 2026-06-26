import { useState, useContext } from "react";
import API from "../../services/api";
import { AuthContext } from "../../context/AuthContext";

export default function Login() {
  const { login } = useContext(AuthContext);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

 const handleLogin = async (e) => {
  e.preventDefault();
  try {
    const res = await API.post("/auth/login", { username, password });
    login(res.data); // sets token + user in context
  } catch (err) {
    alert("Login failed: " + err.response.data.error);
  }
  
};

  

  return (
    <div className="login-container">
      <h2>Jomange Shop POS</h2>
      <form onSubmit={handleLogin}>
        <input
          type="text"
          placeholder="Enter username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />
        <input
          type="password"
          placeholder="Enter password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <button type="submit">Login</button>
      </form>
    </div>
  );
}
