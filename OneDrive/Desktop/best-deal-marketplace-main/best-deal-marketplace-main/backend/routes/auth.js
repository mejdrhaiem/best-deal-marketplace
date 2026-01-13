const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const path = require("path");
const prisma = require("../lib/prisma");
const authMiddleware = require("../middleware/auth");

// Ensure .env is loaded in routes (in case it wasn't loaded in index.js)
require("dotenv").config({ path: path.join(__dirname, "../../.env") });

const router = express.Router();

// Register
router.post("/signup", async (req, res) => {
  const { email, password, firstName, lastName, phone, address } = req.body;

  try {
    if (!email || !password) {
      return res
        .status(400)
        .json({ message: "Email and password are required" });
    }

    if (!process.env.JWT_SECRET) {
      console.error("JWT_SECRET is not set in environment variables");
      return res.status(500).json({ message: "Server configuration error" });
    }

    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    console.log("Creating user with email:", email);
    const user = await prisma.user.create({
      data: {
        email,
        password: hashedPassword,
        profile: {
          create: {
            firstName: firstName || null,
            lastName: lastName || null,
            phone: phone || null,
            address: address || null,
            isAdmin: email === "daly@gmail.com",
          },
        },
      },
      include: {
        profile: true,
      },
    });
    console.log("User created successfully:", user.id);

    const token = jwt.sign(
      { id: user.id, email: user.email, isAdmin: user.profile.isAdmin },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );

    res.json({
      session: {
        access_token: token,
        user: { id: user.id, email: user.email, user_metadata: user.profile },
      },
      user: { id: user.id, email: user.email },
    });
  } catch (err) {
    console.error("Signup error:", err);
    console.error("Error stack:", err.stack);
    console.error("Error details:", {
      name: err.name,
      message: err.message,
      code: err.code,
    });
    res.status(500).json({
      message: "Server error",
      error: err.message || "Unknown error",
      code: err.code,
    });
  }
});

// Login
router.post("/login", async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await prisma.user.findUnique({
      where: { email },
      include: { profile: true },
    });

    if (!user) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    const token = jwt.sign(
      {
        id: user.id,
        email: user.email,
        isAdmin: user.profile?.isAdmin || false,
      },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );

    res.json({
      session: {
        access_token: token,
        user: { id: user.id, email: user.email, user_metadata: user.profile },
      },
      user: { id: user.id, email: user.email },
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

// Get User (Me) - Emulate Supabase getUser
router.get("/user", authMiddleware, async (req, res) => {
  try {
    const user = await prisma.user.findUnique({
      where: { id: req.user.id },
      include: { profile: true },
    });
    res.json({
      user: { id: user.id, email: user.email, user_metadata: user.profile },
    });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});

// Admin: Get all users
router.get("/users", authMiddleware, async (req, res) => {
  if (!req.user.isAdmin) return res.status(403).json({ message: "Admin only" });

  try {
    const profiles = await prisma.profile.findMany({
      orderBy: { createdAt: "desc" },
    });
    res.json(profiles);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});

// Admin: Toggle admin status
router.put("/users/:id/role", authMiddleware, async (req, res) => {
  if (!req.user.isAdmin) return res.status(403).json({ message: "Admin only" });

  try {
    const profile = await prisma.profile.update({
      where: { id: req.params.id },
      data: { isAdmin: req.body.isAdmin },
    });
    res.json(profile);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;
