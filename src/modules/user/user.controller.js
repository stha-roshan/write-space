import {
  asyncHandler,
  ApiError,
  ApiResponse,
  accessTokenCookieOption,
  refreshTokenCookieOption,
} from "../../shared/utils/index.js";
import { UserService } from "./user.service.js";

export const registerUser = asyncHandler(async (req, res) => {
  const user = await UserService.register(req.body);

  return res
    .status(201)
    .json(new ApiResponse(201, "User registered successfully", user));
});

export const loginUser = asyncHandler(async (req, res) => {
  const loggedInUser = await UserService.login(req.body);

  const { accessToken, refreshToken, responseData } = loggedInUser;
  return res
    .status(200)
    .cookie("accessToken", accessToken, accessTokenCookieOption)
    .cookie("refreshToken", refreshToken, refreshTokenCookieOption)
    .json(new ApiResponse(200, "User logged in successfully", responseData));
});
