import { z } from "zod";

export const categorySchema = z.object({
    name: z
        .string()
        .trim()
        .min(1, { message: "Category name is required" }),

    type: z.enum(["income", "expense"], {
        message: "Type must be either income or expense",
    }),

    user: z
        .string()
        .regex(/^[0-9a-fA-F]{24}$/, "Invalid user ID format")
        .nullable()
        .optional(),
});
