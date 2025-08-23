// Test script to verify Twitter OAuth configuration
// Run this with: node app/ai-marketing-agent/test-twitter-oauth.js

const fs = require("fs");
const path = require("path");

console.log("🔍 Twitter OAuth Configuration Test");
console.log("=====================================\n");

// Check if .env.local exists
const envPath = path.join(process.cwd(), ".env.local");
if (fs.existsSync(envPath)) {
  console.log("✅ .env.local file found");

  const envContent = fs.readFileSync(envPath, "utf8");

  // Check for required environment variables
  const requiredVars = [
    "TWITTER_CLIENT_ID",
    "TWITTER_CLIENT_SECRET",
    "NEXTAUTH_URL",
    "NEXTAUTH_SECRET",
  ];

  console.log("\n📋 Environment Variables Check:");
  requiredVars.forEach((varName) => {
    if (envContent.includes(varName)) {
      console.log(`✅ ${varName} is set`);
    } else {
      console.log(`❌ ${varName} is missing`);
    }
  });

  // Check for optional variables
  const optionalVars = [
    "GOOGLE_CLIENT_ID",
    "GOOGLE_CLIENT_SECRET",
    "OPENAI_API_KEY",
  ];

  console.log("\n📋 Optional Environment Variables:");
  optionalVars.forEach((varName) => {
    if (envContent.includes(varName)) {
      console.log(`✅ ${varName} is set`);
    } else {
      console.log(`⚠️  ${varName} is not set (optional)`);
    }
  });
} else {
  console.log("❌ .env.local file not found");
  console.log(
    "Please create a .env.local file with your Twitter OAuth credentials"
  );
}

console.log("\n🔧 Next Steps:");
console.log("1. Ensure your Twitter app has OAuth 2.0 enabled");
console.log(
  "2. Set callback URL to: http://localhost:3000/api/ai-marketing-agent/social-auth/twitter/callback"
);
console.log(
  "3. Use OAuth 2.0 Client ID and Client Secret (not API Key/Secret)"
);
console.log('4. Set app permissions to "Read and Write"');
console.log("5. Start your dev server: npm run dev");
console.log("6. Test OAuth flow at: http://localhost:3000/ai-marketing-agent");

console.log("\n📚 For detailed setup instructions, see:");
console.log("- app/ai-marketing-agent/SETUP.md");
console.log("- app/ai-marketing-agent/TROUBLESHOOTING.md");
