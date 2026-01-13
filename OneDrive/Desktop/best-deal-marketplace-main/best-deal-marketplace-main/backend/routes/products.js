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
      // Check Cloudinary configuration
      if (
        !process.env.CLOUDINARY_CLOUD_NAME ||
        !process.env.CLOUDINARY_API_KEY ||
        !process.env.CLOUDINARY_API_SECRET
      ) {
        console.error("Cloudinary credentials not configured");
        return res.status(500).json({
          message: "Image upload service not configured",
          error: "Cloudinary credentials missing",
        });
      }

      if (!req.file) {
        return res.status(400).json({ message: "No file uploaded" });
      }

      // Validate file type
      const allowedTypes = [
        "image/jpeg",
        "image/jpg",
        "image/png",
        "image/gif",
        "image/webp",
      ];
      if (!allowedTypes.includes(req.file.mimetype)) {
        return res.status(400).json({
          message:
            "Invalid file type. Only images are allowed (JPEG, PNG, GIF, WebP)",
        });
      }

      // Validate file size (max 10MB)
      const maxSize = 10 * 1024 * 1024; // 10MB
      if (req.file.size > maxSize) {
        return res.status(400).json({
          message: "File too large. Maximum size is 10MB",
        });
      }

      // Log Cloudinary config (without exposing secrets)
      console.log("Cloudinary config check:", {
        cloud_name: process.env.CLOUDINARY_CLOUD_NAME ? "Set" : "Missing",
        api_key: process.env.CLOUDINARY_API_KEY ? "Set" : "Missing",
        api_secret: process.env.CLOUDINARY_API_SECRET ? "Set" : "Missing",
      });

      // Upload to Cloudinary
      const uploadPromise = new Promise((resolve, reject) => {
        const stream = cloudinary.uploader.upload_stream(
          {
            folder: "best-deal-products",
            resource_type: "image",
            allowed_formats: ["jpg", "jpeg", "png", "gif", "webp"],
          },
          (error, result) => {
            if (error) {
              console.error("Cloudinary upload error details:", {
                message: error.message,
                http_code: error.http_code,
                name: error.name,
                error: error,
              });
              reject(error);
              return;
            }
            if (!result || !result.secure_url) {
              console.error(
                "Cloudinary upload failed: No URL returned",
                result
              );
              reject(new Error("No URL returned from Cloudinary"));
              return;
            }
            console.log("Upload successful:", result.secure_url);
            resolve(result);
          }
        );

        stream.on("error", (err) => {
          console.error("Stream error:", err);
          reject(err);
        });

        stream.end(req.file.buffer);
      });

      const uploadResult = await uploadPromise;
      res.json({ url: uploadResult.secure_url });
    } catch (err) {
      console.error("Upload error:", err);
      console.error("Error stack:", err.stack);
      res.status(500).json({
        message: "Upload error",
        error: err.message || "Unknown error occurred",
        details:
          process.env.NODE_ENV === "development" ? err.toString() : undefined,
      });
    }
  }
);

// Create product (Admin)
router.post("/", authMiddleware, async (req, res) => {
  if (!req.user.isAdmin) return res.status(403).json({ message: "Admin only" });

  try {
    console.log("Creating product with data:", req.body);

    // Validate required fields
    if (!req.body.name || !req.body.price) {
      return res.status(400).json({
        message: "Product name and price are required",
      });
    }

    const product = await prisma.product.create({
      data: {
        name: req.body.name,
        description: req.body.description || null,
        price: parseFloat(req.body.price),
        imageUrl: req.body.imageUrl || null,
        categoryId: req.body.categoryId || null,
        stock: parseInt(req.body.stock) || 0,
        isActive: req.body.isActive !== undefined ? req.body.isActive : true,
      },
    });

    console.log("Product created successfully:", product.id);
    res.json(product);
  } catch (err) {
    console.error("Product creation error:", err);
    console.error("Error details:", {
      code: err.code,
      meta: err.meta,
      message: err.message,
    });
    res.status(500).json({
      message: "Server error",
      error: err.message || "Unknown error occurred",
      code: err.code,
    });
  }
});

// Update product (Admin)
router.put("/:id", authMiddleware, async (req, res) => {
  if (!req.user.isAdmin) return res.status(403).json({ message: "Admin only" });

  try {
    const updateData = {};
    if (req.body.name) updateData.name = req.body.name;
    if (req.body.description !== undefined)
      updateData.description = req.body.description;
    if (req.body.price !== undefined)
      updateData.price = parseFloat(req.body.price);
    if (req.body.imageUrl !== undefined)
      updateData.imageUrl = req.body.imageUrl;
    if (req.body.categoryId !== undefined)
      updateData.categoryId = req.body.categoryId;
    if (req.body.stock !== undefined)
      updateData.stock = parseInt(req.body.stock);
    if (req.body.isActive !== undefined)
      updateData.isActive = req.body.isActive;

    const product = await prisma.product.update({
      where: { id: req.params.id },
      data: updateData,
    });
    res.json(product);
  } catch (err) {
    console.error("Product update error:", err);
    res.status(500).json({
      message: "Server error",
      error: err.message || "Unknown error occurred",
    });
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
