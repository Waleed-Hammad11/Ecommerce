import { env } from '../config/env.js';

export const buildVerificationEmail = (token) => {
  const verifyUrl = `${env.backendUrl}/api/v1/auth/verify-email/${token}`;

  return `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Verify Your Email</title>
</head>
<body style="margin:0;padding:0;background-color:#f0f4f8;font-family:Arial,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background-color:#f0f4f8;padding:40px 20px;">
    <tr>
      <td align="center">
        <table width="600" cellpadding="0" cellspacing="0"
          style="background-color:#ffffff;border-radius:12px;overflow:hidden;box-shadow:0 4px 20px rgba(0,0,0,0.08);">
          <!-- Header -->
          <tr>
            <td style="background:linear-gradient(135deg,#0057FF,#00C6FF);padding:40px;text-align:center;">
              <h1 style="margin:0;color:#ffffff;font-size:28px;font-weight:700;letter-spacing:-0.5px;">
                Welcome to ShopHub
              </h1>
              <p style="margin:8px 0 0;color:rgba(255,255,255,0.85);font-size:15px;">
                One step away from your account
              </p>
            </td>
          </tr>
          <!-- Body -->
          <tr>
            <td style="padding:40px;">
              <p style="color:#374151;font-size:16px;line-height:1.6;margin:0 0 24px;">
                Hi there! Thanks for registering. Please verify your email address
                to activate your account and start shopping.
              </p>
              <table width="100%" cellpadding="0" cellspacing="0">
                <tr>
                  <td align="center" style="padding:8px 0 32px;">
                    <a href="${verifyUrl}"
                      style="display:inline-block;padding:14px 32px;background:linear-gradient(135deg,#0057FF,#00C6FF);
                             color:#ffffff;border-radius:8px;text-decoration:none;font-size:16px;
                             font-weight:600;letter-spacing:0.3px;">
                      Verify My Account
                    </a>
                  </td>
                </tr>
              </table>
              <p style="color:#6b7280;font-size:13px;line-height:1.6;margin:0;">
                This link expires in <strong>24 hours</strong>. If you didn't create an account,
                you can safely ignore this email.
              </p>
              <hr style="border:none;border-top:1px solid #e5e7eb;margin:24px 0;">
              <p style="color:#9ca3af;font-size:12px;margin:0;">
                If the button doesn't work, copy this link:<br>
                <a href="${verifyUrl}" style="color:#0057FF;word-break:break-all;">${verifyUrl}</a>
              </p>
            </td>
          </tr>
          <!-- Footer -->
          <tr>
            <td style="background-color:#f9fafb;padding:20px;text-align:center;border-top:1px solid #e5e7eb;">
              <p style="color:#9ca3af;font-size:12px;margin:0;">
                © ${new Date().getFullYear()} ShopHub. All rights reserved.
              </p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>
  `.trim();
};
