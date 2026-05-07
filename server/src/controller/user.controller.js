import User from "../models/user.model.js";
import Product from "../models/product.model.js";

// @desc    Add or remove product from wishlist
// @route   POST /api/users/wishlist/:id
// @access  Private
import mongoose from "mongoose";

export const toggleWishlist = async (req, res) => {
  try {
    const productId = req.params.id;

    // Validate if productId is a valid ObjectId
    if (!mongoose.Types.ObjectId.isValid(productId)) {
      return res.status(400).json({ message: "Invalid Product ID format" });
    }

    const user = await User.findById(req.user._id);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const alreadyInWishlist = user.wishlist && user.wishlist.some(id => id && id.toString() === productId);

    let updatedWishlist;
    if (alreadyInWishlist) {
      // Remove from wishlist
      const updatedUser = await User.findByIdAndUpdate(
        req.user._id,
        { $pull: { wishlist: productId } },
        { new: true }
      );
      updatedWishlist = updatedUser.wishlist;
    } else {
      // Add to wishlist
      const updatedUser = await User.findByIdAndUpdate(
        req.user._id,
        { $addToSet: { wishlist: productId } },
        { new: true }
      );
      updatedWishlist = updatedUser.wishlist;
    }

    res.json(updatedWishlist);
  } catch (error) {
    console.error("Wishlist toggle error:", error);
    res.status(500).json({ message: error.message || "Internal Server Error during wishlist toggle" });
  }
};

// @desc    Get user wishlist products
// @route   GET /api/users/wishlist
// @access  Private
export const getWishlist = async (req, res) => {
  const user = await User.findById(req.user._id).populate("wishlist");
  
  if (!user) {
    return res.status(404).json({ message: "User not found" });
  }

  res.json(user.wishlist);
};
