import {ApiError} from "../utils/ApiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import jwt from "jsonwebtoken";
import User from "../models/User.js";
import Admin from "../models/Admin.js";

export const verifyJWT = asyncHandler (async (req, _, next) => {
    try{
        const token = req.cookies?.accessToken || req.header("Authorization")?.replace("Bearer ","")

        if(!token){
            throw new ApiError(401, "Unauthorized request")
        }
        const decodedToken = jwt.verify(token, process.env.ACCESS_TOKEN_REQUEST_SECRET)

        const user = await User.findById(decodedToken?._id).select (" -password -refreshToken")

        if(!user){
            const admin = await Admin.findById(decodedToken?._id).select (" -password -refreshToken")
            if(!admin) {
                throw new ApiError(401, "Invalid Access Token");
            }
        }
         
        req.user = user;
        next();
    }
    catch(error){
        throw new ApiError (401, error?.message || "Invalid access token")
    }

})