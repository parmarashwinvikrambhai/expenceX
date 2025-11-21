import type mongoose from "mongoose";
import type { Types } from "mongoose";

export interface ITransaction {
    _id?: Types.ObjectId;
    user: Types.ObjectId;
    category: Types.ObjectId | undefined;  
    type: "income" | "expense";
    amount: number;
    description: string | undefined;       
    date: Date;
    createdAt?: Date;
    updatedAt?: Date;
}


export interface IUpdateTransaction {
    type?: "income" | "expense";
    amount?: number;
    description?: string | undefined;
    date?: Date | undefined;
    category?: string | mongoose.Types.ObjectId | undefined;
}







