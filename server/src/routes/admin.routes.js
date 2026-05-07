import express from "express";
import { getAdminStats } from "../controller/admin.controller.js";
import { protect, admin } from "../middleware/authMiddleware.js";

const router = express.Router();

router.route("/stats").get(protect, admin, getAdminStats);

export default router;
