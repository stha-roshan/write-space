import { pool } from "../../config/db.js";
import { ApiError } from "../../shared/utils/index.js";

const registerUserQuery = `
    INSERT INTO users (name, email, password)
    VALUES($1, $2, $3)
    RETURNING id, name, email, role, is_active, created_at
    `;

const findUserQuery = `
    SELECT id, name, email, password, role, is_active
    FROM users
    WHERE email = $1  
`;

const setRefreshTokenQuery = `
  UPDATE users
  SET refresh_token = $1
  WHERE email = $2
  RETURNING id, email, refresh_token
`;

export const UserRepository = {
  register: async (data) => {
    const { name, email, password } = data;

    const client = await pool.connect();

    try {
      const registeredUser = await client.query(registerUserQuery, [
        name,
        email,
        password,
      ]);
      //   console.log('User regisetered successfully -> [debug: user.repository.js]',registeredUser.rows[0]);
      return registeredUser.rows[0];
    } catch (error) {
      console.log("Error regestering user", error);
      throw new ApiError(500, "Database operation failed while register");
    } finally {
      client.release();
    }
  },

  findUser: async (email) => {
    const client = await pool.connect();

    try {
      const user = await client.query(findUserQuery, [email]);

      return {
        exists: user.rowCount >= 1,
        data: user.rows[0],
      };
    } catch (error) {
      console.log("Error finding user", error);
      throw new ApiError(500, "Database operation failed while findUser");
    } finally {
      client.release();
    }
  },

  setRefreshToken: async (email, refreshToken) => {
    const client = await pool.connect();

    try {
      const result = await client.query(setRefreshTokenQuery, [
        refreshToken,
        email,
      ]);

      return {
        success: result.rowCount >= 1,
        userWithToken: result.rows[0],
      };
    } catch (error) {
      console.log("Error storing refresh token", error);
      throw new ApiError(
        500,
        "Database operation failed while setRefreshToken",
      );
    } finally {
      client.release();
    }
  },
};
