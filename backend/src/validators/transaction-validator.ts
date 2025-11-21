import mongoose from "mongoose";
import { z } from "zod";

export const transactionSchema = z.object({
    category: z
        .string()
        .optional()
        .transform((val) => (val ? new mongoose.Types.ObjectId(val) : undefined)),

    type: z.enum(["income", "expense"]),

    amount: z.number().refine((val) => val > 0, {
        message: "Amount must be greater than 0",
    }),

    description: z.string().optional(),

    date: z
        .union([z.string(), z.date()])
        .transform((val) => (val ? new Date(val) : new Date()))
        .refine((val) => !isNaN(val.getTime()), {
            message: "Invalid date format",
        }),
});
