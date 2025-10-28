import React, { useEffect, useState } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Link,
} from "react-router-dom";
import Login from "./Login";
import Signup from "./Signup";
import FinanceTracker from "./FinanceTracker";
import PrivateRoute from "./PrivateRoute";
import { jwtDecode } from "jwt-decode";

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [username, setUsername] = useState("");

  // ✅ Check token on mount
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      try {
        const decoded = jwtDecode(token);
        setUsername(decoded.username);
        setIsLoggedIn(true);
      } catch (error) {
        console.error("Invalid token");
        localStorage.removeItem("token");
      }
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    setIsLoggedIn(false);
    window.location.href = "/login";
  };

  return (
    <Router>
      <div style={styles.container}>
        {/* 🔹 Header Bar */}
        <header style={styles.header}>
          <h2 style={styles.logo}>💰 Personal Finance Tracker</h2>

          <div style={styles.navRight}>
            {!isLoggedIn ? (
              <>
                <Link to="/login" style={styles.link}>
                  Login
                </Link>
                <Link to="/signup" style={styles.link}>
                  Signup
                </Link>
              </>
            ) : (
              <>
                <span style={styles.welcome}>Welcome, {username} 👋</span>
                <button onClick={handleLogout} style={styles.logoutButton}>
                  Logout
                </button>
              </>
            )}
          </div>
        </header>

        {/* 🔹 Routes */}
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route
            path="/tracker"
            element={
              <PrivateRoute>
                <FinanceTracker />
              </PrivateRoute>
            }
          />
        </Routes>
      </div>
    </Router>
  );
}

// 🎨 Styling
const styles = {
  container: {
    fontFamily: "Poppins, sans-serif",
  },
  header: {
    backgroundColor: "#f8f9fa",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: "10px 30px",
    borderBottom: "2px solid #ddd",
    position: "sticky",
    top: 0,
    zIndex: 1000,
  },
  logo: {
    color: "#0275d8",
    margin: 0,
  },
  navRight: {
    display: "flex",
    alignItems: "center",
    gap: "15px",
  },
  link: {
    textDecoration: "none",
    color: "#0275d8",
    fontWeight: "bold",
  },
  welcome: {
    color: "#555",
    fontSize: "14px",
    marginRight: "10px",
  },
  logoutButton: {
    backgroundColor: "#d9534f",
    color: "white",
    border: "none",
    padding: "6px 12px",
    borderRadius: "5px",
    cursor: "pointer",
  },
};

export default App;
