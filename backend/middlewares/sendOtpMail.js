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

  const mailOptions = {
    from: `"Aharyas" <${process.env.EMAIL_USER}>`,
    to: email,
    subject: `${isAdmin ? 'Admin ' : ''}Verification Code – Aharyas`,
    html: `
      <!DOCTYPE html>
      <html lang="en">
      <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Email Verification - Aharyas</title>
          <style>
              @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@300;400;500;600&family=Inter:wght@300;400;500;600;700&display=swap');
          </style>
      </head>
      <body style="margin: 0; padding: 0; font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Helvetica, Arial, sans-serif; background: linear-gradient(to bottom, #fafaf9 0%, #ffffff 100%); color: #1a1a1a;">
          <table cellpadding="0" cellspacing="0" border="0" width="100%" style="background: linear-gradient(to bottom, #fafaf9 0%, #ffffff 100%); min-height: 100vh;">
              <tr>
                  <td align="center" style="padding: 60px 20px;">
                      <table cellpadding="0" cellspacing="0" border="0" width="600" style="max-width: 600px; background-color: #ffffff; box-shadow: 0 4px 24px rgba(0, 0, 0, 0.06);">
                          
                          <!-- Decorative Top Border -->
                          <tr>
                              <td style="height: 6px; background: linear-gradient(90deg, #1a1a1a 0%, #4a4a4a 50%, #1a1a1a 100%);"></td>
                          </tr>

                          <!-- Header -->
                          <tr>
                              <td style="padding: 50px 50px 40px; text-align: center; background: #ffffff; border-bottom: 1px solid #e7e7e7;">
                                  <h1 style="margin: 0 0 8px 0; font-family: 'Cormorant Garamond', Georgia, serif; font-size: 48px; font-weight: 300; letter-spacing: 8px; color: #1a1a1a; text-transform: uppercase;">AHARYAS</h1>
                                  <div style="width: 40px; height: 1px; background: #1a1a1a; margin: 0 auto 12px;"></div>
                                  <p style="margin: 0; font-family: 'Inter', sans-serif; font-size: 11px; letter-spacing: 3px; color: #6b6b6b; text-transform: uppercase; font-weight: 400;">${portalType}</p>
                              </td>
                          </tr>

                          ${isAdmin ? `
                          <!-- Admin Alert Banner -->
                          <tr>
                              <td style="background: linear-gradient(135deg, #1a1a1a 0%, #2a2a2a 100%); padding: 16px 32px; text-align: center;">
                                  <p style="margin: 0; font-family: 'Inter', sans-serif; font-size: 11px; color: #ffffff; font-weight: 600; letter-spacing: 2px; text-transform: uppercase;">🔐 Admin Access Verification</p>
                              </td>
                          </tr>
                          ` : ''}

                          <!-- Main Content -->
                          <tr>
                              <td style="padding: 50px 50px 40px; text-align: center; background: #ffffff;">
                                  <h2 style="margin: 0 0 16px 0; font-family: 'Cormorant Garamond', Georgia, serif; font-size: 32px; font-weight: 400; letter-spacing: 1px; color: #1a1a1a;">Email Verification</h2>
                                  <p style="margin: 0; font-family: 'Inter', sans-serif; font-size: 15px; color: #525252; font-weight: 300; line-height: 1.7; max-width: 440px; margin: 0 auto;">
                                      We've sent you a verification code to complete your ${registrationType}. Please enter the code below to verify your email address.
                                  </p>
                              </td>
                          </tr>

                          <!-- OTP Display Card -->
                          <tr>
                              <td style="padding: 0 50px 40px;">
                                  <table cellpadding="0" cellspacing="0" border="0" width="100%" style="background: linear-gradient(135deg, #fafaf9 0%, #f5f5f4 100%); border: 2px dashed #d4d4d4;">
                                      <tr>
                                          <td style="padding: 40px 32px; text-align: center;">
                                              <p style="margin: 0 0 20px 0; font-family: 'Inter', sans-serif; font-size: 11px; color: #737373; font-weight: 600; letter-spacing: 2px; text-transform: uppercase;">Your Verification Code</p>
                                              
                                              <!-- OTP Code -->
                                              <div style="font-family: 'Courier New', Courier, monospace; font-size: 42px; font-weight: 700; color: #1a1a1a; letter-spacing: 12px; margin: 0 0 20px 0; text-shadow: 0 2px 8px rgba(0,0,0,0.08);">
                                                  ${otp}
                                              </div>
                                              
                                              <div style="display: inline-block; background: #ffffff; border: 1px solid #e7e7e7; border-radius: 4px; padding: 10px 20px;">
                                                  <p style="margin: 0; font-family: 'Inter', sans-serif; font-size: 12px; color: #737373; font-weight: 400;">
                                                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" style="vertical-align: middle; margin-right: 6px;">
                                                          <circle cx="12" cy="12" r="10" stroke="#737373" stroke-width="2"/>
                                                          <path d="M12 6V12L16 14" stroke="#737373" stroke-width="2" stroke-linecap="round"/>
                                                      </svg>
                                                      Expires in <strong style="color: #1a1a1a; font-weight: 600;">5 minutes</strong>
                                                  </p>
                                              </div>
                                          </td>
                                      </tr>
                                  </table>
                              </td>
                          </tr>

                          <!-- Instructions -->
                          <tr>
                              <td style="padding: 0 50px 40px;">
                                  <table cellpadding="0" cellspacing="0" border="0" width="100%" style="border: 1px solid #e7e7e7; background: #ffffff;">
                                      <tr>
                                          <td style="padding: 24px 28px; background: #fafaf9; border-bottom: 1px solid #e7e7e7;">
                                              <h3 style="margin: 0; font-family: 'Inter', sans-serif; font-size: 11px; font-weight: 600; letter-spacing: 2px; text-transform: uppercase; color: #1a1a1a;">📝 Next Steps</h3>
                                          </td>
                                      </tr>
                                      <tr>
                                          <td style="padding: 28px;">
                                              <table cellpadding="0" cellspacing="0" border="0" width="100%">
                                                  <tr>
                                                      <td style="padding: 12px 0; font-family: 'Inter', sans-serif; font-size: 14px; color: #525252; font-weight: 300; line-height: 1.8;">
                                                          <strong style="color: #1a1a1a; font-weight: 600;">1.</strong> Return to the ${isAdmin ? 'admin ' : ''}registration page
                                                      </td>
                                                  </tr>
                                                  <tr style="border-top: 1px solid #f5f5f4;">
                                                      <td style="padding: 12px 0; font-family: 'Inter', sans-serif; font-size: 14px; color: #525252; font-weight: 300; line-height: 1.8;">
                                                          <strong style="color: #1a1a1a; font-weight: 600;">2.</strong> Enter the 6-digit code shown above
                                                      </td>
                                                  </tr>
                                                  <tr style="border-top: 1px solid #f5f5f4;">
                                                      <td style="padding: 12px 0; font-family: 'Inter', sans-serif; font-size: 14px; color: #525252; font-weight: 300; line-height: 1.8;">
                                                          <strong style="color: #1a1a1a; font-weight: 600;">3.</strong> Click "Verify & Create Account" to complete
                                                      </td>
                                                  </tr>
                                              </table>
                                          </td>
                                      </tr>
                                  </table>
                              </td>
                          </tr>

                          ${isAdmin ? `
                          <!-- Admin Notice -->
                          <tr>
                              <td style="padding: 0 50px 40px;">
                                  <table cellpadding="0" cellspacing="0" border="0" width="100%" style="background: #fff5f5; border: 1px solid #fecaca; border-left: 4px solid #dc2626;">
                                      <tr>
                                          <td style="padding: 24px 28px;">
                                              <h4 style="margin: 0 0 12px 0; font-family: 'Inter', sans-serif; font-size: 13px; font-weight: 600; letter-spacing: 1px; color: #991b1b; text-transform: uppercase;">⚠️ Admin Access Notice</h4>
                                              <p style="margin: 0; font-family: 'Inter', sans-serif; font-size: 14px; color: #7f1d1d; font-weight: 400; line-height: 1.7;">
                                                  This verification is for administrative access to the Aharyas platform. Only authorized personnel should complete this verification process.
                                              </p>
                                          </td>
                                      </tr>
                                  </table>
                              </td>
                          </tr>
                          ` : ''}

                          <!-- Security Notice -->
                          <tr>
                              <td style="padding: 0 50px 40px;">
                                  <table cellpadding="0" cellspacing="0" border="0" width="100%" style="background: #fffbf5; border: 1px solid #fde68a; border-left: 4px solid #d97706;">
                                      <tr>
                                          <td style="padding: 24px 28px;">
                                              <h4 style="margin: 0 0 16px 0; font-family: 'Inter', sans-serif; font-size: 13px; font-weight: 600; letter-spacing: 1px; color: #92400e; text-transform: uppercase;">🛡️ Security Notice</h4>
                                              <table cellpadding="0" cellspacing="0" border="0" width="100%">
                                                  <tr>
                                                      <td style="padding: 6px 0; font-family: 'Inter', sans-serif; font-size: 13px; color: #78350f; font-weight: 400; line-height: 1.7;">
                                                          • Never share this code with anyone
                                                      </td>
                                                  </tr>
                                                  <tr>
                                                      <td style="padding: 6px 0; font-family: 'Inter', sans-serif; font-size: 13px; color: #78350f; font-weight: 400; line-height: 1.7;">
                                                          • Our team will never ask for your verification code
                                                      </td>
                                                  </tr>
                                                  <tr>
                                                      <td style="padding: 6px 0; font-family: 'Inter', sans-serif; font-size: 13px; color: #78350f; font-weight: 400; line-height: 1.7;">
                                                          • This code is valid for 5 minutes only
                                                      </td>
                                                  </tr>
                                                  <tr>
                                                      <td style="padding: 6px 0; font-family: 'Inter', sans-serif; font-size: 13px; color: #78350f; font-weight: 400; line-height: 1.7;">
                                                          • If you didn't request this, please ignore this email
                                                      </td>
                                                  </tr>
                                              </table>
                                          </td>
                                      </tr>
                                  </table>
                              </td>
                          </tr>

                          <!-- Help Section -->
                          <tr>
                              <td style="padding: 0 50px 50px;">
                                  <table cellpadding="0" cellspacing="0" border="0" width="100%" style="background: #fafaf9; border: 1px solid #e7e7e7;">
                                      <tr>
                                          <td style="padding: 28px; text-align: center;">
                                              <h4 style="margin: 0 0 12px 0; font-family: 'Inter', sans-serif; font-size: 14px; font-weight: 600; color: #1a1a1a;">Having trouble?</h4>
                                              <p style="margin: 0; font-family: 'Inter', sans-serif; font-size: 13px; color: #525252; font-weight: 300; line-height: 1.8;">
                                                  Make sure you're entering the code exactly as shown • Check if the code has expired • Try requesting a new verification code • Contact support if the issue persists
                                              </p>
                                          </td>
                                      </tr>
                                  </table>
                              </td>
                          </tr>

                          <!-- Footer -->
                          <tr>
                              <td style="padding: 40px 50px; text-align: center; background: #fafaf9; border-top: 1px solid #e7e7e7;">
                                  <p style="margin: 0 0 8px 0; font-family: 'Inter', sans-serif; font-size: 13px; color: #737373; font-weight: 300;">
                                      This is an automated verification email
                                  </p>
                                  <p style="margin: 0; font-family: 'Inter', sans-serif; font-size: 13px; color: #737373; font-weight: 300;">
                                      Need help? Contact us at <a href="mailto:support@aharyas.com" style="color: #1a1a1a; text-decoration: none; font-weight: 500; border-bottom: 1px solid #1a1a1a;">support@aharyas.com</a>
                                  </p>
                                  <div style="margin: 24px 0 0 0; padding-top: 24px; border-top: 1px solid #e7e7e7;">
                                      <p style="margin: 0; font-family: 'Inter', sans-serif; font-size: 11px; color: #a3a3a3; font-weight: 300; line-height: 1.6;">
                                          © ${new Date().getFullYear()} Aharyas. All rights reserved.<br>
                                          Preserving heritage, one thread at a time.
                                      </p>
                                  </div>
                              </td>
                          </tr>

                          <!-- Decorative Bottom Border -->
                          <tr>
                              <td style="height: 6px; background: linear-gradient(90deg, #1a1a1a 0%, #4a4a4a 50%, #1a1a1a 100%);"></td>
                          </tr>

                      </table>
                  </td>
              </tr>
          </table>
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