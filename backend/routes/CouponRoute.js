import express from 'express';
import { createCoupon, validateCoupon, listCoupons, toggleCoupon, deleteCoupon } from '../controllers/CouponController.js';
import authUser from '../middlewares/Auth.js';
import authAdmin from '../middlewares/AdminAuth.js';

const couponRouter = express.Router();

couponRouter.post('/create', authAdmin, createCoupon);
couponRouter.post('/validate', authUser, validateCoupon);
couponRouter.get('/list', authAdmin, listCoupons);
couponRouter.patch('/toggle/:couponId', authAdmin, toggleCoupon);
couponRouter.delete('/delete/:couponId', authAdmin, deleteCoupon);

export default couponRouter;
