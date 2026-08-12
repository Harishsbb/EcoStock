import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import connectDB from "./config/db.js";
import { initCronJobs } from "./utils/cron.js";
import { errorHandler, notFound } from "./middleware/errorMiddleware.js";
import Product from "./models/Product.js";
import { seedDatabase } from "./utils/seedData.js";

// Routes
import authRoutes from "./routes/authRoutes.js";
import shopRoutes from "./routes/shopRoutes.js";
import productRoutes from "./routes/productRoutes.js";
import inventoryRoutes from "./routes/inventoryRoutes.js";
import salesRoutes from "./routes/salesRoutes.js";
import discountRoutes from "./routes/discountRoutes.js";
import forecastRoutes from "./routes/forecastRoutes.js";
import supplierRoutes from "./routes/supplierRoutes.js";
import wasteRoutes from "./routes/wasteRoutes.js";
import exchangeRoutes from "./routes/exchangeRoutes.js";
import dealsRoutes from "./routes/dealsRoutes.js";
import notificationRoutes from "./routes/notificationRoutes.js";
import reportRoutes from "./routes/reportRoutes.js";

dotenv.config();

const app = express();

// Robust CORS Middleware
app.use(
  cors({
    origin: true, // Reflect request origin
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization", "X-Requested-With", "Accept"],
  })
);

app.options("*", cors());

// Middlewares
app.use(express.json());

// Auto-connect DB middleware for serverless
app.use(async (req, res, next) => {
  try {
    await connectDB();
    next();
  } catch (err) {
    next(err);
  }
});

// API Routes
app.use("/api/auth", authRoutes);
app.use("/api/shops", shopRoutes);
app.use("/api/products", productRoutes);
app.use("/api/inventory", inventoryRoutes);
app.use("/api/sales", salesRoutes);
app.use("/api/discounts", discountRoutes);
app.use("/api/forecast", forecastRoutes);
app.use("/api/suppliers", supplierRoutes);
app.use("/api/waste", wasteRoutes);
app.use("/api/exchange", exchangeRoutes);
app.use("/api/deals", dealsRoutes);
app.use("/api/notifications", notificationRoutes);
app.use("/api/reports", reportRoutes);

app.get("/api/health", (req, res) => {
  res.json({ status: "OK", timestamp: new Date(), app: "SmartStock Backend API" });
});

// Error handling
app.use(notFound);
app.use(errorHandler);

let PORT = process.env.PORT || 5000;

const startServer = async () => {
  await connectDB();
  initCronJobs();

  // Auto-seed if database is freshly initialized or empty
  try {
    const productCount = await Product.countDocuments();
    if (productCount === 0) {
      console.log("Empty database detected. Auto-seeding initial SmartStock demo data...");
      await seedDatabase();
    }
  } catch (err) {
    console.warn("Could not auto-seed database:", err.message);
  }

  const server = app.listen(PORT, () => {
    console.log(`🚀 SmartStock Server running on port ${PORT}`);
    console.log(`Health check: http://localhost:${PORT}/api/health`);
  });

  server.on("error", (err) => {
    if (err.code === "EADDRINUSE") {
      console.log(`Port ${PORT} is currently occupied. Retrying on port ${Number(PORT) + 1}...`);
      PORT = Number(PORT) + 1;
      setTimeout(() => {
        app.listen(PORT, () => {
          console.log(`🚀 SmartStock Server fallback running on port ${PORT}`);
        });
      }, 1000);
    } else {
      console.error("Server startup error:", err);
    }
  });
};

if (!process.env.VERCEL) {
  startServer();
}

export default app;
