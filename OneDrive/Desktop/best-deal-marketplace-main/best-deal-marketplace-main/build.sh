#!/bin/bash
set -e

echo "Building backend..."
cd backend
npm install
npx prisma generate

echo "Setting up database..."
npx prisma migrate deploy || npx prisma db push --skip-generate || echo "Database setup skipped"

echo "Building frontend..."
cd ../frontend
npm install
npm run build

echo "Build complete!"
