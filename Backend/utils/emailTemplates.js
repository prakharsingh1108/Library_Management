export function generateVerificationEmailTemplate(otpCode) {
  return `<div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #ddd; border-radius: 8px; background-color: #000; color: #fff;">
    <h2 style="color: #fff; text-align: center;">Verify Your Email Address</h2>

    <p style="font-size: 16px; color: #ccc;">Dear User,</p>

    <p style="font-size: 16px; color: #ccc;">
      To complete your registration or login, please use the following verification code:
    </p>

    <div style="text-align: center; margin: 20px 0;">
      <span style="display: inline-block; font-size: 24px; font-weight: bold; color: #000; padding: 10px 20px; border: 1px solid #fff; border-radius: 5px; background-color: #fff;">
        ${otpCode}
      </span>
    </div>

    <p style="font-size: 16px; color: #ccc;">
      This code is valid for 15 minutes. Please do not share this code with anyone.
    </p>

    <p style="font-size: 16px; color: #ccc;">
      If you did not request this email, please ignore it.
    </p>

    <footer style="margin-top: 20px; text-align: center; font-size: 14px; color: #666;">
      <p>
        Thank you,<br>
        BookWorm Team
      </p>

      <p style="font-size: 12px; color: #444;">
        This is an automated message. Please do not reply to this email.
      </p>
    </footer>
  </div>`;
}

export function generateForgotPasswordEmailTemplate(resetPasswordUrl) {
  return `<div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #ddd; border-radius: 8px; background-color: #000; color: #fff;">
    <h2 style="color: #fff; text-align: center;">Reset Your Password</h2>

    <p style="font-size: 16px; color: #ccc;">Dear User,</p>

    <p style="font-size: 16px; color: #ccc;">
      You requested to reset your password. Please click the button below to reset your password:
    </p>

    <div style="text-align: center; margin: 20px 0;">
      <a href="${resetPasswordUrl}" target="_blank" style="display: inline-block; font-size: 16px; font-weight: bold; color: #000; padding: 12px 24px; border: 1px solid #fff; border-radius: 5px; background-color: #fff; text-decoration: none;">
        Reset Password
      </a>
    </div>

    <p style="font-size: 16px; color: #ccc;">
      This link is valid for 15 minutes. Please do not share this email or link with anyone.
    </p>

    <p style="font-size: 14px; color: #999; word-break: break-all;">
      If the button above does not work, copy and paste the following URL into your browser: <br>
      <a href="${resetPasswordUrl}" style="color: #fff;">${resetPasswordUrl}</a>
    </p>

    <p style="font-size: 16px; color: #ccc;">
      If you did not request a password reset, please ignore this email.
    </p>

    <footer style="margin-top: 20px; text-align: center; font-size: 14px; color: #666;">
      <p>
        Thank you,<br>
        BookWorm Team
      </p>

      <p style="font-size: 12px; color: #444;">
        This is an automated message. Please do not reply to this email.
      </p>
    </footer>
  </div>`;
}