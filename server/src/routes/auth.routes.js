import express from "express";
import {
  registerUser,
  loginUser,
  logoutUser,
  forgotPassword,
} from "../controller/auth.controller.js";

const router = express.Router();

router.post("/register", registerUser);
router.post("/login", loginUser);
router.post("/logout", logoutUser);
router.post("/forgot-password", forgotPassword);

export default router;
