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

// Helper function to format date
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
        return '<span style="background: #ff9800; color: white; padding: 4px 12px; border-radius: 20px; font-size: 12px; font-weight: bold;">Cash on Delivery</span>';
    }
    return isPaid ? 
        '<span style="background: #4CAF50; color: white; padding: 4px 12px; border-radius: 20px; font-size: 12px; font-weight: bold;">Paid Online</span>' :
        '<span style="background: #f44336; color: white; padding: 4px 12px; border-radius: 20px; font-size: 12px; font-weight: bold;">Payment Pending</span>';
};

// Professional function to send both customer and admin emails
const sendOrderEmails = async (orderData, user) => {
    const { _id: orderId, amount, items, address, paymentMethod, payment, date } = orderData;

    // Find product owner (admin) for the first product to determine vendor
    let owner = null;
    try {
        const product = await productModel.findById(items[0].productId).populate("adminId"); 
        if (product && product.adminId) {
            owner = product.adminId;
        } else {
            console.error("❌ Could not find product owner for order");
            return false;
        }
    } catch (error) {
        console.error("❌ Error finding product owner:", error);
        return false;
    }

    // === CUSTOMER EMAIL ===
    const customerSubject = `🎉 Order Confirmed #${orderId} - Thank you for shopping with Aharyas!`;
    
    const customerHtml = `
        <!DOCTYPE html>
        <html>
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Order Confirmation</title>
        </head>
        <body style="margin: 0; padding: 0; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #f8f9fa;">
            <div style="max-width: 650px; margin: 0 auto; background: white; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 6px rgba(0,0,0,0.1);">
                
                <!-- Header -->
                <div style="background: linear-gradient(135deg, #8B4513 0%, #D2B48C 100%); padding: 30px 20px; text-align: center;">
                    <h1 style="color: white; margin: 0; font-size: 28px; font-weight: 300;">AHARYAS</h1>
                    <p style="color: rgba(255,255,255,0.9); margin: 8px 0 0 0; font-size: 14px;">Premium Fashion Store</p>
                </div>

                <!-- Success Message -->
                <div style="padding: 30px 20px; text-align: center; border-bottom: 1px solid #eee;">
                    <h2 style="color: #333; margin: 0 0 10px 0; font-size: 24px;">Order Confirmed!</h2>
                    <p style="color: #666; margin: 0; font-size: 16px;">Hi ${user.name}, your order has been successfully placed.</p>
                </div>

                <!-- Order Details -->
                <div style="padding: 30px 20px;">
                    <div style="background: #f8f9fa; border-radius: 8px; padding: 20px; margin-bottom: 25px;">
                        <h3 style="margin: 0 0 15px 0; color: #333; font-size: 18px; display: flex; align-items: center;">
                            📋 Order Summary
                        </h3>
                        <table style="width: 100%; border-collapse: collapse;">
                            <tr>
                                <td style="padding: 8px 0; color: #666; width: 40%;">Order ID:</td>
                                <td style="padding: 8px 0; color: #333; font-weight: 600;">#${orderId}</td>
                            </tr>
                            <tr>
                                <td style="padding: 8px 0; color: #666;">Order Date:</td>
                                <td style="padding: 8px 0; color: #333;">${formatDate(date)}</td>
                            </tr>
                            <tr>
                                <td style="padding: 8px 0; color: #666;">Payment Method:</td>
                                <td style="padding: 8px 0;">${getPaymentBadge(paymentMethod, payment)}</td>
                            </tr>
                            <tr>
                                <td style="padding: 8px 0; color: #666;">Total Amount:</td>
                                <td style="padding: 8px 0; color: #4CAF50; font-weight: bold; font-size: 18px;">₹${amount}</td>
                            </tr>
                        </table>
                    </div>

                    <!-- Items -->
                    <div style="margin-bottom: 25px;">
                        <h3 style="margin: 0 0 15px 0; color: #333; font-size: 18px;">🛍️ Items Ordered</h3>
                        ${items.map(item => `
                            <div style="border: 1px solid #eee; border-radius: 8px; padding: 15px; margin-bottom: 10px; display: flex; align-items: center;">
                                ${item.image ? `<img src="${item.image}" alt="${item.name}" style="width: 60px; height: 60px; object-fit: cover; border-radius: 6px; margin-right: 15px;">` : ''}
                                <div style="flex: 1;">
                                    <h4 style="margin: 0 0 5px 0; color: #333; font-size: 16px;">${item.name}</h4>
                                    <p style="margin: 0; color: #666; font-size: 14px;">
                                        Quantity: ${item.quantity} ${item.size ? `• Size: ${item.size}` : ''} • ₹${item.price} each
                                    </p>
                                </div>
                                <div style="text-align: right;">
                                    <span style="color: #4CAF50; font-weight: bold; font-size: 16px;">₹${item.price * item.quantity}</span>
                                </div>
                            </div>
                        `).join('')}
                    </div>

                    <!-- Delivery Address -->
                    <div style="background: #fff8e1; border-radius: 8px; padding: 20px; margin-bottom: 25px;">
                        <h3 style="margin: 0 0 15px 0; color: #333; font-size: 18px;">🚚 Delivery Address</h3>
                        <div style="color: #666; line-height: 1.6;">
                            <strong style="color: #333;">${address.firstName} ${address.lastName}</strong><br>
                            ${address.street}<br>
                            ${address.city}, ${address.state} - ${address.zipcode}<br>
                            ${address.country}<br>
                            📞 ${address.phone}
                        </div>
                    </div>

                    <!-- Next Steps -->
                    <div style="background: #e8f5e8; border-radius: 8px; padding: 20px; text-align: center;">
                        <h3 style="margin: 0 0 10px 0; color: #2e7d32; font-size: 18px;">What's Next? 🚀</h3>
                        <p style="margin: 0; color: #388e3c; line-height: 1.6;">
                            ${paymentMethod === 'COD' ? 
                                'Your order will be processed and shipped soon. Please keep the exact amount ready for cash payment.' :
                                'Your payment has been received. We\'ll process your order and send tracking details soon.'
                            }
                        </p>
                    </div>
                </div>

                <!-- Footer -->
                <div style="background: #f8f9fa; padding: 25px 20px; text-align: center; border-top: 1px solid #eee;">
                    <p style="margin: 0 0 10px 0; color: #666; font-size: 14px;">Thank you for choosing Aharyas!</p>
                    <p style="margin: 0; color: #999; font-size: 12px;">
                        Need help? Contact us at <a href="mailto:support@aharyas.com" style="color: #667eea; text-decoration: none;">support@aharyas.com</a>
                    </p>
                </div>
            </div>
        </body>
        </html>
    `;

    // === ADMIN/VENDOR EMAIL ===
    const adminSubject = `🔔 New Order Alert #${orderId} - Aharyas Store`;
    
    const adminHtml = `
        <!DOCTYPE html>
        <html>
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>New Order Alert</title>
        </head>
        <body style="margin: 0; padding: 0; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #f8f9fa;">
            <div style="max-width: 650px; margin: 0 auto; background: white; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 6px rgba(0,0,0,0.1);">
                
                <!-- Header -->
                <div style="background: linear-gradient(135deg, #8B4513 0%, #D2B48C 100%); padding: 30px 20px; text-align: center;">
                    <h1 style="color: white; margin: 0; font-size: 28px; font-weight: 300;">AHARYAS ADMIN</h1>
                    <p style="color: rgba(255,255,255,0.9); margin: 8px 0 0 0; font-size: 14px;">New Order Management</p>
                </div>

                <!-- Alert Message -->
                <div style="padding: 30px 20px; text-align: center; border-bottom: 1px solid #eee;">
                    <h2 style="color: #333; margin: 0 0 10px 0; font-size: 24px;">New Order Received!</h2>
                    <p style="color: #666; margin: 0; font-size: 16px;">Hi ${owner.name}, you have a new order to process.</p>
                </div>

                <!-- Order Details -->
                <div style="padding: 30px 20px;">
                    <div style="background: #fff3e0; border-radius: 8px; padding: 20px; margin-bottom: 25px;">
                        <h3 style="margin: 0 0 15px 0; color: #333; font-size: 18px; display: flex; align-items: center;">
                            📋 Order Information
                        </h3>
                        <table style="width: 100%; border-collapse: collapse;">
                            <tr>
                                <td style="padding: 8px 0; color: #666; width: 40%;">Order ID:</td>
                                <td style="padding: 8px 0; color: #333; font-weight: 600;">#${orderId}</td>
                            </tr>
                            <tr>
                                <td style="padding: 8px 0; color: #666;">Order Date:</td>
                                <td style="padding: 8px 0; color: #333;">${formatDate(date)}</td>
                            </tr>
                            <tr>
                                <td style="padding: 8px 0; color: #666;">Payment Status:</td>
                                <td style="padding: 8px 0;">${getPaymentBadge(paymentMethod, payment)}</td>
                            </tr>
                            <tr>
                                <td style="padding: 8px 0; color: #666;">Order Value:</td>
                                <td style="padding: 8px 0; color: #4CAF50; font-weight: bold; font-size: 18px;">₹${amount}</td>
                            </tr>
                        </table>
                    </div>

                    <!-- Customer Details -->
                    <div style="background: #e3f2fd; border-radius: 8px; padding: 20px; margin-bottom: 25px;">
                        <h3 style="margin: 0 0 15px 0; color: #333; font-size: 18px;">👤 Customer Details</h3>
                        <table style="width: 100%; border-collapse: collapse;">
                            <tr>
                                <td style="padding: 8px 0; color: #666; width: 30%;">Name:</td>
                                <td style="padding: 8px 0; color: #333; font-weight: 600;">${user.name}</td>
                            </tr>
                            <tr>
                                <td style="padding: 8px 0; color: #666;">Email:</td>
                                <td style="padding: 8px 0; color: #333;">${user.email}</td>
                            </tr>
                            <tr>
                                <td style="padding: 8px 0; color: #666;">Phone:</td>
                                <td style="padding: 8px 0; color: #333;">${address.phone}</td>
                            </tr>
                        </table>
                    </div>

                    <!-- Items to Ship -->
                    <div style="margin-bottom: 25px;">
                        <h3 style="margin: 0 0 15px 0; color: #333; font-size: 18px;">📦 Items to Process</h3>
                        ${items.map(item => `
                            <div style="border: 1px solid #eee; border-radius: 8px; padding: 15px; margin-bottom: 10px; display: flex; align-items: center;">
                                ${item.image ? `<img src="${item.image}" alt="${item.name}" style="width: 60px; height: 60px; object-fit: cover; border-radius: 6px; margin-right: 15px;">` : ''}
                                <div style="flex: 1;">
                                    <h4 style="margin: 0 0 5px 0; color: #333; font-size: 16px;">${item.name}</h4>
                                    <p style="margin: 0; color: #666; font-size: 14px;">
                                        <strong>Qty:</strong> ${item.quantity} ${item.size ? `• <strong>Size:</strong> ${item.size}` : ''} • <strong>Price:</strong> ₹${item.price} each
                                    </p>
                                </div>
                                <div style="text-align: right;">
                                    <span style="color: #4CAF50; font-weight: bold; font-size: 16px;">₹${item.price * item.quantity}</span>
                                </div>
                            </div>
                        `).join('')}
                    </div>

                    <!-- Shipping Address -->
                    <div style="background: #f3e5f5; border-radius: 8px; padding: 20px; margin-bottom: 25px;">
                        <h3 style="margin: 0 0 15px 0; color: #333; font-size: 18px;">🚚 Shipping Address</h3>
                        <div style="color: #666; line-height: 1.6;">
                            <strong style="color: #333;">${address.firstName} ${address.lastName}</strong><br>
                            ${address.street}<br>
                            ${address.city}, ${address.state} - ${address.zipcode}<br>
                            ${address.country}<br>
                            📞 ${address.phone}
                        </div>
                    </div>

                    <!-- Action Required -->
                    <div style="background: #ffebee; border-radius: 8px; padding: 20px; text-align: center; border-left: 4px solid #f44336;">
                        <h3 style="margin: 0 0 10px 0; color: #d32f2f; font-size: 18px;">⚡ Action Required</h3>
                        <p style="margin: 0; color: #666; line-height: 1.6;">
                            Please process this order promptly and update the order status in your admin panel. 
                            ${paymentMethod === 'COD' ? 'This is a Cash on Delivery order.' : 'Payment has been received.'}
                        </p>
                    </div>
                </div>

                <!-- Footer -->
                <div style="background: #f8f9fa; padding: 25px 20px; text-align: center; border-top: 1px solid #eee;">
                    <p style="margin: 0 0 10px 0; color: #666; font-size: 14px;">Aharyas Admin Panel</p>
                    <p style="margin: 0; color: #999; font-size: 12px;">
                        Manage orders at <a href="https://admin.aharyas.com" style="color: #667eea; text-decoration: none;">admin.aharyas.com</a>
                    </p>
                </div>
            </div>
        </body>
        </html>
    `;

    // Send both emails
    const results = await Promise.allSettled([
        sendOrderMail(user.email, customerSubject, '', customerHtml),
        sendOrderMail(owner.email, adminSubject, '', adminHtml)
    ]);

    results.forEach((result, index) => {
        const recipient = index === 0 ? 'customer' : 'admin';
        if (result.status === 'fulfilled' && result.value) {
            console.log(`✅ ${recipient} email sent successfully`);
        } else {
            console.error(`❌ Failed to send ${recipient} email:`, result.reason);
        }
    });

    return results;
};

export { sendOrderMail, sendOrderEmails };
export default sendOrderMail;