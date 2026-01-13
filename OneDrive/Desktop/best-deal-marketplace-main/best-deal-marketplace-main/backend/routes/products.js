const express = require("express");
const prisma = require("../lib/prisma");
const authMiddleware = require("../middleware/auth");
const multer = require("multer");
const { v2: cloudinary } = require("cloudinary");
const router = express.Router();

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const storage = multer.memoryStorage();
const upload = multer({ storage });

// Get all products
router.get("/", async (req, res) => {
  try {
    const products = await prisma.product.findMany({
      where: { isActive: true },
      include: { category: true },
    });
    res.json(products);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});

// Get single product
router.get("/:id", async (req, res) => {
  try {
    const product = await prisma.product.findUnique({
      where: { id: req.params.id },
      include: { category: true },
    });
    if (!product) return res.status(404).json({ message: "Product not found" });
    res.json(product);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});

// Upload product image (Admin)
router.post(
  "/upload",
  authMiddleware,
  upload.single("image"),
  async (req, res) => {
    if (!req.user.isAdmin)
      return res.status(403).json({ message: "Admin only" });
    try {
      if (!req.file) {
        return res.status(400).json({ message: "No file uploaded" });
      }
      const stream = cloudinary.uploader.upload_stream(
        { folder: "best-deal-products" },
        (error, result) => {
          if (error) {
            return res.status(500).json({ message: "Upload error" });
          }
          res.json({ url: result.secure_url });
        }
      );
      stream.end(req.file.buffer);
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: "Server error" });
    }
  }
);

// Create product (Admin)
router.post("/", authMiddleware, async (req, res) => {
  if (!req.user.isAdmin) return res.status(403).json({ message: "Admin only" });

  try {
    const product = await prisma.product.create({
      data: req.body,
    });
    res.json(product);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

// Update product (Admin)
router.put("/:id", authMiddleware, async (req, res) => {
  if (!req.user.isAdmin) return res.status(403).json({ message: "Admin only" });

  try {
    const product = await prisma.product.update({
      where: { id: req.params.id },
      data: req.body,
    });
    res.json(product);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});

// Delete product (Admin)
router.delete("/:id", authMiddleware, async (req, res) => {
  if (!req.user.isAdmin) return res.status(403).json({ message: "Admin only" });

  try {
    await prisma.product.delete({
      where: { id: req.params.id },
    });
    res.json({ message: "Product deleted" });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;
