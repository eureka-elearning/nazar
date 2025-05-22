# PowerShell script for deploying to Surge

$DOMAIN = "nazar-ankudinov.surge.sh"
$BUILD_DIR = Join-Path $PSScriptRoot "../out"

# Check if build directory exists
if (!(Test-Path $BUILD_DIR)) {
    Write-Host "❌ Build directory not found. Run 'npm run build' first." -ForegroundColor Red
    exit 1
}

# Create a surge-specific 200.html file for SPA routing
Copy-Item -Path (Join-Path $BUILD_DIR "index.html") -Destination (Join-Path $BUILD_DIR "200.html")

# Deploy to Surge
Write-Host "🚀 Deploying to $DOMAIN..." -ForegroundColor Cyan
npx surge $BUILD_DIR $DOMAIN

if ($LASTEXITCODE -eq 0) {
    Write-Host "✅ Deployed to https://$DOMAIN" -ForegroundColor Green
} else {
    Write-Host "❌ Deployment failed!" -ForegroundColor Red
}
