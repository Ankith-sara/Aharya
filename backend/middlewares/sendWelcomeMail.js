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

// Helper function to format current date
const formatDate = () => {
  return new Date().toLocaleDateString('en-IN', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
};

const sendWelcomeMail = async (email, name = 'Admin') => {
  if (!email) {
    console.error('Missing email for welcome mail');
    return false;
  }

  const mailOptions = {
    from: `"Aharyas" <${process.env.EMAIL_USER}>`,
    to: email,
    subject: `Welcome to Aharyas, ${name}`,
    html: `
      <!DOCTYPE html>
      <html lang="en">
      <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Welcome to Aharyas</title>
          <style>
              @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@300;400;500;600&family=Inter:wght@300;400;500;600;700&display=swap');
          </style>
      </head>
      <body style="margin: 0; padding: 0; font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Helvetica, Arial, sans-serif; background: linear-gradient(to bottom, #fafaf9 0%, #ffffff 100%); color: #1a1a1a;">
          <table cellpadding="0" cellspacing="0" border="0" width="100%" style="background: linear-gradient(to bottom, #fafaf9 0%, #ffffff 100%); min-height: 100vh;">
              <tr>
                  <td align="center" style="padding: 60px 20px;">
                      <table cellpadding="0" cellspacing="0" border="0" width="680" style="max-width: 680px; background-color: #ffffff; box-shadow: 0 4px 24px rgba(0, 0, 0, 0.06);">
                          
                          <!-- Decorative Top Border -->
                          <tr>
                              <td style="height: 6px; background: linear-gradient(90deg, #1a1a1a 0%, #4a4a4a 50%, #1a1a1a 100%);"></td>
                          </tr>

                          <!-- Header -->
                          <tr>
                              <td style="padding: 50px 60px 40px; text-align: center; background: #ffffff; border-bottom: 1px solid #e7e7e7;">
                                  <h1 style="margin: 0 0 8px 0; font-family: 'Cormorant Garamond', Georgia, serif; font-size: 48px; font-weight: 300; letter-spacing: 8px; color: #1a1a1a; text-transform: uppercase;">AHARYAS</h1>
                                  <div style="width: 40px; height: 1px; background: #1a1a1a; margin: 0 auto 12px;"></div>
                                  <p style="margin: 0; font-family: 'Inter', sans-serif; font-size: 11px; letter-spacing: 3px; color: #6b6b6b; text-transform: uppercase; font-weight: 400;">Conscious Luxury · Indian Heritage</p>
                              </td>
                          </tr>

                          <!-- Hero Welcome Banner -->
                          <tr>
                              <td style="padding: 0; background: linear-gradient(135deg, #1a1a1a 0%, #2a2a2a 100%); position: relative;">
                                  <table cellpadding="0" cellspacing="0" border="0" width="100%">
                                      <tr>
                                          <td style="padding: 50px 60px; text-align: center;">
                                              <h2 style="margin: 0 0 16px 0; font-family: 'Cormorant Garamond', Georgia, serif; font-size: 36px; font-weight: 400; letter-spacing: 2px; color: #ffffff; line-height: 1.3;">Welcome to Our Family</h2>
                                              <p style="margin: 0; font-family: 'Inter', sans-serif; font-size: 15px; color: rgba(255,255,255,0.85); font-weight: 300; line-height: 1.7; max-width: 480px; margin: 0 auto;">Your admin account has been successfully created. We're honored to have you join the Aharyas team.</p>
                                          </td>
                                      </tr>
                                  </table>
                              </td>
                          </tr>

                          <!-- Personal Greeting -->
                          <tr>
                              <td style="padding: 50px 60px 40px; text-align: center; background: #ffffff;">
                                  <h3 style="margin: 0 0 16px 0; font-family: 'Cormorant Garamond', Georgia, serif; font-size: 28px; font-weight: 400; letter-spacing: 1px; color: #1a1a1a;">Hello, ${name}</h3>
                                  <p style="margin: 0; font-family: 'Inter', sans-serif; font-size: 15px; color: #525252; font-weight: 300; line-height: 1.8; max-width: 500px; margin: 0 auto;">
                                      Thank you for joining the <strong style="font-weight: 500; color: #1a1a1a;">Aharyas Admin Team</strong>. Together, we'll continue preserving India's handcrafted heritage and supporting artisans across the country.
                                  </p>
                              </td>
                          </tr>

                          <!-- Account Details Card -->
                          <tr>
                              <td style="padding: 0 60px 40px;">
                                  <table cellpadding="0" cellspacing="0" border="0" width="100%" style="border: 1px solid #e7e7e7; background: #ffffff;">
                                      <tr>
                                          <td style="padding: 24px 32px; background: #fafaf9; border-bottom: 1px solid #e7e7e7;">
                                              <h3 style="margin: 0; font-family: 'Inter', sans-serif; font-size: 11px; font-weight: 600; letter-spacing: 2px; text-transform: uppercase; color: #1a1a1a;">📋 Account Details</h3>
                                          </td>
                                      </tr>
                                      <tr>
                                          <td style="padding: 32px;">
                                              <table cellpadding="0" cellspacing="0" border="0" width="100%">
                                                  <tr>
                                                      <td style="padding: 12px 0; font-family: 'Inter', sans-serif; font-size: 13px; color: #737373; font-weight: 400; width: 35%;">Admin Name</td>
                                                      <td style="padding: 12px 0; font-family: 'Inter', sans-serif; font-size: 14px; color: #1a1a1a; font-weight: 500;">${name}</td>
                                                  </tr>
                                                  <tr style="border-top: 1px solid #f5f5f4;">
                                                      <td style="padding: 12px 0; font-family: 'Inter', sans-serif; font-size: 13px; color: #737373; font-weight: 400;">Email Address</td>
                                                      <td style="padding: 12px 0; font-family: 'Inter', sans-serif; font-size: 14px; color: #1a1a1a; font-weight: 400;">${email}</td>
                                                  </tr>
                                                  <tr style="border-top: 1px solid #f5f5f4;">
                                                      <td style="padding: 12px 0; font-family: 'Inter', sans-serif; font-size: 13px; color: #737373; font-weight: 400;">Account Type</td>
                                                      <td style="padding: 12px 0;">
                                                          <span style="display: inline-block; background: #1a1a1a; color: #ffffff; padding: 6px 16px; font-family: 'Inter', sans-serif; font-size: 10px; font-weight: 600; letter-spacing: 1.5px; text-transform: uppercase; border-radius: 2px;">Admin Access</span>
                                                      </td>
                                                  </tr>
                                                  <tr style="border-top: 1px solid #f5f5f4;">
                                                      <td style="padding: 12px 0; font-family: 'Inter', sans-serif; font-size: 13px; color: #737373; font-weight: 400;">Registration Date</td>
                                                      <td style="padding: 12px 0; font-family: 'Inter', sans-serif; font-size: 14px; color: #1a1a1a; font-weight: 400;">${formatDate()}</td>
                                                  </tr>
                                              </table>
                                          </td>
                                      </tr>
                                  </table>
                              </td>
                          </tr>

                          <!-- Quick Start Guide -->
                          <tr>
                              <td style="padding: 0 60px 40px;">
                                  <table cellpadding="0" cellspacing="0" border="0" width="100%" style="background: linear-gradient(135deg, #fafaf9 0%, #f5f5f4 100%); border: 1px solid #e7e7e7;">
                                      <tr>
                                          <td style="padding: 32px 36px;">
                                              <h3 style="margin: 0 0 24px 0; font-family: 'Cormorant Garamond', Georgia, serif; font-size: 24px; font-weight: 400; letter-spacing: 1px; color: #1a1a1a;">🚀 Quick Start Guide</h3>
                                              
                                              <!-- Step 1 -->
                                              <table cellpadding="0" cellspacing="0" border="0" width="100%" style="margin-bottom: 20px;">
                                                  <tr>
                                                      <td style="width: 40px; vertical-align: top;">
                                                          <div style="width: 32px; height: 32px; background: #1a1a1a; border-radius: 50%; display: flex; align-items: center; justify-content: center;">
                                                              <span style="font-family: 'Inter', sans-serif; color: #ffffff; font-weight: 600; font-size: 14px;">1</span>
                                                          </div>
                                                      </td>
                                                      <td style="padding-left: 16px;">
                                                          <h4 style="margin: 0 0 6px 0; font-family: 'Inter', sans-serif; font-size: 15px; font-weight: 600; color: #1a1a1a;">Access Your Dashboard</h4>
                                                          <p style="margin: 0; font-family: 'Inter', sans-serif; font-size: 14px; color: #525252; font-weight: 300; line-height: 1.7;">Log in to your admin panel to start managing products, orders, and customers.</p>
                                                      </td>
                                                  </tr>
                                              </table>

                                              <!-- Step 2 -->
                                              <table cellpadding="0" cellspacing="0" border="0" width="100%" style="margin-bottom: 20px;">
                                                  <tr>
                                                      <td style="width: 40px; vertical-align: top;">
                                                          <div style="width: 32px; height: 32px; background: #1a1a1a; border-radius: 50%; display: flex; align-items: center; justify-content: center;">
                                                              <span style="font-family: 'Inter', sans-serif; color: #ffffff; font-weight: 600; font-size: 14px;">2</span>
                                                          </div>
                                                      </td>
                                                      <td style="padding-left: 16px;">
                                                          <h4 style="margin: 0 0 6px 0; font-family: 'Inter', sans-serif; font-size: 15px; font-weight: 600; color: #1a1a1a;">Set Up Your Profile</h4>
                                                          <p style="margin: 0; font-family: 'Inter', sans-serif; font-size: 14px; color: #525252; font-weight: 300; line-height: 1.7;">Complete your admin profile and configure your preferences for optimal workflow.</p>
                                                      </td>
                                                  </tr>
                                              </table>

                                              <!-- Step 3 -->
                                              <table cellpadding="0" cellspacing="0" border="0" width="100%">
                                                  <tr>
                                                      <td style="width: 40px; vertical-align: top;">
                                                          <div style="width: 32px; height: 32px; background: #1a1a1a; border-radius: 50%; display: flex; align-items: center; justify-content: center;">
                                                              <span style="font-family: 'Inter', sans-serif; color: #ffffff; font-weight: 600; font-size: 14px;">3</span>
                                                          </div>
                                                      </td>
                                                      <td style="padding-left: 16px;">
                                                          <h4 style="margin: 0 0 6px 0; font-family: 'Inter', sans-serif; font-size: 15px; font-weight: 600; color: #1a1a1a;">Start Managing</h4>
                                                          <p style="margin: 0; font-family: 'Inter', sans-serif; font-size: 14px; color: #525252; font-weight: 300; line-height: 1.7;">Begin adding products, processing orders, and supporting our artisan community.</p>
                                                      </td>
                                                  </tr>
                                              </table>
                                          </td>
                                      </tr>
                                  </table>
                              </td>
                          </tr>

                          <!-- Admin Features -->
                          <tr>
                              <td style="padding: 0 60px 40px;">
                                  <table cellpadding="0" cellspacing="0" border="0" width="100%" style="border: 1px solid #e7e7e7; background: #ffffff;">
                                      <tr>
                                          <td style="padding: 24px 32px; background: #fafaf9; border-bottom: 1px solid #e7e7e7;">
                                              <h3 style="margin: 0; font-family: 'Inter', sans-serif; font-size: 11px; font-weight: 600; letter-spacing: 2px; text-transform: uppercase; color: #1a1a1a;">⭐ Admin Features</h3>
                                          </td>
                                      </tr>
                                      <tr>
                                          <td style="padding: 32px;">
                                              <table cellpadding="0" cellspacing="0" border="0" width="100%">
                                                  <tr>
                                                      <td style="width: 50%; padding: 10px 0; font-family: 'Inter', sans-serif; font-size: 14px; color: #525252; font-weight: 400;">
                                                          <span style="margin-right: 8px;">📦</span> Product Management
                                                      </td>
                                                      <td style="width: 50%; padding: 10px 0; font-family: 'Inter', sans-serif; font-size: 14px; color: #525252; font-weight: 400;">
                                                          <span style="margin-right: 8px;">📊</span> Sales Analytics
                                                      </td>
                                                  </tr>
                                                  <tr>
                                                      <td style="width: 50%; padding: 10px 0; font-family: 'Inter', sans-serif; font-size: 14px; color: #525252; font-weight: 400;">
                                                          <span style="margin-right: 8px;">🛒</span> Order Processing
                                                      </td>
                                                      <td style="width: 50%; padding: 10px 0; font-family: 'Inter', sans-serif; font-size: 14px; color: #525252; font-weight: 400;">
                                                          <span style="margin-right: 8px;">👥</span> Customer Management
                                                      </td>
                                                  </tr>
                                                  <tr>
                                                      <td style="width: 50%; padding: 10px 0; font-family: 'Inter', sans-serif; font-size: 14px; color: #525252; font-weight: 400;">
                                                          <span style="margin-right: 8px;">💰</span> Revenue Tracking
                                                      </td>
                                                      <td style="width: 50%; padding: 10px 0; font-family: 'Inter', sans-serif; font-size: 14px; color: #525252; font-weight: 400;">
                                                          <span style="margin-right: 8px;">📈</span> Growth Insights
                                                      </td>
                                                  </tr>
                                              </table>
                                          </td>
                                      </tr>
                                  </table>
                              </td>
                          </tr>

                          <!-- Support Section -->
                          <tr>
                              <td style="padding: 0 60px 40px;">
                                  <table cellpadding="0" cellspacing="0" border="0" width="100%" style="background: #fffbf5; border: 1px solid #fde68a; border-left: 4px solid #d97706;">
                                      <tr>
                                          <td style="padding: 28px 32px;">
                                              <h4 style="margin: 0 0 12px 0; font-family: 'Inter', sans-serif; font-size: 14px; font-weight: 600; color: #92400e;">💬 Need Help?</h4>
                                              <p style="margin: 0 0 20px 0; font-family: 'Inter', sans-serif; font-size: 14px; color: #78350f; font-weight: 300; line-height: 1.7;">
                                                  Our support team is here to help you get the most out of your admin experience.
                                              </p>
                                              <table cellpadding="0" cellspacing="0" border="0">
                                                  <tr>
                                                      <td style="padding-right: 20px;">
                                                          <a href="mailto:aharyasofficial@gmail.com" style="font-family: 'Inter', sans-serif; font-size: 13px; color: #92400e; text-decoration: none; font-weight: 500; border-bottom: 1px solid #d97706;">📧 Email Support</a>
                                                      </td>
                                                      <td style="padding-right: 20px;">
                                                          <a href="#" style="font-family: 'Inter', sans-serif; font-size: 13px; color: #92400e; text-decoration: none; font-weight: 500; border-bottom: 1px solid #d97706;">📖 Admin Guide</a>
                                                      </td>
                                                      <td>
                                                          <a href="#" style="font-family: 'Inter', sans-serif; font-size: 13px; color: #92400e; text-decoration: none; font-weight: 500; border-bottom: 1px solid #d97706;">💬 Live Chat</a>
                                                      </td>
                                                  </tr>
                                              </table>
                                          </td>
                                      </tr>
                                  </table>
                              </td>
                          </tr>

                          <!-- Call to Action -->
                          <tr>
                              <td style="padding: 0 60px 50px; text-align: center;">
                                  <table cellpadding="0" cellspacing="0" border="0" width="100%">
                                      <tr>
                                          <td align="center">
                                              <a href="https://admin.aharyas.com/" style="display: inline-block; background: #1a1a1a; color: #ffffff; padding: 16px 48px; font-family: 'Inter', sans-serif; font-size: 13px; font-weight: 600; letter-spacing: 1.5px; text-transform: uppercase; text-decoration: none; border-radius: 2px; box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);">
                                                  Access Admin Dashboard
                                              </a>
                                          </td>
                                      </tr>
                                  </table>
                              </td>
                          </tr>

                          <!-- Closing Message -->
                          <tr>
                              <td style="padding: 40px 60px; text-align: center; background: #fafaf9; border-top: 1px solid #e7e7e7;">
                                  <p style="margin: 0 0 8px 0; font-family: 'Cormorant Garamond', Georgia, serif; font-size: 17px; color: #1a1a1a; font-weight: 300; letter-spacing: 0.5px; font-style: italic;">Welcome to the Aharyas family</p>
                                  <p style="margin: 0; font-family: 'Inter', sans-serif; font-size: 13px; color: #737373; font-weight: 300; line-height: 1.7;">
                                      We're excited to work together in preserving India's handcrafted heritage.
                                  </p>
                              </td>
                          </tr>

                          <!-- Footer -->
                          <tr>
                              <td style="padding: 32px 60px; text-align: center; background: #ffffff; border-top: 1px solid #e7e7e7;">
                                  <p style="margin: 0 0 8px 0; font-family: 'Inter', sans-serif; font-size: 12px; color: #737373; font-weight: 300;">
                                      This email was sent to <a href="mailto:${email}" style="color: #1a1a1a; text-decoration: none; font-weight: 500; border-bottom: 1px solid #d4d4d4;">${email}</a>
                                  </p>
                                  <p style="margin: 0; font-family: 'Inter', sans-serif; font-size: 12px; color: #737373; font-weight: 300;">
                                      Questions? <a href="mailto:aharyasofficial@gmail.com" style="color: #1a1a1a; text-decoration: none; font-weight: 500; border-bottom: 1px solid #d4d4d4;">Contact Support</a>
                                  </p>
                                  <div style="margin: 20px 0 0 0; padding-top: 20px; border-top: 1px solid #e7e7e7;">
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
    return true;
  } catch (error) {
    return false;
  }
};

export default sendWelcomeMail;