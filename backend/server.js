import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import cors from 'cors';
import path from 'path';

import authRoutes from './routes/auth.js';
import destinationRoutes from './routes/destinations.js';
import connectDB from './config/db.js';
import externalRoutes from './routes/external.js';
import nearbyRoutes from './routes/nearby.js';
import geocodeRoutes from "./routes/geocode.js";
import favoriteRoutes from "./routes/favorites.js";
import quoteRoutes from './routes/quote.js';

dotenv.config(); // Load environment variables from .env file

if (process.env.NODE_ENV !== "production") {
  // Show a message in development mode to confirm MONGO_URI was loaded
  console.log("📦 MONGO_URI loaded from .env");
}

const app = express();
const PORT = process.env.PORT || 5000;

// Global middleware
app.use(cors()); // Enable Cross-Origin Resource Sharing
app.use(express.json()); // Parse incoming JSON requests
app.use('/uploads', express.static('uploads')); // Serve uploaded files statically

// Simple logger middleware for incoming requests (for testing purposes)
app.use((req, res, next) => {
  console.log(`📥 ${req.method} ${req.url}`);
  next();
});

// Register API routes
app.use('/api/auth', authRoutes);
app.use('/api/destinations', destinationRoutes);
app.use("/api/quote", quoteRoutes);
app.use('/api/external', externalRoutes);
app.use('/api/nearby', nearbyRoutes);
app.use("/api/geocode", geocodeRoutes);
app.use("/api/favorites", favoriteRoutes);

// Root route (basic health check)
app.get('/', (req, res) => {
  res.send('Travel Web API is running...');
});

// Connect to MongoDB, then start the server
connectDB().then(() => {
  app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
});

// Serve static frontend files in production
if (process.env.NODE_ENV === "production") {
  const frontendPath = path.join(__dirname, "./frontend/dist");
  app.use(express.static(frontendPath));

  // Catch-all: redirect all non-API requests to index.html
  app.get("*", (req, res) => {
    res.sendFile(path.join(frontendPath, "index.html"));
  });
}

const __dirname = path.resolve(); // Resolve the absolute path for the project root
