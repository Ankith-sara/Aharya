import express from 'express'
import { placeOrder, placeOrderStripe, placeOrderRazorpay, allOrders, userOrders, updateStatus, verifyStripe } from '../controllers/OrderController.js'
import adminAuth from '../middlewares/AdminAuth.js';
import authUser from '../middlewares/Auth.js'

const orderRouter = express.Router()

orderRouter.post('/list', adminAuth, allOrders)
orderRouter.post('/status', adminAuth, updateStatus)
orderRouter.post('/place', authUser, placeOrder)
orderRouter.post('/stripe', authUser, placeOrderStripe)
orderRouter.post('/razorpay', authUser, placeOrderRazorpay)
orderRouter.post('/userorders', authUser, userOrders)
orderRouter.post('/verifystripe', authUser, verifyStripe)

export default orderRouter;