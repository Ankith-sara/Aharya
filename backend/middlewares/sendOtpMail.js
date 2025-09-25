import nodemailer from 'nodemailer';
import dotenv from 'dotenv';

dotenv.config();

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
  pool: true,
  maxConnections: 5,
  maxMessages: 100,
});

const sendOtpMail = async (email, otp, role = 'user') => {
  if (!email || !otp) {
    console.error('Missing email or OTP for verification mail');
    return false;
  }

  const isAdmin = role === 'admin';
  const portalType = isAdmin ? 'Admin Portal' : 'Customer Account';
  const registrationType = isAdmin ? 'admin registration' : 'account registration';
  const messageType = isAdmin ? 'admin account verification' : 'account verification';

  const mailOptions = {
    from: `"Aharyas" <${process.env.EMAIL_USER}>`,
    to: email,
    subject: `🔐 Your Verification Code - Aharyas ${isAdmin ? 'Admin' : 'Account'}`,
    html: `
      <!DOCTYPE html>
      <html>
      <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Email Verification</title>
      </head>
      <body style="margin: 0; padding: 0; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #f8f9fa;">
          <div style="max-width: 650px; margin: 0 auto; background: white; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 6px rgba(0,0,0,0.1);">
              
              <!-- Header -->
              <div style="background: linear-gradient(135deg, #8B4513 0%, #D2B48C 100%); padding: 30px 20px; text-align: center;">
                  <h1 style="color: white; margin: 0; font-size: 28px; font-weight: 300;">AHARYAS</h1>
                  <p style="color: rgba(255,255,255,0.9); margin: 8px 0 0 0; font-size: 14px;">${portalType} Access</p>
              </div>

              <!-- Main Content -->
              <div style="padding: 40px 30px; text-align: center;">
                  <!-- Security Icon -->
                  <div style="width: 80px; height: 80px; background: linear-gradient(135deg, ${isAdmin ? '#FF6B35' : '#667eea'} 0%, ${isAdmin ? '#F7931E' : '#764ba2'} 100%); border-radius: 50%; margin: 0 auto 25px; display: flex; align-items: center; justify-content: center;">
                      <div style="width: 40px; height: 40px; border: 3px solid white; border-radius: 50%; position: relative;">
                          <div style="width: 12px; height: 8px; background: white; border-radius: 2px; position: absolute; top: 50%; left: 50%; transform: translate(-50%, -60%);"></div>
                      </div>
                  </div>

                  <h2 style="color: #333; margin: 0 0 15px 0; font-size: 24px;">Email Verification Required</h2>
                  <p style="color: #666; margin: 0 0 30px 0; font-size: 16px; line-height: 1.5;">
                      We've sent you a verification code to complete your ${registrationType}. 
                      Please enter the code below to verify your email address.
                  </p>

                  <!-- OTP Display -->
                  <div style="background: linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%); border-radius: 12px; padding: 30px; margin: 30px 0; border: 2px dashed #dee2e6;">
                      <p style="color: #666; margin: 0 0 15px 0; font-size: 14px; text-transform: uppercase; letter-spacing: 1px;">Your Verification Code</p>
                      <div style="font-size: 36px; font-weight: bold; color: #333; letter-spacing: 8px; font-family: 'Courier New', monospace; margin: 10px 0; text-shadow: 0 2px 4px rgba(0,0,0,0.1);">
                          ${otp}
                      </div>
                      <p style="color: #999; margin: 15px 0 0 0; font-size: 12px;">
                          This code will expire in 5 minutes
                      </p>
                  </div>

                  <!-- Security Notice -->
                  <div style="background: #fff8e1; border-radius: 8px; padding: 20px; margin: 25px 0; text-align: left; border-left: 4px solid #ffb74d;">
                      <h4 style="margin: 0 0 10px 0; color: #f57c00; font-size: 16px;">🛡️ Security Notice</h4>
                      <ul style="color: #666; margin: 0; padding-left: 20px; font-size: 14px; line-height: 1.6;">
                          <li>Never share this code with anyone</li>
                          <li>Our team will never ask for your verification code</li>
                          <li>This code is valid for 5 minutes only</li>
                          <li>If you didn't request this, please ignore this email</li>
                      </ul>
                  </div>

                  <!-- Instructions -->
                  <div style="background: ${isAdmin ? '#fff3e0' : '#e8f5e8'}; border-radius: 8px; padding: 20px; margin: 25px 0;">
                      <h4 style="margin: 0 0 10px 0; color: ${isAdmin ? '#f57c00' : '#2e7d32'}; font-size: 16px;">📝 What to do next:</h4>
                      <p style="color: ${isAdmin ? '#ef6c00' : '#388e3c'}; margin: 0; font-size: 14px; line-height: 1.6;">
                          1. Return to the ${isAdmin ? 'admin ' : ''}registration page<br>
                          2. Enter the 6-digit code above<br>
                          3. Click "Verify & Create Account" to complete your registration
                      </p>
                  </div>

                  ${isAdmin ? `
                  <!-- Admin Specific Notice -->
                  <div style="background: #ffebee; border-radius: 8px; padding: 20px; margin: 25px 0; text-align: left; border-left: 4px solid #f44336;">
                      <h4 style="margin: 0 0 10px 0; color: #c62828; font-size: 16px;">⚠️ Admin Access Notice</h4>
                      <p style="color: #d32f2f; margin: 0; font-size: 14px; line-height: 1.6;">
                          This verification is for administrative access to the Aharyas platform. 
                          Only authorized personnel should complete this verification process.
                      </p>
                  </div>
                  ` : ''}

                  <!-- Trouble with verification -->
                  <div style="margin-top: 30px; padding: 20px; background: #f8f9fa; border-radius: 8px;">
                      <h4 style="margin: 0 0 10px 0; color: #333; font-size: 16px;">Having trouble?</h4>
                      <p style="color: #666; margin: 0; font-size: 14px; line-height: 1.6;">
                          • Make sure you're entering the code exactly as shown<br>
                          • Check if the code has expired (valid for 5 minutes)<br>
                          • Try requesting a new verification code<br>
                          • Contact support if the issue persists
                      </p>
                  </div>
              </div>

              <!-- Footer -->
              <div style="background: #f8f9fa; padding: 25px 20px; text-align: center; border-top: 1px solid #eee;">
                  <p style="margin: 0 0 10px 0; color: #666; font-size: 14px;">
                      This is an automated message for ${messageType}
                  </p>
                  <p style="margin: 0; color: #999; font-size: 12px;">
                      Need help? Contact us at <a href="mailto:support@aharyas.com" style="color: #667eea; text-decoration: none;">support@aharyas.com</a>
                  </p>
              </div>
          </div>
      </body>
      </html>
    `,
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log(`OTP email sent successfully for ${role} registration to ${email}`);
    return true;
  } catch (error) {
    console.error('Failed to send OTP email:', error.message);
    return false;
  }
};

export default sendOtpMail;