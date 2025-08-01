import express from 'express'
import { listProducts, addProduct, removeProduct, singleProduct, editProduct, listAllProductsPublic } from '../controllers/ProductController.js';
import adminAuth from '../middlewares/AdminAuth.js';
import upload from '../middlewares/multer.js';

const productRouter = express.Router();

productRouter.post('/add', adminAuth, upload.fields([{ name: 'image1', maxCount: 1 }, { name: 'image2', maxCount: 1 }, { name: 'image3', maxCount: 1 }, { name: 'image4', maxCount: 1 }, { name: 'image5', maxCount: 1 }, { name: 'image6', maxCount: 1 }]), addProduct);
productRouter.put('/edit/:id', adminAuth, upload.fields([{ name: 'image1', maxCount: 1 }, { name: 'image2', maxCount: 1 }, { name: 'image3', maxCount: 1 }, { name: 'image4', maxCount: 1 }, { name: 'image5', maxCount: 1 }, { name: 'image6', maxCount: 1 }]), editProduct);
productRouter.get('/list', adminAuth, listProducts);
productRouter.get('/all', listAllProductsPublic);
productRouter.post('/single', singleProduct);
productRouter.delete('/remove/:id', adminAuth, removeProduct);

export default productRouter;