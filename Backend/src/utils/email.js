import { getMailTransporter } from '../config/mailer.js';
import { buildVerificationEmail } from './email.template.js';
import { logger } from './logger.js';
import { env } from '../config/env.js';

export const sendVerificationEmail = async (email, token) => {
  try {
    const transporter = getMailTransporter();

    const info = await transporter.sendMail({
      from: `"ShopHub" <${env.smtp.user}>`,
      to: email,
      subject: 'Verify your email address',
      html: buildVerificationEmail(token),
    });

    logger.info(`Verification email sent to ${email} [${info.messageId}]`);
    return true;
  } catch (error) {
    logger.error(`Failed to send verification email to ${email}: ${error.message}`);
    return false;
  }
};
