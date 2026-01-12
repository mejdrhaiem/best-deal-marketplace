const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const prisma = require("../lib/prisma");
const authMiddleware = require("../middleware/auth");
const router = express.Router();

// Register
router.post("/signup", async (req, res) => {
  const { email, password, firstName, lastName, phone, address } = req.body;

  try {
    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await prisma.user.create({
      data: {
        email,
        password: hashedPassword,
        profile: {
          create: {
            firstName,
            lastName,
            phone,
            address,
            isAdmin: email === "daly@gmail.com",
          },
        },
      },
      include: {
        profile: true,
      },
    });

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
    console.error(err);
    res.status(500).json({ message: "Server error" });
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
