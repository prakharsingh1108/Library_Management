import cron from 'node-cron';
import { Borrow } from '../models/borrowModel.js';
import { sendEmail } from '../utils/sendEmail.js';

export const notifyUsersCron = () => {
    // Runs every day at 12:00 AM (Midnight)
    cron.schedule('0 0 * * *', async () => {
        try {
            console.log("[CRON] Running overdue book notification service...");

            const overdueBorrows = await Borrow.find({
                returned: false,
                dueDate: { $lt: new Date() },
            }).populate("userId", "name email").populate("bookId", "title");

            console.log(`[CRON] Found ${overdueBorrows.length} overdue books.`);

            for (const borrow of overdueBorrows) {
                if (borrow.userId && borrow.userId.email) {
                    const message = `<div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #ddd; border-radius: 8px; background-color: #000; color: #fff;">
                        <h2 style="color: #fff; text-align: center;">Overdue Book Reminder</h2>
                        <p style="font-size: 16px; color: #ccc;">Dear ${borrow.userId.name},</p>
                        <p style="font-size: 16px; color: #ccc;">
                          This is a friendly reminder that the book <strong>"${borrow.bookId.title}"</strong> you borrowed was due on <strong>${new Date(borrow.dueDate).toDateString()}</strong>.
                        </p>
                        <p style="font-size: 16px; color: #ccc;">
                          Please return the book to the library at your earliest convenience. Overdue books accumulate a fine of 10 units per day.
                        </p>
                        <footer style="margin-top: 20px; text-align: center; font-size: 14px; color: #666;">
                          <p>Thank you,<br>BookWorm Team</p>
                        </footer>
                    </div>`;

                    await sendEmail({
                        email: borrow.userId.email,
                        subject: `Overdue Book Reminder: "${borrow.bookId.title}"`,
                        message,
                    });

                    console.log(`[CRON] Notification sent to ${borrow.userId.email} for "${borrow.bookId.title}"`);
                }
            }
        } catch (error) {
            console.error("[CRON ERROR] Overdue notification failed:", error);
        }
    });
};
