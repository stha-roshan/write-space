import bcrypt from "bcrypt";
import { UserRepository } from "./user.repository.js";
const saltRounds = 10;

export const UserService = {
  register: async (data) => {
    const { name, email, password } = data;
    const hash = await bcrypt.hash(password, saltRounds);

    //now passing to user repository
    const preparedData = {
      name,
      email,
      password: hash,
    };
    const result = await UserRepository.register(preparedData);
    return result
  },
};
