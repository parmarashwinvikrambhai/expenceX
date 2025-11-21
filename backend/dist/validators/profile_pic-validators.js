"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.profilePicSchema = void 0;
const zod_1 = require("zod");
exports.profilePicSchema = zod_1.z.object({
    profilePic: zod_1.z.string().url().optional(),
});
//# sourceMappingURL=profile_pic-validators.js.map