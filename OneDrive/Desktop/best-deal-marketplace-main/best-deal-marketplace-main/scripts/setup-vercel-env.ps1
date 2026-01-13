# PowerShell script to help set up Vercel environment variables
# Usage: .\scripts\setup-vercel-env.ps1

Write-Host "🚀 Vercel Environment Variables Setup" -ForegroundColor Cyan
Write-Host "======================================" -ForegroundColor Cyan
Write-Host ""

# Check if vercel CLI is installed
try {
    $null = Get-Command vercel -ErrorAction Stop
} catch {
    Write-Host "❌ Vercel CLI is not installed!" -ForegroundColor Red
    Write-Host "Install it with: npm install -g vercel" -ForegroundColor Yellow
    exit 1
}

Write-Host "This script will help you set environment variables in Vercel."
Write-Host "You'll need:"
Write-Host "  - DATABASE_URL (PostgreSQL connection string)"
Write-Host "  - JWT_SECRET (will be generated)"
Write-Host "  - CLOUDINARY_CLOUD_NAME"
Write-Host "  - CLOUDINARY_API_KEY"
Write-Host "  - CLOUDINARY_API_SECRET"
Write-Host ""

Read-Host "Press Enter to continue"

# Generate JWT_SECRET
Write-Host ""
Write-Host "📝 Generating JWT_SECRET..." -ForegroundColor Yellow
$bytes = New-Object byte[] 32
$rng = [System.Security.Cryptography.RandomNumberGenerator]::Create()
$rng.GetBytes($bytes)
$JWT_SECRET = [Convert]::ToBase64String($bytes)
Write-Host "Generated JWT_SECRET: $JWT_SECRET" -ForegroundColor Green
Write-Host ""

# Set DATABASE_URL
Write-Host "📝 Setting DATABASE_URL..." -ForegroundColor Yellow
Write-Host "Enter your PostgreSQL connection string:"
Write-Host "Format: postgresql://user:password@host:port/database?sslmode=require"
$DATABASE_URL = Read-Host "DATABASE_URL"
echo $DATABASE_URL | vercel env add DATABASE_URL production
echo $DATABASE_URL | vercel env add DATABASE_URL preview
echo $DATABASE_URL | vercel env add DATABASE_URL development

# Set JWT_SECRET
Write-Host ""
Write-Host "📝 Setting JWT_SECRET..." -ForegroundColor Yellow
echo $JWT_SECRET | vercel env add JWT_SECRET production
echo $JWT_SECRET | vercel env add JWT_SECRET preview
echo $JWT_SECRET | vercel env add JWT_SECRET development

# Set Cloudinary variables
Write-Host ""
Write-Host "📝 Setting Cloudinary variables..." -ForegroundColor Yellow
$CLOUDINARY_CLOUD_NAME = Read-Host "CLOUDINARY_CLOUD_NAME"
echo $CLOUDINARY_CLOUD_NAME | vercel env add CLOUDINARY_CLOUD_NAME production
echo $CLOUDINARY_CLOUD_NAME | vercel env add CLOUDINARY_CLOUD_NAME preview
echo $CLOUDINARY_CLOUD_NAME | vercel env add CLOUDINARY_CLOUD_NAME development

$CLOUDINARY_API_KEY = Read-Host "CLOUDINARY_API_KEY"
echo $CLOUDINARY_API_KEY | vercel env add CLOUDINARY_API_KEY production
echo $CLOUDINARY_API_KEY | vercel env add CLOUDINARY_API_KEY preview
echo $CLOUDINARY_API_KEY | vercel env add CLOUDINARY_API_KEY development

$CLOUDINARY_API_SECRET = Read-Host "CLOUDINARY_API_SECRET"
echo $CLOUDINARY_API_SECRET | vercel env add CLOUDINARY_API_SECRET production
echo $CLOUDINARY_API_SECRET | vercel env add CLOUDINARY_API_SECRET preview
echo $CLOUDINARY_API_SECRET | vercel env add CLOUDINARY_API_SECRET development

Write-Host ""
Write-Host "✅ Environment variables set!" -ForegroundColor Green
Write-Host ""
Write-Host "📋 Summary:" -ForegroundColor Cyan
Write-Host "  - DATABASE_URL: Set"
Write-Host "  - JWT_SECRET: $JWT_SECRET (save this securely!)"
Write-Host "  - CLOUDINARY_*: Set"
Write-Host ""
Write-Host "🚀 Next steps:" -ForegroundColor Yellow
Write-Host "  1. Deploy: vercel --prod"
Write-Host "  2. Check deployment logs for any errors"
Write-Host "  3. Test the signup endpoint"

