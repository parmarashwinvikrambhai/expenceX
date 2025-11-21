"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const userSchema = new mongoose_1.default.Schema({
    name: {
        type: String,
        required: true,
        trim: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        trim: true,
    },
    password: {
        type: String,
        required: true,
        minlength: 6,
    },
    profilePic: {
        type: String, // URL store hoga
        default: "https://cdn-icons-png.flaticon.com/512/3135/3135715.png",
    },
    resetPasswordToken: String,
    resetPasswordExpires: Date,
}, { timestamps: true });
const User = mongoose_1.default.model("User", userSchema);
exports.default = User;
//# sourceMappingURL=user-model.js.map