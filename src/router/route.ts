import { Router } from "express";
import {
  login,
  logout,
  refreshToken,
  signup,
} from "../controllers/user.controller";

const router = Router();

router.post("/signup", signup);
router.post("/login", login);
router.post("/refresh-token", refreshToken);
router.post("/logout", logout);

export default router;
