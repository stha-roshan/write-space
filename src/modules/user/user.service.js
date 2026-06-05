import bcrypt from "bcrypt";
import { UserRepository } from "./user.repository.js";
import { ApiError } from "../../shared/utils/index.js";
const saltRounds = 10;

export const UserService = {
  register: async (data) => {
    const { name, email, password } = data;

    const isExistingUser = await UserRepository.isExistingUser(email);

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
};
