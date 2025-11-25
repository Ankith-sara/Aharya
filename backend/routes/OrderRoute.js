import express from 'express';
import authUser from '../middlewares/Auth.js';
import adminAuth from '../middlewares/AdminAuth.js';
import {
    placeOrder, placeOrderRazorpay, verifyRazorpay, verifyCOD, allOrders, userOrders, updateStatus, orderStatus
} from '../controllers/OrderController.js';

const orderRouter = express.Router();

orderRouter.post('/place', authUser, placeOrder);
orderRouter.post('/razorpay', authUser, placeOrderRazorpay);
orderRouter.post('/verifyRazorpay', authUser, verifyRazorpay);
orderRouter.post('/verifyCOD', authUser, verifyCOD);
orderRouter.post('/userorders', authUser, userOrders); 
orderRouter.get('/status/:orderId', orderStatus);
orderRouter.post('/list', adminAuth, allOrders);
orderRouter.post('/status', adminAuth, updateStatus);

export default orderRouter;