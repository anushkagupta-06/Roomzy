import {asyncHandler} from "../utils/asyncHandler.js";
import Admin from "../models/Admin.js";
import ApiError from "../utils/ApiError.js";
import {ApiResponse} from "../utils/ApiResponse.js";

export const generateAccessAndRefreshTokens = async (userId) =>{
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
      throw new ApiError (500 , "Error during generating tokens")
  }
}


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