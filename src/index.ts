import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import * as admin from 'firebase-admin';
import subscriptionRoutes from './routes/subscriptionRoutes';
import errorHandler from './middleware/errorHandler';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import cors from 'cors';
import morgan from 'morgan';
import winston from 'winston';
import http from 'http'; // Import http module

dotenv.config();

const app = express();

// **Logging and Monitoring**

const logger = winston.createLogger({
  level: process.env.LOG_LEVEL || 'info',
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.json()
  ),
  transports: [
    new winston.transports.Console(),
  ],
});

app.use(morgan('combined', { stream: { write: (message) => logger.info(message.trim()) } }));
app.locals.logger = logger;


// **Security Enhancements**

app.use(helmet());

const corsOptions = {
  origin: process.env.ALLOWED_ORIGINS ? process.env.ALLOWED_ORIGINS.split(',') : '*'
};
app.use(cors(corsOptions));

const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  message: 'Too many requests from this IP, please try again after 15 minutes'
});
app.use('/api/', apiLimiter);


// Middleware to parse JSON request bodies
app.use(express.json());

// Initialize Firebase Admin SDK
const firebaseServiceAccountKeyPath = process.env.FIREBASE_SERVICE_ACCOUNT_KEY_PATH;

if (!firebaseServiceAccountKeyPath) {
  logger.error('FIREBASE_SERVICE_ACCOUNT_KEY_PATH is not defined in your .env file.');
  process.exit(1);
}

try {
  const serviceAccount = require(firebaseServiceAccountKeyPath);
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount)
  });
  logger.info('Firebase Admin SDK initialized');
} catch (error) {
  logger.error('Error initializing Firebase Admin SDK:', error);
  process.exit(1);
}

// MongoDB Connection
const mongoURI = process.env.MONGODB_URI;

if (!mongoURI) {
  logger.error('MONGODB_URI is not defined in your .env file.');
  process.exit(1);
}

mongoose.connect(mongoURI)
  .then(() => logger.info('MongoDB connected'))
  .catch(err => logger.error('MongoDB connection error:', err));

// Use Subscription Routes
app.use('/api/subscriptions', subscriptionRoutes);

app.get('/', (req, res) => {
  const name = process.env.NAME || 'World';
  res.send(`Hello ${name}!`);
});

// Add the error handling middleware as the last middleware
app.use(errorHandler);

const port = parseInt(process.env.PORT || '3000');

// Create a Node.js HTTP server
const server = http.createServer(app);

server.listen(port, () => {
  logger.info(`listening on port ${port}`);
});

// **Graceful Shutdown**

const gracefulShutdown = () => {
  logger.info('Received termination signal. Starting graceful shutdown.');

  // Stop the server from accepting new connections
  server.close(async (err) => {
    if (err) {
      logger.error('Error during server shutdown:', err);
      process.exit(1);
    }

    logger.info('HTTP server closed.');

    // Close database connections
    try {
      await mongoose.disconnect();
      logger.info('MongoDB connection closed.');
    } catch (dbErr) {
      logger.error('Error during MongoDB disconnection:', dbErr);
      // Continue with shutdown even if database disconnection fails
    }

    // Add other resource cleanup here (e.g., closing file handles, other connections)

    logger.info('Graceful shutdown complete. Exiting process.');
    process.exit(0);
  });

  // Optional: Forceful shutdown after a timeout
  setTimeout(() => {
    logger.error('Graceful shutdown timeout. Forcing exit.');
    process.exit(1);
  }, process.env.SHUTDOWN_TIMEOUT ? parseInt(process.env.SHUTDOWN_TIMEOUT) : 10000); // Default timeout of 10 seconds
};

// Listen for termination signals
process.on('SIGINT', gracefulShutdown);
process.on('SIGTERM', gracefulShutdown);
