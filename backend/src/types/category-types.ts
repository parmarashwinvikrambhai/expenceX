import { Types } from "mongoose";

export interface ICategory {
    _id?: Types.ObjectId;           
    name: string;                   
    type: "income" | "expense";     
    user?: Types.ObjectId | null;  
    createdAt?: Date;               
    updatedAt?: Date;               
}
