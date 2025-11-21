"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.isAuthorizedUser = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const isAuthorizedUser = (req, res, next) => {
    try {
        const token = req.cookies?.token || req.header("Authorization")?.replace("Bearer ", "") || req.header("authorization")?.replace("Bearer ", "");
        if (!token) {
            return res.status(401).json({ message: "token not provided" });
        }
        const secret = process.env.JWT_SECRET;
        if (!secret) {
            return res.status(500).json({ message: "secret is missing provided" });
        }
        const decode = jsonwebtoken_1.default.verify(token, secret);
        req.user = decode;
        next();
    }
    catch (error) {
        console.error("JWT verification failed:", error);
        return res.status(403).json({ message: "Invalid or expired token" });
    }
};
exports.isAuthorizedUser = isAuthorizedUser;
//# sourceMappingURL=auth-middleware.js.map