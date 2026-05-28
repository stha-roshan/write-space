import dotenv from "dotenv";
dotenv.config();
import pkg from "pg";
const { Pool } = pkg;

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

const testConnection = async () => {
  let client;
  try {
    client = await pool.connect();
    const result = await client.query("SELECT NOW()");
    console.log("Database connected successfully");
    console.log("Query result", result);
  } catch (error) {
    console.error("Database connection failed", error);
    process.exit(1);
  } finally {
    if (client) client.release();
  }
};

export { pool, testConnection }
