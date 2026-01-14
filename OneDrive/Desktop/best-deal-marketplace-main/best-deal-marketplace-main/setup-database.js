#!/usr/bin/env node
/**
 * Database Setup Script
 * This script helps set up the PostgreSQL database for production
 * 
 * Usage:
 *   1. Set DATABASE_URL in your environment
 *   2. Run: node setup-database.js
 */

const { execSync } = require('child_process');
const path = require('path');
require('dotenv').config();

const backendPath = path.join(__dirname, 'backend');

console.log('🚀 Setting up database...\n');

// Check if DATABASE_URL is set
if (!process.env.DATABASE_URL) {
  console.error('❌ ERROR: DATABASE_URL is not set!');
  console.error('\nPlease set DATABASE_URL in your environment:');
  console.error('  export DATABASE_URL="postgresql://user:password@host:port/database?sslmode=require"');
  console.error('\nOr create a .env file with:');
  console.error('  DATABASE_URL="postgresql://user:password@host:port/database?sslmode=require"');
  process.exit(1);
}

console.log('✅ DATABASE_URL is set');
console.log(`   Database: ${process.env.DATABASE_URL.replace(/:[^:@]+@/, ':****@')}\n`);

try {
  // Generate Prisma Client
  console.log('📦 Generating Prisma Client...');
  execSync('npx prisma generate', {
    cwd: backendPath,
    stdio: 'inherit',
  });
  console.log('✅ Prisma Client generated\n');

  // Run migrations
  console.log('🔄 Running database migrations...');
  execSync('npx prisma migrate deploy', {
    cwd: backendPath,
    stdio: 'inherit',
  });
  console.log('✅ Migrations completed\n');

  console.log('🎉 Database setup complete!');
} catch (error) {
  console.error('\n❌ Database setup failed!');
  console.error('Error:', error.message);
  process.exit(1);
}


