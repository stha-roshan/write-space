import express from "express";
import { registerUser, loginUser } from "../../modules/user/user.controller.js";
import { validateBody } from "../../shared/middleware/validate.middleware.js";
import {
  registrationSchema,
  loginSchema,
} from "../../modules/user/user.schema.js";
import { ro } from "zod/locales";
const router = express.Router();

router.post("/register", validateBody(registrationSchema), registerUser);
router.post("/login", validateBody(loginSchema), loginUser);
export default router;
