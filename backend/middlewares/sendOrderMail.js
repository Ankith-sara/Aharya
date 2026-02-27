import nodemailer from 'nodemailer';
import dotenv from 'dotenv';
import productModel from '../models/ProductModal.js';

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

const sendOrderMail = async (email, subject, text, html) => {
    if (!email || !subject) {
        console.error('Missing email or subject for order mail');
        return false;
    }
    const mailOptions = {
        from: `"Aharyas" <${process.env.EMAIL_USER}>`,
        to: email,
        subject,
        text,
        html,
    };
    try {
        const info = await transporter.sendMail(mailOptions);
        console.log(`Order email sent successfully to ${email}:`, info.messageId);
        return true;
    } catch (error) {
        console.error(`Error sending order email to ${email}:`, error.message);
        return false;
    }
};

const formatDate = (timestamp) => {
    return new Date(timestamp).toLocaleDateString('en-IN', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    });
};

// Helper function to get payment status badge
const getPaymentBadge = (paymentMethod, isPaid) => {
    if (paymentMethod === 'COD') {
        return '<span style="display: inline-block; background: #1a1a1a; color: #ffffff; padding: 8px 20px; font-size: 10px; font-weight: 600; letter-spacing: 1.5px; text-transform: uppercase; border-radius: 2px;">Cash on Delivery</span>';
    }
    return isPaid ?
        '<span style="display: inline-block; background: #2e7d32; color: #ffffff; padding: 8px 20px; font-size: 10px; font-weight: 600; letter-spacing: 1.5px; text-transform: uppercase; border-radius: 2px;">Paid</span>' :
        '<span style="display: inline-block; background: #d32f2f; color: #ffffff; padding: 8px 20px; font-size: 10px; font-weight: 600; letter-spacing: 1.5px; text-transform: uppercase; border-radius: 2px;">Pending</span>';
};

// Send shipping notification email
const sendShippingEmail = async (orderData, user) => {
    try {
        const { _id: orderId, items, address, amount } = orderData;
        
        if (!user || !user.email) {
            console.error('User data incomplete for shipping email');
            return false;
        }

        const subject = `Your Aharyas Order #${orderId} Has Been Shipped!`;

        const html = `
            <!DOCTYPE html>
            <html lang="en">
            <head>
                <meta charset="UTF-8">
                <meta name="viewport" content="width=device-width, initial-scale=1.0">
                <title>Order Shipped - Aharyas</title>
            </head>
            <body style="margin: 0; padding: 0; font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Helvetica, Arial, sans-serif; background: linear-gradient(to bottom, #fafaf9 0%, #ffffff 100%); color: #1a1a1a;">
                <table cellpadding="0" cellspacing="0" border="0" width="100%" style="background: linear-gradient(to bottom, #fafaf9 0%, #ffffff 100%); min-height: 100vh;">
                    <tr>
                        <td align="center" style="padding: 60px 20px;">
                            <table cellpadding="0" cellspacing="0" border="0" width="680" style="max-width: 680px; background-color: #ffffff; box-shadow: 0 4px 24px rgba(0, 0, 0, 0.06);">
                                
                                <tr>
                                    <td style="height: 6px; background: #000000;"></td>
                                </tr>

                                <tr>
                                    <td style="padding: 50px 60px 40px; text-align: center; background: linear-gradient(135deg, #fafaf9 0%, #f5f5f4 100%); border-bottom: 1px solid #e7e7e7;">
                                        <h1 style="margin: 0 0 8px 0; font-family: Georgia, serif; font-size: 48px; font-weight: 300; letter-spacing: 8px; color: #1a1a1a; text-transform: uppercase;">AHARYAS</h1>
                                        <div style="width: 40px; height: 1px; background: #1a1a1a; margin: 0 auto 12px;"></div>
                                        <p style="margin: 0; font-size: 11px; letter-spacing: 3px; color: #6b6b6b; text-transform: uppercase; font-weight: 400;">Conscious Luxury · Indian Heritage</p>
                                    </td>
                                </tr>

                                <tr>
                                    <td style="padding: 60px 60px 50px; text-align: center;">
                                        <h2 style="margin: 0 0 16px 0; font-family: Georgia, serif; font-size: 36px; font-weight: 400; letter-spacing: 2px; color: #1a1a1a;">Your Order is On Its Way!</h2>
                                        <p style="margin: 0; font-size: 16px; color: #525252; font-weight: 300; line-height: 1.7; max-width: 480px; margin: 0 auto;">
                                            Great news, <strong style="font-weight: 500; color: #1a1a1a;">${user.name}</strong>! Your handcrafted treasures have been shipped and are making their way to you.
                                        </p>
                                    </td>
                                </tr>

                                <tr>
                                    <td style="padding: 0 60px 50px;">
                                        <table cellpadding="0" cellspacing="0" border="0" width="100%" style="border: 1px solid #e7e7e7; background: #ffffff;">
                                            <tr>
                                                <td style="padding: 24px 32px; background: #000000; border-bottom: 1px solid #e7e7e7;">
                                                    <h3 style="margin: 0; font-size: 11px; font-weight: 600; letter-spacing: 2px; text-transform: uppercase; color: #ffffff;">Shipment Details</h3>
                                                </td>
                                            </tr>
                                            <tr>
                                                <td style="padding: 32px;">
                                                    <table cellpadding="0" cellspacing="0" border="0" width="100%">
                                                        <tr>
                                                            <td style="padding: 14px 0; font-size: 14px; color: #737373;">Order Number</td>
                                                            <td style="padding: 14px 0; font-size: 14px; color: #1a1a1a; font-weight: 500; text-align: right;">#${orderId}</td>
                                                        </tr>
                                                        <tr style="border-top: 1px solid #f5f5f4;">
                                                            <td style="padding: 14px 0; font-size: 14px; color: #737373;">Items</td>
                                                            <td style="padding: 14px 0; font-size: 14px; color: #1a1a1a; text-align: right;">${items.length} item(s)</td>
                                                        </tr>
                                                        <tr style="border-top: 1px solid #f5f5f4;">
                                                            <td style="padding: 14px 0; font-size: 14px; color: #737373;">Order Total</td>
                                                            <td style="padding: 14px 0; font-size: 18px; color: #1a1a1a; font-weight: 600; text-align: right;">₹${amount.toLocaleString('en-IN')}</td>
                                                        </tr>
                                                    </table>
                                                </td>
                                            </tr>
                                        </table>
                                    </td>
                                </tr>

                                <tr>
                                    <td style="padding: 0 60px 50px;">
                                        <table cellpadding="0" cellspacing="0" border="0" width="100%" style="border: 1px solid #e7e7e7; background: #fafaf9;">
                                            <tr>
                                                <td style="padding: 24px 32px; border-bottom: 1px solid #e7e7e7;">
                                                    <h3 style="margin: 0; font-size: 11px; font-weight: 600; letter-spacing: 2px; text-transform: uppercase; color: #1a1a1a;">Delivering To</h3>
                                                </td>
                                            </tr>
                                            <tr>
                                                <td style="padding: 28px 32px;">
                                                    <p style="margin: 0; font-size: 15px; color: #1a1a1a; line-height: 1.9;">
                                                        <strong>${address.firstName || ''} ${address.lastName || ''}</strong><br>
                                                        ${address.street || ''}<br>
                                                        ${address.city || ''}, ${address.state || ''} ${address.zipcode || ''}<br>
                                                        ${address.country || ''}<br>
                                                        <span style="color: #737373;">📞 ${address.phone || 'N/A'}</span>
                                                    </p>
                                                </td>
                                            </tr>
                                        </table>
                                    </td>
                                </tr>

                                <tr>
                                    <td style="padding: 0 60px 50px;">
                                        <table cellpadding="0" cellspacing="0" border="0" width="100%" style="background: #1a1a1a; border-left: 4px solid #000000;">
                                            <tr>
                                                <td style="padding: 32px 36px;">
                                                    <h3 style="margin: 0 0 16px 0; font-family: Georgia, serif; font-size: 22px; font-weight: 400; color: #1a1a1a;">What's Next?</h3>
                                                    <p style="margin: 0; font-size: 15px; color: #525252; line-height: 1.8;">
                                                        Your package is on its way! You'll receive another email once it's out for delivery. Please ensure someone is available to receive the package at the delivery address.
                                                    </p>
                                                </td>
                                            </tr>
                                        </table>
                                    </td>
                                </tr>

                                <tr>
                                    <td style="padding: 50px 60px; text-align: center; background: #ffffff; border-top: 1px solid #e7e7e7;">
                                        <p style="margin: 0 0 8px 0; font-size: 13px; color: #737373;">
                                            Questions? Reach us at <a href="mailto:support@aharyas.com" style="color: #1a1a1a; text-decoration: none; font-weight: 500; border-bottom: 1px solid #1a1a1a;">support@aharyas.com</a>
                                        </p>
                                        <p style="margin: 0; font-size: 13px; color: #737373;">
                                            or call us at <a href="tel:+919063284008" style="color: #1a1a1a; text-decoration: none; font-weight: 500;">+91 9063284008</a>
                                        </p>
                                    </td>
                                </tr>

                                <tr>
                                    <td style="padding: 40px 60px; text-align: center; background: #fafaf9; border-top: 1px solid #e7e7e7;">
                                        <p style="margin: 0; font-size: 11px; color: #a3a3a3; line-height: 1.7;">
                                            © ${new Date().getFullYear()} Aharyas. All rights reserved.<br>
                                            Preserving heritage, one thread at a time.
                                        </p>
                                    </td>
                                </tr>

                                <tr>
                                    <td style="height: 6px; background: #000000;"></td>
                                </tr>
                            </table>
                        </td>
                    </tr>
                </table>
            </body>
            </html>
        `;

        return await sendOrderMail(user.email, subject, '', html);
    } catch (error) {
        console.error('Error sending shipping email:', error);
        return false;
    }
};

// Send delivered notification email
const sendDeliveredEmail = async (orderData, user) => {
    try {
        const { _id: orderId, items, amount } = orderData;
        
        if (!user || !user.email) {
            console.error('User data incomplete for delivered email');
            return false;
        }

        const subject = `Your Aharyas Order #${orderId} Has Been Delivered!`;

        const html = `
            <!DOCTYPE html>
            <html lang="en">
            <head>
                <meta charset="UTF-8">
                <meta name="viewport" content="width=device-width, initial-scale=1.0">
                <title>Order Delivered - Aharyas</title>
            </head>
            <body style="margin: 0; padding: 0; font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Helvetica, Arial, sans-serif; background: linear-gradient(to bottom, #fafaf9 0%, #ffffff 100%); color: #1a1a1a;">
                <table cellpadding="0" cellspacing="0" border="0" width="100%" style="background: linear-gradient(to bottom, #fafaf9 0%, #ffffff 100%); min-height: 100vh;">
                    <tr>
                        <td align="center" style="padding: 60px 20px;">
                            <table cellpadding="0" cellspacing="0" border="0" width="680" style="max-width: 680px; background-color: #ffffff; box-shadow: 0 4px 24px rgba(0, 0, 0, 0.06);">
                                
                                <tr>
                                    <td style="height: 6px; background: linear-gradient(90deg, #16a34a 0%, #22c55e 50%, #16a34a 100%);"></td>
                                </tr>

                                <tr>
                                    <td style="padding: 50px 60px 40px; text-align: center; background: linear-gradient(135deg, #fafaf9 0%, #f5f5f4 100%); border-bottom: 1px solid #e7e7e7;">
                                        <h1 style="margin: 0 0 8px 0; font-family: Georgia, serif; font-size: 48px; font-weight: 300; letter-spacing: 8px; color: #1a1a1a; text-transform: uppercase;">AHARYAS</h1>
                                        <div style="width: 40px; height: 1px; background: #1a1a1a; margin: 0 auto 12px;"></div>
                                        <p style="margin: 0; font-size: 11px; letter-spacing: 3px; color: #6b6b6b; text-transform: uppercase; font-weight: 400;">Conscious Luxury · Indian Heritage</p>
                                    </td>
                                </tr>

                                <tr>
                                    <td style="padding: 60px 60px 50px; text-align: center;">
                                        <h2 style="margin: 0 0 16px 0; font-family: Georgia, serif; font-size: 36px; font-weight: 400; letter-spacing: 2px; color: #1a1a1a;">Your Order Has Arrived!</h2>
                                        <p style="margin: 0; font-size: 16px; color: #525252; font-weight: 300; line-height: 1.7; max-width: 480px; margin: 0 auto;">
                                            Congratulations, <strong style="font-weight: 500; color: #1a1a1a;">${user.name}</strong>! Your handcrafted treasures from Aharyas have been successfully delivered.
                                        </p>
                                    </td>
                                </tr>

                                <tr>
                                    <td style="padding: 0 60px 50px;">
                                        <table cellpadding="0" cellspacing="0" border="0" width="100%" style="border: 1px solid #e7e7e7; background: #ffffff;">
                                            <tr>
                                                <td style="padding: 24px 32px; background: #16a34a; border-bottom: 1px solid #e7e7e7;">
                                                    <h3 style="margin: 0; font-size: 11px; font-weight: 600; letter-spacing: 2px; text-transform: uppercase; color: #ffffff;">Delivery Confirmed</h3>
                                                </td>
                                            </tr>
                                            <tr>
                                                <td style="padding: 32px;">
                                                    <table cellpadding="0" cellspacing="0" border="0" width="100%">
                                                        <tr>
                                                            <td style="padding: 14px 0; font-size: 14px; color: #737373;">Order Number</td>
                                                            <td style="padding: 14px 0; font-size: 14px; color: #1a1a1a; font-weight: 500; text-align: right;">#${orderId}</td>
                                                        </tr>
                                                        <tr style="border-top: 1px solid #f5f5f4;">
                                                            <td style="padding: 14px 0; font-size: 14px; color: #737373;">Items Delivered</td>
                                                            <td style="padding: 14px 0; font-size: 14px; color: #1a1a1a; text-align: right;">${items.length} item(s)</td>
                                                        </tr>
                                                        <tr style="border-top: 1px solid #f5f5f4;">
                                                            <td style="padding: 14px 0; font-size: 14px; color: #737373;">Delivered On</td>
                                                            <td style="padding: 14px 0; font-size: 14px; color: #1a1a1a; text-align: right;">${formatDate(Date.now())}</td>
                                                        </tr>
                                                        <tr style="border-top: 2px solid #16a34a;">
                                                            <td style="padding: 20px 0 0 0; font-size: 13px; color: #1a1a1a; font-weight: 600; letter-spacing: 1.5px; text-transform: uppercase;">Order Total</td>
                                                            <td style="padding: 20px 0 0 0; font-family: Georgia, serif; font-size: 32px; color: #16a34a; font-weight: 500; text-align: right;">₹${amount.toLocaleString('en-IN')}</td>
                                                        </tr>
                                                    </table>
                                                </td>
                                            </tr>
                                        </table>
                                    </td>
                                </tr>

                                <tr>
                                    <td style="padding: 0 60px 50px;">
                                        <h3 style="margin: 0 0 24px 0; font-size: 11px; font-weight: 600; letter-spacing: 2px; text-transform: uppercase; color: #1a1a1a;">Items Delivered</h3>
                                        ${items.map((item, index) => `
                                            <table cellpadding="0" cellspacing="0" border="0" width="100%" style="margin-bottom: ${index < items.length - 1 ? '16px' : '0'}; border: 1px solid #e7e7e7; background: #f0fdf4;">
                                                <tr>
                                                    <td style="padding: 20px;">
                                                        <table cellpadding="0" cellspacing="0" border="0" width="100%">
                                                            <tr>
                                                                <td style="width: 70%; vertical-align: top;">
                                                                    <img src="${item.image || item.images?.[0] || ''}" alt="${item.name}" style="width: 70px; height: 70px; object-fit: cover; border-radius: 6px; margin-bottom: 10px; display: block;" />
                                                                    <h4 style="margin: 0 0 8px 0; font-family: Georgia, serif; font-size: 18px; font-weight: 400; color: #1a1a1a;">${item.name || 'Product'}</h4>
                                                                    <p style="margin: 0; font-size: 13px; color: #737373;">Qty: ${item.quantity} ${item.size ? `• Size: ${item.size}` : ''}</p>
                                                                </td>
                                                                <td style="width: 30%; text-align: right; vertical-align: top;">
                                                                    <span style="font-family: Georgia, serif; font-size: 20px; color: #1a1a1a; font-weight: 500;">₹${(item.price * item.quantity).toLocaleString('en-IN')}</span>
                                                                </td>
                                                            </tr>
                                                        </table>
                                                    </td>
                                                </tr>
                                            </table>
                                        `).join('')}
                                    </td>
                                </tr>

                                <tr>
                                    <td style="padding: 0 60px 50px;">
                                        <table cellpadding="0" cellspacing="0" border="0" width="100%" style="background: linear-gradient(135deg, #f0fdf4 0%, #dcfce7 100%); border-left: 4px solid #16a34a;">
                                            <tr>
                                                <td style="padding: 32px 36px;">
                                                    <h3 style="margin: 0 0 16px 0; font-family: Georgia, serif; font-size: 22px; font-weight: 400; color: #1a1a1a;">We'd Love Your Feedback!</h3>
                                                    <p style="margin: 0; font-size: 15px; color: #525252; line-height: 1.8;">
                                                        We hope you love your new handcrafted pieces! Your feedback helps our artisans continue their craft. If you have a moment, please share your experience with us.
                                                    </p>
                                                </td>
                                            </tr>
                                        </table>
                                    </td>
                                </tr>

                                <tr>
                                    <td style="padding: 0 60px 50px;">
                                        <table cellpadding="0" cellspacing="0" border="0" width="100%" style="background: #fffbf5; border: 1px solid #fbbf24; border-radius: 8px;">
                                            <tr>
                                                <td style="padding: 24px 32px; text-align: center;">
                                                    <p style="margin: 0 0 8px 0; font-size: 14px; color: #92400e; font-weight: 500;">Need Help?</p>
                                                    <p style="margin: 0; font-size: 13px; color: #a3a3a3;">
                                                        If there are any issues with your order, please contact us within 7 days of delivery.
                                                    </p>
                                                </td>
                                            </tr>
                                        </table>
                                    </td>
                                </tr>

                                <tr>
                                    <td style="padding: 50px 60px; text-align: center; background: #ffffff; border-top: 1px solid #e7e7e7;">
                                        <p style="margin: 0 0 20px 0; font-family: Georgia, serif; font-size: 18px; color: #1a1a1a; font-style: italic;">Thank you for choosing Aharyas!</p>
                                        <p style="margin: 0 0 8px 0; font-size: 13px; color: #737373;">
                                            Questions? <a href="mailto:support@aharyas.com" style="color: #1a1a1a; text-decoration: none; font-weight: 500; border-bottom: 1px solid #1a1a1a;">support@aharyas.com</a>
                                        </p>
                                        <p style="margin: 0; font-size: 13px; color: #737373;">
                                            Call us at <a href="tel:+919063284008" style="color: #1a1a1a; text-decoration: none; font-weight: 500;">+91 9063284008</a>
                                        </p>
                                    </td>
                                </tr>

                                <tr>
                                    <td style="padding: 40px 60px; text-align: center; background: #fafaf9; border-top: 1px solid #e7e7e7;">
                                        <p style="margin: 0; font-size: 11px; color: #a3a3a3; line-height: 1.7;">
                                            © ${new Date().getFullYear()} Aharyas. All rights reserved.<br>
                                            Preserving heritage, one thread at a time.
                                        </p>
                                    </td>
                                </tr>

                                <tr>
                                    <td style="height: 6px; background: linear-gradient(90deg, #16a34a 0%, #22c55e 50%, #16a34a 100%);"></td>
                                </tr>
                            </table>
                        </td>
                    </tr>
                </table>
            </body>
            </html>
        `;

        return await sendOrderMail(user.email, subject, '', html);
    } catch (error) {
        console.error('Error sending delivered email:', error);
        return false;
    }
};

// Professional function to send both customer and admin emails
const sendOrderEmails = async (orderData, user) => {
    try {
        const { _id: orderId, amount, items, address, paymentMethod, payment, date } = orderData;

        // Validate required data
        if (!user || !user.email || !user.name) {
            console.error('User data is incomplete:', user);
            return false;
        }

        if (!items || items.length === 0) {
            console.error('No items in order');
            return false;
        }

        console.log(`Starting email send for order ${orderId} to ${user.email}`);

        // Find product owner (admin) for the first product to determine vendor
        let owner = null;
        try {
            const product = await productModel.findById(items[0].productId).populate("adminId");
            if (product && product.adminId) {
                owner = product.adminId;
            } else {
                console.error("Could not find product owner for order, skipping admin email");
            }
        } catch (error) {
            console.error("Error finding product owner:", error.message);
        }

        // === CUSTOMER EMAIL ===
        const customerSubject = `Your Aharyas Order #${orderId.toString()} is Confirmed`;

        const customerHtml = `
            <!DOCTYPE html>
            <html lang="en">
            <head>
                <meta charset="UTF-8">
                <meta name="viewport" content="width=device-width, initial-scale=1.0">
                <title>Order Confirmation - Aharyas</title>
                <style>
                    @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@300;400;500;600&family=Inter:wght@300;400;500;600&display=swap');
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

                                <!-- Header with Brand Identity -->
                                <tr>
                                    <td style="padding: 50px 60px 40px; text-align: center; background: linear-gradient(135deg, #fafaf9 0%, #f5f5f4 100%); border-bottom: 1px solid #e7e7e7;">
                                        <h1 style="margin: 0 0 8px 0; font-family: 'Cormorant Garamond', Georgia, serif; font-size: 48px; font-weight: 300; letter-spacing: 8px; color: #1a1a1a; text-transform: uppercase;">AHARYAS</h1>
                                        <div style="width: 40px; height: 1px; background: #1a1a1a; margin: 0 auto 12px;"></div>
                                        <p style="margin: 0; font-family: 'Inter', sans-serif; font-size: 11px; letter-spacing: 3px; color: #6b6b6b; text-transform: uppercase; font-weight: 400;">Conscious Luxury · Indian Heritage</p>
                                    </td>
                                </tr>

                                <!-- Hero Section -->
                                <tr>
                                    <td style="padding: 0; background: #ffffff;">
                                        <table cellpadding="0" cellspacing="0" border="0" width="100%">
                                            <tr>
                                                <td style="padding: 60px 60px 50px; text-align: center;">
                                                    <h2 style="margin: 0 0 16px 0; font-family: 'Cormorant Garamond', Georgia, serif; font-size: 36px; font-weight: 400; letter-spacing: 2px; color: #1a1a1a; line-height: 1.3;">Your Order is Confirmed</h2>
                                                    <p style="margin: 0; font-family: 'Inter', sans-serif; font-size: 16px; color: #525252; font-weight: 300; line-height: 1.7; max-width: 480px; margin: 0 auto;">Thank you, <strong style="font-weight: 500; color: #1a1a1a;">${user.name}</strong>. Your order has been received and our artisans are preparing your handcrafted pieces with care.</p>
                                                </td>
                                            </tr>
                                        </table>
                                    </td>
                                </tr>

                                <!-- Order Summary Card -->
                                <tr>
                                    <td style="padding: 0 60px 50px;">
                                        <table cellpadding="0" cellspacing="0" border="0" width="100%" style="border: 1px solid #e7e7e7; background: #ffffff;">
                                            <!-- Card Header -->
                                            <tr>
                                                <td style="padding: 24px 32px; background: #fafaf9; border-bottom: 1px solid #e7e7e7;">
                                                    <h3 style="margin: 0; font-family: 'Inter', sans-serif; font-size: 11px; font-weight: 600; letter-spacing: 2px; text-transform: uppercase; color: #1a1a1a;">Order Summary</h3>
                                                </td>
                                            </tr>
                                            
                                            <!-- Card Content -->
                                            <tr>
                                                <td style="padding: 32px;">
                                                    <table cellpadding="0" cellspacing="0" border="0" width="100%">
                                                        <tr>
                                                            <td style="padding: 14px 0; font-family: 'Inter', sans-serif; font-size: 14px; color: #737373; font-weight: 400;">Order Number</td>
                                                            <td style="padding: 14px 0; font-family: 'Inter', sans-serif; font-size: 14px; color: #1a1a1a; font-weight: 500; text-align: right; letter-spacing: 0.5px;">#${orderId}</td>
                                                        </tr>
                                                        <tr style="border-top: 1px solid #f5f5f4;">
                                                            <td style="padding: 14px 0; font-family: 'Inter', sans-serif; font-size: 14px; color: #737373; font-weight: 400;">Order Date</td>
                                                            <td style="padding: 14px 0; font-family: 'Inter', sans-serif; font-size: 14px; color: #1a1a1a; font-weight: 400; text-align: right;">${formatDate(date)}</td>
                                                        </tr>
                                                        <tr style="border-top: 1px solid #f5f5f4;">
                                                            <td style="padding: 14px 0; font-family: 'Inter', sans-serif; font-size: 14px; color: #737373; font-weight: 400;">Payment Method</td>
                                                            <td style="padding: 14px 0; text-align: right;">${getPaymentBadge(paymentMethod, payment)}</td>
                                                        </tr>
                                                        <tr style="border-top: 2px solid #1a1a1a;">
                                                            <td style="padding: 20px 0 0 0; font-family: 'Inter', sans-serif; font-size: 13px; color: #1a1a1a; font-weight: 600; letter-spacing: 1.5px; text-transform: uppercase;">Total Amount</td>
                                                            <td style="padding: 20px 0 0 0; font-family: 'Cormorant Garamond', Georgia, serif; font-size: 32px; color: #1a1a1a; font-weight: 500; text-align: right; letter-spacing: 1px;">₹${amount.toLocaleString('en-IN')}</td>
                                                        </tr>
                                                    </table>
                                                </td>
                                            </tr>
                                        </table>
                                    </td>
                                </tr>

                                <!-- Order Items -->
                                <tr>
                                    <td style="padding: 0 60px 50px;">
                                        <h3 style="margin: 0 0 24px 0; font-family: 'Inter', sans-serif; font-size: 11px; font-weight: 600; letter-spacing: 2px; text-transform: uppercase; color: #1a1a1a;">Your Items</h3>
                                        
                                        ${items.map((item, index) => `
                                            <table cellpadding="0" cellspacing="0" border="0" width="100%" style="margin-bottom: ${index < items.length - 1 ? '16px' : '0'}; border: 1px solid #e7e7e7; background: #ffffff;">
                                                <tr>
                                                    <td style="padding: 28px;">
                                                        <table cellpadding="0" cellspacing="0" border="0" width="100%">
                                                            <tr>
                                                                <td style="width: 70%; vertical-align: top;">
                                                                        <img 
                                                                            src="${item.image || item.images?.[0] || ''}" 
                                                                            alt="${item.name || 'Product Image'}" 
                                                                            style="
                                                                                width: 85px; 
                                                                                height: 85px; 
                                                                                object-fit: cover; 
                                                                                border-radius: 6px; 
                                                                                margin-bottom: 12px; 
                                                                                display: block;
                                                                            "
                                                                        />

                                                                        <h4 style="margin: 0 0 10px 0; font-family: 'Cormorant Garamond', Georgia, serif; font-size: 20px; font-weight: 400; color: #1a1a1a; letter-spacing: 0.5px; line-height: 1.4;">
                                                                            ${item.name || 'Handcrafted Product'}
                                                                        </h4>

                                                                        <p style="margin: 0; font-family: 'Inter', sans-serif; font-size: 13px; color: #737373; font-weight: 400; line-height: 1.8;">
                                                                            <span style="color: #1a1a1a; font-weight: 500;">Quantity:</span> ${item.quantity}
                                                                            ${item.size ? ` <span style="color: #a3a3a3;">•</span> <span style="color: #1a1a1a; font-weight: 500;">Size:</span> ${item.size}` : ''}
                                                                            <br>
                                                                        </p>

                                                                    </td>
                                                                <td style="width: 30%; text-align: right; vertical-align: top;">
                                                                    <span style="font-family: 'Cormorant Garamond', Georgia, serif; font-size: 22px; color: #1a1a1a; font-weight: 500; letter-spacing: 0.5px;">₹${(item.price * item.quantity).toLocaleString('en-IN')}</span>
                                                                </td>
                                                            </tr>
                                                        </table>
                                                    </td>
                                                </tr>
                                            </table>
                                        `).join('')}
                                    </td>
                                </tr>

                                <!-- Delivery Address -->
                                <tr>
                                    <td style="padding: 0 60px 50px;">
                                        <table cellpadding="0" cellspacing="0" border="0" width="100%" style="border: 1px solid #e7e7e7; background: #fafaf9;">
                                            <tr>
                                                <td style="padding: 24px 32px; border-bottom: 1px solid #e7e7e7;">
                                                    <h3 style="margin: 0; font-family: 'Inter', sans-serif; font-size: 11px; font-weight: 600; letter-spacing: 2px; text-transform: uppercase; color: #1a1a1a;">Delivery Address</h3>
                                                </td>
                                            </tr>
                                            <tr>
                                                <td style="padding: 28px 32px;">
                                                    <p style="margin: 0; font-family: 'Inter', sans-serif; font-size: 15px; color: #1a1a1a; font-weight: 400; line-height: 1.9;">
                                                        <strong style="font-weight: 500;">${address.firstName || ''} ${address.lastName || ''}</strong><br>
                                                        ${address.street || ''}<br>
                                                        ${address.city || ''}, ${address.state || ''} ${address.zipcode || ''}<br>
                                                        ${address.country || ''}<br>
                                                        <span style="color: #737373; margin-top: 8px; display: inline-block;">📞 ${address.phone || 'N/A'}</span>
                                                    </p>
                                                </td>
                                            </tr>
                                        </table>
                                    </td>
                                </tr>

                                <!-- What's Next Section -->
                                <tr>
                                    <td style="padding: 0 60px 50px;">
                                        <table cellpadding="0" cellspacing="0" border="0" width="100%" style="background: linear-gradient(135deg, #fafaf9 0%, #f5f5f4 100%); border-left: 4px solid #1a1a1a;">
                                            <tr>
                                                <td style="padding: 32px 36px;">
                                                    <h3 style="margin: 0 0 16px 0; font-family: 'Cormorant Garamond', Georgia, serif; font-size: 22px; font-weight: 400; letter-spacing: 1px; color: #1a1a1a;">What Happens Next?</h3>
                                                    <p style="margin: 0; font-family: 'Inter', sans-serif; font-size: 15px; color: #525252; font-weight: 300; line-height: 1.8;">
                                                        ${paymentMethod === 'COD' ?
                                                            'Your order is being carefully handcrafted by our artisans. We will notify you with tracking details once it ships. <strong style="font-weight: 500; color: #1a1a1a;">Please keep the exact cash amount ready upon delivery.</strong>' :
                                                            'Your payment has been confirmed. Our master artisans are now preparing your order with the utmost care and attention to detail. You will receive tracking information once your package is dispatched.'
                                                        }
                                                    </p>
                                                </td>
                                            </tr>
                                        </table>
                                    </td>
                                </tr>

                                <!-- Closing Message -->
                                <tr>
                                    <td style="padding: 50px 60px; text-align: center; background: #ffffff; border-top: 1px solid #e7e7e7;">
                                        <p style="margin: 0 0 20px 0; font-family: 'Cormorant Garamond', Georgia, serif; font-size: 18px; color: #1a1a1a; font-weight: 300; letter-spacing: 0.5px; font-style: italic;">Thank you for supporting handcrafted heritage</p>
                                        <div style="width: 60px; height: 1px; background: #d4d4d4; margin: 0 auto 24px;"></div>
                                        <p style="margin: 0 0 8px 0; font-family: 'Inter', sans-serif; font-size: 13px; color: #737373; font-weight: 300;">
                                            Questions? Reach us at <a href="mailto:support@aharyas.com" style="color: #1a1a1a; text-decoration: none; font-weight: 500; border-bottom: 1px solid #1a1a1a;">support@aharyas.com</a>
                                        </p>
                                        <p style="margin: 0; font-family: 'Inter', sans-serif; font-size: 13px; color: #737373; font-weight: 300;">
                                            or call us at <a href="tel:+919063284008" style="color: #1a1a1a; text-decoration: none; font-weight: 500;">+91 9063284008</a>
                                        </p>
                                    </td>
                                </tr>

                                <!-- Footer -->
                                <tr>
                                    <td style="padding: 40px 60px; text-align: center; background: #fafaf9; border-top: 1px solid #e7e7e7;">
                                        <p style="margin: 0 0 16px 0; font-family: 'Inter', sans-serif; font-size: 11px; color: #a3a3a3; font-weight: 300; line-height: 1.7;">
                                            © ${new Date().getFullYear()} Aharyas. All rights reserved.<br>
                                            Preserving heritage, one thread at a time.
                                        </p>
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
        `;

        // Send customer email
        const customerEmailSent = await sendOrderMail(user.email, customerSubject, '', customerHtml);

        // === ADMIN EMAIL ===
        let adminEmailSent = false;
        if (owner && owner.email) {
            const adminSubject = `New Order Alert #${orderId.toString().slice(-6)} – Aharyas Admin`;

            const adminHtml = `
                <!DOCTYPE html>
                <html lang="en">
                <head>
                    <meta charset="UTF-8">
                    <meta name="viewport" content="width=device-width, initial-scale=1.0">
                    <title>New Order Alert - Aharyas Admin</title>
                    <style>
                        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@300;400;500;600&family=Inter:wght@300;400;500;600;700&display=swap');
                    </style>
                </head>
                <body style="margin: 0; padding: 0; font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Helvetica, Arial, sans-serif; background: #f5f5f5; color: #1a1a1a;">
                    <table cellpadding="0" cellspacing="0" border="0" width="100%" style="background: #f5f5f5; min-height: 100vh;">
                        <tr>
                            <td align="center" style="padding: 60px 20px;">
                                <table cellpadding="0" cellspacing="0" border="0" width="680" style="max-width: 680px; background-color: #ffffff; box-shadow: 0 8px 32px rgba(0, 0, 0, 0.12);">
                                    
                                    <!-- Alert Bar -->
                                    <tr>
                                        <td style="background: linear-gradient(135deg, #1a1a1a 0%, #2a2a2a 100%); padding: 18px 32px; text-align: center;">
                                            <p style="margin: 0; font-family: 'Inter', sans-serif; font-size: 12px; color: #ffffff; font-weight: 600; letter-spacing: 2px; text-transform: uppercase;">⚡ New Order Received</p>
                                        </td>
                                    </tr>

                                    <!-- Header -->
                                    <tr>
                                        <td style="padding: 50px 60px 40px; text-align: center; background: #fafaf9; border-bottom: 1px solid #e7e7e7;">
                                            <h1 style="margin: 0 0 8px 0; font-family: 'Cormorant Garamond', Georgia, serif; font-size: 42px; font-weight: 300; letter-spacing: 6px; color: #1a1a1a; text-transform: uppercase;">AHARYAS</h1>
                                            <div style="width: 40px; height: 1px; background: #1a1a1a; margin: 0 auto 12px;"></div>
                                            <p style="margin: 0; font-family: 'Inter', sans-serif; font-size: 10px; letter-spacing: 2px; color: #737373; text-transform: uppercase; font-weight: 500;">Admin Dashboard</p>
                                        </td>
                                    </tr>

                                    <!-- Greeting -->
                                    <tr>
                                        <td style="padding: 50px 60px 40px; text-align: center; background: #ffffff;">
                                            <h2 style="margin: 0 0 16px 0; font-family: 'Cormorant Garamond', Georgia, serif; font-size: 32px; font-weight: 400; letter-spacing: 1px; color: #1a1a1a;">New Order Placed</h2>
                                            <p style="margin: 0; font-family: 'Inter', sans-serif; font-size: 15px; color: #525252; font-weight: 300; line-height: 1.7;">Hi <strong style="font-weight: 500; color: #1a1a1a;">${owner.name}</strong>, a customer has placed an order that requires your attention and processing.</p>
                                        </td>
                                    </tr>

                                    <!-- Order Overview Card -->
                                    <tr>
                                        <td style="padding: 0 60px 40px;">
                                            <table cellpadding="0" cellspacing="0" border="0" width="100%" style="border: 2px solid #1a1a1a; background: #ffffff;">
                                                <tr>
                                                    <td style="padding: 20px 28px; background: #1a1a1a; border-bottom: 2px solid #1a1a1a;">
                                                        <h3 style="margin: 0; font-family: 'Inter', sans-serif; font-size: 11px; font-weight: 600; letter-spacing: 2px; text-transform: uppercase; color: #ffffff;">Order Information</h3>
                                                    </td>
                                                </tr>
                                                <tr>
                                                    <td style="padding: 32px 28px; background: #fafaf9;">
                                                        <table cellpadding="0" cellspacing="0" border="0" width="100%">
                                                            <tr>
                                                                <td style="padding: 12px 0; font-family: 'Inter', sans-serif; font-size: 13px; color: #737373; font-weight: 400;">Order ID</td>
                                                                <td style="padding: 12px 0; font-family: 'Inter', sans-serif; font-size: 15px; color: #1a1a1a; font-weight: 600; text-align: right; letter-spacing: 0.5px;">#${orderId}</td>
                                                            </tr>
                                                            <tr style="border-top: 1px solid #e7e7e7;">
                                                                <td style="padding: 12px 0; font-family: 'Inter', sans-serif; font-size: 13px; color: #737373; font-weight: 400;">Order Date</td>
                                                                <td style="padding: 12px 0; font-family: 'Inter', sans-serif; font-size: 13px; color: #1a1a1a; font-weight: 400; text-align: right;">${formatDate(date)}</td>
                                                            </tr>
                                                            <tr style="border-top: 1px solid #e7e7e7;">
                                                                <td style="padding: 12px 0; font-family: 'Inter', sans-serif; font-size: 13px; color: #737373; font-weight: 400;">Payment Status</td>
                                                                <td style="padding: 12px 0; text-align: right;">${getPaymentBadge(paymentMethod, payment)}</td>
                                                            </tr>
                                                            <tr style="border-top: 2px solid #1a1a1a;">
                                                                <td style="padding: 18px 0 0 0; font-family: 'Inter', sans-serif; font-size: 12px; color: #1a1a1a; font-weight: 600; letter-spacing: 1.5px; text-transform: uppercase;">Order Value</td>
                                                                <td style="padding: 18px 0 0 0; font-family: 'Cormorant Garamond', Georgia, serif; font-size: 36px; color: #1a1a1a; font-weight: 500; text-align: right; letter-spacing: 0.5px;">₹${amount.toLocaleString('en-IN')}</td>
                                                            </tr>
                                                        </table>
                                                    </td>
                                                </tr>
                                            </table>
                                        </td>
                                    </tr>

                                    <!-- Customer Details -->
                                    <tr>
                                        <td style="padding: 0 60px 40px;">
                                            <table cellpadding="0" cellspacing="0" border="0" width="100%" style="border: 1px solid #e7e7e7; background: #ffffff;">
                                                <tr>
                                                    <td style="padding: 20px 28px; background: #f5f5f4; border-bottom: 1px solid #e7e7e7;">
                                                        <h3 style="margin: 0; font-family: 'Inter', sans-serif; font-size: 11px; font-weight: 600; letter-spacing: 2px; text-transform: uppercase; color: #1a1a1a;">Customer Details</h3>
                                                    </td>
                                                </tr>
                                                <tr>
                                                    <td style="padding: 28px;">
                                                        <table cellpadding="0" cellspacing="0" border="0" width="100%">
                                                            <tr>
                                                                <td style="padding: 10px 0; font-family: 'Inter', sans-serif; font-size: 13px; color: #737373; width: 35%;">Name</td>
                                                                <td style="padding: 10px 0; font-family: 'Inter', sans-serif; font-size: 14px; color: #1a1a1a; font-weight: 500;">${user.name}</td>
                                                            </tr>
                                                            <tr style="border-top: 1px solid #f5f5f4;">
                                                                <td style="padding: 10px 0; font-family: 'Inter', sans-serif; font-size: 13px; color: #737373;">Email</td>
                                                                <td style="padding: 10px 0; font-family: 'Inter', sans-serif; font-size: 13px; color: #1a1a1a;"><a href="mailto:${user.email}" style="color: #1a1a1a; text-decoration: none; border-bottom: 1px solid #d4d4d4;">${user.email}</a></td>
                                                            </tr>
                                                            <tr style="border-top: 1px solid #f5f5f4;">
                                                                <td style="padding: 10px 0; font-family: 'Inter', sans-serif; font-size: 13px; color: #737373;">Phone</td>
                                                                <td style="padding: 10px 0; font-family: 'Inter', sans-serif; font-size: 13px; color: #1a1a1a;">${address.phone || 'N/A'}</td>
                                                            </tr>
                                                        </table>
                                                    </td>
                                                </tr>
                                            </table>
                                        </td>
                                    </tr>

                                    <!-- Items to Process -->
                                    <tr>
                                        <td style="padding: 0 60px 40px;">
                                            <h3 style="margin: 0 0 20px 0; font-family: 'Inter', sans-serif; font-size: 11px; font-weight: 600; letter-spacing: 2px; text-transform: uppercase; color: #1a1a1a;">Items to Process</h3>
                                            ${items.map((item, index) => `
                                                <table cellpadding="0" cellspacing="0" border="0" width="100%" style="margin-bottom: ${index < items.length - 1 ? '16px' : '0'}; border: 1px solid #e7e7e7; background: #fafaf9;">
                                                    <tr>
                                                        <td style="padding: 28px;">
                                                            <table cellpadding="0" cellspacing="0" border="0" width="100%">
                                                                <tr>
                                                                    <td style="width: 65%; vertical-align: top;">
                                                                        <img 
                                                                            src="${item.image}" 
                                                                            alt="${item.name}" 
                                                                            style="width: 80px; height: 80px; object-fit: cover; border-radius: 6px; margin-bottom: 10px; display: block;"
                                                                        />

                                                                        <h4 style="margin: 0 0 10px 0; font-family: 'Cormorant Garamond', Georgia, serif; font-size: 19px; font-weight: 400; color: #1a1a1a; letter-spacing: 0.5px;">
                                                                            ${item.name || 'Product'}
                                                                        </h4>

                                                                        <p style="margin: 0; font-family: 'Inter', sans-serif; font-size: 12px; color: #737373; font-weight: 400; line-height: 1.8;">
                                                                            <strong style="color: #1a1a1a; font-weight: 600;">Qty:</strong> ${item.quantity}
                                                                            ${item.size ? ` <strong style="color: #1a1a1a; font-weight: 600;">• Size:</strong> ${item.size}` : ''}<br>
                                                                        </p>
                                                                    </td>

                                                                    <td style="width: 35%; text-align: right; vertical-align: top;">
                                                                        <span style="font-family: 'Cormorant Garamond', Georgia, serif; font-size: 22px; color: #1a1a1a; font-weight: 500; letter-spacing: 0.5px;">₹${(item.price * item.quantity).toLocaleString('en-IN')}</span>
                                                                    </td>
                                                                </tr>
                                                            </table>
                                                        </td>
                                                    </tr>
                                                </table>
                                            `).join('')}
                                        </td>
                                    </tr>

                                    <!-- Shipping Address -->
                                    <tr>
                                        <td style="padding: 0 60px 40px;">
                                            <table cellpadding="0" cellspacing="0" border="0" width="100%" style="border: 1px solid #e7e7e7; background: #fffbf5; border-left: 4px solid #d97706;">
                                                <tr>
                                                    <td style="padding: 20px 28px; border-bottom: 1px solid #e7e7e7;">
                                                        <h3 style="margin: 0; font-family: 'Inter', sans-serif; font-size: 11px; font-weight: 600; letter-spacing: 2px; text-transform: uppercase; color: #1a1a1a;">Shipping Address</h3>
                                                    </td>
                                                </tr>
                                                <tr>
                                                    <td style="padding: 28px;">
                                                        <p style="margin: 0; font-family: 'Inter', sans-serif; font-size: 15px; color: #1a1a1a; font-weight: 400; line-height: 1.9;">
                                                            <strong style="font-weight: 600;">${address.firstName || ''} ${address.lastName || ''}</strong><br>
                                                            ${address.street || ''}<br>
                                                            ${address.city || ''}, ${address.state || ''} ${address.zipcode || ''}<br>
                                                            ${address.country || ''}<br>
                                                            <span style="color: #737373; margin-top: 8px; display: inline-block;">📞 ${address.phone || 'N/A'}</span>
                                                        </p>
                                                    </td>
                                                </tr>
                                            </table>
                                        </td>
                                    </tr>

                                    <!-- Action Required Banner -->
                                    <tr>
                                        <td style="padding: 0 60px 50px;">
                                            <table cellpadding="0" cellspacing="0" border="0" width="100%" style="background: linear-gradient(135deg, #1a1a1a 0%, #2a2a2a 100%); border-radius: 4px;">
                                                <tr>
                                                    <td style="padding: 32px; text-align: center;">
                                                        <h3 style="margin: 0 0 12px 0; font-family: 'Inter', sans-serif; font-size: 13px; font-weight: 600; letter-spacing: 2px; text-transform: uppercase; color: #ffffff;">⚡ Action Required</h3>
                                                        <p style="margin: 0; font-family: 'Inter', sans-serif; font-size: 14px; color: rgba(255,255,255,0.85); font-weight: 300; line-height: 1.8;">
                                                            Please process this order promptly and update the status in your admin panel.<br>
                                                            ${paymentMethod === 'COD' ? '<strong style="font-weight: 600; color: #ffffff;">Cash on Delivery</strong> – Customer will pay upon delivery.' : '<strong style="font-weight: 600; color: #ffffff;">Payment Confirmed</strong> – Online payment received successfully.'}
                                                        </p>
                                                    </td>
                                                </tr>
                                            </table>
                                        </td>
                                    </tr>

                                    <!-- Footer -->
                                    <tr>
                                        <td style="padding: 40px 60px; text-align: center; background: #fafaf9; border-top: 1px solid #e7e7e7;">
                                            <p style="margin: 0 0 12px 0; font-family: 'Inter', sans-serif; font-size: 12px; color: #737373; font-weight: 400;">
                                                Manage this order in your <a href="https://admin.aharyas.com" style="color: #1a1a1a; text-decoration: none; font-weight: 600; border-bottom: 1px solid #1a1a1a;">Admin Dashboard</a>
                                            </p>
                                            <div style="margin: 20px 0 0 0; padding-top: 20px; border-top: 1px solid #e7e7e7;">
                                                <p style="margin: 0; font-family: 'Inter', sans-serif; font-size: 11px; color: #a3a3a3; font-weight: 300; line-height: 1.6;">
                                                    © ${new Date().getFullYear()} Aharyas Admin Panel<br>
                                                    This email was sent to ${owner.email}
                                                </p>
                                            </div>
                                        </td>
                                    </tr>

                                </table>
                            </td>
                        </tr>
                    </table>
                </body>
                </html>
            `;

            adminEmailSent = await sendOrderMail(owner.email, adminSubject, '', adminHtml);
        }

        return customerEmailSent;

    } catch (error) {
        console.error('Error in sendOrderEmails:', error);
        return false;
    }
};

export { sendOrderMail, sendOrderEmails, sendShippingEmail, sendDeliveredEmail };
export default sendOrderEmails;