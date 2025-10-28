import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";
import transactionRoutes from "./routes/transactionRoutes.js";
import authRoutes from "./routes/authRoutes.js";


dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 5000;

// MongoDB connection
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("✅ MongoDB Connected"))
  .catch((err) => console.error(err));

// Routes
app.use("/api/transactions", transactionRoutes);
app.use("/api/auth", authRoutes);


// Default route
app.get("/", (req, res) => {
  res.send("Personal Finance Tracker API is running 🚀");
});

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
