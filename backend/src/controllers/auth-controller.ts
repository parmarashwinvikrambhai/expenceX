import authRepository from "../repositories/auth-repository";
import User from "../models/user-model";
import type { Request, Response } from "express";
import { registerSchema, loginSchema, updateProfileSchema } from "../validators/user-validator";
import bcrypt from "bcrypt";
import { z } from "zod";
import jwt from "jsonwebtoken"
import Transaction from "../models/transaction-model";
import mongoose, { Types } from "mongoose";
import { changePasswordSchema } from "../validators/change_password-validator";
import cloudinary from "../config/cloudinary";
import { forgotPasswordSchema } from "../validators/forgot_password-validators";
import crypto from "crypto";
import { sendEmail } from "../utils/emailService";
import { resetPasswordSchema } from "../validators/reset_password-validator";


export const createUser = async (req: Request, res: Response) => {
    try {
        const validatedData = registerSchema.parse(req.body);
        const { name, email, password } = validatedData;
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(409).json({ message: "User already exists" });
        }
        const hashPassword = await bcrypt.hash(password, 10);
        const user = await authRepository.createUser({
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
    } catch (error) {
        if (error instanceof z.ZodError) {
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

export const loginUser = async (req: Request, res: Response) => {
    const validateData = loginSchema.safeParse(req.body);
    if (!validateData.success) {
        return res.status(400).json({
            message: "Please enter proper data",
            errors: validateData.error.issues.map((e) => ({
                field: e.path[0],
                message: e.message,
            }))
        })
    }
    const { email, password } = validateData.data;
    try {
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({ message: "Invalid credential..." });
        }
        const isMatching = await bcrypt.compare(password, user.password);
        if (!isMatching) {
            return res.status(400).json({ message: "Invalid credential..." });
        }
        const secret = process.env.JWT_SECRET;
        if (!secret) {
            return res.status(500).json({ message: "secret not define..." });
        }
        const token = jwt.sign({ id: user._id, email: user.email }, secret, { expiresIn: "1d" });
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
    } catch (error) {
        if (error instanceof z.ZodError) {
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
}

export const logoutUser = async (req: Request, res: Response) => {
    try {
        res.clearCookie("token", {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production", // only HTTPS in prod
            sameSite: "lax",
        });
        res.status(200).json({ message: "Logged out successfully" });

    } catch (error) {
        console.error("Logout error:", error);
        res.status(500).json({ error: "Server error while logging out" });
    }
}

export const checkAuth = async (req: Request, res: Response) => {
    try {
        const token = req.cookies.token;
        if (!token) return res.status(401).json({ loggedIn: false });

        const secret = process.env.JWT_SECRET!;
        const decoded = jwt.verify(token, secret);

        return res.status(200).json({ loggedIn: true, user: decoded });
    } catch (error) {
        console.error("checkAuth error:", error);
        return res.status(401).json({ loggedIn: false });
    }
};

export const getProfile = async (req: Request, res: Response) => {
    try {
        const userId = (req as any).user.id;
        const id = mongoose.Types.ObjectId.createFromHexString(userId);
        const user = await User.findById(userId).select("name email profilePic");
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }
        const income = await Transaction.aggregate([
            { $match: { user: id, type: "income" } },
            { $group: { _id: null, total: { $sum: "$amount" } } }
        ]);

        const expense = await Transaction.aggregate([
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

    } catch (err) {
        console.log(err);
        res.status(500).json({ message: "Profile fetch failed" });
    }
};

export const updateUser = async (req: Request, res: Response) => {
    try {
        const userId = (req as any).user.id;
        const validateData = updateProfileSchema.safeParse(req.body);
        if(!validateData.success){
            return res.status(400).json({
                message:"Please enter valid data",
                errors:validateData.error.issues.map((e)=>({
                    fields:e.path[0],
                    message:e.message 
                }))
            })
        }
        const updatedUser = await User.findByIdAndUpdate(userId, validateData.data, { new: true });
        if (!updatedUser) {
            return res.status(404).json({ message: "User not found" });
        }
        res.json({message: "Profile updated successfully",user: updatedUser});
    } catch (error) {
        console.error(error);
        return res.status(500).json({
            message: "Something went wrong",
        });  
    }
}

export const changePassword = async (req: Request, res: Response) => {
    try {
        const userId = (req as any).user.id;
        const validateData = changePasswordSchema.safeParse(req.body);
        if(!validateData.success){
            return res.status(400).json({
                message:"Please enter valid Data",
                errors:validateData.error.issues.map((e)=>({
                    fields:e.path[0],
                    message:e.message
                }))
            });
        }
        const {Password,newPassword} = validateData.data;
        const user = await User.findById(userId);
        if(!user){
            return res.status(404).json({message:"User not found"});
        }
        const isMatch = bcrypt.compare(Password,newPassword);
        if(!isMatch){
            return res.status(400).json({ message: "Password and new password not matched..." });
        }
        const hashPassword = await bcrypt.hash(newPassword,10);
        user.password = hashPassword;
        await user.save();
        res.status(200).json({message:"Password Update successfully..."});
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server error" });  
    }
}

export const updateProfilePic = async (req: Request, res: Response) => {
    try {
        const userId = (req as any).user.id;
        if (!req.file) {
            return res.status(400).json({ message: "Image is required" });
        }

        const base64 = req.file.buffer.toString("base64");
        const dataURI = `data:${req.file.mimetype};base64,${base64}`;

        const result = await cloudinary.uploader.upload(dataURI, {
            folder: "profile_pics",
        });

        const updatedUser = await User.findByIdAndUpdate(
            userId,
            { profilePic: result.secure_url },
            { new: true }
        ).select("name email profilePic totalIncome totalExpense saving");

        return res.json({
            message: "Profile picture updated",
            user: updatedUser,
        });

    } catch (err) {
        console.log(err);
        return res.status(500).json({ message: "Image update failed" });
    }
};

export const forgotPassword = async (req: Request, res: Response) => {
    try {
        const validateData = forgotPasswordSchema.safeParse(req.body);
        if (!validateData.success) {
            const errors = z.treeifyError(validateData.error);
            return res.status(400).json({ errors });
        }
        const { email } = validateData.data;
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(404).json({ message: "user not found..." });
        }
        const resetToken = crypto.randomBytes(32).toString("hex");
        user.resetPasswordToken = crypto.createHash("sha256").update(resetToken).digest("hex");
        user.resetPasswordExpires = new Date(Date.now() + 4 * 60 * 1000)
        await user.save();
        const resetUrl = `${process.env.FRONTEND_URL}/reset-password/${resetToken}`;
        const html = `
      <p>Click below link to reset password:</p>
      <a href="${resetUrl}" target="_blank">${resetUrl}</a> 
    `;
        await sendEmail(user.email, "Reset Password", html);
        return res.json({ message: "Reset link sent successfully" });
    } catch (error:any) {
        console.error("Forgot Password Error:", error);
        res.status(500).json({ message: "Server Error", error: error.message });
    }
}

export const resetPassword = async (req: Request, res: Response) => {
    try {
        const validateData = resetPasswordSchema.safeParse(req.body);
        if(!validateData.success){
            const errors = z.treeifyError(validateData.error);
            return res.status(400).json({errors});
        }
        const {token} = req.params;
        if(!token){
            return res.status(404).json({message:"token not found..."});
        }
        const {password} = validateData.data;
        const hashedToken = crypto.createHash("sha256").update(token).digest("hex");
        const user = await User.findOne({ resetPasswordToken: hashedToken, resetPasswordExpires: { $gt: new Date() }});
        if (!user)
            return res.status(400).json({ message: "Token invalid or expired" });

        user.password = await bcrypt.hash(password, 10);
        user.resetPasswordToken = null;
        user.resetPasswordExpires = null;

        await user.save();

        return res.json({ message: "Password reset successful" });
    } catch (error) {
        return res.status(500).json({ message: "Server Error" });
    }
    
}





