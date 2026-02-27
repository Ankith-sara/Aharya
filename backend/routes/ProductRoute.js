import express from 'express';
import { listProducts, addProduct, removeProduct, singleProduct, editProduct, listAllProductsPublic, getCompanies, getProductsByCompany, sellerAnalytics, getRegions } from '../controllers/ProductController.js';
import adminAuth from '../middlewares/AdminAuth.js';
import upload from '../middlewares/multer.js';

const productRouter = express.Router();

const imageUpload = upload.fields([
    { name: 'image1', maxCount: 1 }, { name: 'image2', maxCount: 1 },
    { name: 'image3', maxCount: 1 }, { name: 'image4', maxCount: 1 },
    { name: 'image5', maxCount: 1 }, { name: 'image6', maxCount: 1 }
]);

productRouter.post('/add', adminAuth, imageUpload, addProduct);
productRouter.put('/edit/:id', adminAuth, imageUpload, editProduct);
productRouter.get('/list', adminAuth, listProducts);
productRouter.get('/all', listAllProductsPublic);
productRouter.get('/companies', getCompanies);
productRouter.get('/company/:company', getProductsByCompany);
productRouter.get('/regions', getRegions);
productRouter.post('/single', singleProduct);
productRouter.delete('/remove/:id', adminAuth, removeProduct);
productRouter.get('/analytics', adminAuth, sellerAnalytics);

export default productRouter;
