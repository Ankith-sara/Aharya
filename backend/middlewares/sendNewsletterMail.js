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

const sendNewsletterMail = async (email) => {
  if (!email) {
    console.error('Missing email for newsletter subscription');
    return false;
  }

  const whatsappLink = process.env.WHATSAPP_GROUP_LINK || 'https://chat.whatsapp.com/YOUR_GROUP_INVITE_LINK';

  const mailOptions = {
    from: `"Aharyas" <${process.env.EMAIL_USER}>`,
    to: email,
    subject: 'Welcome to the Aharyas Community',
    html: `
      <!DOCTYPE html>
      <html lang="en">
      <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Welcome to Aharyas Newsletter</title>
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
                              <td style="padding: 50px 60px 40px; text-align: center; background: linear-gradient(135deg, #fafaf9 0%, #f5f5f4 100%); border-bottom: 1px solid #e7e7e7;">
                                  <h1 style="margin: 0 0 8px 0; font-family: 'Cormorant Garamond', Georgia, serif; font-size: 48px; font-weight: 300; letter-spacing: 8px; color: #1a1a1a; text-transform: uppercase;">AHARYAS</h1>
                                  <div style="width: 40px; height: 1px; background: #1a1a1a; margin: 0 auto 12px;"></div>
                                  <p style="margin: 0; font-family: 'Inter', sans-serif; font-size: 11px; letter-spacing: 3px; color: #6b6b6b; text-transform: uppercase; font-weight: 400;">Conscious Luxury · Indian Heritage</p>
                              </td>
                          </tr>

                          <!-- Welcome Hero -->
                          <tr>
                              <td style="padding: 60px 60px 50px; text-align: center; background: #ffffff;">
                                  <h2 style="margin: 0 0 16px 0; font-family: 'Cormorant Garamond', Georgia, serif; font-size: 36px; font-weight: 400; letter-spacing: 2px; color: #1a1a1a; line-height: 1.3;">Welcome to Our Community</h2>
                                  <p style="margin: 0; font-family: 'Inter', sans-serif; font-size: 16px; color: #525252; font-weight: 300; line-height: 1.8; max-width: 500px; margin: 0 auto;">
                                      Thank you for joining the Aharyas family. We're honored to have you as part of our community that celebrates heritage, sustainability, and conscious fashion.
                                  </p>
                              </td>
                          </tr>

                          <!-- WhatsApp CTA -->
                          <tr>
                              <td style="padding: 0 60px 50px;">
                                  <table cellpadding="0" cellspacing="0" border="0" width="100%" style="background: linear-gradient(135deg, #1a1a1a 0%, #2a2a2a 100%); border-radius: 4px; overflow: hidden;">
                                      <tr>
                                          <td style="padding: 40px 36px; text-align: center;">
                                              <h3 style="margin: 0 0 12px 0; font-family: 'Cormorant Garamond', Georgia, serif; font-size: 26px; font-weight: 400; letter-spacing: 1px; color: #ffffff;">Join Our WhatsApp Community</h3>
                                              <p style="margin: 0 0 28px 0; font-family: 'Inter', sans-serif; font-size: 15px; color: rgba(255,255,255,0.85); font-weight: 300; line-height: 1.7; max-width: 440px; margin-left: auto; margin-right: auto;">
                                                  Get exclusive updates, early access to collections, behind-the-scenes artisan stories, and special offers.
                                              </p>
                                              <a href="${whatsappLink}" 
                                                 style="display: inline-block; background: #25D366; color: #ffffff; padding: 16px 48px; 
                                                        font-family: 'Inter', sans-serif; font-size: 13px; font-weight: 600; letter-spacing: 1.5px; 
                                                        text-transform: uppercase; text-decoration: none; border-radius: 2px; 
                                                        box-shadow: 0 4px 12px rgba(37, 211, 102, 0.3);">
                                                  Join WhatsApp Group
                                              </a>
                                          </td>
                                      </tr>
                                  </table>
                              </td>
                          </tr>

                          <!-- What You'll Receive -->
                          <tr>
                              <td style="padding: 0 60px 40px;">
                                  <h3 style="margin: 0 0 28px 0; font-family: 'Cormorant Garamond', Georgia, serif; font-size: 26px; font-weight: 400; letter-spacing: 1px; color: #1a1a1a; text-align: center;">What You'll Receive</h3>
                                  
                                  <!-- Benefit 1 -->
                                  <table cellpadding="0" cellspacing="0" border="0" width="100%" style="margin-bottom: 16px; background: #fafaf9; border: 1px solid #e7e7e7; border-left: 4px solid #1a1a1a;">
                                      <tr>
                                          <td style="padding: 24px 28px;">
                                              <table cellpadding="0" cellspacing="0" border="0" width="100%">
                                                  <tr>
                                                      <td style="padding-left: 16px;">
                                                          <h4 style="margin: 0 0 6px 0; font-family: 'Inter', sans-serif; font-size: 16px; font-weight: 600; color: #1a1a1a;">Exclusive Collection Drops</h4>
                                                          <p style="margin: 0; font-family: 'Inter', sans-serif; font-size: 14px; color: #525252; font-weight: 300; line-height: 1.7;">Be the first to know about new collections and limited-edition handcrafted pieces</p>
                                                      </td>
                                                  </tr>
                                              </table>
                                          </td>
                                      </tr>
                                  </table>

                                  <!-- Benefit 2 -->
                                  <table cellpadding="0" cellspacing="0" border="0" width="100%" style="margin-bottom: 16px; background: #fafaf9; border: 1px solid #e7e7e7; border-left: 4px solid #1a1a1a;">
                                      <tr>
                                          <td style="padding: 24px 28px;">
                                              <table cellpadding="0" cellspacing="0" border="0" width="100%">
                                                  <tr>
                                                      <td style="padding-left: 16px;">
                                                          <h4 style="margin: 0 0 6px 0; font-family: 'Inter', sans-serif; font-size: 16px; font-weight: 600; color: #1a1a1a;">Artisan Stories & Heritage</h4>
                                                          <p style="margin: 0; font-family: 'Inter', sans-serif; font-size: 14px; color: #525252; font-weight: 300; line-height: 1.7;">Behind-the-scenes glimpses into our makers' craftsmanship and cultural traditions</p>
                                                      </td>
                                                  </tr>
                                              </table>
                                          </td>
                                      </tr>
                                  </table>

                                  <!-- Benefit 3 -->
                                  <table cellpadding="0" cellspacing="0" border="0" width="100%" style="margin-bottom: 16px; background: #fafaf9; border: 1px solid #e7e7e7; border-left: 4px solid #1a1a1a;">
                                      <tr>
                                          <td style="padding: 24px 28px;">
                                              <table cellpadding="0" cellspacing="0" border="0" width="100%">
                                                  <tr>
                                                      <td style="padding-left: 16px;">
                                                          <h4 style="margin: 0 0 6px 0; font-family: 'Inter', sans-serif; font-size: 16px; font-weight: 600; color: #1a1a1a;">Sustainability Updates</h4>
                                                          <p style="margin: 0; font-family: 'Inter', sans-serif; font-size: 14px; color: #525252; font-weight: 300; line-height: 1.7;">Learn about our eco-friendly practices and community impact initiatives</p>
                                                      </td>
                                                  </tr>
                                              </table>
                                          </td>
                                      </tr>
                                  </table>

                                  <!-- Benefit 4 -->
                                  <table cellpadding="0" cellspacing="0" border="0" width="100%" style="background: #fafaf9; border: 1px solid #e7e7e7; border-left: 4px solid #1a1a1a;">
                                      <tr>
                                          <td style="padding: 24px 28px;">
                                              <table cellpadding="0" cellspacing="0" border="0" width="100%">
                                                  <tr>
                                                      <td style="padding-left: 16px;">
                                                          <h4 style="margin: 0 0 6px 0; font-family: 'Inter', sans-serif; font-size: 16px; font-weight: 600; color: #1a1a1a;">Exclusive Offers</h4>
                                                          <p style="margin: 0; font-family: 'Inter', sans-serif; font-size: 14px; color: #525252; font-weight: 300; line-height: 1.7;">Subscriber-only discounts and early-bird pricing on new launches</p>
                                                      </td>
                                                  </tr>
                                              </table>
                                          </td>
                                      </tr>
                                  </table>
                              </td>
                          </tr>

                          <!-- Follow Us Section -->
                          <tr>
                              <td style="padding: 0 60px 50px;">
                                  <table cellpadding="0" cellspacing="0" border="0" width="100%" style="background: linear-gradient(135deg, #fafaf9 0%, #f5f5f4 100%); border: 1px solid #e7e7e7;">
                                      <tr>
                                          <td style="padding: 32px 36px; text-align: center;">
                                              <h4 style="margin: 0 0 16px 0; font-family: 'Inter', sans-serif; font-size: 15px; font-weight: 600; letter-spacing: 1px; color: #1a1a1a; text-transform: uppercase;">Follow Us</h4>
                                              <table cellpadding="0" cellspacing="0" border="0" width="100%">
                                                  <tr>
                                                      <td align="center">
                                                          <a href="https://www.instagram.com/aharyass/" style="display: inline-block; margin: 0 12px; font-family: 'Inter', sans-serif; font-size: 13px; color: #525252; text-decoration: none; font-weight: 500;">
                                                              Instagram
                                                          </a>
                                                          <a href="https://in.linkedin.com/in/aharya-in-3a265633a" style="display: inline-block; margin: 0 12px; font-family: 'Inter', sans-serif; font-size: 13px; color: #525252; text-decoration: none; font-weight: 500;">
                                                              LinkedIn
                                                          </a>
                                                      </td>
                                                  </tr>
                                              </table>
                                          </td>
                                      </tr>
                                  </table>
                              </td>
                          </tr>

                          <!-- Closing Quote -->
                          <tr>
                              <td style="padding: 0 60px 50px;">
                                  <table cellpadding="0" cellspacing="0" border="0" width="100%" style="background: #fffbf5; border: 1px solid #fde68a; border-left: 4px solid #d97706;">
                                      <tr>
                                          <td style="padding: 32px 36px; text-align: center;">
                                              <p style="margin: 0 0 12px 0; font-family: 'Cormorant Garamond', Georgia, serif; font-size: 17px; color: #78350f; font-weight: 300; font-style: italic; line-height: 1.7;">
                                                  "Every piece tells a story, every thread connects us to our heritage. Thank you for being part of our journey towards sustainable and meaningful fashion."
                                              </p>
                                              <p style="margin: 0; font-family: 'Inter', sans-serif; font-size: 13px; color: #92400e; font-weight: 500;">
                                                  — The Aharyas Team
                                              </p>
                                          </td>
                                      </tr>
                                  </table>
                              </td>
                          </tr>

                          <!-- Footer -->
                          <tr>
                              <td style="padding: 40px 60px; text-align: center; background: #fafaf9; border-top: 1px solid #e7e7e7;">
                                  <p style="margin: 0 0 8px 0; font-family: 'Inter', sans-serif; font-size: 13px; color: #737373; font-weight: 300;">
                                      You're receiving this because you subscribed to the Aharyas newsletter
                                  </p>
                                  <p style="margin: 0 0 16px 0; font-family: 'Inter', sans-serif; font-size: 12px; color: #737373; font-weight: 300;">
                                      Questions? Contact us at <a href="mailto:support@aharyas.com" style="color: #1a1a1a; text-decoration: none; font-weight: 500; border-bottom: 1px solid #d4d4d4;">support@aharyas.com</a>
                                  </p>
                                  <p style="margin: 0; font-family: 'Inter', sans-serif; font-size: 11px; color: #a3a3a3;">
                                      <a href="#" style="color: #a3a3a3; text-decoration: none;">Unsubscribe</a> • 
                                      <a href="#" style="color: #a3a3a3; text-decoration: none;">Privacy Policy</a>
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
    console.log(`Newsletter welcome email sent successfully to ${email}`);
    return true;
  } catch (error) {
    console.error('Failed to send newsletter email:', error.message);
    throw new Error(`Email sending failed: ${error.message}`);
  }
};

export default sendNewsletterMail;