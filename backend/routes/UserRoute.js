import express from 'express';
import upload from '../middlewares/multer.js';
import authUser from '../middlewares/Auth.js';
import {
    loginUser, registerUser, adminLogin, getUserDetails, getUserProfile, updateUserProfile, changePassword, addOrUpdateAddress,
    deleteAddress, sendOtp, verifyOtp, sendAdminOtp, verifyAdminOtp, subscribeNewsletter, sendForgotPasswordOtp, resetPassword,
    refreshToken
} from '../controllers/UserController.js';

const userRouter = express.Router();

userRouter.post('/register', registerUser);
userRouter.post('/login', loginUser);
userRouter.post('/send-otp', sendOtp);
userRouter.post('/verify-otp', verifyOtp);
userRouter.post('/refresh-token', refreshToken);
userRouter.post("/newsletter/subscribe", subscribeNewsletter);
userRouter.post('/admin-login', adminLogin);
userRouter.post('/send-admin-otp', sendAdminOtp);
userRouter.post('/verify-admin-otp', verifyAdminOtp);
userRouter.get('/profile', authUser, getUserProfile);
userRouter.get('/profile/:id', getUserDetails);
userRouter.put('/profile/:id', upload.single('image'), updateUserProfile);
userRouter.put('/address/:id', addOrUpdateAddress);
userRouter.delete('/address/:id', deleteAddress);
userRouter.put('/change-password/:id', changePassword);
userRouter.post('/forgot-password-otp', sendForgotPasswordOtp);
userRouter.post('/reset-password', resetPassword);

export default userRouter;
