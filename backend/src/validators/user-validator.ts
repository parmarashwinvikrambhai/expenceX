import {z} from "zod"
 
export const registerSchema = z.object({
    name: z
        .string()
        .min(2, { message: "Name must be at least 2 characters" })
        .max(50, { message: "Name cannot exceed 50 characters" })
        .regex(/^[A-Za-z\s]+$/, { message: "Name can only contain letters and spaces" }),

    email: z
        .string()
        .trim()
        .toLowerCase()
        .email({ message: "Invalid email address" }),

    password: z
        .string()
        .min(8, { message: "Password must be at least 8 characters long" })
        .max(32, { message: "Password cannot exceed 32 characters" })
        .regex(/[A-Z]/, { message: "Must contain at least one uppercase letter" })
        .regex(/[a-z]/, { message: "Must contain at least one lowercase letter" })
        .regex(/[0-9]/, { message: "Must contain at least one number" })
        .regex(/[@$!%*?&#]/, { message: "Must contain at least one special character" }),
})

export const loginSchema = z.object({
    email: z
        .string()
        .trim()
        .toLowerCase()
        .email({ message: "Invalid email address" }),

    password: z
        .string()
        .min(1, { message: "Password is required" }),
});

export const updateProfileSchema = z.object({
    name: z.string().min(3, "Name must be at least 3 characters"),
    email: z.string().email("Invalid email address"),
    profilePic: z.string().url().optional(),
});
