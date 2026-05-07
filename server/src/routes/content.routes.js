import express from "express";
import {
  getContent,
  updateContent,
  bulkUpdateContent,
} from "../controller/content.controller.js";
import { protect, admin } from "../middleware/authMiddleware.js";

const router = express.Router();

router.route("/")
  .get(getContent)
  .post(protect, admin, updateContent);

router.route("/bulk")
  .post(protect, admin, bulkUpdateContent);

export default router;
