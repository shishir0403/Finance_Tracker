import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

function FinanceTracker() {
  const [transactions, setTransactions] = useState([]);
  const [text, setText] = useState("");
  const [amount, setAmount] = useState("");
  const [type, setType] = useState("income"); // ✅ NEW: income or expense
  const [editingId, setEditingId] = useState(null);
  const [username, setUsername] = useState("");
  const navigate = useNavigate();

  // ✅ Decode token
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/login");
      return;
    }
    try {
      const decoded = jwtDecode(token);
      setUsername(decoded.username || "User");
    } catch (err) {
      localStorage.removeItem("token");
      navigate("/login");
    }
  }, [navigate]);

  // ✅ Fetch transactions
  const fetchTransactions = () => {
    const token = localStorage.getItem("token");
    fetch("http://localhost:5000/api/transactions", {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    })
      .then((res) => res.json())
      .then((data) => setTransactions(data))
      .catch((err) => console.error("Error fetching transactions:", err));
  };

  

  useEffect(() => {
    fetchTransactions();
  }, []);

  // ✅ Add or update transaction
  // ✅ Add or update transaction
const handleAddTransaction = async (e) => {
  e.preventDefault();
  if (!text || !amount) return alert("Please fill all fields");

  const token = localStorage.getItem("token");
  const value = type === "expense" ? -Math.abs(amount) : Math.abs(amount);

  // ✅ Include type in the request
  const newTx = { text, amount: Number(value), type };

  try {
    const url = editingId
      ? `http://localhost:5000/api/transactions/${editingId}`
      : "http://localhost:5000/api/transactions";

    const method = editingId ? "PUT" : "POST";

    const res = await fetch(url, {
      method,
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(newTx),
    });

    if (!res.ok) throw new Error("Transaction failed");
    fetchTransactions();
    setText("");
    setAmount("");
    setType("income");
    setEditingId(null);
  } catch (err) {
    alert("Error: " + err.message);
  }
};


  // ✅ Delete transaction
  const handleDelete = async (id) => {
    const token = localStorage.getItem("token");
    if (!window.confirm("Delete this transaction?")) return;
    await fetch(`http://localhost:5000/api/transactions/${id}`, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${token}` },
    });
    fetchTransactions();
  };

  // ✅ Edit transaction
  const handleEdit = (tx) => {
    setEditingId(tx._id);
    setText(tx.text);
    setAmount(Math.abs(tx.amount));
    setType(tx.amount < 0 ? "expense" : "income");
  };

  // ✅ Calculations
  const income = transactions
    .filter((t) => t.amount > 0)
    .reduce((a, t) => a + t.amount, 0);
  const expenses = transactions
    .filter((t) => t.amount < 0)
    .reduce((a, t) => a + t.amount, 0);
  const balance = income + expenses;

  const chartData = [
    { name: "Income", value: income },
    { name: "Expenses", value: Math.abs(expenses) },
  ];

  const COLORS = ["#28a745", "#dc3545"];

  return (
    <div style={styles.container}>
      <h2>💰 Your Dashboard</h2>
      <h4 style={{ color: "#555" }}>Welcome, {username} 👋</h4>

      <div style={styles.summary}>
        <div style={styles.card}>
          <h4>Income</h4>
          <p style={{ color: "green" }}>₹{income}</p>
        </div>
        <div style={styles.card}>
          <h4>Expenses</h4>
          <p style={{ color: "red" }}>₹{Math.abs(expenses)}</p>
        </div>
        <div style={styles.card}>
          <h4>Balance</h4>
          <p>₹{balance}</p>
        </div>
      </div>

      {/* 🟢 Chart */}
      <div style={styles.chartContainer}>
        <h3>Spending Overview</h3>
        <ResponsiveContainer width="100%" height={250}>
          <PieChart>
            <Pie
              data={chartData}
              cx="50%"
              cy="50%"
              labelLine={false}
              outerRadius={80}
              fill="#8884d8"
              dataKey="value"
              label={({ name, percent }) =>
                `${name} ${(percent * 100).toFixed(0)}%`
              }
            >
              {chartData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip />
            <Legend />
          </PieChart>
        </ResponsiveContainer>
      </div>

      {/* 🧾 Add/Edit form */}
      <form onSubmit={handleAddTransaction} style={styles.form}>
        <input
          type="text"
          placeholder="Enter text..."
          value={text}
          onChange={(e) => setText(e.target.value)}
          style={styles.input}
        />
        <input
          type="number"
          placeholder="Enter amount..."
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          style={styles.input}
        />
        <select
          value={type}
          onChange={(e) => setType(e.target.value)}
          style={styles.select}
        >
          <option value="income">Income</option>
          <option value="expense">Expense</option>
        </select>
        <button type="submit" style={styles.addButton}>
          {editingId ? "Update" : "Add"}
        </button>
      </form>

      {/* 🗂 Transaction list */}
      <ul style={styles.list}>
        {transactions.map((t) => (
          <li key={t._id} style={styles.listItem}>
            <span style={{ color: t.amount > 0 ? "green" : "red" }}>
              {t.text} — ₹{t.amount}
            </span>
            <span>
              <button onClick={() => handleEdit(t)} style={styles.editBtn}>
                ✏️
              </button>
              <button onClick={() => handleDelete(t._id)} style={styles.deleteBtn}>
                🗑️
              </button>
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}

const styles = {
  container: { maxWidth: "650px", margin: "40px auto", textAlign: "center" },
  summary: { display: "flex", justifyContent: "space-around", margin: "20px 0" },
  card: {
    border: "2px solid #ccc",
    borderRadius: "10px",
    padding: "15px",
    width: "150px",
  },
  chartContainer: {
    border: "1px solid #ddd",
    borderRadius: "10px",
    padding: "15px",
    margin: "20px 0",
    backgroundColor: "#f9f9f9",
  },
  form: { marginBottom: "20px" },
  input: {
    padding: "8px",
    margin: "5px",
    borderRadius: "5px",
    border: "1px solid #ccc",
  },
  select: {
    padding: "8px",
    margin: "5px",
    borderRadius: "5px",
    border: "1px solid #ccc",
  },
  addButton: {
    padding: "8px 15px",
    backgroundColor: "#0275d8",
    color: "white",
    border: "none",
    borderRadius: "5px",
    cursor: "pointer",
  },
  list: { listStyleType: "none", padding: 0 },
  listItem: {
    margin: "8px 0",
    fontWeight: "bold",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
  },
  editBtn: {
    background: "none",
    border: "none",
    cursor: "pointer",
    marginRight: "8px",
  },
  deleteBtn: {
    background: "none",
    border: "none",
    cursor: "pointer",
  },
};

export default FinanceTracker;
