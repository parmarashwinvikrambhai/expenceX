import Category from "../models/category-model";
import { ICategory } from "../types/category-types";

const createCategory = async (data: ICategory) => {
    const category = new Category(data)
    return await category.save();
}
const deleteCategory = async (id:string,userId:string) => {
    return await Category.findOneAndDelete({
        _id:id,
        user:userId
    });
}
export const updateCategory = async (id: string, userId: string,data:ICategory) => {
    return await Category.findOneAndUpdate({
        _id:id,
        user:userId
    },data,{new:true});
}

export default {
    createCategory,
    deleteCategory,
    updateCategory
}