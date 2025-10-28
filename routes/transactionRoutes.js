import express from "express";
import {
  getTransactions,
  addTransaction,
  deleteTransaction,
} from "../controllers/transactionController.js";
import { authMiddleware } from "../middleware/authMiddleware.js";

const router = express.Router();

router.get("/", authMiddleware, getTransactions);
router.post("/", authMiddleware, addTransaction);
router.delete("/:id", authMiddleware, deleteTransaction);

export default router;
