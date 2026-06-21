import express from "express";
import { validateBody, verifyUser } from "../../shared/middleware/index.js";
import { createComment } from "../../modules/comments/comment.controller.js";
import { commentSchema } from "../../modules/comments/comment.schema.js";
const router = express.Router({mergeParams: true});

router.post("/", verifyUser, validateBody(commentSchema), createComment);
// router.get("/", getAllComments)
export default router;
