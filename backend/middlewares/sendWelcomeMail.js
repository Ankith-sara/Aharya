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
    subject: `🎉 Welcome to Aharyas - ${name}!`,
    html: `
      <!DOCTYPE html>
      <html>
      <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Welcome to Aharyas</title>
      </head>
      <body style="margin: 0; padding: 0; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #f8f9fa;">
          <div style="max-width: 650px; margin: 0 auto; background: white; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 6px rgba(0,0,0,0.1);">
              
              <!-- Header -->
              <div style="background: linear-gradient(135deg, #8B4513 0%, #D2B48C 100%); padding: 30px 20px; text-align: center;">
                  <h1 style="color: white; margin: 0; font-size: 28px; font-weight: 300;">AHARYAS</h1>
                  <p style="color: rgba(255,255,255,0.9); margin: 8px 0 0 0; font-size: 14px;">Premium Fashion Store</p>
              </div>

              <!-- Celebration Banner -->
              <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 25px 20px; text-align: center; position: relative;">
                  <div style="position: absolute; top: 0; left: 0; right: 0; bottom: 0; background: url('data:image/svg+xml,<svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 100 100\"><text y=\"50\" font-size=\"20\" fill=\"rgba(255,255,255,0.1)\">🎉</text></svg>') repeat; opacity: 0.3;"></div>
                  <h2 style="color: white; margin: 0; font-size: 24px; position: relative; z-index: 1;">Welcome Aboard!</h2>
                  <p style="color: rgba(255,255,255,0.9); margin: 8px 0 0 0; font-size: 16px; position: relative; z-index: 1;">Your admin account has been successfully created</p>
              </div>

              <!-- Main Content -->
              <div style="padding: 40px 30px;">
                  <!-- Personal Welcome -->
                  <div style="text-align: center; margin-bottom: 35px;">
                      <!-- Profile Avatar -->
                      <div style="width: 100px; height: 100px; background: linear-gradient(135deg, #4CAF50 0%, #45a049 100%); border-radius: 50%; margin: 0 auto 20px; display: flex; align-items: center; justify-content: center; color: white; font-size: 36px; font-weight: bold;">
                          ${name.charAt(0).toUpperCase()}
                      </div>
                      
                      <h3 style="color: #333; margin: 0 0 10px 0; font-size: 22px;">Hello ${name}!</h3>
                      <p style="color: #666; margin: 0; font-size: 16px; line-height: 1.6;">
                          Thank you for joining the <strong>Aharyas Admin Team</strong>. We're excited to have you managing our premium fashion platform.
                      </p>
                  </div>

                  <!-- Account Details -->
                  <div style="background: #f8f9fa; border-radius: 12px; padding: 25px; margin-bottom: 30px; border-left: 4px solid #4CAF50;">
                      <h4 style="margin: 0 0 15px 0; color: #333; font-size: 18px;">📋 Account Details</h4>
                      <table style="width: 100%; border-collapse: collapse;">
                          <tr>
                              <td style="padding: 8px 0; color: #666; width: 30%;">Admin Name:</td>
                              <td style="padding: 8px 0; color: #333; font-weight: 600;">${name}</td>
                          </tr>
                          <tr>
                              <td style="padding: 8px 0; color: #666;">Email Address:</td>
                              <td style="padding: 8px 0; color: #333;">${email}</td>
                          </tr>
                          <tr>
                              <td style="padding: 8px 0; color: #666;">Account Type:</td>
                              <td style="padding: 8px 0;"><span style="background: #4CAF50; color: white; padding: 4px 12px; border-radius: 20px; font-size: 12px; font-weight: bold;">Admin Access</span></td>
                          </tr>
                          <tr>
                              <td style="padding: 8px 0; color: #666;">Registration Date:</td>
                              <td style="padding: 8px 0; color: #333;">${formatDate()}</td>
                          </tr>
                      </table>
                  </div>

                  <!-- Quick Start Guide -->
                  <div style="background: #e8f5e8; border-radius: 12px; padding: 25px; margin-bottom: 30px;">
                      <h4 style="margin: 0 0 20px 0; color: #2e7d32; font-size: 18px;">🚀 Quick Start Guide</h4>
                      <div style="space-y: 15px;">
                          <div style="display: flex; align-items: flex-start; margin-bottom: 15px;">
                              <div style="width: 30px; height: 30px; background: #4CAF50; border-radius: 50%; display: flex; align-items: center; justify-content: center; margin-right: 15px; flex-shrink: 0;">
                                  <span style="color: white; font-weight: bold; font-size: 14px;">1</span>
                              </div>
                              <div>
                                  <h5 style="margin: 0 0 5px 0; color: #333; font-size: 16px;">Access Your Dashboard</h5>
                                  <p style="margin: 0; color: #666; font-size: 14px; line-height: 1.5;">Log in to your admin panel to start managing products, orders, and customers.</p>
                              </div>
                          </div>
                          
                          <div style="display: flex; align-items: flex-start; margin-bottom: 15px;">
                              <div style="width: 30px; height: 30px; background: #4CAF50; border-radius: 50%; display: flex; align-items: center; justify-content: center; margin-right: 15px; flex-shrink: 0;">
                                  <span style="color: white; font-weight: bold; font-size: 14px;">2</span>
                              </div>
                              <div>
                                  <h5 style="margin: 0 0 5px 0; color: #333; font-size: 16px;">Set Up Your Profile</h5>
                                  <p style="margin: 0; color: #666; font-size: 14px; line-height: 1.5;">Complete your admin profile and configure your preferences.</p>
                              </div>
                          </div>
                          
                          <div style="display: flex; align-items: flex-start; margin-bottom: 15px;">
                              <div style="width: 30px; height: 30px; background: #4CAF50; border-radius: 50%; display: flex; align-items: center; justify-content: center; margin-right: 15px; flex-shrink: 0;">
                                  <span style="color: white; font-weight: bold; font-size: 14px;">3</span>
                              </div>
                              <div>
                                  <h5 style="margin: 0 0 5px 0; color: #333; font-size: 16px;">Start Managing</h5>
                                  <p style="margin: 0; color: #666; font-size: 14px; line-height: 1.5;">Begin adding products, processing orders, and growing your business.</p>
                              </div>
                          </div>
                      </div>
                  </div>

                  <!-- Admin Features -->
                  <div style="background: #fff3e0; border-radius: 12px; padding: 25px; margin-bottom: 30px;">
                      <h4 style="margin: 0 0 20px 0; color: #f57c00; font-size: 18px;">⭐ Admin Features Available</h4>
                      <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 15px;">
                          <div style="display: flex; align-items: center;">
                              <span style="margin-right: 10px;">📦</span>
                              <span style="color: #666; font-size: 14px;">Product Management</span>
                          </div>
                          <div style="display: flex; align-items: center;">
                              <span style="margin-right: 10px;">📊</span>
                              <span style="color: #666; font-size: 14px;">Sales Analytics</span>
                          </div>
                          <div style="display: flex; align-items: center;">
                              <span style="margin-right: 10px;">🛒</span>
                              <span style="color: #666; font-size: 14px;">Order Processing</span>
                          </div>
                          <div style="display: flex; align-items: center;">
                              <span style="margin-right: 10px;">👥</span>
                              <span style="color: #666; font-size: 14px;">Customer Management</span>
                          </div>
                          <div style="display: flex; align-items: center;">
                              <span style="margin-right: 10px;">💰</span>
                              <span style="color: #666; font-size: 14px;">Revenue Tracking</span>
                          </div>
                          <div style="display: flex; align-items: center;">
                              <span style="margin-right: 10px;">📈</span>
                              <span style="color: #666; font-size: 14px;">Growth Insights</span>
                          </div>
                      </div>
                  </div>

                  <!-- Support Information -->
                  <div style="background: #e3f2fd; border-radius: 12px; padding: 25px; margin-bottom: 30px;">
                      <h4 style="margin: 0 0 15px 0; color: #1976d2; font-size: 18px;">💬 Need Help?</h4>
                      <p style="color: #666; margin: 0 0 15px 0; font-size: 14px; line-height: 1.6;">
                          Our support team is here to help you get the most out of your admin experience.
                      </p>
                      <div style="display: flex; flex-wrap: wrap; gap: 15px;">
                          <a href="mailto:support@aharyas.com" style="color: #1976d2; text-decoration: none; font-weight: 600; font-size: 14px;">📧 Email Support</a>
                          <a href="#" style="color: #1976d2; text-decoration: none; font-weight: 600; font-size: 14px;">📖 Admin Guide</a>
                          <a href="#" style="color: #1976d2; text-decoration: none; font-weight: 600; font-size: 14px;">💬 Live Chat</a>
                      </div>
                  </div>

                  <!-- Call to Action -->
                  <div style="text-align: center; margin-top: 35px;">
                      <a href="#" style="display: inline-block; background: linear-gradient(135deg, #8B4513 0%, #D2B48C 100%); color: white; padding: 15px 35px; border-radius: 8px; text-decoration: none; font-weight: 600; font-size: 16px; box-shadow: 0 4px 6px rgba(0,0,0,0.1); transition: all 0.3s ease;">
                          Access Admin Dashboard
                      </a>
                  </div>
              </div>

              <!-- Footer -->
              <div style="background: #f8f9fa; padding: 25px 20px; text-align: center; border-top: 1px solid #eee;">
                  <p style="margin: 0 0 10px 0; color: #666; font-size: 14px;">
                      Welcome to the Aharyas family! We're excited to work with you.
                  </p>
                  <p style="margin: 0; color: #999; font-size: 12px;">
                      This email was sent to ${email} • 
                      <a href="mailto:support@aharyas.com" style="color: #667eea; text-decoration: none;">Contact Support</a>
                  </p>
              </div>
          </div>
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