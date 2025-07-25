import bcrypt from "bcrypt";
import Admin from "../models/Admin.js";
import User from "../models/User.js";
import mongoose from "mongoose";

import {asyncHandler} from "../utils/asyncHandler.js";
import {ApiError} from "../utils/ApiError.js";
import {ApiResponse} from "../utils/ApiResponse.js";
import jwt from "jsonwebtoken";

export const generateAccessAndRefreshTokens = async (userId) =>{
  try {
      const user = await Admin.findById(userId)
      if(!user){
          console.log("user ni mila yrr")
      }
      const accessToken = user.generateAccessToken()
      const refreshToken = user.generateRefreshToken()

      user.refreshToken = refreshToken
      await user.save ({validateBeforeSave : false})
      return { accessToken, refreshToken }

  } catch (error) {
      throw new ApiError (500 ,error, "Error during generating tokens")
  }
}

export const adminSignup = asyncHandler(async (req, res) => {
  const { name, email, password } = req.body;

  if (!name || !email || !password) {
    throw new ApiError(400, "Name, email, and password are required.");
  }

  const existingAdmin = await Admin.findOne({ email: email.toLowerCase() });
  if (existingAdmin) {
    throw new ApiError(409, "Admin already exists with this email.");
  }

  const admin = await Admin.create({
    name: name.trim(),
    email: email.toLowerCase(),
    password
  });

  // ── (Optional) Generate tokens ──
  // const { accessToken, refreshToken } = await generateAccessAndRefreshTokens(admin._id);

  return res.status(201).json(
    new ApiResponse(201, {
      admin: {
        _id: admin._id,
        name: admin.name,
        email: admin.email
      },
      // accessToken
    }, "Admin registered successfully")
  );
});


export const loginAdmin = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    throw new ApiError(400, "Email and password are required");
  }

  const admin = await Admin.findOne({ email }).select("+password");

  console.log("Entered password:", password);
console.log("Stored hash:", admin.password);
console.log("Password match:", await bcrypt.compare(password, admin.password));


  if (!admin || !(await admin.comparePassword(password))) {
    throw new ApiError(401, "Invalid email or password");
  }
console.log("admin id : ", admin._id);
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

  const refreshAccessToken = asyncHandler (async (req, res) => {
      const incomingRefreshToken = req.cookie.refreshToken || req.body.refreshToken
  
      if(!incomingRefreshToken){
          throw new ApiError(401,"unauthorised request")
      }
      try {
          const decodedToken = jwt.verify(
              incomingRefreshToken,
              process.env.REFRESH_TOKEN_SECRET
          )
      
          const user = await User.findById(decodedToken?._id)
      
          if (!user) {
              throw new ApiError(401, "Invalid refresh token")
          }
      
          if (incomingRefreshToken !== user?.refreshToken) {
              throw new ApiError(401, "Refresh token is expired or used")
              
          }
      
          const options = {
              httpOnly: true,
              secure: true
          }
      
          const {accessToken, newRefreshToken} = await generateAccessAndRefreshTokens(user._id)
      
          return res
          .status(200)
          .cookie("accessToken", accessToken, options)
          .cookie("refreshToken", newRefreshToken, options)
          .json(
              new ApiResponse(
                  200, 
                  {accessToken, refreshToken: newRefreshToken},
                  "Access token refreshed"
              )
          )
      } catch (error) {
          throw new ApiError(401, error?.message || "Invalid refresh token")
      }
  
  })

  res.status(200).json(
    new ApiResponse(200, matches, "Matched roommate pairs retrieved")
  );
});

export const addMatchedPairByEmail = asyncHandler(async (req, res) => {
  // if (req.admin.role !== "admin") {
  //   throw new ApiError(403, "Admin access required");
  // }

  const { userEmail, roommateEmail } = req.body;

  if (!userEmail || !roommateEmail) {
    throw new ApiError(400, "Both emails are required");
  }

  const [user, roommate] = await Promise.all([
    User.findOne({ email: userEmail }),
    User.findOne({ email: roommateEmail })
  ]);

  if (!user || !roommate) {
    throw new ApiError(404, "One or both users not found");
  }

  const admin = await Admin.findOne({});
  if (!admin) {
    throw new ApiError(404, "Admin not found");
  }

  const alreadyMatched = admin.matchedUsers.some(
    (pair) =>
      (pair.user.toString() === user._id.toString() &&
       pair.roommate.toString() === roommate._id.toString()) ||
      (pair.user.toString() === roommate._id.toString() &&
       pair.roommate.toString() === user._id.toString())
  );

  if (alreadyMatched) {
    throw new ApiError(400, "These users are already matched");
  }

  admin.matchedUsers.push({ user: user._id, roommate: roommate._id });
  await admin.save();

  res.status(200).json(
    new ApiResponse(200, {user, roommate}, "Matched pair added successfully")
  );
});


export const removeMatchedPairByUser = asyncHandler(async (req, res) => {
  // if (req.user.role !== "admin") {
  //   throw new ApiError(403, "Admin access required");
  // }

  const { identifier } = req.params; // could be userId or email

  if (!identifier) {
    throw new ApiError(400, "User identifier is required");
  }

  let user;
  if (mongoose.Types.ObjectId.isValid(identifier)) {
    user = await User.findById(identifier);
  } else {
    user = await User.findOne({ email: identifier });
  }

  if (!user) {
    throw new ApiError(404, "User not found");
  }

  const admin = await Admin.findOne({});
  if (!admin) {
    throw new ApiError(404, "Admin not found");
  }

  const originalLength = admin.matchedUsers.length;

  admin.matchedUsers = admin.matchedUsers.filter(
    (pair) =>
      pair.user.toString() !== user._id.toString() &&
      pair.roommate.toString() !== user._id.toString()
  );

  if (admin.matchedUsers.length === originalLength) {
    throw new ApiError(404, "No matched pair found for this user");
  }

  await admin.save();

  res.status(200).json(
    new ApiResponse(200, null, "Matched pair removed successfully")
  );
});
