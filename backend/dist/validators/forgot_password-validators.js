"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.forgotPasswordSchema = void 0;
const zod_1 = require("zod");
exports.forgotPasswordSchema = zod_1.z.object({
    email: zod_1.z
        .string()
        .trim()
        .toLowerCase()
        .email({ message: "Invalid email address" })
});
//# sourceMappingURL=forgot_password-validators.js.map