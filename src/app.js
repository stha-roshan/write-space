import express from "express";
import cookieParser from "cookie-parser";
import userRoutes from "./routes/user/user.routes.js";
import postRoutes from "./routes/posts/post.routes.js";
// import commentRoutes from "./routes/comments/comment.routes.js";

import { ApiError } from "./shared/utils/index.js";

const app = express();

app.use(express.json());
app.use(cookieParser())

app.use("/users", userRoutes);
app.use("/posts", postRoutes);
// app.use("/comments", commentRoutes);

app.use((err, req, res, next) => {
  if (err instanceof ApiError) {
    return res.status(err.statusCode).json({
      success: false,
      message: err.message,
      errors: err.errors,
    });
  }

  return res.status(500).json({
    success: false,
    message: "something went wrong",
  });
});
export { app };
