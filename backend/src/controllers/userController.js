import User from "../models/User.js";
import {asyncHandler} from "../utils/asyncHandler.js";
import Admin from "../models/Admin.js";
import {ApiError} from "../utils/ApiError.js";
import {ApiResponse} from "../utils/ApiResponse.js";
import jwt from "jsonwebtoken";

import cloudinary from "../config/cloudinary.js";


const generateAccessAndRefreshTokens = async (userId) =>{
    try {
        const user = await User.findById(userId)
        if(!user){
            console.log("user ni mila yrr")
        }
        const accessToken = user.generateAccessToken()
        const refreshToken = user.generateRefreshToken()

        user.refreshToken = refreshToken
        await user.save ({validateBeforeSave : false})
        return { accessToken, refreshToken }

    } catch (error) {
        console.log("messedup!")
        throw new ApiError (500 , "Error during generating tokens")
    }
}


const registerUser = asyncHandler(async (req, res) => {
    const { name, email, password } = req.body;
  
    if ([name, email, password].some((field) => !field || field.trim() === "")) {
      throw new ApiError(400, "All fields are required.");
    }
  
    const existedUser = await User.findOne({
      $or: [{ name: name.toLowerCase() }, { email: email.toLowerCase() }]
    });
  
    if (existedUser) {
      throw new ApiError(409, "User already exists");
    }
  
    const admin = await Admin.findOne({});
    if (!admin || !admin.unapprovedUsers.includes(email.toLowerCase())) {
      throw new ApiError(403, "Your email is not in admin list");
    }
  
    const user = await User.create({
      name: name.toLowerCase(),
      email: email.toLowerCase(),
      password,
    });
  
    const { accessToken, refreshToken } = await generateAccessAndRefreshTokens(user._id);
  
    user.refreshToken = refreshToken;
    await user.save({ validateBeforeSave: false });
  
    // 🛠️ Update admin: remove from unapproved, add to approved
    admin.unapprovedUsers = admin.unapprovedUsers.filter(e => e !== email.toLowerCase());
    if (!admin.approvedUsers.includes(email.toLowerCase())) {
      admin.approvedUsers.push(email.toLowerCase());
    }
    await admin.save();
  
    const createdUser = await User.findById(user._id).select("-password -refreshToken");
  
    return res.status(201).json(
      new ApiResponse(201, {
        user: createdUser,
        accessToken
      }, "User registered successfully")
    );
  });  

const loginUser = asyncHandler(async (req, res) => {
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


const logoutUser = asyncHandler (async (req, res)=> {
    await User.findByIdAndUpdate(
        req.user._id,{
            $unset: {
                refreshToken: 1 //remove tokens from docu
            }
        },
        {
            new:true
        }
    )

    const options = {
        httpOnly: true,
        secure: true
    }

    return res.status(200).clearCookie("accessToken",options).clearCookie("refreshToken",options).json(new ApiResponse (200, {}, "User logged Out"))
})

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

const getUser = asyncHandler( async(req, res,) => {
    return res.status(200).json( 
        new ApiResponse (
        200, req.user,"User details fetched"
        )
    )
})

const changePassword = asyncHandler (async (req,res) =>{
    const {oldPassword, newPassword} = req.body;
    const user = await User.findById(req.user?._id)
    const isPasswordValid = await user.isPasswordCorrect(oldPassword)

    if(!isPasswordValid){
        throw new ApiError(401, "Invalid old password")
    }
    user.password = newPassword
    await user.save({validBeforeSave: false})

    return res.status(200).json(new ApiResponse(200,{},"Password changed successfully"))
})

const updateProfile = asyncHandler(async (req, res) => {
  const userId = req.user._id;
  const { age } = req.body;

  // ✅ Validate age
  if (age && (age < 18 || age > 99)) {
    throw new ApiError(400, "Age must be between 18 and 99.");
  }

  const user = await User.findById(userId);
  if (!user) {
    throw new ApiError(404, "User not found.");
  }

  // ✅ Only upload avatar if a file is provided
  if (req.file) {
    const result = await cloudinary.uploader.upload(req.file.path, {
      folder: "avatars",
      width: 300,
      crop: "scale",
    });
    user.avatar = result.secure_url;
  }

  // ✅ Set age if provided
  if (age) {
    user.age = age;
  }

  await user.save({ validateBeforeSave: false });

  return res.status(200).json(
    new ApiResponse(200, {
      avatar: user.avatar,
      age: user.age,
    }, "Profile updated successfully")
  );
});

const getMatch = asyncHandler(async (req, res) => {
  if (req.user.role !== "admin") {
    throw new ApiError(403, "Admin access required");
  }

  const usersWithMatches = await User.find({ "matchResult.roommate.userId": { $ne: null } })
    .populate("matchResult.roommate.userId", "name email avatar age bio");

  if (!usersWithMatches.length) {
    throw new ApiError(404, "No matched users found");
  }

  // Format the results
          //   const matchList = usersWithMatches.map(user => ({
          //     user: {
          //       id: user._id,
          //       name: user.name,
          //       email: user.email,
          //       avatar: user.avatar,
          //       age: user.age,
          //       bio: user.bio
          //     },
          //     matchedRoommate: {
          //       id: user.matchResult?.roommate?.userId?._id || null,
          //       name: user.matchResult?.roommate?.userId?.name || null,
          //       email: user.matchResult?.roommate?.userId?.email || null,
          //       avatar: user.matchResult?.roommate?.userId?.avatar || null,
          //       age: user.matchResult?.roommate?.userId?.age || null,
          //       bio: user.matchResult?.roommate?.userId?.bio || null
          //     },
          //     compatibilityScore: user.matchResult?.compatibilityScore || null,
          //     explanation: user.matchResult?.explanation || ""
          //   }));

          //   res.status(200).json(new ApiResponse(200, matchList, "User match results fetched successfully"));
          //   [
          //   {
          //     "user": {
          //       "id": "64ff...",
          //       "name": "Alice",
          //       "email": "alice@example.com"
          //     },
          //     "matchedRoommate": {
          //       "id": "65aa...",
          //       "name": "Bob",
          //       "email": "bob@example.com"
          //     },
          //     "compatibilityScore": 87,
          //     "explanation": "High match in lifestyle and preferences"
          //   }
          // ]

});



export {
    registerUser,
    loginUser,
    logoutUser,
    refreshAccessToken,
    generateAccessAndRefreshTokens,
    getUser,
    changePassword,
    updateProfile,
    getMatch
}