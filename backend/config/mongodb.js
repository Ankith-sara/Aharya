import mongoose from "mongoose";

const connectDB = async () => {
    mongoose.connection.on('connected', () => {
        console.log('DB connected');
    });
    mongoose.connection.on('error', (err) => {
        console.error('MongoDB connection error:', err);
    });

    await mongoose.connect(`${process.env.MONGODB_URI}`, {
        maxPoolSize: 10,
        serverSelectionTimeoutMS: 5000,
        socketTimeoutMS: 45000,
    });
}

export default connectDB;
