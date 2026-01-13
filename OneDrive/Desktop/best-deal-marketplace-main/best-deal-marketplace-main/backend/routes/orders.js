const express = require("express");
const prisma = require("../lib/prisma");
const authMiddleware = require("../middleware/auth");
const router = express.Router();

// Get orders (Admin gets all, User gets own)
router.get("/", authMiddleware, async (req, res) => {
  try {
    const where = req.user.isAdmin ? {} : { userId: req.user.id };
    const orders = await prisma.order.findMany({
      where,
      include: { items: true },
      orderBy: { createdAt: "desc" },
    });
    res.json(orders);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});

const jwt = require("jsonwebtoken");
const { sendEvent } = require("../lib/metaConversions");

// Create order
router.post("/", async (req, res) => {
  const {
    customerFirstName,
    customerLastName,
    customerPhone,
    customerAddress,
    customerCity,
    customerNotes,
    totalAmount,
    items,
    eventId,
  } = req.body;

  let userId = null;
  const token = req.header("Authorization")?.replace("Bearer ", "");
  if (token) {
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      userId = decoded.id;
    } catch (err) {
      // Invalid token, proceed as guest
    }
  }

  try {
    const order = await prisma.order.create({
      data: {
        userId,
        customerFirstName,
        customerLastName,
        customerPhone,
        customerAddress,
        customerCity,
        customerNotes,
        totalAmount,
        items: {
          create: items.map((item) => ({
            productId: item.productId,
            productName: item.productName,
            productPrice: item.productPrice,
            quantity: item.quantity,
          })),
        },
      },
      include: { items: true },
    });
    // Send Purchase server-side for CAPI with dedup event_id
    try {
      if (eventId) {
        await sendEvent({
          eventName: "Purchase",
          eventId,
          contents: order.items.map((it) => ({
            id: it.productId,
            quantity: it.quantity,
            item_price: Number(it.productPrice),
          })),
          value: Number(order.totalAmount),
          currency: "TND",
          clientIp: req.ip,
          userAgent: req.headers["user-agent"],
        });
      }
    } catch (e) {
      // ignore send errors
    }
    res.json(order);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

// Update order status (Admin)
router.put("/:id", authMiddleware, async (req, res) => {
  if (!req.user.isAdmin) return res.status(403).json({ message: "Admin only" });

  try {
    const order = await prisma.order.update({
      where: { id: req.params.id },
      data: { status: req.body.status },
    });
    res.json(order);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;
