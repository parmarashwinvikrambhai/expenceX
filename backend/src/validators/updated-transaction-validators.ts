import z from "zod";

export const transactionUpdateSchema = z.object({
    category: z.string().optional(),
    type: z.enum(["income", "expense"]).optional(),
    amount: z.number().optional(),
    description: z.string().optional(),
    date: z.string().optional(),
});
