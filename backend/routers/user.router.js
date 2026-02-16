import express from "express";
import {
  login,
  logout,
  signup,

  getMe,
} from "../controllers/user.controller.js";
import { authenticate } from "../middleware/auth.js";

const router = express.Router();

// note: use /signup to match common naming
router.post("/signup", signup); // previously was "/signin"
router.post("/login", login);
router.post("/logout", logout); // allow client to clear cookie even if token expired


// protected
router.get("/me", authenticate, getMe);

export default router;
