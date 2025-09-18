import express from 'express';
import cors from 'cors';
import 'dotenv/config';
import connectDB from './config/mongodb.js';
import connectCloudinary from './config/cloudinary.js';
import userRouter from './routes/UserRoute.js';
import productRouter from './routes/ProductRoute.js';
import cartRouter from './routes/CartRoute.js';
import orderRouter from './routes/OrderRoute.js';

// App Config
const app = express();
const port = process.env.PORT_TEST || process.env.PORT || 4000;

app.use(cors({
  origin: "*", // your frontend
  credentials: true
}));

// Connect to DB and Cloudinary
connectDB();
connectCloudinary();

// Middleware
app.use(express.json());
app.use(cors());

// API Endpoints
app.use('/api/user', userRouter);
app.use('/api/product', productRouter)
app.use('/api/cart', cartRouter)
app.use('/api/order', orderRouter)

app.get('/', (req, res) => {
    res.send("API working");
});

// Error Handling Middleware
app.use((err, req, res, next) => {
    console.error(err.message);
    res.status(500).send("Something went wrong!");
});

app.listen(port, () => console.log(`Server started on PORT: ${port}`));

export default app;