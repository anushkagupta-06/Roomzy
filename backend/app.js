import express from "express";
import dotenv from "dotenv";
import cors from "cors";

import userRoutes from "./routes/userRoutes.js";
import adminRoutes from "./routes/adminRoutes.js";

import { notFound } from "./middleware/notFound.js";
import { apiErrorHandler } from "./middleware/apiErrorHandler.js";

dotenv.config();
const app = express();

// ── Middleware ──
app.use(cors());
app.use(express.json());

// ── Routes ──
app.use("/api/users", userRoutes);
app.use("/api/admin", adminRoutes);

// ── Base Route ──
app.get("/", (req, res) => {
  res.send("Welcome to the Roomzy API 🚀");
});

// ── 404 Handler ──
app.use(notFound);

// ── Central Error Handler ──
app.use(apiErrorHandler);

export default app;