// // src/components/Auth/PrivateRoute.js
// import React, { useContext } from "react";
// import { Navigate } from "react-router-dom";
// import { AuthContext } from "../../context/AuthContext";

// export default function PrivateRoute({ children, allowedRoles }) {
//   const { auth } = useContext(AuthContext);

//   if (!auth) {
//     return <Navigate to="/login" />;
//   }

//   if (allowedRoles && !allowedRoles.includes(auth.role)) {
//     return <Navigate to="/" />; // redirect to dashboard if role not allowed
//   }

//   return children;
// }
