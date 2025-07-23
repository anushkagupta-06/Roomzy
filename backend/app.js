import express from "express";
import dotenv from "dotenv";
import cors from "cors";

import userRoutes from "./src/routes/userRoutes.js";
import adminRoutes from "./src/routes/adminRoutes.js";

import connectDB from "./src/db/db.js";

dotenv.config();
const app = express();

connectDB();

const PORT = process.env.PORT || 3000;

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


app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});

export default app;