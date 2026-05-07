import express from "express";
import { toggleWishlist, getWishlist } from "../controller/user.controller.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

router.route("/wishlist").get(protect, getWishlist);
router.route("/wishlist/:id").post(protect, toggleWishlist);

export default router;
