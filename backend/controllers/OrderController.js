import orderModel from "../models/OrderModel.js";
import userModel from "../models/UserModel.js";
import productModel from "../models/ProductModal.js"
import Stripe from 'stripe'
import Razorpay from 'razorpay';
import crypto from 'crypto';
import dotenv from 'dotenv';
import sendOrderEmails from "../middlewares/sendOrderMail.js";
dotenv.config();

const currency = 'inr'
const deliveryCharge = 50

// gateway initialize
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY)
const razorpayInstance = new Razorpay({
  key_id: 'rzp_test_RHQLdXqxNVuLnL',
  key_secret: 'R1Ug1eYXNjAXq3PSNS4Gj66v',
});

// Placing orders using COD Method
const placeOrder = async (req, res) => {
  try {
    const { userId, items, amount, address } = req.body;

    if (!userId || !items || !amount || !address) {
      return res.status(400).json({
        success: false,
        message: 'Missing required fields: userId, items, amount, or address'
      });
    }

    const orderData = {
      userId,
      items,
      amount,
      address,
      paymentMethod: "COD",
      payment: false,
      date: Date.now()
    }

    const newOrder = new orderModel(orderData);
    await newOrder.save();

    await userModel.findByIdAndUpdate(userId, { cartData: {} });

    const user = await userModel.findById(userId);
    if (!user) {
      console.error('User not found for email notification');
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    try {
      await sendOrderEmails(newOrder, user);
    } catch (emailError) {
      console.error('Email sending failed:', emailError)
    }

    res.status(201).json({
      success: true,
      message: "Order placed successfully",
      orderId: newOrder._id
    });

  } catch (error) {
    console.error('COD Order Error:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// Placing orders using Stripe Method
const placeOrderStripe = async (req, res) => {
  try {
    const { userId, items, amount, address } = req.body;
    const { origin } = req.headers;

    if (!userId || !items || !amount || !address) {
      return res.status(400).json({
        success: false,
        message: 'Missing required fields'
      });
    }

    const orderData = {
      userId,
      items,
      amount,
      address,
      paymentMethod: "Stripe",
      payment: false,
      date: Date.now()
    };

    const newOrder = new orderModel(orderData);
    await newOrder.save();

    const line_items = items.map((item) => ({
      price_data: {
        currency: currency,
        product_data: {
          name: item.name
        },
        unit_amount: item.price * 100
      },
      quantity: item.quantity
    }));

    line_items.push({
      price_data: {
        currency: currency,
        product_data: {
          name: 'Delivery Charges'
        },
        unit_amount: deliveryCharge * 100
      },
      quantity: 1
    })

    const session = await stripe.checkout.sessions.create({
      line_items,
      mode: "payment",
      success_url: `${origin}/verify?success=true&orderId=${newOrder._id}`,
      cancel_url: `${origin}/verify?success=false&orderId=${newOrder._id}`,
    });

    res.status(200).json({ success: true, session_url: session.url });
  } catch (error) {
    console.error("Error placing Stripe order:", error.message);
    res.status(500).json({ success: false, message: "Failed to create order. Please try again." });
  }
};

// Verify Stripe Payment
const verifyStripe = async (req, res) => {
  const { orderId, success, userId } = req.body;

  try {
    if (!success) {
      await orderModel.findByIdAndDelete(orderId);
      return res.json({ success: false, message: "Payment not successful" });
    }

    const order = await orderModel.findById(orderId);
    const user = await userModel.findById(userId);

    if (!order || !user) {
      await orderModel.findByIdAndDelete(orderId);
      return res.json({ success: false, message: "Invalid order or user" });
    }

    await orderModel.findByIdAndUpdate(orderId, { payment: true });
    await userModel.findByIdAndUpdate(userId, { cartData: {} });

    try {
      await sendOrderEmails(order, user);
    } catch (emailError) {
      console.error('Email sending failed after Stripe payment:', emailError);
    }

    return res.json({ success: true, message: "Payment successful" });

  } catch (error) {
    console.error("Stripe verification error:", error);
    return res.status(500).json({ success: false, message: error.message });
  }
};

// Placing orders using Razorpay Method
const placeOrderRazorpay = async (req, res) => {
  try {
    const { userId, items, amount, address } = req.body;

    if (!amount) {
      return res.status(400).json({ success: false, message: "Amount required" });
    }

    const options = {
      amount: amount * 100,
      currency: "INR",
      receipt: `receipt_order_${Date.now()}`,
    };

    const order = await razorpayInstance.orders.create(options);
    res.json({ success: true, order });

  } catch (error) {
    console.error("Razorpay order error:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};

const verifyRazorpay = async (req, res) => {
  try {
    const {
      userId,
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
      items,
      amount,
      address,
    } = req.body;

    const expectedSignature = crypto
      .createHmac("sha256", process.env.RAZORPAY_SECRET_KEY)
      .update(`${razorpay_order_id}|${razorpay_payment_id}`)
      .digest("hex");

    if (expectedSignature !== razorpay_signature) {
      return res.status(400).json({
        success: false,
        message: "Invalid payment signature"
      });
    }

    const user = await userModel.findById(userId);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found"
      });
    }

    const orderData = {
      userId,
      items,
      amount,
      address,
      paymentMethod: "Razorpay",
      payment: true,
      date: Date.now(),
    };

    const newOrder = new orderModel(orderData);
    await newOrder.save();

    await userModel.findByIdAndUpdate(userId, { cartData: {} });

    try {
      await sendOrderEmails(newOrder, user);
    } catch (emailError) {
      console.error('Email sending failed after Razorpay payment:', emailError);
    }

    return res.json({
      success: true,
      message: "Payment verified & order placed",
      orderId: newOrder._id,
    });

  } catch (error) {
    console.error("Razorpay verification error:", error);
    return res.status(500).json({ success: false, message: error.message });
  }
};

// All orders using COD Method
const allOrders = async (req, res) => {
  try {
    const adminId = req.user.id;
    const adminProducts = await productModel.find({ adminId: adminId }).select('_id');
    const adminProductIds = adminProducts.map(p => p._id);
    const orders = await orderModel.find({ 'items.productId': { $in: adminProductIds } })
    res.json({ success: true, orders })
  } catch (error) {
    console.log(error)
    res.json({ success: false, message: error.message })
  }
}

// User order data
const userOrders = async (req, res) => {
  try {
    const { userId } = req.body;
    const orders = await orderModel.find({ userId })
    res.json({ success: true, orders })
  } catch (error) {
    console.log(error)
    res.json({ success: false, message: error.message })
  }
}

// Update orders status
const updateStatus = async (req, res) => {
  try {
    const { orderId, status } = req.body
    await orderModel.findByIdAndUpdate(orderId, { status })
    res.json({ success: true, message: "Order status updated" })
  } catch (error) {
    console.log(error)
    res.json({ success: false, message: error.message })
  }
}

// Get order status
const orderStatus = async (req, res) => {
  try {
    const { orderId } = req.params;
    const order = await orderModel.findById(orderId);
    if (!order) {
      return res.status(404).json({ success: false, message: 'Order not found' });
    }
    res.json({ success: true, order });
  } catch (e) {
    console.error("Tracking Error:", e.message);
    res.status(500).json({ success: false, message: e.message });
  }
};

export { verifyRazorpay, verifyStripe, placeOrder, placeOrderStripe, placeOrderRazorpay, allOrders, userOrders, updateStatus, orderStatus };