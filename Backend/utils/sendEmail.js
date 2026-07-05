import nodeMailer from 'nodemailer';

export const sendEmail = async ({email, subject, message}) => {
    const transporter = nodeMailer.createTransport({
        host: process.env.SMTP_HOST,
        service: process.env.SMTP_SERVICE,
        port: process.env.SMTP_PORT,
        auth: {
            user: process.env.SMTP_MAIL,
            pass: process.env.SMTP_PASSWORD,
        },
    });
    const mailOptions = {
        from: process.env.SMTP_MAIL,
        to: email,
        subject,
        html: message,
    };
    try {
        await transporter.sendMail(mailOptions);
    } catch (error) {
        console.log("---------- EMAIL SEND FAILURE (MOCKED FOR OFFLINE DEV) ----------");
        console.log(`To: ${email}`);
        console.log(`Subject: ${subject}`);
        console.log(`HTML Message:\n${message}`);
        console.log("-----------------------------------------------------------------");
        // Bypassing error for testing when offline
        if (process.env.NODE_ENV !== "production") {
            return;
        }
        throw error;
    }
};