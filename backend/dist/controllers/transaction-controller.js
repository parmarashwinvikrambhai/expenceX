"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateTransaction = exports.deleteTransaction = exports.getTransaction = exports.createTransaction = void 0;
const zod_1 = require("zod");
const transaction_model_1 = __importDefault(require("../models/transaction-model"));
const transaction_validator_1 = require("../validators/transaction-validator");
const transaction_repository_1 = __importDefault(require("../repositories/transaction-repository"));
const mongoose_1 = __importDefault(require("mongoose"));
const createTransaction = async (req, res) => {
    try {
        const validateData = transaction_validator_1.transactionSchema.safeParse(req.body);
        if (!validateData.success) {
            return res.status(400).json({
                message: "Please enter proper Data",
                errors: validateData.error.issues.map((e) => ({
                    field: e.path[0],
                    message: e.message,
                })),
            });
        }
        const { type, amount, description, date, category } = validateData.data;
        const userId = req.user.id;
        if (!userId) {
            return res.status(400).json({ message: "Unauthorized User..." });
        }
        const existingTransaction = await transaction_model_1.default.findOne({
            user: userId,
            type,
            amount,
            description,
            category,
            date: new Date(date),
        });
        if (existingTransaction) {
            return res.status(409).json({
                message: "Transaction already exists",
            });
        }
        const transaction = await transaction_repository_1.default.createTransaction({
            user: userId,
            type,
            amount,
            description,
            category,
            date: date || new Date(),
        });
        const populatedTransaction = await transaction.populate("category", "name type");
        res.status(201).json({
            message: "Transaction created successfully",
            transaction: populatedTransaction,
        });
    }
    catch (error) {
        if (error instanceof zod_1.z.ZodError) {
            return res.status(400).json({
                errors: error.issues.map((e) => ({
                    field: e.path[0],
                    message: e.message,
                })),
            });
        }
        console.error(error);
        return res.status(500).json({ message: "Internal server error" });
    }
};
exports.createTransaction = createTransaction;
const getTransaction = async (req, res) => {
    try {
        const userId = req.user.id;
        const transaction = await transaction_model_1.default.find({ $or: [{ user: null }, { user: userId }] }).populate("category", "name type").sort({ createdAt: -1 });
        res.status(200).json({ message: "transaction fetch successsfully...", transaction });
    }
    catch (error) {
        if (error instanceof zod_1.z.ZodError) {
            return res.status(400).json({
                errors: error.issues.map((e) => ({
                    field: e.path[0],
                    message: e.message
                }))
            });
        }
        console.error("Transaction Fetch failed:", error);
        res.status(500).json({ error: "Server error" });
    }
};
exports.getTransaction = getTransaction;
const deleteTransaction = async (req, res) => {
    try {
        const userId = req.user.id;
        const transactionId = req.params.id;
        if (!transactionId) {
            return res.status(400).json({ message: "Transaction Id not provided..." });
        }
        if (!mongoose_1.default.Types.ObjectId.isValid(transactionId)) {
            return res.status(400).json({ error: "Invalid ID format" });
        }
        const existingTransaction = await transaction_model_1.default.findById(transactionId);
        if (!existingTransaction) {
            return res.status(404).json({ message: "Transaction not found..." });
        }
        if (existingTransaction.user.toString() !== userId.toString()) {
            return res.status(403).json({
                message: "You are not allowed to delete this Transaction... Unauthorized"
            });
        }
        const transaction = await transaction_repository_1.default.deleteTransaction(transactionId, userId);
        return res.status(200).json({ message: "Transaction deleted successfully...", transaction });
    }
    catch (error) {
        if (error instanceof zod_1.z.ZodError) {
            return res.status(400).json({
                errors: error.issues.map((e) => ({
                    field: e.path[0],
                    messsage: e.message
                }))
            });
        }
        console.error("Failed to update category", error);
        res.status(500).json({ error: "Server error" });
    }
};
exports.deleteTransaction = deleteTransaction;
const updateTransaction = async (req, res) => {
    try {
        const validateData = transaction_validator_1.transactionSchema.safeParse(req.body);
        if (!validateData.success) {
            return res.status(400).json({
                message: "Please enter valid Data",
                errors: validateData.error.issues.map((e) => ({
                    field: e.path[0],
                    message: e.message
                }))
            });
        }
        const userId = req.user.id;
        const transactionId = req.params.id;
        const { type, amount, description, date, category } = validateData.data;
        if (!transactionId) {
            return res.status(400).json({ message: "Transaction is not defined...." });
        }
        if (!mongoose_1.default.Types.ObjectId.isValid(transactionId)) {
            return res.status(400).json({ error: "Invalid ID format" });
        }
        const existingTransaction = await transaction_model_1.default.findById(transactionId);
        if (!existingTransaction) {
            return res.status(404).json({ message: "Transaction not found..." });
        }
        if (existingTransaction.user.toString() !== userId.toString()) {
            return res.status(403).json({ message: "You are not allowed to Update this Transaction... Unauthorized" });
        }
        const updatedTransaction = await transaction_repository_1.default.updateTransaction(transactionId, userId, { type, amount, description, date, category });
        res.status(200).json({ messagge: "Transaction Update successfully...", updatedTransaction });
    }
    catch (error) {
        if (error instanceof zod_1.z.ZodError) {
            return res.status(400).json({
                errors: error.issues.map((e) => ({
                    field: e.path[0],
                    message: e.message
                }))
            });
        }
    }
};
exports.updateTransaction = updateTransaction;
//# sourceMappingURL=transaction-controller.js.map