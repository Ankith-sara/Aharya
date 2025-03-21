import express from 'express';
import { loginUser, registerUser, adminLogin, getUserDetails } from '../controllers/UserController.js';
// import validateUser from '../middlewares/validateUser.js';

const userRouter = express.Router();

userRouter.post('/register', registerUser);
userRouter.post('/login', loginUser);
userRouter.post('/admin', adminLogin);
userRouter.post('/profile/:id', getUserDetails)

export default userRouter;