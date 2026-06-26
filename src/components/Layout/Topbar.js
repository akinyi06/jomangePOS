import React, { useContext } from "react";
import { AuthContext } from "../../context/AuthContext";

export default function Topbar() {
  const { auth, logout } = useContext(AuthContext);

  return (
    <div className="topbar">
      <span>Welcome, {auth?.username}</span>
      <button onClick={logout}>Logout</button>
    </div>
  );
}
