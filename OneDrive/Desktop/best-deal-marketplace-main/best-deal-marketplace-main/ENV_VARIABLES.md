# Environment Variables Reference

This document lists all environment variables used in the Best Deal Marketplace application.

## Required Environment Variables

### Database Configuration
```bash
DATABASE_URL="file:./backend/dev.db"
```
- **Description:** Database connection string
- **Development:** Use SQLite: `file:./backend/dev.db`
- **Production:** Use PostgreSQL: `postgresql://user:password@host:port/database`
- **Example (PostgreSQL):** `postgresql://user:pass@localhost:5432/mydb?schema=public`

### Authentication
```bash
JWT_SECRET="your-super-secret-jwt-key-change-this-in-production"
```
- **Description:** Secret key for signing and verifying JWT tokens
- **How to generate:** Run `openssl rand -base64 32` or use any secure random string generator
- **Security:** Must be a strong, random string. Never commit this to version control.

### Cloudinary (Image Uploads)
```bash
CLOUDINARY_CLOUD_NAME="your-cloudinary-cloud-name"
CLOUDINARY_API_KEY="your-cloudinary-api-key"
CLOUDINARY_API_SECRET="your-cloudinary-api-secret"
```
- **Description:** Cloudinary credentials for image upload and storage
- **Where to get:** Sign up at https://cloudinary.com and get credentials from dashboard
- **Required for:** Product image uploads

## Optional Environment Variables

### Meta Pixel (Facebook/Meta Tracking)
```bash
META_PIXEL_ID="your-meta-pixel-id"
META_ACCESS_TOKEN="your-meta-access-token"
META_TEST_EVENT_CODE="your-test-event-code"
```
- **Description:** Meta Pixel configuration for tracking conversions
- **Required for:** Facebook/Meta ad tracking and conversion events
- **Where to get:** Meta Business Manager → Events Manager

### Frontend Configuration
```bash
VITE_API_URL=""
```
- **Description:** Frontend API base URL
- **Default:** `/api` (relative URL)
- **Development:** Can be set to `http://localhost:5000/api`
- **Production:** Leave empty to use relative URLs

### Server Configuration
```bash
PORT=5000
```
- **Description:** Server port number
- **Default:** `5000`
- **Note:** Vercel automatically sets this - don't override in production

```bash
NODE_ENV="development"
```
- **Description:** Node.js environment
- **Values:** `development` | `production`
- **Default:** `development`
- **Production:** Automatically set to `production` by Vercel

### Platform Detection
```bash
VERCEL="1"
```
- **Description:** Automatically set by Vercel platform
- **Do not set manually:** This is used to detect if running on Vercel
- **Purpose:** Enables Vercel-specific optimizations

## Environment Variables by Component

### Backend (`backend/`)
- `DATABASE_URL` - Prisma database connection
- `JWT_SECRET` - JWT token signing
- `CLOUDINARY_CLOUD_NAME` - Image uploads
- `CLOUDINARY_API_KEY` - Image uploads
- `CLOUDINARY_API_SECRET` - Image uploads
- `META_PIXEL_ID` - Meta Pixel tracking
- `META_ACCESS_TOKEN` - Meta Pixel tracking
- `META_TEST_EVENT_CODE` - Meta Pixel testing
- `PORT` - Server port
- `NODE_ENV` - Environment mode
- `VERCEL` - Platform detection

### Frontend (`frontend/`)
- `VITE_API_URL` - API endpoint URL

## Setting Up Environment Variables

### Local Development

1. Create a `.env` file in the project root:
   ```bash
   cp .env.example .env
   ```

2. Edit `.env` and fill in your values:
   ```bash
   DATABASE_URL="file:./backend/dev.db"
   JWT_SECRET="your-local-secret-key"
   CLOUDINARY_CLOUD_NAME="your-cloud-name"
   CLOUDINARY_API_KEY="your-api-key"
   CLOUDINARY_API_SECRET="your-api-secret"
   ```

### Vercel Deployment

#### Using Vercel CLI:
```bash
vercel env add DATABASE_URL
vercel env add JWT_SECRET
vercel env add CLOUDINARY_CLOUD_NAME
vercel env add CLOUDINARY_API_KEY
vercel env add CLOUDINARY_API_SECRET
```

#### Using Vercel Dashboard:
1. Go to your project on Vercel
2. Navigate to Settings → Environment Variables
3. Add each variable for Production, Preview, and Development environments

## Security Best Practices

1. **Never commit `.env` files** - They should be in `.gitignore`
2. **Use different secrets** for development and production
3. **Rotate secrets regularly** especially if exposed
4. **Use strong random strings** for `JWT_SECRET` (minimum 32 characters)
5. **Restrict database access** - Use connection pooling and IP whitelisting
6. **Use environment-specific values** - Different Cloudinary accounts for dev/prod

## Generating Secure Secrets

### Generate JWT Secret:
```bash
# Using OpenSSL
openssl rand -base64 32

# Using Node.js
node -e "console.log(require('crypto').randomBytes(32).toString('base64'))"

# Using PowerShell (Windows)
[Convert]::ToBase64String((1..32 | ForEach-Object { Get-Random -Maximum 256 }))
```

## Troubleshooting

### "JWT_SECRET is not set"
- Ensure `.env` file exists in project root
- Verify variable name is exactly `JWT_SECRET`
- Restart your development server after adding variables

### Database Connection Errors
- Verify `DATABASE_URL` format is correct
- For PostgreSQL, ensure connection string includes SSL if required
- Check database server is accessible from your network

### Cloudinary Upload Failures
- Verify all three Cloudinary variables are set
- Check Cloudinary dashboard for account status
- Ensure API keys have correct permissions

### Frontend API Errors
- Check `VITE_API_URL` is set correctly
- For production, ensure it's empty or points to correct API URL
- Verify backend is running and accessible




