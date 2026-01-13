const { PrismaClient } = require("@prisma/client");
const path = require("path");

// Load .env from parent directory (root of project)
require("dotenv").config({ path: path.join(__dirname, "../../.env") });

const prisma = new PrismaClient({
  log: process.env.NODE_ENV === "development" ? ["query", "error", "warn"] : ["error"],
});

// Handle Prisma connection errors
prisma.$connect().catch((err) => {
  console.error("Failed to connect to database:", err.message);
  console.error("DATABASE_URL:", process.env.DATABASE_URL ? "Set" : "NOT SET");
});

module.exports = prisma;
