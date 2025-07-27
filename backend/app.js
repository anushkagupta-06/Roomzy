import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import cookieParser from "cookie-parser";

import userRoutes from "./src/routes/userRoutes.js";
import adminRoutes from "./src/routes/adminRoutes.js";

import connectDB from "./src/db/db.js";

import http from "http";
import { initSocket } from "./socket/chatSocket.js";

dotenv.config();
const app = express();

connectDB();

const PORT = process.env.PORT || 3000;

app.use(cookieParser());

// ── Middleware ──
app.use(cors({
  origin: "http://localhost:5173", 
  credentials: true         
}));
app.use(express.json());

// ── Routes ──
app.use("/api/users", userRoutes);
app.use("/api/admin", adminRoutes);

// ── Base Route ──
app.get("/", (req, res) => {
  res.send("Welcome to the Roomzy API 🚀");
});

const server = http.createServer(app);
const io = initSocket(server);

server.listen(process.env.PORT || 3000, () => {
  console.log(`🚀 Server running on port ${process.env.PORT}`);
});

export default app;