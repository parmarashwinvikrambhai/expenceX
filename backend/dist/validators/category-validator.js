"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.categorySchema = void 0;
const zod_1 = require("zod");
exports.categorySchema = zod_1.z.object({
    name: zod_1.z
        .string()
        .trim()
        .min(1, { message: "Category name is required" }),
    type: zod_1.z.enum(["income", "expense"], {
        message: "Type must be either income or expense",
    }),
    user: zod_1.z
        .string()
        .regex(/^[0-9a-fA-F]{24}$/, "Invalid user ID format")
        .nullable()
        .optional(),
});
//# sourceMappingURL=category-validator.js.map