"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateProfileSchema = exports.loginSchema = exports.registerSchema = void 0;
const zod_1 = require("zod");
exports.registerSchema = zod_1.z.object({
    name: zod_1.z
        .string()
        .min(2, { message: "Name must be at least 2 characters" })
        .max(50, { message: "Name cannot exceed 50 characters" })
        .regex(/^[A-Za-z\s]+$/, { message: "Name can only contain letters and spaces" }),
    email: zod_1.z
        .string()
        .trim()
        .toLowerCase()
        .email({ message: "Invalid email address" }),
    password: zod_1.z
        .string()
        .min(8, { message: "Password must be at least 8 characters long" })
        .max(32, { message: "Password cannot exceed 32 characters" })
        .regex(/[A-Z]/, { message: "Must contain at least one uppercase letter" })
        .regex(/[a-z]/, { message: "Must contain at least one lowercase letter" })
        .regex(/[0-9]/, { message: "Must contain at least one number" })
        .regex(/[@$!%*?&#]/, { message: "Must contain at least one special character" }),
});
exports.loginSchema = zod_1.z.object({
    email: zod_1.z
        .string()
        .trim()
        .toLowerCase()
        .email({ message: "Invalid email address" }),
    password: zod_1.z
        .string()
        .min(1, { message: "Password is required" }),
});
exports.updateProfileSchema = zod_1.z.object({
    name: zod_1.z.string().min(3, "Name must be at least 3 characters"),
    email: zod_1.z.string().email("Invalid email address"),
    profilePic: zod_1.z.string().url().optional(),
});
//# sourceMappingURL=user-validator.js.map