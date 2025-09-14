import express from 'express';
import upload from '../middlewares/multer.js';
import {
    loginUser, registerUser, adminLogin, registerAdmin, getUserDetails, updateUserProfile, changePassword, addOrUpdateAddress, deleteAddress, sendOtp, verifyOtp
} from '../controllers/UserController.js';

const userRouter = express.Router();

userRouter.post('/register', registerUser);
userRouter.post('/login', loginUser);
userRouter.post('/admin-login', adminLogin);
userRouter.post('/admin-register', registerAdmin);
userRouter.get('/profile/:id', getUserDetails);
userRouter.put('/profile/:id', upload.single('image'), updateUserProfile);
userRouter.put('/address/:id', addOrUpdateAddress);
userRouter.delete('/address/:id', deleteAddress);
userRouter.put('/change-password/:id', changePassword);
userRouter.post('/send-otp', sendOtp);
userRouter.post('/verify-otp', verifyOtp);

export default userRouter;
