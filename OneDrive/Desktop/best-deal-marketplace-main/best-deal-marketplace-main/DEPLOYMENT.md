# Deployment Guide - Best Deal Marketplace

This guide will help you deploy the Best Deal Marketplace application to Vercel.

## Prerequisites

1. **Node.js** (v18 or higher)
2. **Git** installed
3. **Vercel account** (sign up at https://vercel.com)
4. **Vercel CLI** (we'll install this)

## Environment Variables

The following environment variables need to be set in Vercel:

### Required Variables

```bash
# Database Configuration
# For SQLite (development): file:./backend/dev.db
# For PostgreSQL (production): postgresql://user:password@host:port/database
DATABASE_URL="file:./backend/dev.db"

# JWT Secret for authentication
# Generate a secure random string: openssl rand -base64 32
JWT_SECRET="your-super-secret-jwt-key-change-this-in-production"

# Cloudinary Configuration (for image uploads)
CLOUDINARY_CLOUD_NAME="your-cloudinary-cloud-name"
CLOUDINARY_API_KEY="your-cloudinary-api-key"
CLOUDINARY_API_SECRET="your-cloudinary-api-secret"
```

### Optional Variables

```bash
# Meta Pixel Configuration (for Facebook/Meta tracking)
META_PIXEL_ID="your-meta-pixel-id"
META_ACCESS_TOKEN="your-meta-access-token"
META_TEST_EVENT_CODE="your-test-event-code"

# Frontend API URL (leave empty for production - defaults to /api)
VITE_API_URL=""

# Server Port (Vercel sets this automatically)
PORT=5000

# Node Environment
NODE_ENV="production"
```

**Note:** `VERCEL` is automatically set by Vercel platform - do not set manually.

## Step-by-Step Deployment

### Option 1: Deploy via Vercel CLI (Recommended)

1. **Install Vercel CLI globally:**
   ```bash
   npm install -g vercel
   ```

2. **Login to Vercel:**
   ```bash
   vercel login
   ```

3. **Navigate to your project directory:**
   ```bash
   cd "D:\bestdealtn\best-deal-marketplace\OneDrive\Desktop\best-deal-marketplace-main\best-deal-marketplace-main"
   ```

4. **Link your project to Vercel:**
   ```bash
   vercel link
   ```
   - If this is a new project, it will ask you to create a new project
   - Follow the prompts to link your project

5. **Set environment variables:**
   ```bash
   vercel env add DATABASE_URL
   vercel env add JWT_SECRET
   vercel env add CLOUDINARY_CLOUD_NAME
   vercel env add CLOUDINARY_API_KEY
   vercel env add CLOUDINARY_API_SECRET
   ```
   
   For each variable, enter the value when prompted. You can also add optional variables:
   ```bash
   vercel env add META_PIXEL_ID
   vercel env add META_ACCESS_TOKEN
   vercel env add META_TEST_EVENT_CODE
   vercel env add VITE_API_URL
   ```

6. **Deploy to production:**
   ```bash
   vercel --prod
   ```

   Or deploy to preview:
   ```bash
   vercel
   ```

### Option 2: Deploy via Vercel Dashboard

1. **Push your code to GitHub/GitLab/Bitbucket**

2. **Go to Vercel Dashboard:**
   - Visit https://vercel.com/dashboard
   - Click "Add New Project"

3. **Import your repository:**
   - Select your Git provider
   - Choose your repository
   - Click "Import"

4. **Configure Project Settings:**
   - **Framework Preset:** Other
   - **Root Directory:** Leave as is (root)
   - **Build Command:** `cd frontend && npm install && npm run build`
   - **Output Directory:** `frontend/dist`
   - **Install Command:** Leave empty (Vercel will auto-detect)

5. **Add Environment Variables:**
   - Go to Project Settings → Environment Variables
   - Add all required variables listed above
   - Make sure to add them for Production, Preview, and Development environments

6. **Deploy:**
   - Click "Deploy"
   - Wait for the build to complete

## Post-Deployment Steps

### 1. Database Setup

Since you're using SQLite in development, you'll need to:

**Option A: Use PostgreSQL (Recommended for Production)**
1. Set up a PostgreSQL database (e.g., Vercel Postgres, Supabase, or Railway)
2. Update `DATABASE_URL` in Vercel environment variables
3. Update `backend/prisma/schema.prisma` to use PostgreSQL:
   ```prisma
   datasource db {
     provider = "postgresql"
     url      = env("DATABASE_URL")
   }
   ```
4. Run migrations:
   ```bash
   cd backend
   npx prisma migrate deploy
   ```

**Option B: Use SQLite (Not Recommended for Production)**
- SQLite files are ephemeral on Vercel serverless functions
- Consider using a persistent storage solution or switch to PostgreSQL

### 2. Run Database Migrations

After setting up your database, run migrations:

```bash
cd backend
npx prisma generate
npx prisma migrate deploy
```

### 3. Verify Deployment

1. Visit your Vercel deployment URL
2. Test the application:
   - Register a new user
   - Login
   - Browse products
   - Create an order

## Troubleshooting

### Build Fails

- Check that all environment variables are set
- Verify Node.js version (should be 18+)
- Check build logs in Vercel dashboard

### API Routes Not Working

- Ensure `vercel.json` routes are correctly configured
- Check that backend dependencies are installed
- Verify environment variables are accessible

### Database Connection Issues

- Verify `DATABASE_URL` is correctly formatted
- For PostgreSQL, ensure connection string includes SSL parameters if needed
- Check database provider allows connections from Vercel IPs

### Image Uploads Not Working

- Verify Cloudinary credentials are correct
- Check Cloudinary account limits
- Ensure CORS is properly configured

## Quick Deploy Commands

```bash
# Install Vercel CLI
npm install -g vercel

# Login
vercel login

# Link project (first time only)
vercel link

# Deploy to preview
vercel

# Deploy to production
vercel --prod

# View logs
vercel logs

# List deployments
vercel ls
```

## Environment Variables Quick Reference

| Variable | Required | Description |
|----------|----------|-------------|
| `DATABASE_URL` | Yes | Database connection string |
| `JWT_SECRET` | Yes | Secret key for JWT tokens |
| `CLOUDINARY_CLOUD_NAME` | Yes | Cloudinary cloud name |
| `CLOUDINARY_API_KEY` | Yes | Cloudinary API key |
| `CLOUDINARY_API_SECRET` | Yes | Cloudinary API secret |
| `META_PIXEL_ID` | No | Meta Pixel ID for tracking |
| `META_ACCESS_TOKEN` | No | Meta Pixel access token |
| `META_TEST_EVENT_CODE` | No | Meta Pixel test event code |
| `VITE_API_URL` | No | Frontend API URL (defaults to /api) |
| `PORT` | No | Server port (auto-set by Vercel) |
| `NODE_ENV` | No | Node environment (production) |

## Additional Resources

- [Vercel Documentation](https://vercel.com/docs)
- [Prisma Deployment Guide](https://www.prisma.io/docs/guides/deployment)
- [Vercel Environment Variables](https://vercel.com/docs/concepts/projects/environment-variables)


