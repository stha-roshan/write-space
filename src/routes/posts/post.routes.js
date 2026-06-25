import express from "express";
import { createPost, getAllPosts } from "../../modules/posts/post.controller.js";
import { validateBody, verifyUser } from "../../shared/middleware/index.js";
import { postSchema } from "../../modules/posts/post.schema.js";

import commentRoutes from "../comments/comment.routes.js";
import voteRoutes from "../votes/vote.routes.js";

const router = express.Router();

router.use("/:postId/comments", commentRoutes);
router.use("/:postId/votes", voteRoutes);

router.post("/", verifyUser, validateBody(postSchema), createPost);
router.get('/', getAllPosts)
// router.get('/:id', getPost)
// router.delete('/:id', verifyUser, deletePost)
export default router;
