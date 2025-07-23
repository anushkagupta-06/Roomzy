import User from "../models/User.js";
import {asyncHandler} from "../utils/asyncHandler.js";
import Admin from "../models/Admin.js";
import {ApiError} from "../utils/ApiError.js";
import {ApiResponse} from "../utils/ApiResponse.js";
import jwt from "jsonwebtoken";


const generateAccessAndRefreshTokens = async (userId) =>{
    try {
        console.log("shuru to hua")
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
    throw new ApiError(403, "Your email is not in admin list");
  }

  const user = await User.create({
    username: username.toLowerCase(),
    email: email.toLowerCase(),
    password,
    role: role || "user",
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

export {
    registerUser,
    loginUser,
    logoutUser,
    refreshAccessToken,
    generateAccessAndRefreshTokens,
    getUser,
    changePassword
}