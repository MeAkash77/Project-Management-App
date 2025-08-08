import express from 'express';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import cors from 'cors';
import morgan from 'morgan';
import cookieParser from 'cookie-parser';

import authRoutes from './routes/auth.js';
import userRoutes from './routes/user.js';
import projectRoutes from './routes/project.js';
import teamRoutes from './routes/teams.js';

// Load environment variables
dotenv.config();

const app = express();
const port = process.env.PORT || 8700;

/** MongoDB Connection */
const connectDB = async () => {
  try {
    mongoose.set('strictQuery', true);
    await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log("✅ MongoDB connected");
  } catch (err) {
    console.error("❌ MongoDB connection error:", err.message);
    process.exit(1); // Exit on failure
  }
};

/** Middlewares */
app.use(express.json());
app.use(cookieParser());
app.use(morgan('tiny'));
app.use(cors({
  origin: true,
  credentials: true,
}));
app.disable('x-powered-by'); // security

/** Routes */
app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/project", projectRoutes);
app.use("/api/team", teamRoutes);

/** Error handling middleware */
app.use((err, req, res, next) => {
  const status = err.status || 500;
  const message = err.message || "Something went wrong";
  res.status(status).json({
    success: false,
    status,
    message
  });
});

/** Start Server */
app.listen(port, () => {
  console.log(`🚀 Server running on port ${port}`);
  connectDB();
});
