import { catchAsyncError } from "../middlewares/catchAsyncError.js";
import ErrorHandler from "../utils/ErrorHandler.js";
import { User } from "../models/userModel.js";
import bcrypt from "bcrypt";
import { sendVerificationCode } from "../utils/sendVerificationCode.js";
import { sendToken } from "../utils/sendToken.js";
import { sendEmail } from "../utils/sendEmail.js";
import { generateForgotPasswordEmailTemplate } from "../utils/emailTemplates.js";
import crypto from "crypto";

// ================= REGISTER =================
export const register = catchAsyncError(async (req, res, next) => {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
        return next(new ErrorHandler("Please fill all the fields.", 400));
    }

    const isRegistered = await User.findOne({
        email,
        accountVerified: true,
    });

    if (isRegistered) {
        return next(new ErrorHandler("User already exists.", 400));
    }

    const registrationAttempts = await User.find({
        email,
        accountVerified: false,
    });

    if (registrationAttempts.length >= 5) {
        return next(
            new ErrorHandler(
                "You have exceeded the maximum number of registration attempts. Please try again later.",
                400
            )
        );
    }

    if (password.length < 8 || password.length > 16) {
        return next(
            new ErrorHandler(
                "Password must be between 8 and 16 characters.",
                400
            )
        );
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await User.create({
        name,
        email,
        password: hashedPassword,
    });

    const verificationCode = await user.generateVerificationCode();

    await user.save();

    await sendVerificationCode(verificationCode, email, res);
});

// ================= VERIFY OTP =================
export const verifyOTP = catchAsyncError(async (req, res, next) => {
    const { email, otp } = req.body;

    if (!email || !otp) {
        return next(
            new ErrorHandler("Please provide both email and OTP.", 400)
        );
    }

    try {
        const userAllEntries = await User.find({
            email,
            accountVerified: false,
        }).sort({ createdAt: -1 });

        if (userAllEntries.length === 0) {
            return next(new ErrorHandler("User not found.", 404));
        }

        let user;

        if (userAllEntries.length > 1) {
            user = userAllEntries[0];

            await User.deleteMany({
                _id: { $ne: user._id },
                email,
                accountVerified: false,
            });
        } else {
            user = userAllEntries[0];
        }

        if (user.verificationCode !== Number(otp)) {
            return next(new ErrorHandler("Invalid OTP.", 400));
        }

        const currentTime = Date.now();
        const verificationCodeExpire = new Date(
            user.verificationCodeExpire
        ).getTime();

        if (currentTime > verificationCodeExpire) {
            return next(new ErrorHandler("OTP has expired.", 400));
        }

        user.accountVerified = true;
        user.verificationCode = null;
        user.verificationCodeExpire = null;

        await user.save({ validateModifiedOnly: true });

        sendToken(user, 200, "Account Verified Successfully.", res);

    } catch (error) {
        console.error(error);
        return next(new ErrorHandler("Internal Server Error.", 500));
    }
});

export const login = catchAsyncError(async (req, res, next) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return next(
            new ErrorHandler("Please provide both email and password.", 400)
        );
    }

    const user = await User.findOne({
        email,
        accountVerified: true,
    }).select("+password");

    if (!user) {
        return next(
            new ErrorHandler("Invalid email or password.", 401)
        );
    }

    const isPasswordMatched = await bcrypt.compare(
        password,
        user.password
    );

    if (!isPasswordMatched) {
        return next(
            new ErrorHandler("Invalid email or password.", 401)
        );
    }

    sendToken(user, 200, "Login Successful.", res);
});

export const logout = catchAsyncError(async (req, res, next) => {
    res
        .status(200)
        .cookie("token","",{
            expires: new Date(Date.now()),
            httpOnly: true,
        })
        .json({
            success: true,
            message: "Logged Out Successfully.",
        });
});

export const getUser = catchAsyncError(async (req, res, next) => {
    const user = req.user;
    res.status(200).json({
        success: true,
        user,
    });
    
});

export const forgotPassword = catchAsyncError(async (req, res, next) => {
    const { email } = req.body;

    if (!email) {
        return next(new ErrorHandler("Please provide an email.", 400));
    }

    const user = await User.findOne({
        email,
        accountVerified: true,
    });

    if (!user)  {
        return next(new ErrorHandler("User not found with this email.", 404));
    }

    const resetToken = user.getResetPasswordToken();

    await user.save({ validateBeforeSave: false });

    const resetPasswordUrl = `${process.env.FRONTEND_URL || 'http://localhost:5173'}/password/reset/${resetToken}`;

    try {
        const message = generateForgotPasswordEmailTemplate(resetPasswordUrl);

        await sendEmail({
            email: user.email,
            subject: "Password Reset Request (Bookworm Library Management System)",
            message,
        });

        res.status(200).json({
            success: true,
            message: `Email sent to ${user.email} successfully.`,
            resetToken, // Include token in response for development testing
        });
    } catch (error) {
        user.resetPasswordToken = undefined;
        user.resetPasswordExpires = undefined;
        await user.save({ validateBeforeSave: false });

        return next(new ErrorHandler("Email could not be sent. " + error.message, 500));
    }
});

export const resetPassword = catchAsyncError(async (req, res, next) => {
    const { token } = req.params;
    const { password, confirmPassword } = req.body;

    if (!password || !confirmPassword) {
        return next(new ErrorHandler("Please fill all fields.", 400));
    }

    if (password !== confirmPassword) {
        return next(new ErrorHandler("Passwords do not match.", 400));
    }

    if (password.length < 8 || password.length > 16) {
        return next(new ErrorHandler("Password must be between 8 and 16 characters.", 400));
    }

    // Hash URL token
    const resetPasswordToken = crypto
        .createHash("sha256")
        .update(token)
        .digest("hex");

    const user = await User.findOne({
        resetPasswordToken,
        resetPasswordExpires: { $gt: Date.now() },
    });

    if (!user) {
        return next(
            new ErrorHandler(
                "Reset Password Token is invalid or has expired.",
                400
            )
        );
    }

    // Hash new password and update user
    const hashedPassword = await bcrypt.hash(password, 10);
    user.password = hashedPassword;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpires = undefined;

    await user.save();

    sendToken(user, 200, "Password Reset Successfully.", res);
});

export const updatePassword = catchAsyncError(async (req, res, next) => {
    const { oldPassword, newPassword, confirmPassword } = req.body;

    if (!oldPassword || !newPassword || !confirmPassword) {
        return next(new ErrorHandler("Please fill all fields.", 400));
    }

    const user = await User.findById(req.user.id).select("+password");

    const isPasswordMatched = await bcrypt.compare(oldPassword, user.password);

    if (!isPasswordMatched) {
        return next(new ErrorHandler("Invalid Current Password.", 400));
    }

    if (newPassword !== confirmPassword) {
        return next(
            new ErrorHandler("New password and confirm password do not match.", 400)
        );
    }

    if (newPassword.length < 8 || newPassword.length > 16) {
        return next(
            new ErrorHandler(
                "Password must be between 8 and 16 characters.",
                400
            )
        );
    }

    user.password = await bcrypt.hash(newPassword, 10);
    await user.save();

    sendToken(user, 200, "Password Updated Successfully.", res);
});