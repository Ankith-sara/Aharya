import orderModel from "../models/OrderModel.js";
import userModel from "../models/UserModel.js";
import productModel from "../models/ProductModal.js";
import couponModel from "../models/CouponModel.js";
import Razorpay from 'razorpay';
import crypto from 'crypto';
import dotenv from 'dotenv';
import sendOrderEmails, { sendShippingEmail, sendDeliveredEmail } from "../middlewares/sendOrderMail.js";
dotenv.config();

const razorpayInstance = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_SECRET_KEY,
});

// Send email async (non-blocking)
const sendOrderNotifications = async (order, user) => {
  try {
    await sendOrderEmails(order, user);
  } catch (emailError) {
    console.error('Email sending failed:', emailError);
  }
};

// Apply coupon helper
const applyCoupon = async (code, amount) => {
    if (!code) return { discount: 0, coupon: null };
    const coupon = await couponModel.findOne({
        code: code.toUpperCase(),
        isActive: true,
        expiresAt: { $gt: new Date() }
    });
    if (!coupon) throw new Error('Invalid or expired coupon code');
    if (coupon.usageLimit !== null && coupon.usedCount >= coupon.usageLimit) throw new Error('Coupon usage limit reached');
    if (amount < coupon.minOrderValue) throw new Error(`Minimum order value for this coupon is ₹${coupon.minOrderValue}`);

    let discount = coupon.discountType === 'percent'
        ? Math.min((coupon.value / 100) * amount, amount)
        : Math.min(coupon.value, amount);

    return { discount: Math.floor(discount), coupon };
};

// Place COD order
const placeOrder = async (req, res) => {
  try {
    const { userId, items, amount, address, couponCode } = req.body;
    if (!userId || !items || !amount || !address) {
      return res.status(400).json({ success: false, message: 'Missing required fields' });
    }

    let discount = 0;
    let appliedCoupon = null;

    if (couponCode) {
        try {
            const result = await applyCoupon(couponCode, amount);
            discount = result.discount;
            appliedCoupon = result.coupon;
        } catch (e) {
            return res.status(400).json({ success: false, message: e.message });
        }
    }

    const finalAmount = amount - discount;
    const newOrder = new orderModel({ userId, items, amount: finalAmount, address, paymentMethod: "COD", payment: false, date: Date.now(), couponCode: couponCode || null, discount });
    await newOrder.save();
    await userModel.findByIdAndUpdate(userId, { cartData: {} });

    if (appliedCoupon) {
        await couponModel.findByIdAndUpdate(appliedCoupon._id, { $inc: { usedCount: 1 } });
    }

    const user = await userModel.findById(userId);
    if (user) sendOrderNotifications(newOrder, user);

    res.status(201).json({ success: true, message: "Order placed successfully", orderId: newOrder._id, discount });
  } catch (error) {
    console.error('COD Order Error:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// Verify COD
const verifyCOD = async (req, res) => {
  try {
    const { orderId } = req.body;
    if (!orderId) return res.status(400).json({ success: false, message: "Order ID required" });
    const order = await orderModel.findById(orderId);
    if (!order) return res.status(404).json({ success: false, message: "Order not found" });
    if (order.paymentMethod !== "COD") return res.status(400).json({ success: false, message: "Invalid payment method" });
    return res.json({ success: true, message: "COD Order confirmed", order });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

// Place Razorpay order
const placeOrderRazorpay = async (req, res) => {
  try {
    const { userId, items, amount, address, couponCode } = req.body;
    if (!amount || !userId || !items || !address) return res.status(400).json({ success: false, message: "All fields required" });

    let discount = 0;
    let appliedCoupon = null;
    if (couponCode) {
        try {
            const result = await applyCoupon(couponCode, amount);
            discount = result.discount;
            appliedCoupon = result.coupon;
        } catch (e) {
            return res.status(400).json({ success: false, message: e.message });
        }
    }

    const finalAmount = amount - discount;
    const newOrder = new orderModel({ userId, items, amount: finalAmount, address, paymentMethod: "Razorpay", payment: false, date: Date.now(), couponCode: couponCode || null, discount });
    await newOrder.save();

    const razorpayOrder = await razorpayInstance.orders.create({
        amount: finalAmount * 100,
        currency: "INR",
        receipt: `receipt_${newOrder._id}`,
        notes: { orderId: newOrder._id.toString() }
    });

    res.json({ success: true, order: razorpayOrder, orderId: newOrder._id, discount });
  } catch (error) {
    console.error("Razorpay order error:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// Verify Razorpay payment
const verifyRazorpay = async (req, res) => {
  try {
    const { orderId, razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body;

    if (orderId && !razorpay_payment_id) {
      const order = await orderModel.findById(orderId);
      if (!order) return res.status(404).json({ success: false, message: "Order not found" });
      return order.payment
        ? res.json({ success: true, message: "Payment already verified", order })
        : res.json({ success: false, message: "Payment verification pending" });
    }

    if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
      return res.status(400).json({ success: false, message: "Missing payment verification details" });
    }

    const expectedSignature = crypto.createHmac("sha256", process.env.RAZORPAY_SECRET_KEY)
        .update(`${razorpay_order_id}|${razorpay_payment_id}`).digest("hex");

    if (expectedSignature !== razorpay_signature) {
      return res.status(400).json({ success: false, message: "Invalid payment signature" });
    }

    const order = await orderModel.findById(orderId);
    const user = await userModel.findById(order.userId);
    if (!order || !user) return res.status(404).json({ success: false, message: "Order or user not found" });

    await orderModel.findByIdAndUpdate(orderId, { payment: true });
    await userModel.findByIdAndUpdate(order.userId, { cartData: {} });

    // Update coupon usage
    if (order.couponCode) {
        await couponModel.findOneAndUpdate({ code: order.couponCode }, { $inc: { usedCount: 1 } });
    }

    sendOrderNotifications(order, user);

    return res.json({ success: true, message: "Payment verified & order placed", orderId: order._id });
  } catch (error) {
    console.error("Razorpay verification error:", error);
    return res.status(500).json({ success: false, message: error.message });
  }
};

// All orders (admin)
const allOrders = async (req, res) => {
  try {
    const adminId = req.user.id;
    const { page = 1, limit = 20, status } = req.query;
    const skip = (Number(page) - 1) * Number(limit);

    const adminProducts = await productModel.find({ adminId }).select('_id');
    const adminProductIds = adminProducts.map(p => p._id);

    const query = { 'items.productId': { $in: adminProductIds } };
    if (status) query.status = status;

    const [orders, total] = await Promise.all([
        orderModel.find(query).sort({ createdAt: -1 }).skip(skip).limit(Number(limit)).lean(),
        orderModel.countDocuments(query)
    ]);

    res.json({ success: true, orders, total, page: Number(page), pages: Math.ceil(total / Number(limit)) });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// User orders
const userOrders = async (req, res) => {
  try {
    const { userId } = req.body;
    const { page = 1, limit = 20 } = req.query;
    const skip = (Number(page) - 1) * Number(limit);
    const [orders, total] = await Promise.all([
        orderModel.find({ userId }).sort({ createdAt: -1 }).skip(skip).limit(Number(limit)).lean(),
        orderModel.countDocuments({ userId })
    ]);
    res.json({ success: true, orders, total, page: Number(page), pages: Math.ceil(total / Number(limit)) });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Update order status + Socket.io notification
const updateStatus = async (req, res) => {
  try {
    const { orderId, status } = req.body;
    const order = await orderModel.findById(orderId);
    if (!order) return res.status(404).json({ success: false, message: "Order not found" });

    const previousStatus = order.status;
    await orderModel.findByIdAndUpdate(orderId, { status });

    // Emit real-time status update
    try {
      const { io } = await import('../server.js');
      io.to(`order_${orderId}`).emit('order-status-update', { status, timestamp: Date.now(), orderId });
    } catch (e) {
      // Socket.io not critical
    }

    const user = await userModel.findById(order.userId);
    if (user?.email) {
      const updatedOrder = await orderModel.findById(orderId);
      if (status === "Shipping" && previousStatus !== "Shipping") {
        sendShippingEmail(updatedOrder, user).catch(e => console.error('Shipping email failed:', e));
      }
      if (status === "Delivered" && previousStatus !== "Delivered") {
        sendDeliveredEmail(updatedOrder, user).catch(e => console.error('Delivered email failed:', e));
      }
    }

    res.json({ success: true, message: "Order status updated" });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Get order status (for tracking)
const orderStatus = async (req, res) => {
  try {
    const { orderId } = req.params;
    const order = await orderModel.findById(orderId);
    if (!order) return res.status(404).json({ success: false, message: 'Order not found' });
    res.json({ success: true, order });
  } catch (e) {
    res.status(500).json({ success: false, message: e.message });
  }
};

// Cancel order
const cancelOrder = async (req, res) => {
  try {
    const { orderId } = req.body;
    const userId = req.body.userId;

    const order = await orderModel.findOne({ _id: orderId, userId });
    if (!order) return res.status(404).json({ success: false, message: "Order not found" });

    const cancellableStatuses = ['Order placed', 'Packing'];
    if (!cancellableStatuses.includes(order.status)) {
      return res.status(400).json({ success: false, message: `Cannot cancel order with status: ${order.status}` });
    }

    await orderModel.findByIdAndUpdate(orderId, { status: 'Cancelled' });
    res.json({ success: true, message: "Order cancelled successfully" });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export { verifyRazorpay, verifyCOD, placeOrder, placeOrderRazorpay, allOrders, userOrders, updateStatus, orderStatus, cancelOrder };