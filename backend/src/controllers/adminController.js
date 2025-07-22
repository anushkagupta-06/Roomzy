import asyncHandler from "../middleware/asyncHandler.js";
import Admin from "../models/admin.model.js";
import User from "../models/user.model.js";
import ApiError from "../utils/ApiError.js";
import ApiResponse from "../utils/ApiResponse.js";
import { generateAccessAndRefreshTokens } from "../utils/generateTokens.js";

export const loginAdmin = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    throw new ApiError(400, "Email and password are required");
  }

  const admin = await Admin.findOne({ email }).select("+password");

  if (!admin || !(await admin.comparePassword(password))) {
    throw new ApiError(401, "Invalid email or password");
  }

  const { accessToken, refreshToken } = await generateAccessAndRefreshTokens(admin._id);

  admin.refreshToken = refreshToken;
  await admin.save({ validateBeforeSave: false });

  res.status(200).json(
    new ApiResponse(200, {
      admin: {
        id: admin._id,
        name: admin.name,
        email: admin.email,
      },
      accessToken,
    }, "Admin login successful")
  );
});

export const getApprovedUsers = asyncHandler(async (req, res) => {
  const admin = await Admin.findOne({});

  if (!admin) {
    throw new ApiError(404, "Admin record not found");
  }

  res.status(200).json(
    new ApiResponse(200, admin.approvedUsers, "Approved user list fetched")
  );
});

export const getMatchedUsers = asyncHandler(async (req, res) => {
  const admin = await Admin.findOne({}).populate("matchedUsers.user matchedUsers.roommate", "username email");

  if (!admin) {
    throw new ApiError(404, "Admin not found");
  }

  const matches = admin.matchedUsers.map((pair) => ({
    user: {
      name: pair.user?.username || "Unknown",
      email: pair.user?.email || "Unknown",
    },
    roommate: {
      name: pair.roommate?.username || "Unknown",
      email: pair.roommate?.email || "Unknown",
    }
  }));

  res.status(200).json(
    new ApiResponse(200, matches, "Matched roommate pairs retrieved")
  );
});