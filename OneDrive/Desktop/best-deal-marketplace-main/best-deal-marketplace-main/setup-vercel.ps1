# Vercel Setup Script for Windows PowerShell
# Run this script to set up and deploy to Vercel

Write-Host "=== Vercel Deployment Setup ===" -ForegroundColor Cyan
Write-Host ""

# Check if Vercel CLI is installed
Write-Host "Checking Vercel CLI installation..." -ForegroundColor Yellow
$vercelInstalled = Get-Command vercel -ErrorAction SilentlyContinue

if (-not $vercelInstalled) {
    Write-Host "Vercel CLI not found. Installing..." -ForegroundColor Yellow
    npm install -g vercel
    if ($LASTEXITCODE -ne 0) {
        Write-Host "Failed to install Vercel CLI. Please install manually: npm install -g vercel" -ForegroundColor Red
        exit 1
    }
    Write-Host "Vercel CLI installed successfully!" -ForegroundColor Green
} else {
    Write-Host "Vercel CLI is already installed." -ForegroundColor Green
}

Write-Host ""
Write-Host "=== Next Steps ===" -ForegroundColor Cyan
Write-Host ""
Write-Host "1. Login to Vercel:" -ForegroundColor Yellow
Write-Host "   vercel login" -ForegroundColor White
Write-Host ""
Write-Host "2. Link your project:" -ForegroundColor Yellow
Write-Host "   vercel link" -ForegroundColor White
Write-Host ""
Write-Host "3. Add environment variables (run each command and enter the value when prompted):" -ForegroundColor Yellow
Write-Host "   vercel env add DATABASE_URL" -ForegroundColor White
Write-Host "   vercel env add JWT_SECRET" -ForegroundColor White
Write-Host "   vercel env add CLOUDINARY_CLOUD_NAME" -ForegroundColor White
Write-Host "   vercel env add CLOUDINARY_API_KEY" -ForegroundColor White
Write-Host "   vercel env add CLOUDINARY_API_SECRET" -ForegroundColor White
Write-Host ""
Write-Host "4. Deploy to production:" -ForegroundColor Yellow
Write-Host "   vercel --prod" -ForegroundColor White
Write-Host ""
Write-Host "For more details, see DEPLOYMENT.md" -ForegroundColor Cyan




