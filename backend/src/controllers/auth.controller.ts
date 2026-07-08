import { Request, Response } from "express";
import User from "../models/users";
import generateToken from "../utils/generateToken";
import { AuthRequest } from "../middleware/auth.middleware";

// @desc    Verify if user exists, login or request registration
// @route   POST /api/auth/login-verify
// @access  Public
export const loginVerify = async (req: Request, res: Response): Promise<void> => {
  try {
    const { uid, phoneNumber } = req.body;

    if (!uid || !phoneNumber) {
      res.status(400).json({ success: false, message: "Firebase uid and phone number are required" });
      return;
    }

    // Try to find the user by UID or phone number
    let user = await User.findOne({
      $or: [{ uid }, { phoneNumber }],
    });

    if (user) {
      // User exists, log them in by issuing a token
      const token = generateToken(user._id.toString());
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
    } else {
      // User does not exist, registration is required
      res.status(200).json({
        success: true,
        registrationRequired: true,
        message: "No user found with this phone number. Registration is required.",
      });
      return;
    }
  } catch (error) {
    console.error("Login verification error:", error);
    res.status(500).json({ success: false, message: "Server error" });
    return;
  }
};

// @desc    Register a new user
// @route   POST /api/auth/register
// @access  Public
export const register = async (req: Request, res: Response): Promise<void> => {
  try {
    const { uid, phoneNumber, firstName, lastName, email } = req.body;

    if (!uid || !phoneNumber || !firstName || !lastName || !email) {
      res.status(400).json({ success: false, message: "All fields are required" });
      return;
    }

    // Find if user already exists by UID or phone number
    let user = await User.findOne({
      $or: [{ uid }, { phoneNumber }],
    });

    if (user) {
      // Update details
      user.firstName = firstName;
      user.lastName = lastName;
      user.email = email;
      await user.save();
    } else {
      // Create user
      user = await User.create({
        uid,
        phoneNumber,
        firstName,
        lastName,
        email,
      });
    }

    const token = generateToken(user._id.toString());

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
  } catch (error) {
    console.error("Registration error:", error);
    res.status(500).json({ success: false, message: "Server error" });
    return;
  }
};

// @desc    Get current user profile
// @route   GET /api/auth/me
// @access  Private
export const getMe = async (req: AuthRequest, res: Response): Promise<void> => {
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
  } catch (error) {
    console.error("Get me error:", error);
    res.status(500).json({ success: false, message: "Server error" });
    return;
  }
};
