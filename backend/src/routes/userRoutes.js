import express from "express";
import {asyncHandler} from "../utils/asyncHandler.js";
import { loginUser, registerUser } from "../controllers/userController.js";

const router = express.Router();

router.post("/signup", asyncHandler(registerUser));

router.post("/login", asyncHandler(loginUser));

export default router;
