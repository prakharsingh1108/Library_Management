import { sendEmail } from "./sendEmail.js";
import { generateVerificationEmailTemplate } from "./emailTemplates.js";

export async function sendVerificationCode(verificationCode, email, res) {
    try {
        const message = generateVerificationEmailTemplate(verificationCode);

        await sendEmail({
            email,
            subject: "Verification Code (Bookworm Library Management System)",
            message,
        });

        res.status(200).json({
            success: true,
            message: "Verification code sent to email",
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Failed to send verification code",
        });
    }
}