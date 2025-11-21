import mongoose from "mongoose"

const transactionSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
    category: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Category",
    },
    
    type: {
        type: String,
        enum: ["income", "expense"],
        required: true,
    },
    amount: {
        type: Number,
        required: true,
    },
    description: {
        type: String,
        trim: true,
    },
    date: {
        type: Date,
        default: Date.now,
    },
    
}, { timestamps: true });

const Transaction  = mongoose.model("Transaction",transactionSchema);
export default Transaction