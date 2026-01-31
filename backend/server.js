import express from 'express';
import cors from 'cors';
import 'dotenv/config';
import connectDB from './config/mongodb.js';
import connectCloudinary from './config/cloudinary.js';
import userRouter from './routes/UserRoute.js';
import productRouter from './routes/ProductRoute.js';
import cartRouter from './routes/CartRoute.js';
import orderRouter from './routes/OrderRoute.js';
import wishlistRouter from './routes/WishlistRoute.js';

// App Config
const app = express();
const port = process.env.PORT || 4000;

// Connect to DB and Cloudinary
connectDB();
connectCloudinary();

// CORS Configuration - FIXED
const allowedOrigins = [
  'http://localhost:5173',           // Local frontend development
  'http://localhost:5174',           // Alternative local port
  'http://localhost:3000',           // Alternative local port
  'https://admin.aharyas.com',       // Production admin frontend
  'https://www.admin.aharyas.com',   // Production admin with www
  'https://aharyas.com',             // Production user frontend
  'https://www.aharyas.com',         // Production user with www
];

const corsOptions = {
  origin: function (origin, callback) {
    // Allow requests with no origin (like mobile apps, Postman, curl)
    if (!origin) return callback(null, true);
    
    if (allowedOrigins.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      console.log('Blocked by CORS:', origin);
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
  exposedHeaders: ['Content-Range', 'X-Content-Range'],
  maxAge: 86400, // 24 hours
};

// Apply CORS middleware ONCE
app.use(cors(corsOptions));

// Handle preflight requests
app.options('*', cors(corsOptions));

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// API Endpoints
app.use('/api/user', userRouter);
app.use('/api/product', productRouter);
app.use('/api/cart', cartRouter);
app.use('/api/order', orderRouter);
app.use('/api/wishlist', wishlistRouter);

app.get('/', (req, res) => {
    res.send("API is working");
});

// 404 Handler
app.use((req, res, next) => {
    res.status(404).json({
        success: false,
        message: `Route ${req.originalUrl} not found`
    });
});

// Error Handling Middleware
app.use((err, req, res, next) => {
    console.error('Error:', err.message);
    res.status(err.status || 500).json({
        success: false,
        message: err.message || "Something went wrong!"
    });
});

app.listen(port, () => console.log(`Server started on PORT: ${port}`));

export default app;