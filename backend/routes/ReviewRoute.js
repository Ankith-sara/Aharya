import express from 'express';
import { addReview, getProductReviews, deleteReview } from '../controllers/ReviewController.js';
import authUser from '../middlewares/Auth.js';

const reviewRouter = express.Router();

reviewRouter.post('/add', authUser, addReview);
reviewRouter.get('/product/:productId', getProductReviews);
reviewRouter.delete('/:reviewId', authUser, deleteReview);

export default reviewRouter;
