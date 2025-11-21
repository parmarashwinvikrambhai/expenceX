import type { Request, Response } from "express";
import { z } from "zod";
import Transaction from "../models/transaction-model";
import { transactionSchema } from "../validators/transaction-validator";
import transactionRepository from "../repositories/transaction-repository";
import mongoose from "mongoose";

export const createTransaction = async (req: Request, res: Response) => {
    try {
        const validateData = transactionSchema.safeParse(req.body);
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
        const userId = (req as any).user.id;
        if (!userId) {
            return res.status(400).json({ message: "Unauthorized User..." });
        }
        const existingTransaction = await Transaction.findOne({
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
        const transaction = await transactionRepository.createTransaction({
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
    } catch (error) {
        if (error instanceof z.ZodError) {
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

export const getTransaction = async (req: Request, res: Response) => {
    try {
        const userId = (req as any).user.id;
        const transaction = await Transaction.find({ $or: [{ user: null }, { user: userId }] }).populate("category", "name type").sort({ createdAt: -1 });
        res.status(200).json({ message: "transaction fetch successsfully...", transaction });
    } catch (error) {
        if (error instanceof z.ZodError) {
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
}

export const deleteTransaction = async (req: Request, res: Response) => {
    try {
        const userId = (req as any).user.id;
        const transactionId = req.params.id;

        if (!transactionId) {
            return res.status(400).json({ message: "Transaction Id not provided..." });
        }
        if (!mongoose.Types.ObjectId.isValid(transactionId)) {
            return res.status(400).json({ error: "Invalid ID format" });
        }
        const existingTransaction = await Transaction.findById(transactionId);
        if (!existingTransaction) {
            return res.status(404).json({ message: "Transaction not found..." });
        }
        if (existingTransaction.user.toString() !== userId.toString()) {
            return res.status(403).json({
                message: "You are not allowed to delete this Transaction... Unauthorized"
            });
        }
        const transaction = await transactionRepository.deleteTransaction(transactionId, userId);
        return res.status(200).json({ message: "Transaction deleted successfully...", transaction });
    } catch (error) {
        if (error instanceof z.ZodError) {
            return res.status(400).json({
                errors: error.issues.map((e) => ({
                    field: e.path[0],
                    messsage: e.message
                }))
            })
        }
        console.error("Failed to update category", error);
        res.status(500).json({ error: "Server error" });
    }
};

export const updateTransaction = async (req: Request, res: Response) => {
    try {
        const validateData = transactionSchema.safeParse(req.body);
        if(!validateData.success){
            return res.status(400).json({
                message:"Please enter valid Data",
                errors:validateData.error.issues.map((e)=>({
                    field:e.path[0],
                    message:e.message
                }))
            });
        }
        const userId = (req as any).user.id;
        const transactionId = req.params.id;
        const { type, amount, description, date, category } = validateData.data;
        if (!transactionId) {
            return res.status(400).json({ message: "Transaction is not defined...." })
        } 
        if (!mongoose.Types.ObjectId.isValid(transactionId)) {
            return res.status(400).json({ error: "Invalid ID format" });
        }
        const existingTransaction = await Transaction.findById(transactionId);
        if (!existingTransaction) {
            return res.status(404).json({ message: "Transaction not found..." });
        }
        if (existingTransaction.user.toString() !== userId.toString()) {
            return res.status(403).json({ message: "You are not allowed to Update this Transaction... Unauthorized" });
        }
        const updatedTransaction = await transactionRepository.updateTransaction(transactionId, userId, { type, amount, description, date, category });
        res.status(200).json({ messagge: "Transaction Update successfully...", updatedTransaction });
    } catch (error) {
        if(error instanceof z.ZodError){
            return res.status(400).json({
                errors:error.issues.map((e)=> ({
                    field:e.path[0],
                    message:e.message 
                }))
            })
        }
    }
}


  