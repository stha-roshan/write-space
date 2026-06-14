import jwt from "jsonwebtoken";
import { logger, ApiError } from "../utils/index.js";
import { UserRepository } from "../../modules/user/user.repository.js";

const extractAccessToken = (req) => {
  return (
    req.cookies?.accessToken ||
    req.header("Authorization")?.replace("Bearer ", "")
  );
};

export const verifyUser = async (req, res, next) => {
  try {
    const accessToken = extractAccessToken(req);

    if (!accessToken) {
      throw new ApiError(401, "Unauthorized: No token provided");
    }

    let decodedAccessToken;

    try {
      decodedAccessToken = jwt.verify(
        accessToken,
        process.env.ACCESS_TOKEN_SECRET,
      );
    } catch (error) {
      throw new ApiError(
        401,
        error.name === "TokenExpiredError" ? "Token expired" : "Invalid token",
      );
    }

    const user = await UserRepository.findUserById(decodedAccessToken.id);

    if (!user) {
      throw new ApiError(403, "Unauthorized");
    }

    if (!user.is_active) {
      throw new ApiError(403, "Account is disabled");
    }

    req.user = {
      id: user.id,
      role: user.role,
      name: user.name,
    };

    next();
  } catch (error) {
    logger.error("Auth middleware error", error);
    next(error);
  }
};