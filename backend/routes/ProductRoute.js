import express from 'express'
import { listProducts, addProduct, removeProduct, singleProduct } from '../controllers/ProductController.js';
import adminAuth from '../middlewares/AdminAuth.js';
import upload from '../middlewares/multer.js';

const productRouter = express.Router();

productRouter.post('/add', adminAuth, upload.fields([{ name: 'image1', maxCount: 1 }, { name: 'image2', maxCount: 1 }, { name: 'image3', maxCount: 1 }, { name: 'image4', maxCount: 1 }, { name: 'image5', maxCount: 1 }, { name: 'image6', maxCount: 1 }]), addProduct);
productRouter.get('/list', listProducts);
productRouter.post('/single', singleProduct);
productRouter.delete('/remove/:id', adminAuth, removeProduct);

export default productRouter;