import jwt from 'jsonwebtoken'

export const emailTemplate = (email) => {
const token = jwt.sign({ email }, 'ntiMail');

return `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>Verify Email</title>
</head>
<body style="font-family: Arial, sans-serif; background-color: #f4f4f4; padding: 40px;">
    <div style="max-width: 600px; margin: auto; background-color: #fff; border-radius: 10px; padding: 20px; box-shadow: 0 2px 8px rgba(0,0,0,0.1);">
    <div style="text-align: center;">
        <img src="https://bb3fab78-340c-4905-8e16-895ee1a74cfe.b-cdn.net/e/139ddc72-d7a7-439f-b9b0-bce1dd77550e/b6733da6-bb18-4922-89c6-890a56b7ef9a.png" alt="Logo" width="60">
        <h2 style="color: #333;">Please verify your email </h2>
        <p style="color: #555;">Click the button below to verify your email address and activate your account.</p>
        <a href="http://localhost:3000/user/verify/${token}" 
        style="display: inline-block; padding: 12px 24px; margin: 20px 0; background-color: #0057FF; color: #fff; border-radius: 8px; text-decoration: none;">
        Verify my account
        </a>
        <p style="font-size: 13px; color: #999;">If you didn't request this, just ignore this email.</p>
    </div>
    </div>
</body>
</html>
`;
};
