const express = require("express");
const prisma = require("../lib/prisma");
const authMiddleware = require("../middleware/auth");
const router = express.Router();

// Get Admin Dashboard Stats
router.get("/", authMiddleware, async (req, res) => {
  if (!req.user.isAdmin) return res.status(403).json({ message: "Admin only" });

  try {
    const [totalProducts, totalCategories, orders, totalUsers] =
      await Promise.all([
        prisma.product.count(),
        prisma.category.count(),
        prisma.order.findMany({ select: { status: true, totalAmount: true } }),
        prisma.profile.count(),
      ]);

    const pendingOrders = orders.filter((o) => o.status === "pending").length;
    const totalRevenue = orders
      .filter((o) => o.status === "delivered")
      .reduce((sum, o) => sum + Number(o.totalAmount), 0);

    res.json({
      totalProducts,
      totalCategories,
      totalOrders: orders.length,
      pendingOrders,
      totalUsers,
      totalRevenue,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;
