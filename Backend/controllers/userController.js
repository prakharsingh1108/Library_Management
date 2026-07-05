import { catchAsyncError } from "../middlewares/catchAsyncError.js";
import ErrorHandler from "../utils/ErrorHandler.js";
import { User } from "../models/userModel.js";
import bcrypt from "bcrypt";

// ================= GET ALL USERS (Admin Only) =================
export const getAllUsers = catchAsyncError(async (req, res, next) => {
    // Find all users who are not Admins (or just all users depending on requirements.
    // Let's return users where role is 'User')
    const users = await User.find({ role: "User" }).sort({ createdAt: -1 });

    res.status(200).json({
        success: true,
        count: users.length,
        users,
    });
});

// ================= REGISTER NEW ADMIN (Admin Only) =================
export const registerNewAdmin = catchAsyncError(async (req, res, next) => {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
        return next(new ErrorHandler("Please fill all the fields.", 400));
    }

    const isRegistered = await User.findOne({ email });
    if (isRegistered) {
        return next(new ErrorHandler("Email is already registered.", 400));
    }

    if (password.length < 8 || password.length > 16) {
        return next(new ErrorHandler("Password must be between 8 and 16 characters.", 400));
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const admin = await User.create({
        name,
        email,
        password: hashedPassword,
        role: "Admin",
        accountVerified: true, // Admins registered by Admins are automatically verified
    });

    res.status(201).json({
        success: true,
        message: "New Admin registered successfully.",
        admin: {
            id: admin._id,
            name: admin.name,
            email: admin.email,
            role: admin.role,
        },
    });
});
