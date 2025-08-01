import express from "express";
import {asyncHandler} from "../utils/asyncHandler.js";
import {registerUser,
    loginUser,
    logoutUser,
    refreshAccessToken,
    getUser,
    changePassword,
    updateProfile,
    getMatch,
    getUserMatch,
    submitComplaint} from "../controllers/userController.js";
import {verifyJWT} from "../middlewares/auth.js";
import upload from "../utils/multer.js"

const router = express.Router();

router.post("/signup", asyncHandler(registerUser));

router.post("/login", asyncHandler(loginUser));

router.patch(
  "/profile/update",
  verifyJWT,
  upload.single("avatar"),
  updateProfile
);

router.route("/logout").post(
    verifyJWT, 
    logoutUser
)
router.route("/refresh-token").post(refreshAccessToken)
router.route("/change-password").patch(
    verifyJWT,
    changePassword
)
router.route("/getuser").get(
    verifyJWT, 
    getUser
)
router.route("/match").get(
    verifyJWT,
    getUserMatch
)
router.route("/match/admin").get(
    verifyJWT,
    getMatch
)
router.route("/complaint").get(
    verifyJWT,
    submitComplaint
)

export default router;
