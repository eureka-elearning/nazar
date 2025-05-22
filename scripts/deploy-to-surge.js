// Simple deployment script for Surge
const { exec } = require("child_process")
const fs = require("fs")
const path = require("path")

const DOMAIN = "nazar-ankudinov.surge.sh"

// Ensure the build directory exists
const buildDir = path.join(__dirname, "../out")
if (!fs.existsSync(buildDir)) {
  console.log('❌ Build directory not found. Run "npm run build" first.')
  process.exit(1)
}

// Create a surge-specific 200.html file for SPA routing
fs.copyFileSync(path.join(buildDir, "index.html"), path.join(buildDir, "200.html"))

// Deploy to Surge
console.log(`🚀 Deploying to ${DOMAIN}...`)
exec(`npx surge ${buildDir} ${DOMAIN}`, (error, stdout, stderr) => {
  if (error) {
    console.error(`❌ Deployment error: ${error}`)
    return
  }

  console.log(stdout)
  console.error(stderr)

  console.log(`✅ Deployed to https://${DOMAIN}`)
})
