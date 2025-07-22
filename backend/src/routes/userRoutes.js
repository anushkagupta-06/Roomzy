import express from "express";
import asyncHandler from "../middleware/asyncHandler.js";
import { loginUser, signupUser } from "../controllers/userController.js";

const router = express.Router();

router.post("/signup", asyncHandler(signupUser));

router.post("/login", asyncHandler(loginUser));

export default router;
