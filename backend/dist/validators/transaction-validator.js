"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.transactionSchema = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const zod_1 = require("zod");
exports.transactionSchema = zod_1.z.object({
    category: zod_1.z
        .string()
        .optional()
        .transform((val) => (val ? new mongoose_1.default.Types.ObjectId(val) : undefined)),
    type: zod_1.z.enum(["income", "expense"]),
    amount: zod_1.z.number().refine((val) => val > 0, {
        message: "Amount must be greater than 0",
    }),
    description: zod_1.z.string().optional(),
    date: zod_1.z
        .union([zod_1.z.string(), zod_1.z.date()])
        .transform((val) => (val ? new Date(val) : new Date()))
        .refine((val) => !isNaN(val.getTime()), {
        message: "Invalid date format",
    }),
});
//# sourceMappingURL=transaction-validator.js.map