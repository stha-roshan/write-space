const dotenv = await import("dotenv");
dotenv.default.config({
  path: ".env",
});
const { app } = await import("./app.js");
const { testConnection } = await import("./config/db.js");

const startServer = async () => {
  try {
    await testConnection();
    app.listen(process.env.PORT, () => {
      console.log(
        `\nSERVER is up and running on http://localhost:${process.env.PORT}\n`,
      );
    });
  } catch (error) {
    console.log("error starting server...", error);
  }
};

startServer();
