import express from "express";
import asyncHandler from "../middleware/asyncHandler.js";
import { loginAdmin, getApprovedUsers, getMatchedUsers } from "../controllers/adminController.js";

const router = express.Router();

router.post("/login", asyncHandler(loginAdmin));

router.get("/approved-users", asyncHandler(getApprovedUsers));

router.get("/matched-users", asyncHandler(getMatchedUsers));

export default router;