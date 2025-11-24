"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const dbConnect = async () => {
    const db = process.env.CONNECTION_STRING;
    if (!db) {
        throw new Error("Database URL not provided...");
    }
    try {
        await mongoose_1.default.connect(db, {
            serverSelectionTimeoutMS: 5000,
        });
        console.log("Database connected successfully...");
    }
    catch (err) {
        console.error("Database connection failed:", err.message);
        process.exit(1);
    }
};
exports.default = dbConnect;
//# sourceMappingURL=db.js.map