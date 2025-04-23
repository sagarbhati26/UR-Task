import { apiError } from "../utils/apiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import jwt from "jsonwebtoken";
import { User } from "../models/user.js";

export const verifyJWT = asyncHandler(async (req, _, next) => {
  try {
    // Retrieve token from cookies or Authorization header
    const token =
      req.cookies?.accessToken || req.header("Authorization")?.replace("Bearer ", "");
    console.log("Received Token:", token);

    if (!token) {
      throw new apiError(401, "Unauthorized request - Token not found");
    }

    // Verify the token
    const decodedToken = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
    console.log("Decoded Token:", decodedToken);

    // Find the user in the database and exclude sensitive fields
    const user = await User.findById(decodedToken?._id).select("-password -refreshToken");
    console.log("Retrieved User:", user);

    if (!user) {
      throw new apiError(401, "Invalid Access Token - User not found");
    }

    // Attach user data to the request
    req.user = user;
    next();
  } catch (error) {
    console.error("Error in verifyJWT middleware:", error.message);
    next(new apiError(401, error.message || "Invalid access token"));
  }
});
