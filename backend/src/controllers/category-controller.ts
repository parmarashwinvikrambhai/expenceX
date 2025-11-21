import type { Request, Response } from "express";
import categoryRepository from "../repositories/category-repository";
import { categorySchema } from "../validators/category-validator";
import Category from "../models/category-model";
import { z } from "zod";
import mongoose from "mongoose";


export const createCategory = async (req: Request, res: Response) => {
    try {
        const validateData = categorySchema.safeParse(req.body);
        if (!validateData.success) {
            return res.status(400).json({
                message: "Please enter valid Data",
                errors: validateData.error.issues.map((e) => ({
                    field: e.path[0],
                    message: e.message
                }))
            })
        }
        const { name, type } = validateData.data;
        const userId = (req as any).user.id;
        const existingCategory = await Category.findOne({ name, user: userId });
        if (existingCategory) {
            return res.status(400).json({ message: "Category already exists" });
        }
        const category = await categoryRepository.createCategory({ name, type, user: userId });
        return res.status(201).json({ message: "Category created successfully", category });
    } catch (error) {
        if (error instanceof z.ZodError) {
            return res.status(400).json({
                errors: error.issues.map((issue) => ({
                    field: issue.path[0],
                    message: issue.message,
                })),
            });
        }
        console.error("Category creation failed:", error);
        res.status(500).json({ error: "Server error" });
    }
}

export const getCategory = async (req: Request, res: Response) => {
    try {
        const userId = (req as any).user.id;
        const category = await Category.find({ $or: [{ user: null }, { user: userId }] }).sort({ createdAt: -1 });
        res.status(200).json({ message: "category fetch successsfully...", category });
    } catch (error) {
        if (error instanceof z.ZodError) {
            return res.status(400).json({
                errors: error.issues.map((e) => ({
                    field: e.path[0],
                    message: e.message
                }))
            });
        }
        console.error("Category Fetch failed:", error);
        res.status(500).json({ error: "Server error" });
    }
}

export const deleteCategory = async (req: Request, res: Response) => {
    try {
        const userId = (req as any).user.id;
        const categoryId = req.params.id;
        if (!categoryId) {
            return res.status(400).json({ message: "CategoryId is not defined...." })
        }
        if (!mongoose.Types.ObjectId.isValid(categoryId)) {
            return res.status(400).json({ error: "Invalid ID format" });
        }
        const existingCategory = await Category.findById(categoryId);
        if (!existingCategory) {
            return res.status(404).json({ message: "Category not found..." });
        }
        if (existingCategory.user.toString() !== userId.toString()) {
            return res.status(403).json({message: "You are not allowed to delete this Category... Unauthorized"});
        }
        const category = await categoryRepository.deleteCategory(categoryId, userId);
        res.status(200).json({ messagge: "Category Deleted successfully...", category });
    } catch (error) {
        if (error instanceof z.ZodError) {
            return res.status(400).json({
                errors: error.issues.map((e) => ({
                    field: e.path[0],
                    message: e.message,
                }))
            })
        }
        console.error("Faield to Delete category", error);
        res.status(500).json({ error: "Server error" });
    }
}

export const updateCategory = async (req: Request, res: Response) => {
    try {
        const validateData = categorySchema.safeParse(req.body);
        if(!validateData.success){
            return res.status(400).json({
                message:"Please Enter valid Data",
                errors:validateData.error.issues.map((e)=>({
                    fields:e.path[0],
                    message:e.message
                }))
            });
        }
        const userId = (req as any).user.id;
        const categoryId = req.params.id;
        const {name,type} = validateData.data;
        if (!categoryId) {
            return res.status(400).json({ message: "CategoryId is not defined...." })
        } 
        if (!mongoose.Types.ObjectId.isValid(categoryId)) {
            return res.status(400).json({ error: "Invalid ID format" });
        }
        const existingCategory = await Category.findById(categoryId);
        if (!existingCategory) {
            return res.status(404).json({ message: "Category not found..." });
        }
        if (existingCategory.user.toString() !== userId.toString()) {
            return res.status(403).json({ message: "You are not allowed to Update this Category... Unauthorized" });
        }
        const updatedCategory = await categoryRepository.updateCategory(categoryId,userId,{name,type});
        res.status(200).json({ messagge: "Category Update successfully...", updatedCategory });
    } catch (error) {
        if(error instanceof z.ZodError){
            return res.status(400).json({
                errors:error.issues.map((e)=>({
                    field:e.path[0],
                    messsage:e.message
                }))
            })
        }
        console.error("Failed to update category",error);
        res.status(500).json({ error: "Server error" });
    }   
}