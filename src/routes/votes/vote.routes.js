import express from "express";
import { validateBody, verifyUser } from "../../shared/middleware/index.js";
import { votePost } from "../../modules/votes/vote.controller.js";
import { voteSchema } from "../../modules/votes/vote.schema.js";

const router = express.Router({ mergeParams: true });

router.post("/", verifyUser, validateBody(voteSchema), votePost);
export default router;
