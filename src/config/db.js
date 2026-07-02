import pkg from "pg";
const { Pool } = pkg;
import { logger } from "../shared/utils/index.js";

const pool = new Pool(
  process.env.DATABASE_URL
    ? {
        connectionString: process.env.DATABASE_URL,
        ssl: { rejectUnauthorized: false },
      }
    : {
        host: process.env.DB_HOST,
        port: process.env.DB_PORT,
        database: process.env.DB_NAME,
        user: process.env.DB_USER,
        password: process.env.DB_PASSWORD,
      }
);

const testConnection = async () => {
  let client;
  try {
    client = await pool.connect();
    const result = await client.query("SELECT NOW()");
    logger.info("Database connected successfully");
  } catch (error) {
    logger.error("Database connection failed", error);
    process.exit(1);
  } finally {
    if (client) client.release();
  }
};

export { pool, testConnection };
