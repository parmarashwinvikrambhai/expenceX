"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateCategory = exports.deleteCategory = exports.getCategory = exports.createCategory = void 0;
const category_repository_1 = __importDefault(require("../repositories/category-repository"));
const category_validator_1 = require("../validators/category-validator");
const category_model_1 = __importDefault(require("../models/category-model"));
const zod_1 = require("zod");
const mongoose_1 = __importDefault(require("mongoose"));
const createCategory = async (req, res) => {
    try {
        const validateData = category_validator_1.categorySchema.safeParse(req.body);
        if (!validateData.success) {
            return res.status(400).json({
                message: "Please enter valid Data",
                errors: validateData.error.issues.map((e) => ({
                    field: e.path[0],
                    message: e.message
                }))
            });
        }
        const { name, type } = validateData.data;
        const userId = req.user.id;
        const existingCategory = await category_model_1.default.findOne({ name, user: userId });
        if (existingCategory) {
            return res.status(400).json({ message: "Category already exists" });
        }
        const category = await category_repository_1.default.createCategory({ name, type, user: userId });
        return res.status(201).json({ message: "Category created successfully", category });
    }
    catch (error) {
        if (error instanceof zod_1.z.ZodError) {
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
};
exports.createCategory = createCategory;
const getCategory = async (req, res) => {
    try {
        const userId = req.user.id;
        const category = await category_model_1.default.find({ $or: [{ user: null }, { user: userId }] }).sort({ createdAt: -1 });
        res.status(200).json({ message: "category fetch successsfully...", category });
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
        console.error("Category Fetch failed:", error);
        res.status(500).json({ error: "Server error" });
    }
};
exports.getCategory = getCategory;
const deleteCategory = async (req, res) => {
    try {
        const userId = req.user.id;
        const categoryId = req.params.id;
        if (!categoryId) {
            return res.status(400).json({ message: "CategoryId is not defined...." });
        }
        if (!mongoose_1.default.Types.ObjectId.isValid(categoryId)) {
            return res.status(400).json({ error: "Invalid ID format" });
        }
        const existingCategory = await category_model_1.default.findById(categoryId);
        if (!existingCategory) {
            return res.status(404).json({ message: "Category not found..." });
        }
        if (existingCategory.user.toString() !== userId.toString()) {
            return res.status(403).json({ message: "You are not allowed to delete this Category... Unauthorized" });
        }
        const category = await category_repository_1.default.deleteCategory(categoryId, userId);
        res.status(200).json({ messagge: "Category Deleted successfully...", category });
    }
    catch (error) {
        if (error instanceof zod_1.z.ZodError) {
            return res.status(400).json({
                errors: error.issues.map((e) => ({
                    field: e.path[0],
                    message: e.message,
                }))
            });
        }
        console.error("Faield to Delete category", error);
        res.status(500).json({ error: "Server error" });
    }
};
exports.deleteCategory = deleteCategory;
const updateCategory = async (req, res) => {
    try {
        const validateData = category_validator_1.categorySchema.safeParse(req.body);
        if (!validateData.success) {
            return res.status(400).json({
                message: "Please Enter valid Data",
                errors: validateData.error.issues.map((e) => ({
                    fields: e.path[0],
                    message: e.message
                }))
            });
        }
        const userId = req.user.id;
        const categoryId = req.params.id;
        const { name, type } = validateData.data;
        if (!categoryId) {
            return res.status(400).json({ message: "CategoryId is not defined...." });
        }
        if (!mongoose_1.default.Types.ObjectId.isValid(categoryId)) {
            return res.status(400).json({ error: "Invalid ID format" });
        }
        const existingCategory = await category_model_1.default.findById(categoryId);
        if (!existingCategory) {
            return res.status(404).json({ message: "Category not found..." });
        }
        if (existingCategory.user.toString() !== userId.toString()) {
            return res.status(403).json({ message: "You are not allowed to Update this Category... Unauthorized" });
        }
        const updatedCategory = await category_repository_1.default.updateCategory(categoryId, userId, { name, type });
        res.status(200).json({ messagge: "Category Update successfully...", updatedCategory });
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
exports.updateCategory = updateCategory;
//# sourceMappingURL=category-controller.js.map