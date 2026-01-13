# Database Setup Guide for Vercel

This guide will help you set up a PostgreSQL database for your Best Deal Marketplace application on Vercel.

## Step 1: Create a PostgreSQL Database

Choose one of these options:

### Option A: Vercel Postgres (Recommended - Easiest Integration)

1. Go to your Vercel project dashboard: https://vercel.com/dashboard
2. Click on your project: **best-deal**
3. Go to the **Storage** tab
4. Click **Create Database** → Select **Postgres**
5. Choose a plan (Hobby plan is free for development)
6. Select a region close to your users
7. Click **Create**

Vercel will automatically:
- Create the database
- Set the `POSTGRES_URL` environment variable
- Set the `POSTGRES_PRISMA_URL` environment variable
- Set the `POSTGRES_URL_NON_POOLING` environment variable

**Note:** If using Vercel Postgres, use `POSTGRES_PRISMA_URL` as your `DATABASE_URL`.

### Option B: Supabase (Free Tier Available)

1. Go to https://supabase.com
2. Sign up or log in
3. Click **New Project**
4. Fill in:
   - Project name: `best-deal-marketplace`
   - Database password: (save this securely!)
   - Region: Choose closest to you
5. Click **Create new project**
6. Wait for the project to be created (2-3 minutes)
7. Go to **Settings** → **Database**
8. Copy the **Connection string** under "Connection string" → **URI**
   - Format: `postgresql://postgres:[YOUR-PASSWORD]@db.[PROJECT-REF].supabase.co:5432/postgres`

### Option C: Neon (Serverless PostgreSQL)

1. Go to https://neon.tech
2. Sign up or log in
3. Click **Create a project**
4. Fill in:
   - Project name: `best-deal-marketplace`
   - Region: Choose closest to you
5. Click **Create Project**
6. Copy the **Connection string** from the dashboard
   - Format: `postgresql://[user]:[password]@[host]/[database]?sslmode=require`

### Option D: Railway

1. Go to https://railway.app
2. Sign up or log in
3. Click **New Project** → **Provision PostgreSQL**
4. Click on the PostgreSQL service
5. Go to **Variables** tab
6. Copy the `DATABASE_URL` value

## Step 2: Set Environment Variables in Vercel

### Using Vercel Dashboard (Recommended)

1. Go to your Vercel project: https://vercel.com/mejds-projects/best-deal
2. Click **Settings** → **Environment Variables**
3. Add the following variables:

#### Required Variables:

| Variable | Value | Environment |
|----------|-------|-------------|
| `DATABASE_URL` | Your PostgreSQL connection string | Production, Preview, Development |
| `JWT_SECRET` | A secure random string (generate with: `openssl rand -base64 32`) | Production, Preview, Development |
| `CLOUDINARY_CLOUD_NAME` | Your Cloudinary cloud name | Production, Preview, Development |
| `CLOUDINARY_API_KEY` | Your Cloudinary API key | Production, Preview, Development |
| `CLOUDINARY_API_SECRET` | Your Cloudinary API secret | Production, Preview, Development |

#### If Using Vercel Postgres:

Instead of `DATABASE_URL`, Vercel automatically sets:
- `POSTGRES_URL` (for general use)
- `POSTGRES_PRISMA_URL` (for Prisma - use this one!)
- `POSTGRES_URL_NON_POOLING` (for migrations)

**Important:** If using Vercel Postgres, you need to set `DATABASE_URL` manually to the value of `POSTGRES_PRISMA_URL`:
1. Go to **Storage** → Your Postgres database
2. Copy the **Prisma Connection String**
3. Add it as `DATABASE_URL` in Environment Variables

### Using Vercel CLI

```bash
# Set DATABASE_URL
vercel env add DATABASE_URL production
# Paste your connection string when prompted

# Set JWT_SECRET (generate a secure one first)
openssl rand -base64 32
vercel env add JWT_SECRET production
# Paste the generated secret

# Set Cloudinary variables
vercel env add CLOUDINARY_CLOUD_NAME production
vercel env add CLOUDINARY_API_KEY production
vercel env add CLOUDINARY_API_SECRET production
```

## Step 3: Run Database Migrations

The build process is now configured to automatically run migrations during deployment. However, you can also run them manually:

### Option A: Automatic (During Deployment)

Migrations will run automatically when you deploy. The build command includes:
```bash
npx prisma migrate deploy
```

### Option B: Manual (Before First Deployment)

1. **Pull environment variables locally:**
   ```bash
   vercel env pull .env.local
   ```

2. **Set DATABASE_URL in your local .env:**
   ```bash
   # Copy DATABASE_URL from .env.local to .env
   # Or set it directly:
   export DATABASE_URL="your-postgresql-connection-string"
   ```

3. **Run the setup script:**
   ```bash
   node setup-database.js
   ```

   Or manually:
   ```bash
   cd backend
   npm install
   npx prisma generate
   npx prisma migrate deploy
   ```

## Step 4: Deploy to Vercel

After setting up the database and environment variables:

```bash
vercel --prod
```

The deployment will:
1. Install dependencies
2. Generate Prisma Client
3. Run database migrations
4. Build the frontend
5. Deploy everything

## Step 5: Verify Everything Works

1. **Check deployment logs:**
   - Go to Vercel dashboard → Your project → Deployments
   - Click on the latest deployment
   - Check the build logs for any errors

2. **Test the API:**
   - Visit: `https://your-domain.vercel.app/api/auth/signup`
   - Try creating an account
   - Check Vercel Function Logs if there are errors

3. **Check database:**
   - Use your database provider's dashboard
   - Verify tables were created (User, Profile, Category, Product, Order, OrderItem)

## Troubleshooting

### Error: "Can't reach database server"

- Check that your `DATABASE_URL` is correct
- Verify the database is running
- Check if your database allows connections from Vercel IPs (most cloud providers do by default)
- For some providers, you may need to add `?sslmode=require` to the connection string

### Error: "Migration failed"

- Check that the database is empty or that migrations haven't been run before
- Try running `npx prisma migrate reset` (WARNING: This deletes all data!)
- Check the migration files in `backend/prisma/migrations/`

### Error: "Prisma Client not generated"

- The build process should generate it automatically
- If not, check that `prisma` is in `backend/package.json` dependencies
- Try running `cd backend && npx prisma generate` manually

### Environment Variables Not Working

- Make sure variables are set for the correct environment (Production, Preview, Development)
- Redeploy after adding new environment variables
- Check variable names are exactly correct (case-sensitive)

## Quick Reference

### Connection String Formats

**Vercel Postgres:**
```
postgres://default:[PASSWORD]@[HOST]:5432/verceldb?sslmode=require
```

**Supabase:**
```
postgresql://postgres:[PASSWORD]@db.[PROJECT-REF].supabase.co:5432/postgres?sslmode=require
```

**Neon:**
```
postgresql://[USER]:[PASSWORD]@[HOST]/[DATABASE]?sslmode=require
```

### Useful Commands

```bash
# Generate Prisma Client
cd backend && npx prisma generate

# Run migrations
cd backend && npx prisma migrate deploy

# View database (Prisma Studio)
cd backend && npx prisma studio

# Reset database (WARNING: Deletes all data!)
cd backend && npx prisma migrate reset
```

## Next Steps

After the database is set up:
1. ✅ Test user registration
2. ✅ Test user login
3. ✅ Add some products via admin panel
4. ✅ Test the full order flow

Your application should now be fully functional on Vercel! 🎉

