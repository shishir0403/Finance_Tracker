import React from "react";
import { Navigate } from "react-router-dom";

function PrivateRoute({ children }) {
  const token = localStorage.getItem("token");

  // if no token, redirect to login
  if (!token) {
    return <Navigate to="/login" replace />;
  }

  // if token exists, render the child component
  return children;
}

export default PrivateRoute;
