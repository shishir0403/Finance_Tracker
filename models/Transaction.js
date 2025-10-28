import mongoose from "mongoose";

const transactionSchema = new mongoose.Schema({
  
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  text: {
    type: String,
    required: [true, "Please add some text"],
  },
  amount: {
    type: Number,
    required: [true, "Please add a positive or negative number"],
  },
  type: {
    type: String,
    enum: ["income", "expense"],
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  user: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: "User", 
    required: true },
  
});


const Transaction = mongoose.model("Transaction", transactionSchema);
export default Transaction;
