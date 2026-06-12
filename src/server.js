const dotenv = await import("dotenv");
dotenv.default.config({
  path: ".env",
});
const { app } = await import("./app.js");
const { testConnection } = await import("./config/db.js");
const { logger } = await import("./shared/utils/index.js");

const startServer = async () => {
  try {
    await testConnection();
    app.listen(process.env.PORT, () => {
      logger.info(
        `SERVER is up and running on http://localhost:${process.env.PORT}`,
      );
    });
  } catch (error) {
    logger.error("error starting server...", error);
  }
};

startServer();
