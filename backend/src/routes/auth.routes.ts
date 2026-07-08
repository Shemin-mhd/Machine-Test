import { Router } from "express";
import { loginVerify, register, getMe } from "../controllers/auth.controller";
import { protect } from "../middleware/auth.middleware";

const router = Router();

router.post("/login-verify", loginVerify);
router.post("/register", register);
router.get("/me", protect, getMe);

export default router;
