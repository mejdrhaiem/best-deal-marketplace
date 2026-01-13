#!/bin/bash
# Script to help set up Vercel environment variables
# Usage: ./scripts/setup-vercel-env.sh

echo "🚀 Vercel Environment Variables Setup"
echo "======================================"
echo ""

# Check if vercel CLI is installed
if ! command -v vercel &> /dev/null; then
    echo "❌ Vercel CLI is not installed!"
    echo "Install it with: npm install -g vercel"
    exit 1
fi

echo "This script will help you set environment variables in Vercel."
echo "You'll need:"
echo "  - DATABASE_URL (PostgreSQL connection string)"
echo "  - JWT_SECRET (generate with: openssl rand -base64 32)"
echo "  - CLOUDINARY_CLOUD_NAME"
echo "  - CLOUDINARY_API_KEY"
echo "  - CLOUDINARY_API_SECRET"
echo ""

read -p "Press Enter to continue..."

# Generate JWT_SECRET if not provided
echo ""
echo "📝 Setting up JWT_SECRET..."
JWT_SECRET=$(openssl rand -base64 32)
echo "Generated JWT_SECRET: $JWT_SECRET"
echo ""

# Set DATABASE_URL
echo "📝 Setting DATABASE_URL..."
echo "Enter your PostgreSQL connection string:"
echo "Format: postgresql://user:password@host:port/database?sslmode=require"
read -p "DATABASE_URL: " DATABASE_URL
vercel env add DATABASE_URL production <<< "$DATABASE_URL"
vercel env add DATABASE_URL preview <<< "$DATABASE_URL"
vercel env add DATABASE_URL development <<< "$DATABASE_URL"

# Set JWT_SECRET
echo ""
echo "📝 Setting JWT_SECRET..."
vercel env add JWT_SECRET production <<< "$JWT_SECRET"
vercel env add JWT_SECRET preview <<< "$JWT_SECRET"
vercel env add JWT_SECRET development <<< "$JWT_SECRET"

# Set Cloudinary variables
echo ""
echo "📝 Setting Cloudinary variables..."
read -p "CLOUDINARY_CLOUD_NAME: " CLOUDINARY_CLOUD_NAME
vercel env add CLOUDINARY_CLOUD_NAME production <<< "$CLOUDINARY_CLOUD_NAME"
vercel env add CLOUDINARY_CLOUD_NAME preview <<< "$CLOUDINARY_CLOUD_NAME"
vercel env add CLOUDINARY_CLOUD_NAME development <<< "$CLOUDINARY_CLOUD_NAME"

read -p "CLOUDINARY_API_KEY: " CLOUDINARY_API_KEY
vercel env add CLOUDINARY_API_KEY production <<< "$CLOUDINARY_API_KEY"
vercel env add CLOUDINARY_API_KEY preview <<< "$CLOUDINARY_API_KEY"
vercel env add CLOUDINARY_API_KEY development <<< "$CLOUDINARY_API_KEY"

read -p "CLOUDINARY_API_SECRET: " CLOUDINARY_API_SECRET
vercel env add CLOUDINARY_API_SECRET production <<< "$CLOUDINARY_API_SECRET"
vercel env add CLOUDINARY_API_SECRET preview <<< "$CLOUDINARY_API_SECRET"
vercel env add CLOUDINARY_API_SECRET development <<< "$CLOUDINARY_API_SECRET"

echo ""
echo "✅ Environment variables set!"
echo ""
echo "📋 Summary:"
echo "  - DATABASE_URL: Set"
echo "  - JWT_SECRET: $JWT_SECRET (save this securely!)"
echo "  - CLOUDINARY_*: Set"
echo ""
echo "🚀 Next steps:"
echo "  1. Deploy: vercel --prod"
echo "  2. Check deployment logs for any errors"
echo "  3. Test the signup endpoint"

