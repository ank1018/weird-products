# AI Marketing Agent - Setup & Integration Guide

This guide will walk you through setting up the AI Marketing Agent with real AI capabilities and social media integrations.

## 🧠 AI Integration Setup

### 1. OpenAI GPT-4 Integration

The AI Marketing Agent uses OpenAI's GPT-4 for intelligent content analysis and generation.

#### Step 1: Get OpenAI API Key

1. Go to [OpenAI Platform](https://platform.openai.com/)
2. Sign up or log in to your account
3. Navigate to "API Keys" in your dashboard
4. Click "Create new secret key"
5. Copy the generated API key

#### Step 2: Add to Environment Variables

Add this to your `.env.local` file:

```bash
# OpenAI API for AI content analysis and generation
OPENAI_API_KEY=sk-your_openai_api_key_here
```

#### Step 3: Verify AI Integration

- The AI will automatically analyze website content
- Generate intelligent platform recommendations
- Create platform-optimized content variations
- Suggest optimal posting times and hashtags

### 2. Website Scraping (Optional)

For production use, consider using a web scraping service:

#### Option A: ScrapingBee (Recommended)

1. Sign up at [ScrapingBee](https://www.scrapingbee.com/)
2. Get your API key
3. Add to `.env.local`:

```bash
SCRAPING_BEE_API_KEY=your_scraping_bee_key
```

#### Option B: Puppeteer (Self-hosted)

```bash
npm install puppeteer
```

## 📱 Social Media Platform Integrations

### 1. Twitter Integration

#### Step 1: Create Twitter Developer Account

1. Go to [Twitter Developer Portal](https://developer.twitter.com/en/portal/dashboard)
2. Apply for a developer account
3. Create a new app
4. Navigate to "Keys and Tokens"

#### Step 2: Configure OAuth2 Settings

1. In your Twitter app settings, go to "User authentication settings"
2. Enable "OAuth 2.0"
3. Set App permissions to "Read and Write"
4. Add your callback URL: `http://localhost:3000/api/ai-marketing-agent/social-auth/twitter/callback`
5. For production, add your production domain callback URL
6. Save the settings

#### Step 3: Get OAuth2 Credentials

1. Copy your "OAuth 2.0 Client ID" (this is your Client ID)
2. Copy your "OAuth 2.0 Client Secret" (this is your Client Secret)
3. Note: These are different from the API Key and API Secret

#### Step 4: Add Environment Variables

```bash
# Twitter OAuth2 Integration (for user authentication)
TWITTER_CLIENT_ID=your_twitter_oauth2_client_id
TWITTER_CLIENT_SECRET=your_twitter_oauth2_client_secret

# Twitter API v1.1 Integration (for direct posting - optional)
TWITTER_API_KEY=your_twitter_api_key
TWITTER_API_SECRET=your_twitter_api_secret
TWITTER_ACCESS_TOKEN=your_twitter_access_token
TWITTER_ACCESS_TOKEN_SECRET=your_twitter_access_token_secret
# Optional: Bearer Token for additional API access
TWITTER_BEARER_TOKEN=your_twitter_bearer_token
```

#### Step 4: Test Twitter Integration

The AI will automatically:

- Format content for Twitter's 280-character limit
- Add relevant hashtags
- Optimize posting times for maximum engagement

### 2. LinkedIn Integration

#### Step 1: Create LinkedIn App

1. Go to [LinkedIn Developers](https://www.linkedin.com/developers/)
2. Create a new app
3. Request access to "Marketing Developer Platform"

#### Step 2: Get API Credentials

1. Note your Client ID and Client Secret
2. Generate access tokens with appropriate permissions
3. Get your LinkedIn Person ID

#### Step 3: Add Environment Variables

```bash
# LinkedIn API Integration
LINKEDIN_CLIENT_ID=your_linkedin_client_id
LINKEDIN_CLIENT_SECRET=your_linkedin_client_secret
LINKEDIN_ACCESS_TOKEN=your_linkedin_access_token
LINKEDIN_PERSON_ID=your_linkedin_person_id
```

#### Step 4: LinkedIn Features

- Professional content optimization
- Industry-specific targeting
- Thought leadership content generation

### 3. Telegram Integration

#### Step 1: Create Telegram Bot

1. Message [@BotFather](https://t.me/botfather) on Telegram
2. Send `/newbot` command
3. Follow instructions to create your bot
4. Copy the bot token

#### Step 2: Set Up Channel/Group

1. Create a Telegram channel or use existing one
2. Add your bot as an administrator
3. Note the channel ID (format: `@channelname` or `-100xxxxxxxxx`)

#### Step 3: Add Environment Variables

```bash
# Telegram Bot Integration
TELEGRAM_BOT_TOKEN=your_telegram_bot_token
TELEGRAM_CHANNEL_ID=@your_channel_name
```

#### Step 4: Telegram Features

- AI-recommended Telegram groups
- Community engagement optimization
- Direct messaging capabilities

### 4. Reddit Integration (Advanced)

#### Step 1: Create Reddit App

1. Go to [Reddit App Preferences](https://www.reddit.com/prefs/apps)
2. Create a new app
3. Note your Client ID and Client Secret

#### Step 2: OAuth2 Setup

Reddit requires OAuth2 authentication. Add these variables:

```bash
# Reddit API Integration (OAuth2)
REDDIT_CLIENT_ID=your_reddit_client_id
REDDIT_CLIENT_SECRET=your_reddit_client_secret
REDDIT_USERNAME=your_reddit_username
REDDIT_PASSWORD=your_reddit_password
```

### 5. Hacker News Integration

Hacker News doesn't have a public posting API, but the AI will:

- Suggest relevant content for HN
- Provide manual submission links
- Optimize content for HN community

## 🔧 Complete Environment Setup

Create a `.env.local` file with all your integrations:

```bash
# AI Integration
OPENAI_API_KEY=sk-your_openai_api_key_here

# Web Scraping (Optional)
SCRAPING_BEE_API_KEY=your_scraping_bee_key

# Twitter Integration
TWITTER_CLIENT_ID=your_twitter_oauth2_client_id
TWITTER_CLIENT_SECRET=your_twitter_oauth2_client_secret
# Optional: Twitter API v1.1 for direct posting
TWITTER_API_KEY=your_twitter_api_key
TWITTER_API_SECRET=your_twitter_api_secret
TWITTER_ACCESS_TOKEN=your_twitter_access_token
TWITTER_ACCESS_TOKEN_SECRET=your_twitter_access_token_secret
TWITTER_BEARER_TOKEN=your_twitter_bearer_token

# LinkedIn Integration
LINKEDIN_CLIENT_ID=your_linkedin_client_id
LINKEDIN_CLIENT_SECRET=your_linkedin_client_secret
LINKEDIN_ACCESS_TOKEN=your_linkedin_access_token
LINKEDIN_PERSON_ID=your_linkedin_person_id

# Telegram Integration
TELEGRAM_BOT_TOKEN=your_telegram_bot_token
TELEGRAM_CHANNEL_ID=@your_channel_name

# Reddit Integration (Optional)
REDDIT_CLIENT_ID=your_reddit_client_id
REDDIT_CLIENT_SECRET=your_reddit_client_secret
REDDIT_USERNAME=your_reddit_username
REDDIT_PASSWORD=your_reddit_password

# Database
MONGODB_URI=your_mongodb_connection_string

# NextAuth
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your_nextauth_secret
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret
```

## 🚀 Installation & Dependencies

### Required Dependencies

```bash
npm install openai puppeteer cheerio twitter-api-v2 node-telegram-bot-api
```

### Optional Dependencies

```bash
npm install scrapingbee axios
```

## 📊 Testing Your Integrations

### 1. Test AI Analysis

1. Enter a website URL in the AI Marketing Agent
2. Click "Analyze & Generate Content"
3. Verify AI analysis results appear
4. Check that recommendations are generated

### 2. Test Social Media Posting

1. Generate content using AI
2. Select platforms to post to
3. Click "Post with AI Optimization"
4. Verify posts appear on your social media accounts

### 3. Test Platform-Specific Features

- **Twitter**: Check character limits and hashtag optimization
- **LinkedIn**: Verify professional tone and industry targeting
- **Telegram**: Test group recommendations and formatting
- **Reddit**: Check subreddit suggestions and community guidelines

## 🔒 Security Best Practices

### 1. Environment Variables

- Never commit API keys to version control
- Use `.env.local` for local development
- Use environment variables in production

### 2. API Rate Limits

- **Twitter**: 300 tweets per 3 hours
- **LinkedIn**: Varies by app tier
- **Telegram**: No strict limits
- **Reddit**: 60 requests per minute

### 3. Content Guidelines

- Respect each platform's content policies
- Avoid spam and excessive posting
- Follow community guidelines

## 🎯 Advanced Configuration

### 1. Custom AI Prompts

You can customize AI behavior by modifying prompts in:

- `app/api/ai-marketing-agent/analyze/route.ts`
- `app/api/ai-marketing-agent/generate/route.ts`

### 2. Platform-Specific Optimization

Adjust content formatting in:

- `app/api/ai-marketing-agent/social-integration/route.ts`

### 3. Database Storage

Configure MongoDB for storing:

- Website analysis results
- Post history and performance
- User preferences and settings

## 🆘 Troubleshooting

### Common Issues

#### 1. OpenAI API Errors

```
Error: OpenAI API key not configured
```

**Solution**: Verify your `OPENAI_API_KEY` is set correctly

#### 2. Twitter API Errors

```
Error: Twitter API credentials not configured
```

**Solution**: Check all Twitter environment variables are set

#### 3. LinkedIn Permission Errors

```
Error: LinkedIn Marketing Developer Platform access required
```

**Solution**: Request access to LinkedIn Marketing Developer Platform

#### 4. Telegram Bot Errors

```
Error: Bot must be admin of the channel to post
```

**Solution**: Add your bot as administrator to the channel

### Getting Help

1. Check the console logs for detailed error messages
2. Verify all environment variables are set correctly
3. Test each platform integration individually
4. Check API rate limits and quotas

## 📈 Next Steps

Once your integrations are working:

1. **Monitor Performance**: Track engagement across platforms
2. **Optimize Content**: Use AI insights to improve content strategy
3. **Scale Up**: Add more platforms and automation features
4. **Customize**: Adapt AI prompts for your specific industry
5. **Analyze**: Use performance data to refine your strategy

---

**Your AI Marketing Agent is now ready to intelligently analyze websites and post optimized content across all your social media platforms! 🚀**
