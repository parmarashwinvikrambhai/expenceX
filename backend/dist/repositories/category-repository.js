"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateCategory = void 0;
const category_model_1 = __importDefault(require("../models/category-model"));
const createCategory = async (data) => {
    const category = new category_model_1.default(data);
    return await category.save();
};
const deleteCategory = async (id, userId) => {
    return await category_model_1.default.findOneAndDelete({
        _id: id,
        user: userId
    });
};
const updateCategory = async (id, userId, data) => {
    return await category_model_1.default.findOneAndUpdate({
        _id: id,
        user: userId
    }, data, { new: true });
};
exports.updateCategory = updateCategory;
exports.default = {
    createCategory,
    deleteCategory,
    updateCategory: exports.updateCategory
};
//# sourceMappingURL=category-repository.js.map