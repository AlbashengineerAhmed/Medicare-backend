import express from "express";
import cookieParser from "cookie-parser";
import cors from "cors";
import mongoose from "mongoose";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";

// Import routes
import authRoute from "./Routes/auth.js";
import userRoute from "./Routes/user.js";
import doctorRoute from "./Routes/doctor.js";
import reviewRoute from "./Routes/review.js";
import appointmentRoute from "./Routes/appointment.js";
import adminRoute from "./Routes/admin.js";
import passwordRoute from "./Routes/password.js";
import deletionRequestRoute from "./Routes/deletionRequest.js";

// Import middleware
import { notFound, errorHandler } from "./middleware/errorMiddleware.js";
import { authRateLimiter, apiRateLimiter } from "./middleware/rateLimitMiddleware.js";
import loggingMiddleware from "./middleware/loggingMiddleware.js";
import logger from "./utils/logger.js";

// Get __dirname equivalent in ES module
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Config
dotenv.config();
const app = express();
const port = process.env.PORT || 8000;
const corsOptions = {
  origin: true,
  credentials: true
};

// Basic route
app.get("/", (req, res) => {
  res.send("HELLO MEDICARE");
});

// Global middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));
app.use(cookieParser());
app.use(cors(corsOptions));
app.use(loggingMiddleware);

// Static folder for uploads
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Apply rate limiters
app.use("/api/v1/auth", authRateLimiter);

// API Routes
app.use("/api/v1/auth", authRoute);
app.use("/api/v1/users", apiRateLimiter, userRoute);
app.use("/api/v1/doctors", apiRateLimiter, doctorRoute);
app.use("/api/v1/reviews", apiRateLimiter, reviewRoute);
app.use("/api/v1/appointments", apiRateLimiter, appointmentRoute);
app.use("/api/v1/admin", apiRateLimiter, adminRoute);
app.use("/api/v1/password", apiRateLimiter, passwordRoute);
app.use("/api/v1/deletion-requests", apiRateLimiter, deletionRequestRoute);

// Error handling middleware
app.use(notFound);
app.use(errorHandler);

// Database connection
mongoose.set("strictQuery", false);
const connectDB = async () => {
  try {
    await mongoose.connect(process.env.DB_URL, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    logger.info("MongoDB Connected Successfully");
    return true;
  } catch (error) {
    logger.error("MongoDB Connection Error:", error);
    process.exit(1); // Exit with failure
  }
};

// Start server only after successful database connection
const startServer = async () => {
  try {
    // Connect to database
    await connectDB();

    // Start server
    app.listen(port, () => {
      logger.info(`Server running in ${process.env.NODE_ENV || 'development'} mode on port ${port}`);
    });
  } catch (error) {
    logger.error("Failed to start server:", error);
    process.exit(1);
  }
};

// Handle unhandled promise rejections
process.on('unhandledRejection', (err) => {
  logger.error('UNHANDLED REJECTION! Shutting down...');
  logger.error(err.name, err.message);
  process.exit(1);
});

// Handle uncaught exceptions
process.on('uncaughtException', (err) => {
  logger.error('UNCAUGHT EXCEPTION! Shutting down...');
  logger.error(err.name, err.message);
  logger.error(err.stack);
  process.exit(1);
});

// Start the server
startServer();
