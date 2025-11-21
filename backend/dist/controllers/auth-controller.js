"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.resetPassword = exports.forgotPassword = exports.updateProfilePic = exports.changePassword = exports.updateUser = exports.getProfile = exports.checkAuth = exports.logoutUser = exports.loginUser = exports.createUser = void 0;
const auth_repository_1 = __importDefault(require("../repositories/auth-repository"));
const user_model_1 = __importDefault(require("../models/user-model"));
const user_validator_1 = require("../validators/user-validator");
const bcrypt_1 = __importDefault(require("bcrypt"));
const zod_1 = require("zod");
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const transaction_model_1 = __importDefault(require("../models/transaction-model"));
const mongoose_1 = __importDefault(require("mongoose"));
const change_password_validator_1 = require("../validators/change_password-validator");
const cloudinary_1 = __importDefault(require("../config/cloudinary"));
const forgot_password_validators_1 = require("../validators/forgot_password-validators");
const crypto_1 = __importDefault(require("crypto"));
const emailService_1 = require("../utils/emailService");
const reset_password_validator_1 = require("../validators/reset_password-validator");
const createUser = async (req, res) => {
    try {
        const validatedData = user_validator_1.registerSchema.parse(req.body);
        const { name, email, password } = validatedData;
        const existingUser = await user_model_1.default.findOne({ email });
        if (existingUser) {
            return res.status(409).json({ message: "User already exists" });
        }
        const hashPassword = await bcrypt_1.default.hash(password, 10);
        const user = await auth_repository_1.default.createUser({
            name,
            email,
            password: hashPassword,
        });
        res.status(201).json({
            message: "User created successfully", user: {
                id: user._id,
                name: user.name,
                email: user.email,
            }
        });
    }
    catch (error) {
        if (error instanceof zod_1.z.ZodError) {
            return res.status(400).json({
                errors: error.issues.map((issue) => ({
                    field: issue.path[0],
                    message: issue.message,
                })),
            });
        }
        console.error("User creation failed:", error);
        return res.status(500).json({ message: "User not created..." });
    }
};
exports.createUser = createUser;
const loginUser = async (req, res) => {
    const validateData = user_validator_1.loginSchema.safeParse(req.body);
    if (!validateData.success) {
        return res.status(400).json({
            message: "Please enter proper data",
            errors: validateData.error.issues.map((e) => ({
                field: e.path[0],
                message: e.message,
            }))
        });
    }
    const { email, password } = validateData.data;
    try {
        const user = await user_model_1.default.findOne({ email });
        if (!user) {
            return res.status(400).json({ message: "Invalid credential..." });
        }
        const isMatching = await bcrypt_1.default.compare(password, user.password);
        if (!isMatching) {
            return res.status(400).json({ message: "Invalid credential..." });
        }
        const secret = process.env.JWT_SECRET;
        if (!secret) {
            return res.status(500).json({ message: "secret not define..." });
        }
        const token = jsonwebtoken_1.default.sign({ id: user._id, email: user.email }, secret, { expiresIn: "1d" });
        res.cookie("token", token, {
            httpOnly: true,
            secure: false,
            sameSite: "lax",
            maxAge: 24 * 60 * 60 * 1000,
        });
        res.status(200).json({
            message: "Login successful", user: {
                id: user._id,
                email: user.email,
                name: user.name,
            }
        });
    }
    catch (error) {
        if (error instanceof zod_1.z.ZodError) {
            return res.status(400).json({
                errors: error.issues.map((issue) => ({
                    field: issue.path[0],
                    message: issue.message,
                })),
            });
        }
        console.error("User login failed:", error);
        res.status(500).json({ error: "Server error" });
    }
};
exports.loginUser = loginUser;
const logoutUser = async (req, res) => {
    try {
        res.clearCookie("token", {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production", // only HTTPS in prod
            sameSite: "lax",
        });
        res.status(200).json({ message: "Logged out successfully" });
    }
    catch (error) {
        console.error("Logout error:", error);
        res.status(500).json({ error: "Server error while logging out" });
    }
};
exports.logoutUser = logoutUser;
const checkAuth = async (req, res) => {
    try {
        const token = req.cookies.token;
        if (!token)
            return res.status(401).json({ loggedIn: false });
        const secret = process.env.JWT_SECRET;
        const decoded = jsonwebtoken_1.default.verify(token, secret);
        return res.status(200).json({ loggedIn: true, user: decoded });
    }
    catch (error) {
        console.error("checkAuth error:", error);
        return res.status(401).json({ loggedIn: false });
    }
};
exports.checkAuth = checkAuth;
const getProfile = async (req, res) => {
    try {
        const userId = req.user.id;
        const id = mongoose_1.default.Types.ObjectId.createFromHexString(userId);
        const user = await user_model_1.default.findById(userId).select("name email profilePic");
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }
        const income = await transaction_model_1.default.aggregate([
            { $match: { user: id, type: "income" } },
            { $group: { _id: null, total: { $sum: "$amount" } } }
        ]);
        const expense = await transaction_model_1.default.aggregate([
            { $match: { user: id, type: "expense" } },
            { $group: { _id: null, total: { $sum: "$amount" } } }
        ]);
        const totalIncome = income[0]?.total || 0;
        const totalExpense = expense[0]?.total || 0;
        const saving = totalIncome - totalExpense;
        res.json({
            name: user.name,
            email: user.email,
            profilePic: user.profilePic,
            totalIncome,
            totalExpense,
            saving
        });
    }
    catch (err) {
        console.log(err);
        res.status(500).json({ message: "Profile fetch failed" });
    }
};
exports.getProfile = getProfile;
const updateUser = async (req, res) => {
    try {
        const userId = req.user.id;
        const validateData = user_validator_1.updateProfileSchema.safeParse(req.body);
        if (!validateData.success) {
            return res.status(400).json({
                message: "Please enter valid data",
                errors: validateData.error.issues.map((e) => ({
                    fields: e.path[0],
                    message: e.message
                }))
            });
        }
        const updatedUser = await user_model_1.default.findByIdAndUpdate(userId, validateData.data, { new: true });
        if (!updatedUser) {
            return res.status(404).json({ message: "User not found" });
        }
        res.json({ message: "Profile updated successfully", user: updatedUser });
    }
    catch (error) {
        console.error(error);
        return res.status(500).json({
            message: "Something went wrong",
        });
    }
};
exports.updateUser = updateUser;
const changePassword = async (req, res) => {
    try {
        const userId = req.user.id;
        const validateData = change_password_validator_1.changePasswordSchema.safeParse(req.body);
        if (!validateData.success) {
            return res.status(400).json({
                message: "Please enter valid Data",
                errors: validateData.error.issues.map((e) => ({
                    fields: e.path[0],
                    message: e.message
                }))
            });
        }
        const { Password, newPassword } = validateData.data;
        const user = await user_model_1.default.findById(userId);
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }
        const isMatch = bcrypt_1.default.compare(Password, newPassword);
        if (!isMatch) {
            return res.status(400).json({ message: "Password and new password not matched..." });
        }
        const hashPassword = await bcrypt_1.default.hash(newPassword, 10);
        user.password = hashPassword;
        await user.save();
        res.status(200).json({ message: "Password Update successfully..." });
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server error" });
    }
};
exports.changePassword = changePassword;
const updateProfilePic = async (req, res) => {
    try {
        const userId = req.user.id;
        if (!req.file) {
            return res.status(400).json({ message: "Image is required" });
        }
        const base64 = req.file.buffer.toString("base64");
        const dataURI = `data:${req.file.mimetype};base64,${base64}`;
        const result = await cloudinary_1.default.uploader.upload(dataURI, {
            folder: "profile_pics",
        });
        const updatedUser = await user_model_1.default.findByIdAndUpdate(userId, { profilePic: result.secure_url }, { new: true }).select("name email profilePic totalIncome totalExpense saving");
        return res.json({
            message: "Profile picture updated",
            user: updatedUser,
        });
    }
    catch (err) {
        console.log(err);
        return res.status(500).json({ message: "Image update failed" });
    }
};
exports.updateProfilePic = updateProfilePic;
const forgotPassword = async (req, res) => {
    try {
        const validateData = forgot_password_validators_1.forgotPasswordSchema.safeParse(req.body);
        if (!validateData.success) {
            const errors = zod_1.z.treeifyError(validateData.error);
            return res.status(400).json({ errors });
        }
        const { email } = validateData.data;
        const user = await user_model_1.default.findOne({ email });
        if (!user) {
            return res.status(404).json({ message: "user not found..." });
        }
        const resetToken = crypto_1.default.randomBytes(32).toString("hex");
        user.resetPasswordToken = crypto_1.default.createHash("sha256").update(resetToken).digest("hex");
        user.resetPasswordExpires = new Date(Date.now() + 4 * 60 * 1000);
        await user.save();
        const resetUrl = `http://localhost:5173/reset-password/${resetToken}`;
        const html = `
      <p>Click below link to reset password:</p>
      <a href="${resetUrl}" target="_blank">${resetUrl}</a> 
    `;
        await (0, emailService_1.sendEmail)(user.email, "Reset Password", html);
        return res.json({ message: "Reset link sent successfully" });
    }
    catch (error) {
        console.error("Forgot Password Error:", error);
        res.status(500).json({ message: "Server Error", error: error.message });
    }
};
exports.forgotPassword = forgotPassword;
const resetPassword = async (req, res) => {
    try {
        const validateData = reset_password_validator_1.resetPasswordSchema.safeParse(req.body);
        if (!validateData.success) {
            const errors = zod_1.z.treeifyError(validateData.error);
            return res.status(400).json({ errors });
        }
        const { token } = req.params;
        if (!token) {
            return res.status(404).json({ message: "token not found..." });
        }
        const { password } = validateData.data;
        const hashedToken = crypto_1.default.createHash("sha256").update(token).digest("hex");
        const user = await user_model_1.default.findOne({ resetPasswordToken: hashedToken, resetPasswordExpires: { $gt: new Date() } });
        if (!user)
            return res.status(400).json({ message: "Token invalid or expired" });
        user.password = await bcrypt_1.default.hash(password, 10);
        user.resetPasswordToken = null;
        user.resetPasswordExpires = null;
        await user.save();
        return res.json({ message: "Password reset successful" });
    }
    catch (error) {
        return res.status(500).json({ message: "Server Error" });
    }
};
exports.resetPassword = resetPassword;
//# sourceMappingURL=auth-controller.js.map