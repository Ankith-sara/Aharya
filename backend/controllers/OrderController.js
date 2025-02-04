import orderModel from "../models/OrderModel.js";
import userModel from "../models/UserModel.js";
import Stripe from 'stripe'

const currency = 'inr'
const deliveryCharge = 50

// gateway initialize
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY)

// Placeing orders using COD Method
const placeOrder = async (req, res) => {
  try {
    const { userId, items, amount, address } = req.body;
    const orderData = {
      userId,
      items,
      amount,
      address,
      paymentMethod: "COD",
      payment: false,
      date: Date.now()
    }
    const neworder = new orderModel(orderData);
    await neworder.save();

    await userModel.findByIdAndUpdate(userId, { cartData: {} })
    res.status(201).json({ success: true, message: "Order placed successfully" });
  } catch (error) {
    console.log(error)
    res.json({ success: false, message: error.message })
  }
}

// Placeing orders using Stripe Method
const placeOrderStripe = async (req, res) => {
  try {
    const { userId, items, amount, address } = req.body;
    const { origin } = req.headers;

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
  const { orderId, success, userId } = req.body
  try {
    if (success) {
      await orderModel.findByIdAndUpdate(orderId, { payment: true })
      await userModel.findByIdAndUpdate(userId, { cartData: {} })
      res.json({ success: true, message: "Payment successful" })
    } else {
      await orderModel.findByIdAndDelete(orderId)
      res.json({ success: false, message: "Payment failed" })
    }
  } catch (error) {
    console.log(error)
    res.json({ success: false, message: error.message })
  }
}

// Placeing orders using Razorpay Method
const placeOrderRazorpay = async (req, res) => {

}

// All orders using COD Method
const allOrders = async (req, res) => {
  try {
    const orders = await orderModel.find({})
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

export { verifyStripe, placeOrder, placeOrderStripe, placeOrderRazorpay, allOrders, userOrders, updateStatus }