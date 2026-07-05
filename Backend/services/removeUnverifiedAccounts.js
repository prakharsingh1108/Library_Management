import cron from 'node-cron';
import { User } from '../models/userModel.js';

export const removeUnverifiedAccountsCron = () => {
    // Runs every day at 1:00 AM (shortly after the late notifications)
    cron.schedule('0 1 * * *', async () => {
        try {
            console.log("[CRON] Running unverified accounts clean-up service...");

            // Delete users where account is unverified AND verification code has expired
            const result = await User.deleteMany({
                accountVerified: false,
                verificationCodeExpires: { $lt: new Date() },
            });

            console.log(`[CRON] Clean-up completed. Removed ${result.deletedCount} unverified accounts.`);
        } catch (error) {
            console.error("[CRON ERROR] Clean-up service failed:", error);
        }
    });
};
