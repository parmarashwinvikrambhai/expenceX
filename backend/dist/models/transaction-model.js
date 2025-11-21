"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const transactionSchema = new mongoose_1.default.Schema({
    user: {
        type: mongoose_1.default.Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
    category: {
        type: mongoose_1.default.Schema.Types.ObjectId,
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
const Transaction = mongoose_1.default.model("Transaction", transactionSchema);
exports.default = Transaction;
//# sourceMappingURL=transaction-model.js.map