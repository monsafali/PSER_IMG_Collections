import express from "express";
import {
  login,
  logout,
  signup,
  forgotPassword,
  resetPassword,
} from "../controllers/user.controller.js";
import { authenticate } from "../middleware/auth.js";

const router = express.Router();

router.post("/signin", signup);
router.post("/login", login);
router.post("/logout", authenticate, logout); // ⬅️ protected route
router.post("/forgot-password", forgotPassword); // Controller to handle email reset
router.post("/reset-password/:token", resetPassword);

// Example protected route
router.get("/me", authenticate, (req, res) => {
  res.json({ success: true, user: req.user });
});

export default router;
