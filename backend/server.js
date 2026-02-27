import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import mongoSanitize from 'express-mongo-sanitize';
import morgan from 'morgan';
import { createServer } from 'http';
import { Server } from 'socket.io';
import 'dotenv/config';
import connectDB from './config/mongodb.js';
import connectCloudinary from './config/cloudinary.js';
import userRouter from './routes/UserRoute.js';
import productRouter from './routes/ProductRoute.js';
import cartRouter from './routes/CartRoute.js';
import orderRouter from './routes/OrderRoute.js';
import wishlistRouter from './routes/WishlistRoute.js';
import couponRouter from './routes/CouponRoute.js';

// App Config
const app = express();
const httpServer = createServer(app);
const port = process.env.PORT || 4000;

// Connect to DB and Cloudinary
connectDB();
connectCloudinary();

// Allowed Origins
const allowedOrigins = [
    'http://localhost:5173',
    'http://localhost:5174',
    'http://localhost:3000',
    'https://admin.aharyas.com',
    'https://www.admin.aharyas.com',
    'https://aharyas.com',
    'https://www.aharyas.com',
];

// Socket.io for Real-Time Order Tracking
export const io = new Server(httpServer, {
    cors: { origin: allowedOrigins, credentials: true }
});

io.on('connection', (socket) => {
    socket.on('track-order', (orderId) => {
        socket.join(`order_${orderId}`);
    });
});

// CORS
app.use(cors({
    origin: function (origin, callback) {
        if (!origin) return callback(null, true);
        if (allowedOrigins.includes(origin)) {
            callback(null, true);
        } else {
            console.log('CORS blocked origin:', origin);
            callback(new Error(`CORS policy: Origin ${origin} not allowed`)); // FIXED BUG
        }
    },
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
    exposedHeaders: ['Content-Range', 'X-Content-Range'],
    maxAge: 86400,
}));

app.options('*', cors());

// Security Headers
app.use(helmet());

// Rate Limiting
const apiLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 100,
    standardHeaders: true,
    legacyHeaders: false,
    message: { success: false, message: 'Too many requests, please try again later.' }
});

const authLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 10,
    standardHeaders: true,
    legacyHeaders: false,
    message: { success: false, message: 'Too many auth attempts, please try again later.' }
});

app.use('/api/', apiLimiter);
app.use('/api/v1/user/login', authLimiter);
app.use('/api/v1/user/register', authLimiter);
app.use('/api/v1/user/send-otp', authLimiter);
app.use('/api/v1/user/admin-login', authLimiter);

// Core Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(mongoSanitize());

// Request Logging
app.use(morgan('combined'));

// Health Check
app.get('/health', (req, res) => {
    res.json({ status: 'ok', uptime: process.uptime(), timestamp: Date.now(), version: 'v1' });
});

// API v1 Routes
app.use('/api/v1/user', userRouter);
app.use('/api/v1/product', productRouter);
app.use('/api/v1/cart', cartRouter);
app.use('/api/v1/order', orderRouter);
app.use('/api/v1/wishlist', wishlistRouter);
app.use('/api/v1/coupon', couponRouter);

// Legacy route aliases (backward compatibility)
app.use('/api/user', userRouter);
app.use('/api/product', productRouter);
app.use('/api/cart', cartRouter);
app.use('/api/order', orderRouter);
app.use('/api/wishlist', wishlistRouter);

app.get('/', (req, res) => {
    res.send("Aharyas API is running ");
});

// 404 Handler
app.use((req, res, next) => {
    res.status(404).json({ success: false, message: `Route ${req.originalUrl} not found` });
});

// Global Error Handler
app.use((err, req, res, next) => {
    console.error('Error:', err.message);
    res.status(err.status || 500).json({ success: false, message: err.message || "Something went wrong!" });
});

httpServer.listen(port, () => console.log(`Server started on PORT: ${port}`));

export default app;
