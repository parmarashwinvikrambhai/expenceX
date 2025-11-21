"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const transaction_model_1 = __importDefault(require("../models/transaction-model"));
const createTransaction = async (data) => {
    const transaction = new transaction_model_1.default(data);
    return await transaction.save();
};
const deleteTransaction = async (id, userId) => {
    return await transaction_model_1.default.findOneAndDelete({
        _id: id,
        user: userId
    });
};
const updateTransaction = async (id, userId, data) => {
    return await transaction_model_1.default.findOneAndUpdate({ _id: id, user: userId }, data, { new: true });
};
exports.default = {
    createTransaction,
    deleteTransaction,
    updateTransaction
};
//# sourceMappingURL=transaction-repository.js.map