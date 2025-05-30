import mongoose from "mongoose";
import { apiError } from "../utils/apiError.js";
import { apiResponse } from "../utils/apiResponse.js";
import { User } from "../models/user.js";
import jwt from "jsonwebtoken";
import { asyncHandler } from "../utils/asyncHandler.js";

// Generate Access and Refresh Tokens
const generateAccessAndRefreshTokens = async (userId) => {
  try {
    const user = await User.findById(userId);
    const accessToken = user.generateAccessToken();
    const refreshToken = user.generateRefreshToken();
    user.refreshToken = refreshToken;
    await user.save({ validateBeforeSave: false });

    return { accessToken, refreshToken };
  } catch (error) {
    throw new apiError(500, "Error generating tokens");
  }
};

// Register User
const registerUser = asyncHandler(async (req, res) => {
  const { fullName, email, username, password, role } = req.body;

  if ([fullName, email, username, password, role].some((field) => !field?.trim())) {
    throw new apiError(400, "All fields are required");
  }

  const existingUser = await User.findOne({ $or: [{ email }, { username }] });
  if (existingUser) {
    throw new apiError(409, "User already exists");
  }

  const user = await User.create({
    email,
    fullName,
    password,
    username: username.toLowerCase(),
    role
  });

  const createdUser = await User.findById(user._id).select("-password -refreshToken");
  return res
    .status(201)
    .json(new apiResponse(201, createdUser, "User registered successfully"));
});

// Login User
const loginUser = asyncHandler(async (req, res) => {
  const { email, username, password } = req.body;

  // Validate input
  if (!username && !email) {
    throw new apiError(400, "Username or email is required");
  }

  // Find user by username or email
  const user = await User.findOne({ $or: [{ username }, { email }] });
  if (!user) {
    throw new apiError(404, "User does not exist");
  }

  // Verify password
  const isPasswordCorrect = await user.isPasswordCorrect(password);
  if (!isPasswordCorrect) {
    throw new apiError(401, "Invalid credentials");
  }

  // Generate tokens
  const { accessToken, refreshToken } = await generateAccessAndRefreshTokens(user._id);

  // Fetch user details to send in response
  const loggedInUser = await User.findById(user._id).select("email role");

  // Set cookie options
  const options = {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    maxAge: 24 * 60 * 60 * 1000, // 1 day
  };

  console.log("Logged in user", loggedInUser);
  
  // Send response
  return res
    .status(200)
    .cookie("accessToken", accessToken, options)
    .cookie("refreshToken", refreshToken, options)
    .json(
      new apiResponse(
        200,
        {
          user: loggedInUser,accessToken // Ensure user object includes the role
        },
        "User logged in successfully"
      )
    );
});

// Logout User
const logoutUser = asyncHandler(async (req, res) => {
  await User.findByIdAndUpdate(req.body._id, { refreshToken: undefined });

  const options = {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
  };

  return res
    .status(200)
    .clearCookie("accessToken", options)
    .clearCookie("refreshToken", options)
    .json(new apiResponse(200, {}, "User logged out successfully"));
});

// Refresh Access Token
const refreshAccessToken = asyncHandler(async (req, res) => {
  const incomingRefreshToken = req.cookies.refreshToken || req.body.refreshToken;

  if (!incomingRefreshToken) {
    throw new apiError(401, "Unauthorized request");
  }

  try {
    const decodedToken = jwt.verify(
      incomingRefreshToken,
      process.env.REFRESH_TOKEN_SECRET
    );

    const user = await User.findOne(decodedToken.email);
    if (!user || incomingRefreshToken !== user.refreshToken) {
      throw new apiError(401, "Invalid or expired refresh token");
    }

    const { accessToken, refreshToken } = await generateAccessAndRefreshTokens(user.email);

    const options = {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 24 * 60 * 60 * 1000,
    };

    return res
      .status(200)
      .cookie("accessToken", accessToken, options)
      .cookie("refreshToken", refreshToken, options)
      .json(
        new apiResponse(200, { accessToken, refreshToken }, "Access token refreshed")
      );
  } catch (error) {
    throw new apiError(500, "Failed to refresh access token");
  }
});

// Change Current Password
const changeCurrentPassword = asyncHandler(async (req, res) => {
  const { oldPassword, newPassword, confirmPassword } = req.body;

  const user = await User.findOne(req.user.email);
  const isPasswordCorrect = await user.isPasswordCorrect(oldPassword);

  if (!isPasswordCorrect) {
    throw new apiError(400, "Invalid old password");
  }
  if (newPassword !== confirmPassword) {
    throw new apiError(401, "Passwords do not match");
  }

  user.password = await bcrypt.hash(newPassword, 10);
  await user.save();

  return res.status(200).json(new apiResponse(200, {}, "Password changed successfully"));
});

export {
  generateAccessAndRefreshTokens,
  registerUser,
  loginUser,
  logoutUser,
  refreshAccessToken,
  changeCurrentPassword,
};
