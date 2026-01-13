# Quick Setup Guide - Vercel Deployment

Follow these steps to get your database set up and deployed on Vercel.

## 🚀 Quick Start (5 minutes)

### Step 1: Create PostgreSQL Database (Choose One)

#### Option A: Vercel Postgres (Easiest - Recommended)
1. Go to: https://vercel.com/mejds-projects/best-deal
2. Click **Storage** tab → **Create Database** → **Postgres**
3. Choose **Hobby** (free) plan
4. Click **Create**
5. Copy the **Prisma Connection String** (you'll need it in Step 2)

#### Option B: Supabase (Free Tier)
1. Go to: https://supabase.com → Sign up
2. **New Project** → Name: `best-deal-marketplace`
3. Set a strong password (save it!)
4. Wait 2-3 minutes for setup
5. Go to **Settings** → **Database** → Copy **Connection string (URI)**

#### Option C: Neon (Serverless - Free Tier)
1. Go to: https://neon.tech → Sign up
2. **Create a project** → Name: `best-deal-marketplace`
3. Copy the **Connection string** from dashboard

### Step 2: Set Environment Variables

#### Using Vercel Dashboard (Easiest):

1. Go to: https://vercel.com/mejds-projects/best-deal/settings/environment-variables

2. Add these variables (click **Add** for each):

   | Variable | Value | Environments |
   |----------|-------|--------------|
   | `DATABASE_URL` | Your PostgreSQL connection string | ✅ Production, ✅ Preview, ✅ Development |
   | `JWT_SECRET` | Generate with: `openssl rand -base64 32` | ✅ All three |
   | `CLOUDINARY_CLOUD_NAME` | Your Cloudinary cloud name | ✅ All three |
   | `CLOUDINARY_API_KEY` | Your Cloudinary API key | ✅ All three |
   | `CLOUDINARY_API_SECRET` | Your Cloudinary API secret | ✅ All three |

3. **Generate JWT_SECRET:**
   ```bash
   # On Windows PowerShell:
   [Convert]::ToBase64String((1..32 | ForEach-Object { Get-Random -Maximum 256 }))
   
   # On Mac/Linux:
   openssl rand -base64 32
   ```

#### Using Script (Automated):

**Windows (PowerShell):**
```powershell
.\scripts\setup-vercel-env.ps1
```

**Mac/Linux:**
```bash
chmod +x scripts/setup-vercel-env.sh
./scripts/setup-vercel-env.sh
```

### Step 3: Deploy

```bash
vercel --prod
```

That's it! The build process will:
- ✅ Install dependencies
- ✅ Generate Prisma Client
- ✅ Run database migrations automatically
- ✅ Build frontend
- ✅ Deploy everything

### Step 4: Verify

1. **Check deployment:**
   - Go to: https://vercel.com/mejds-projects/best-deal
   - Click on the latest deployment
   - Check build logs for success ✅

2. **Test signup:**
   - Visit: `https://best-deal-two.vercel.app` (or your domain)
   - Try creating an account
   - If it works, you're done! 🎉

## 🔧 Troubleshooting

### "Can't reach database server"
- ✅ Check `DATABASE_URL` is correct
- ✅ Make sure connection string includes `?sslmode=require`
- ✅ Verify database is running

### "Migration failed"
- ✅ Check build logs in Vercel dashboard
- ✅ Make sure database is empty (or migrations haven't run)
- ✅ Verify `DATABASE_URL` is set correctly

### "Prisma Client not found"
- ✅ This should be fixed automatically in the build
- ✅ Check that `prisma` is in `backend/package.json`

### Still having issues?
1. Check Vercel Function Logs: Dashboard → Your Project → Functions → View Logs
2. Check the detailed guide: `SETUP_DATABASE.md`
3. Verify all environment variables are set for **all environments** (Production, Preview, Development)

## 📚 More Help

- **Detailed Database Setup:** See `SETUP_DATABASE.md`
- **Environment Variables:** See `ENV_VARIABLES.md`
- **Full Deployment Guide:** See `DEPLOYMENT.md`

## ✅ Checklist

Before deploying, make sure:
- [ ] PostgreSQL database created
- [ ] `DATABASE_URL` set in Vercel (all environments)
- [ ] `JWT_SECRET` set in Vercel (all environments)
- [ ] `CLOUDINARY_*` variables set (all environments)
- [ ] Ready to deploy!

---

**Need help?** Check the logs in Vercel dashboard or see the detailed guides in the repository.

