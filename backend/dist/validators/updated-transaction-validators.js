"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.transactionUpdateSchema = void 0;
const zod_1 = __importDefault(require("zod"));
exports.transactionUpdateSchema = zod_1.default.object({
    category: zod_1.default.string().optional(),
    type: zod_1.default.enum(["income", "expense"]).optional(),
    amount: zod_1.default.number().optional(),
    description: zod_1.default.string().optional(),
    date: zod_1.default.string().optional(),
});
//# sourceMappingURL=updated-transaction-validators.js.map