import express from "express";
import {asyncHandler} from "../utils/asyncHandler.js";
import {loginAdmin} from "../controllers/adminController.js";
import {getApprovedUsers} from "../controllers/adminController.js";
import {getMatchedUsers} from "../controllers/adminController.js";

const router = express.Router();

router.post("/login", asyncHandler(loginAdmin));

router.get("/approved-users", asyncHandler(getApprovedUsers));

router.get("/matched-users", asyncHandler(getMatchedUsers));

export default router;