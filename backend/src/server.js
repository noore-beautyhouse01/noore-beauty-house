import "dotenv/config";
import express from "express";
import cors from "cors";
import helmet from "helmet";
import rateLimit from "express-rate-limit";
import mongoose from "mongoose";
import bcrypt from "bcryptjs";

import Admin from "./models/Admin.js";

import authRoutes from "./routes/auth.js";
import bookingRoutes from "./routes/bookings.js";
import serviceRoutes from "./routes/services.js";
import galleryRoutes from "./routes/gallery.js";
import messageRoutes from "./routes/messages.js";

const app = express();

const PORT = Number(process.env.PORT || 5000);

/* SECURITY */
app.use(helmet());

app.use(
  express.json({
    limit: "100kb",
  })
);

/* CORS */
const allowedOrigins = String(process.env.FRONTEND_URL || "")
  .split(",")
  .map((origin) => origin.trim())
  .filter(Boolean);

app.use(
  cors({
    origin(origin, callback) {
      if (!origin) {
        return callback(null, true);
      }

      // Local development
      if (
        origin.startsWith("http://localhost:") ||
        origin.startsWith("http://127.0.0.1:")
      ) {
        return callback(null, true);
      }

      // Production frontend
      if (allowedOrigins.includes(origin)) {
        return callback(null, true);
      }

      console.log("Blocked CORS origin:", origin);

      return callback(new Error("Origin not allowed by CORS"));
    },

    methods: [
      "GET",
      "POST",
      "PUT",
      "PATCH",
      "DELETE",
      "OPTIONS",
    ],

    allowedHeaders: [
      "Content-Type",
      "Authorization",
    ],
  })
);

/* RATE LIMIT */
app.use(
  rateLimit({
    windowMs: 15 * 60 * 1000,
    limit: 300,
    standardHeaders: true,
    legacyHeaders: false,
  })
);

/* HEALTH CHECK */
app.get("/api/health", (req, res) => {
  res.status(200).json({
    ok: true,
    service: "NOORÉ API",
    status: "running",
  });
});

/* API ROUTES */

app.use("/api/auth", authRoutes);

app.use("/api/bookings", bookingRoutes);

app.use("/api/services", serviceRoutes);

app.use("/api/gallery", galleryRoutes);

app.use("/api/messages", messageRoutes);

/* 404 */
app.use((req, res) => {
  res.status(404).json({
    message: "API route not found.",
  });
});

/* ERROR */
app.use((err, req, res, next) => {
  console.error("API ERROR:", err);

  res.status(500).json({
    message: "Server error.",
  });
});

/* DATABASE */
async function bootstrap() {
  if (!process.env.MONGODB_URI) {
    throw new Error("MONGODB_URI is missing.");
  }

  if (!process.env.JWT_SECRET) {
    throw new Error("JWT_SECRET is missing.");
  }

  console.log("Connecting to MongoDB...");

  await mongoose.connect(process.env.MONGODB_URI);

  console.log("MongoDB connected successfully.");

  /* ADMIN */
  const email = String(process.env.ADMIN_EMAIL || "")
    .trim()
    .toLowerCase();

  const password = String(process.env.ADMIN_PASSWORD || "");

  if (!email || !password) {
    throw new Error(
      "ADMIN_EMAIL and ADMIN_PASSWORD are required."
    );
  }

  const existing = await Admin.findOne({ email });

  if (!existing) {
    const passwordHash = await bcrypt.hash(password, 12);

    await Admin.create({
      email,
      passwordHash,
    });

    console.log(`Created admin account: ${email}`);
  } else {
    console.log(`Admin account already exists: ${email}`);
  }

  /* START SERVER */
  app.listen(PORT, "0.0.0.0", () => {
    console.log(
      `NOORÉ API running on 0.0.0.0:${PORT}`
    );
  });
}

bootstrap().catch((err) => {
  console.error("Startup failed:", err);
  process.exit(1);
});