import asyncHandler from "../middleware/asyncHandler.js";
import User from "../models/user.model.js";
import Admin from "../models/admin.model.js";
import ApiError from "../utils/ApiError.js";
import ApiResponse from "../utils/ApiResponse.js";
import { generateAccessAndRefreshTokens } from "../utils/generateTokens.js";

export const registerUser = asyncHandler(async (req, res) => {
  const { username, email, password, role } = req.body;

  if ([username, email, password, role].some((field) => !field || field.trim() === "")) {
    throw new ApiError(400, "All fields are required.");
  }

  const existedUser = await User.findOne({
    $or: [{ username: username.toLowerCase() }, { email: email.toLowerCase() }]
  });

  if (existedUser) {
    throw new ApiError(409, "User already exists");
  }

  const admin = await Admin.findOne({});
  if (!admin || !admin.approvedUsers.includes(email.toLowerCase())) {
    throw new ApiError(403, "Your email is not approved by admin");
  }

  const user = await User.create({
    username: username.toLowerCase(),
    email: email.toLowerCase(),
    password,
    role: role || "user",
    isApproved: true
  });

  const { accessToken, refreshToken } = await generateAccessAndRefreshTokens(user._id);

  user.refreshToken = refreshToken;
  await user.save({ validateBeforeSave: false });

  const createdUser = await User.findById(user._id).select("-password -refreshToken");

  return res.status(201).json(
    new ApiResponse(201, {
      user: createdUser,
      accessToken
    }, "User registered successfully")
  );
});

export const loginUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email }).select("+password");
  if (!user || !(await user.comparePassword(password))) {
    throw new ApiError(401, "Invalid email or password");
  }

  const { accessToken, refreshToken } = await generateAccessAndRefreshTokens(user._id);

  user.refreshToken = refreshToken;
  await user.save({ validateBeforeSave: false });

  const sanitizedUser = await User.findById(user._id).select("-password -refreshToken");

  res.status(200).json(
    new ApiResponse(200, {
      user: sanitizedUser,
      accessToken
    }, "Login successful")
  );
});

export const logoutUser = asyncHandler(async (req, res) => {
  const { email } = req.body;

  if (!email) {
    throw new ApiError(400, "Email is required to logout");
  }

  const user = await User.findOne({ email });

  if (!user) {
    throw new ApiError(404, "User not found");
  }

  user.refreshToken = null;
  await user.save({ validateBeforeSave: false });

  res.status(200).json(new ApiResponse(200, null, "Logout successful"));
});