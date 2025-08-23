# AI Marketing Agent

An intelligent AI-powered marketing agent that analyzes websites, generates optimized content, and posts to multiple social media platforms with smart recommendations.

## Features

- **AI-Powered Analysis**: Uses Perplexity API (primary) and OpenAI (fallback) for intelligent website analysis
- **Content Generation**: Creates marketing posts, blog content, and product descriptions
- **Multi-Platform Posting**: Supports Twitter, LinkedIn, Telegram, Reddit, and Hacker News
- **Smart Recommendations**: AI suggests optimal platforms, timing, and content strategies
- **OAuth Integration**: User-friendly social media account connections
- **Post History**: Track and manage all your marketing posts
- **Scheduling**: Schedule posts for optimal timing
- **Authentication**: Secure login required for all features

## AI Integration

### Primary: Perplexity API

The application uses **Perplexity API** as the primary AI service for:

- Website content analysis
- Marketing recommendations
- Content generation
- Platform optimization

### Fallback: OpenAI

If Perplexity API fails or is unavailable, the system automatically falls back to **OpenAI GPT-4** for:

- Content generation
- Analysis and recommendations
- Error recovery

## Environment Variables

### Required

```env
# Database
MONGODB_URI=your_mongodb_connection_string

# Authentication
NEXTAUTH_SECRET=your_nextauth_secret
NEXTAUTH_URL=http://localhost:3000

# AI Services (at least one required)
PERPLEXITY_API_KEY=your_perplexity_api_key
OPENAI_API_KEY=your_openai_api_key

# Social Media APIs (optional for demo)
TWITTER_API_KEY=your_twitter_api_key
TWITTER_API_SECRET=your_twitter_api_secret
TWITTER_ACCESS_TOKEN=your_twitter_access_token
TWITTER_ACCESS_TOKEN_SECRET=your_twitter_access_token_secret

LINKEDIN_CLIENT_ID=your_linkedin_client_id
LINKEDIN_CLIENT_SECRET=your_linkedin_client_secret
LINKEDIN_ACCESS_TOKEN=your_linkedin_access_token
LINKEDIN_PERSON_ID=your_linkedin_person_id

TELEGRAM_BOT_TOKEN=your_telegram_bot_token
TELEGRAM_CHANNEL_ID=@your_channel_name
```

## API Endpoints

### Content Generation

- `POST /api/ai-marketing-agent/generate` - Generate marketing content
- `POST /api/ai-marketing-agent/analyze` - Analyze website content
- `POST /api/ai-marketing-agent/post` - Post to social media platforms
- `GET /api/ai-marketing-agent/posts` - Get post history
- `DELETE /api/ai-marketing-agent/posts` - Delete a post

### Social Media Integration

- `POST /api/ai-marketing-agent/social-integration` - Post to multiple platforms
- `GET /api/ai-marketing-agent/social-integration` - Get platform configuration

### OAuth Authentication

- `GET /api/ai-marketing-agent/social-auth/twitter` - Twitter OAuth
- `GET /api/ai-marketing-agent/social-auth/linkedin` - LinkedIn OAuth
- `GET /api/ai-marketing-agent/social-auth/telegram` - Telegram bot setup

### Scheduling

- `POST /api/ai-marketing-agent/schedule` - Schedule a post
- `GET /api/ai-marketing-agent/schedule` - Get scheduled posts

## Setup Instructions

### 1. Get Perplexity API Key

1. Visit [Perplexity API](https://www.perplexity.ai/settings/api)
2. Create an account and generate an API key
3. Add to your `.env.local` file:
   ```env
   PERPLEXITY_API_KEY=your_perplexity_api_key
   ```

### 2. Get OpenAI API Key (Fallback)

1. Visit [OpenAI Platform](https://platform.openai.com/api-keys)
2. Create an API key
3. Add to your `.env.local` file:
   ```env
   OPENAI_API_KEY=your_openai_api_key
   ```

### 3. Set up Social Media APIs

Follow the setup instructions in the Social Media Connection section of the app for each platform.

## Usage

1. **Sign In**: Login with Google to access all features
2. **Analyze Website**: Enter a website URL for AI analysis
3. **Generate Content**: Create marketing posts with AI assistance
4. **Connect Social Media**: Link your social media accounts
5. **Post Content**: Share to multiple platforms with one click
6. **Track Results**: Monitor your post history and engagement

## AI Models Used

### Perplexity API

- **Model**: `llama-3.1-sonar-small-128k-online`
- **Features**: Real-time web search, up-to-date information
- **Use Cases**: Website analysis, content generation, recommendations

### OpenAI (Fallback)

- **Model**: `gpt-4`
- **Features**: Advanced reasoning, creative content generation
- **Use Cases**: Content creation, analysis, when Perplexity is unavailable

## Error Handling

The application implements robust error handling:

- **Primary API Failure**: Automatic fallback to secondary API
- **Network Issues**: Graceful degradation with fallback content
- **Authentication Errors**: Clear user feedback and retry options
- **Rate Limiting**: Intelligent retry logic with exponential backoff

## Testing

To test the API integration:

```bash
# Test Perplexity API
node test-perplexity-api.js

# Test OpenAI API
node test-openai-api.js
```

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

MIT License - see LICENSE file for details.
