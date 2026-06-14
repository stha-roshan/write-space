import express from "express";
import { registerUser, loginUser } from "../../modules/user/user.controller.js";
import { validateBody, verifyUser } from "../../shared/middleware/index.js";
import {
  registrationSchema,
  loginSchema,
} from "../../modules/user/user.schema.js";
const router = express.Router();

router.post("/register", validateBody(registrationSchema), registerUser);
router.post("/login", validateBody(loginSchema), loginUser);

router.get("/test-route", verifyUser, (req, res) => {
  res.json({ message: "Route is working!" });
});
export default router;
