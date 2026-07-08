"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getMe = exports.register = exports.loginVerify = void 0;
const users_1 = __importDefault(require("../models/users"));
const generateToken_1 = __importDefault(require("../utils/generateToken"));
const loginVerify = async (req, res) => {
    try {
        const { uid, phoneNumber } = req.body;
        if (!uid || !phoneNumber) {
            res.status(400).json({ success: false, message: "Firebase uid and phone number are required" });
            return;
        }
        // Try to find the user by UID or phone number
        let user = await users_1.default.findOne({
            $or: [{ uid }, { phoneNumber }],
        });
        if (user) {
            const token = (0, generateToken_1.default)(user._id.toString());
            res.status(200).json({
                success: true,
                token,
                user: {
                    id: user._id,
                    uid: user.uid,
                    phoneNumber: user.phoneNumber,
                    firstName: user.firstName,
                    lastName: user.lastName,
                    email: user.email,
                },
            });
            return;
        }
        else {
            res.status(200).json({
                success: true,
                registrationRequired: true,
                message: "No user found with this phone number. Registration is required.",
            });
            return;
        }
    }
    catch (error) {
        console.error("Login verification error:", error);
        res.status(500).json({ success: false, message: "Server error" });
        return;
    }
};
exports.loginVerify = loginVerify;
const register = async (req, res) => {
    try {
        const { uid, phoneNumber, firstName, lastName, email } = req.body;
        if (!uid || !phoneNumber || !firstName || !lastName || !email) {
            res.status(400).json({ success: false, message: "All fields are required" });
            return;
        }
        // Find if user already exists by UID or phone number
        let user = await users_1.default.findOne({
            $or: [{ uid }, { phoneNumber }],
        });
        if (user) {
            user.firstName = firstName;
            user.lastName = lastName;
            user.email = email;
            await user.save();
        }
        else {
            // Create user
            user = await users_1.default.create({
                uid,
                phoneNumber,
                firstName,
                lastName,
                email,
            });
        }
        const token = (0, generateToken_1.default)(user._id.toString());
        res.status(201).json({
            success: true,
            token,
            user: {
                id: user._id,
                uid: user.uid,
                phoneNumber: user.phoneNumber,
                firstName: user.firstName,
                lastName: user.lastName,
                email: user.email,
            },
        });
        return;
    }
    catch (error) {
        console.error("Registration error:", error);
        res.status(500).json({ success: false, message: "Server error" });
        return;
    }
};
exports.register = register;
const getMe = async (req, res) => {
    try {
        if (!req.user) {
            res.status(404).json({ success: false, message: "User not found" });
            return;
        }
        res.status(200).json({
            success: true,
            user: {
                id: req.user._id,
                uid: req.user.uid,
                phoneNumber: req.user.phoneNumber,
                firstName: req.user.firstName,
                lastName: req.user.lastName,
                email: req.user.email,
            },
        });
        return;
    }
    catch (error) {
        console.error("Get me error:", error);
        res.status(500).json({ success: false, message: "Server error" });
        return;
    }
};
exports.getMe = getMe;
