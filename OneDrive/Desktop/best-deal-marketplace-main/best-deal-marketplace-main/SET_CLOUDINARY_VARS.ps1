# Set Cloudinary environment variables
# Run this script and enter your Cloudinary credentials when prompted

Write-Host "Setting Cloudinary Environment Variables" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

$CLOUDINARY_CLOUD_NAME = Read-Host "CLOUDINARY_CLOUD_NAME"
$CLOUDINARY_API_KEY = Read-Host "CLOUDINARY_API_KEY"
$CLOUDINARY_API_SECRET = Read-Host "CLOUDINARY_API_SECRET"

Write-Host ""
Write-Host "Setting variables..." -ForegroundColor Yellow

# Set for all environments
echo $CLOUDINARY_CLOUD_NAME | vercel env add CLOUDINARY_CLOUD_NAME production
echo $CLOUDINARY_CLOUD_NAME | vercel env add CLOUDINARY_CLOUD_NAME preview
echo $CLOUDINARY_CLOUD_NAME | vercel env add CLOUDINARY_CLOUD_NAME development

echo $CLOUDINARY_API_KEY | vercel env add CLOUDINARY_API_KEY production
echo $CLOUDINARY_API_KEY | vercel env add CLOUDINARY_API_KEY preview
echo $CLOUDINARY_API_KEY | vercel env add CLOUDINARY_API_KEY development

echo $CLOUDINARY_API_SECRET | vercel env add CLOUDINARY_API_SECRET production
echo $CLOUDINARY_API_SECRET | vercel env add CLOUDINARY_API_SECRET preview
echo $CLOUDINARY_API_SECRET | vercel env add CLOUDINARY_API_SECRET development

Write-Host ""
Write-Host "Cloudinary variables set successfully!" -ForegroundColor Green

