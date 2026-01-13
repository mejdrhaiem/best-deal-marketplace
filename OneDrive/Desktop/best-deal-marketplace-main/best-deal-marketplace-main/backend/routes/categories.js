const express = require("express");
const prisma = require("../lib/prisma");
const authMiddleware = require("../middleware/auth");
const router = express.Router();

// Get all categories
router.get("/", async (req, res) => {
  try {
    const categories = await prisma.category.findMany();
    res.json(categories);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});

// Create category (Admin)
router.post("/", authMiddleware, async (req, res) => {
  if (!req.user.isAdmin) return res.status(403).json({ message: "Admin only" });

  try {
    const category = await prisma.category.create({
      data: req.body,
    });
    res.json(category);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});

// Update category (Admin)
router.put("/:id", authMiddleware, async (req, res) => {
  if (!req.user.isAdmin) return res.status(403).json({ message: "Admin only" });

  try {
    const category = await prisma.category.update({
      where: { id: req.params.id },
      data: req.body,
    });
    res.json(category);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});

// Delete category (Admin)
router.delete("/:id", authMiddleware, async (req, res) => {
  if (!req.user.isAdmin) return res.status(403).json({ message: "Admin only" });

  try {
    await prisma.category.delete({
      where: { id: req.params.id },
    });
    res.json({ message: "Category deleted" });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;
