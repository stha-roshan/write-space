import { pool } from "../../config/db.js";

const registerUserQuery = `
    INSERT INTO users (name, email, password)
    VALUES($1, $2, $3)
    RETURNING id, name, email, role, is_active, created_at
    `;

const existingUserQuery = `
    SELECT id FROM users
    WHERE email = $1
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
      throw error;
    } finally {
      client.release();
    }
  },

  isExistingUser: async (email) => {
    const client = await pool.connect();

    try {
      const user = await client.query(existingUserQuery, [email]);

      //   console.log('from user repository: existing user check --> user: ', user.rowCount )

      return user.rowCount >= 1;
    } catch (error) {
      console.log("Error checking existing user", error);
      throw error;
    } finally {
      client.release();
    }
  },
};
