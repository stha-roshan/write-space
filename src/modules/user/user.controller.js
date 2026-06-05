import {
  asyncHandler,
  ApiError,
  ApiResponse,
} from "../../shared/utils/index.js";
import { UserService } from "./user.service.js";

export const registerUser = asyncHandler(async (req, res) => {
  const user = await UserService.register(req.body);

  if (!user) {
    console.log(
      "Something went wrong while regestering user -> [debug: user.controller]",
    );
    throw new ApiError(500, "Something went wrong while regestering user");
  }

  return res
    .status(201)
    .json(new ApiResponse(201, "User registered successfully", user));
});
