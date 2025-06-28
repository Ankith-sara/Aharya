import express from 'express';
import { loginUser, registerUser, adminLogin, getUserDetails, updateUserProfile, changePassword, addOrUpdateAddress, deleteAddress } from '../controllers/UserController.js';

const userRouter = express.Router();

userRouter.post('/register', registerUser);
userRouter.post('/login', loginUser);
userRouter.post('/admin', adminLogin);
userRouter.get('/profile/:id', getUserDetails);
userRouter.post('/profile/:id', getUserDetails);
userRouter.put('/update/:id', updateUserProfile);
userRouter.put('/address/:id', addOrUpdateAddress);
userRouter.delete('/address/:id', deleteAddress);
userRouter.put('/change-password/:id', changePassword);

export default userRouter;