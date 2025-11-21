"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.changePasswordSchema = void 0;
const zod_1 = require("zod");
exports.changePasswordSchema = zod_1.z.object({
    Password: zod_1.z.string(),
    newPassword: zod_1.z.string(),
});
//# sourceMappingURL=change_password-validator.js.map