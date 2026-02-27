import express from 'express';
import { addToWishlist, getUserWishlist, getWishlistWithDetails, removeFromWishlist, toggleWishlist } from '../controllers/WishlistController.js';
import authUser from '../middlewares/Auth.js';

const wishlistRouter = express.Router();

wishlistRouter.post('/add', authUser, addToWishlist);
wishlistRouter.post('/remove', authUser, removeFromWishlist);
wishlistRouter.post('/toggle', authUser, toggleWishlist);
wishlistRouter.post('/get', authUser, getUserWishlist);
wishlistRouter.post('/details', authUser, getWishlistWithDetails);

export default wishlistRouter;