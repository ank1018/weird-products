# AI Marketing Agent - Troubleshooting Guide

## 🐛 Common Issues and Solutions

### Twitter OAuth Issues

#### Issue: "Twitter OAuth failed. The app may not have proper permissions or the OAuth was cancelled."

**Possible Causes and Solutions:**

1. **Missing or Incorrect Environment Variables**

   ```bash
   # Check your .env.local file has these variables:
   TWITTER_CLIENT_ID=your_twitter_oauth2_client_id
   TWITTER_CLIENT_SECRET=your_twitter_oauth2_client_secret
   NEXTAUTH_URL=http://localhost:3000
   ```

2. **Incorrect Twitter App Configuration**

   - Go to [Twitter Developer Portal](https://developer.twitter.com/en/portal/dashboard)
   - Select your app
   - Go to "User authentication settings"
   - Ensure OAuth 2.0 is enabled
   - Verify callback URL: `http://localhost:3000/api/ai-marketing-agent/social-auth/twitter/callback`
   - Set App permissions to "Read and Write"

3. **Wrong Credentials Type**

   - Use OAuth 2.0 Client ID and Client Secret (not API Key/Secret)
   - These are found in the "Keys and Tokens" section under "OAuth 2.0"

4. **Callback URL Mismatch**

   - The callback URL in your Twitter app must exactly match: `http://localhost:3000/api/ai-marketing-agent/social-auth/twitter/callback`
   - For production, add your production domain

5. **App Not Approved**
   - Ensure your Twitter app has the necessary permissions approved
   - Check if your app is in "Read" or "Read and Write" mode

#### Debugging Steps:

1. **Check Browser Console**

   - Open browser developer tools
   - Look for any JavaScript errors during OAuth flow

2. **Check Server Logs**

   - Look for errors in your Next.js server console
   - Check for "Twitter OAuth error" or "Twitter token exchange error" messages

3. **Test Environment Variables**
   ```bash
   # Add this to your route to debug
   console.log("TWITTER_CLIENT_ID:", process.env.TWITTER_CLIENT_ID);
   console.log("TWITTER_CLIENT_SECRET:", process.env.TWITTER_CLIENT_SECRET ? "SET" : "NOT SET");
   ```

### Other Common Issues

#### Issue: "Authentication required" error

**Solution:**

- Ensure you're signed in to the application
- Check that NextAuth is properly configured
- Verify your Google OAuth setup

#### Issue: OAuth window doesn't open

**Solution:**

- Check if popup blockers are enabled
- Try allowing popups for your domain
- Check browser console for errors

#### Issue: OAuth completes but account doesn't show as connected

**Solution:**

- Check if the callback route is working properly
- Verify that credentials are being saved
- Check browser console for any JavaScript errors

## 🔧 Environment Variables Checklist

Make sure your `.env.local` file includes:

```bash
# Required for Twitter OAuth
TWITTER_CLIENT_ID=your_twitter_oauth2_client_id
TWITTER_CLIENT_SECRET=your_twitter_oauth2_client_secret
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your_nextauth_secret

# Required for authentication
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret

# Required for AI features
OPENAI_API_KEY=sk-your_openai_api_key_here

# Database (if using MongoDB)
MONGODB_URI=your_mongodb_connection_string
```

## 🚀 Testing Your Setup

### Test Twitter OAuth:

1. Start your development server: `npm run dev`
2. Navigate to `/ai-marketing-agent`
3. Sign in with Google
4. Click "Connect" next to Twitter
5. Complete the OAuth flow
6. Verify the account shows as connected

### Test AI Features:

1. Enter a website URL
2. Click "Analyze & Generate Content"
3. Verify AI analysis appears
4. Test content generation

## 📞 Getting Help

If you're still experiencing issues:

1. Check the browser console for errors
2. Check the server console for errors
3. Verify all environment variables are set correctly
4. Ensure your Twitter app has the correct permissions
5. Test with a fresh browser session

## 🔄 Reset Everything

If you need to start fresh:

1. Clear browser localStorage: `localStorage.clear()`
2. Restart your development server
3. Sign out and sign back in
4. Try the OAuth flow again
