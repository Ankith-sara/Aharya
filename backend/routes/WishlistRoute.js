import express from 'express';
import authUser from '../middleware/auth.js';
import { addToWishlist, clearWishlist, getUserWishlist, removeFromWishlist, syncWishlist } from '../controllers/WishlistController.js';

const wishlistRouter = express.Router();

// All routes require authentication
wishlistRouter.post('/add', authUser, addToWishlist);
wishlistRouter.post('/remove', authUser, removeFromWishlist);
wishlistRouter.get('/get', authUser, getUserWishlist);
wishlistRouter.delete('/clear', authUser, clearWishlist);
wishlistRouter.post('/sync', authUser, syncWishlist);

export default wishlistRouter;