const { PrismaClient } = require("@prisma/client");
const path = require("path");

// Load .env from parent directory (root of project)
require("dotenv").config({ path: path.join(__dirname, "../../.env") });

const prisma = new PrismaClient();

module.exports = prisma;
