import Order from "../models/order.model.js";
import User from "../models/user.model.js";
import Product from "../models/product.model.js";

// @desc    Get admin dashboard stats
// @route   GET /api/admin/stats
// @access  Private/Admin
const getAdminStats = async (req, res) => {
  try {
    const totalUsers = await User.countDocuments({});
    const totalOrders = await Order.countDocuments({});
    const products = await Product.countDocuments({});
    
    // Calculate total revenue
    const orders = await Order.find({});
    const totalRevenue = orders.reduce((acc, item) => acc + item.totalPrice, 0);

    const pendingOrders = await Order.countDocuments({ status: "pending" });

    res.json({
      totalUsers,
      totalOrders,
      totalRevenue,
      pendingOrders,
      totalProducts: products
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export { getAdminStats };
