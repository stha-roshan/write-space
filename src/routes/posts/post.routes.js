import express from "express";
import { createPost } from "../../modules/posts/post.controller.js";
import { validateBody, verifyUser } from "../../shared/middleware/index.js";
import { postSchema } from "../../modules/posts/post.schema.js";


const router = express.Router()

router.post('/create', verifyUser, validateBody(postSchema), createPost)
export default router