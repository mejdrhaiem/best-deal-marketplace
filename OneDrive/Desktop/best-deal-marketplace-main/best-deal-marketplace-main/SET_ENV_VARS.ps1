# Quick script to set all Vercel environment variables
# Usage: .\SET_ENV_VARS.ps1

Write-Host "Setting Vercel Environment Variables" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

# Generate JWT_SECRET
Write-Host "Generating JWT_SECRET..." -ForegroundColor Yellow
$bytes = New-Object byte[] 32
$rng = [System.Security.Cryptography.RandomNumberGenerator]::Create()
$rng.GetBytes($bytes)
$JWT_SECRET = [Convert]::ToBase64String($bytes)
Write-Host "Generated JWT_SECRET: $JWT_SECRET" -ForegroundColor Green
Write-Host "SAVE THIS SECRET SECURELY!" -ForegroundColor Yellow
Write-Host ""

# Get values from user
Write-Host "Enter your values (press Enter after each):" -ForegroundColor Cyan
Write-Host ""

$DATABASE_URL = Read-Host "DATABASE_URL (PostgreSQL connection string)"
$CLOUDINARY_CLOUD_NAME = Read-Host "CLOUDINARY_CLOUD_NAME"
$CLOUDINARY_API_KEY = Read-Host "CLOUDINARY_API_KEY"
$CLOUDINARY_API_SECRET = Read-Host "CLOUDINARY_API_SECRET"

Write-Host ""
Write-Host "Setting environment variables..." -ForegroundColor Yellow

# Set DATABASE_URL for all environments
Write-Host "  Setting DATABASE_URL..." -ForegroundColor Gray
echo $DATABASE_URL | vercel env add DATABASE_URL production
echo $DATABASE_URL | vercel env add DATABASE_URL preview
echo $DATABASE_URL | vercel env add DATABASE_URL development

# Set JWT_SECRET for all environments
Write-Host "  Setting JWT_SECRET..." -ForegroundColor Gray
echo $JWT_SECRET | vercel env add JWT_SECRET production
echo $JWT_SECRET | vercel env add JWT_SECRET preview
echo $JWT_SECRET | vercel env add JWT_SECRET development

# Set Cloudinary variables for all environments
Write-Host "  Setting CLOUDINARY_CLOUD_NAME..." -ForegroundColor Gray
echo $CLOUDINARY_CLOUD_NAME | vercel env add CLOUDINARY_CLOUD_NAME production
echo $CLOUDINARY_CLOUD_NAME | vercel env add CLOUDINARY_CLOUD_NAME preview
echo $CLOUDINARY_CLOUD_NAME | vercel env add CLOUDINARY_CLOUD_NAME development

Write-Host "  Setting CLOUDINARY_API_KEY..." -ForegroundColor Gray
echo $CLOUDINARY_API_KEY | vercel env add CLOUDINARY_API_KEY production
echo $CLOUDINARY_API_KEY | vercel env add CLOUDINARY_API_KEY preview
echo $CLOUDINARY_API_KEY | vercel env add CLOUDINARY_API_KEY development

Write-Host "  Setting CLOUDINARY_API_SECRET..." -ForegroundColor Gray
echo $CLOUDINARY_API_SECRET | vercel env add CLOUDINARY_API_SECRET production
echo $CLOUDINARY_API_SECRET | vercel env add CLOUDINARY_API_SECRET preview
echo $CLOUDINARY_API_SECRET | vercel env add CLOUDINARY_API_SECRET development

Write-Host ""
Write-Host "All environment variables set successfully!" -ForegroundColor Green
Write-Host ""
Write-Host "Summary:" -ForegroundColor Cyan
Write-Host "  DATABASE_URL: Set for all environments"
Write-Host "  JWT_SECRET: $JWT_SECRET (SAVE THIS!)"
Write-Host "  CLOUDINARY_CLOUD_NAME: Set for all environments"
Write-Host "  CLOUDINARY_API_KEY: Set for all environments"
Write-Host "  CLOUDINARY_API_SECRET: Set for all environments"
Write-Host ""
Write-Host "Next step: Run 'vercel --prod' to deploy" -ForegroundColor Yellow
