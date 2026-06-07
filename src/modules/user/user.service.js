import bcrypt from "bcrypt";
import { UserRepository } from "./user.repository.js";
import {
  ApiError,
  ApiResponse,
  generateAccessToken,
  generateRefreshToken,
} from "../../shared/utils/index.js";

const saltRounds = 10;

export const UserService = {
  register: async (data) => {
    const { name, email, password } = data;

    const existingUser = await UserRepository.findUser(email);
    const isExistingUser = existingUser.exists;

    if (isExistingUser) {
      throw new ApiError(409, "User already exists");
    }

    const hash = await bcrypt.hash(password, saltRounds);

    //now passing to user repository
    const preparedData = {
      name,
      email,
      password: hash,
    };
    const result = await UserRepository.register(preparedData);
    return result;
  },

  login: async (data) => {
    const { email, password } = data;

    const user = await UserRepository.findUser(email);
    if (!user.exists) {
      throw new ApiError(404, "User not found");
    }
    const isPasswordCorrect = await bcrypt.compare(
      password,
      user.data.password,
    );

    if (!isPasswordCorrect) {
      throw new ApiError(400, "Invalid credentials");
    }

    const payload = {
      id: user.data.id,
      role: user.data.role,
    };

    const responseData = {
      id: user.data.id,
      name: user.data.name,
      email: user.data.email,
    };
    const accessToken = generateAccessToken(payload);
    const refreshToken = generateRefreshToken(payload);

    if (process.env.NODE_ENV === "development") {
      responseData.accessToken = accessToken;
      responseData.refreshToken = refreshToken;
    }

    const storeToken = await UserRepository.setRefreshToken(
      email,
      refreshToken,
    );

    if (!storeToken.success) {
      throw new ApiError(500, "Failed to store refresh token");
    }

    return { accessToken, refreshToken, responseData };
  },
};
