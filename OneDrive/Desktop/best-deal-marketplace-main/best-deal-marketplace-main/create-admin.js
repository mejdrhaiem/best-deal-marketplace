#!/usr/bin/env node
/**
 * Create Admin Account Script
 * Creates an admin user in the database
 */

const bcrypt = require("bcryptjs");
const path = require("path");
require("dotenv").config({ path: path.join(__dirname, ".env") });

const prisma = require("./backend/lib/prisma");

async function createAdmin() {
  const adminEmail = "daly@gmail.com";
  const adminPassword = "Admin@123456"; // Change this to a secure password
  
  try {
    // Check if admin already exists
    const existingUser = await prisma.user.findUnique({
      where: { email: adminEmail },
      include: { profile: true },
    });

    if (existingUser) {
      // Update existing user to admin if not already
      if (!existingUser.profile?.isAdmin) {
        await prisma.profile.update({
          where: { userId: existingUser.id },
          data: { isAdmin: true },
        });
        console.log("✅ Existing user updated to admin!");
        console.log(`   Email: ${adminEmail}`);
        console.log(`   Password: (use existing password or reset)`);
      } else {
        console.log("✅ Admin account already exists!");
        console.log(`   Email: ${adminEmail}`);
      }
    } else {
      // Create new admin user
      const hashedPassword = await bcrypt.hash(adminPassword, 10);
      
      const user = await prisma.user.create({
        data: {
          email: adminEmail,
          password: hashedPassword,
          profile: {
            create: {
              firstName: "Admin",
              lastName: "User",
              isAdmin: true,
            },
          },
        },
        include: {
          profile: true,
        },
      });

      console.log("✅ Admin account created successfully!");
      console.log("");
      console.log("📋 Admin Credentials:");
      console.log("   Email: " + adminEmail);
      console.log("   Password: " + adminPassword);
      console.log("");
      console.log("⚠️  IMPORTANT: Change this password after first login!");
    }
  } catch (error) {
    console.error("❌ Error creating admin account:", error.message);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

createAdmin();

