# API Documentation - Creator Growth Platform

## Overview
This document provides comprehensive API specifications for the backend implementation of the Creator Growth Platform. The platform handles viral content discovery, YouTube analytics, competitor analysis, AI script tools, multi-platform posting, and subscription management.

---

## Base Configuration

### Base URL
```
Production: https://api.yourplatform.com/v1
Development: http://localhost:3000/api/v1
```

### Authentication
All protected endpoints require Bearer token authentication:
```
Authorization: Bearer {access_token}
```

### Response Format
All responses follow this structure:
```json
{
  "success": boolean,
  "data": object | array,
  "error": {
    "code": string,
    "message": string
  },
  "meta": {
    "timestamp": string,
    "requestId": string
  }
}
```

### Error Codes
- `400` - Bad Request
- `401` - Unauthorized
- `403` - Forbidden
- `404` - Not Found
- `429` - Too Many Requests
- `500` - Internal Server Error

---

## Authentication Endpoints

### 1. User Registration
**Endpoint:** `POST /auth/register`

**Request Body:**
```json
{
  "name": "string (required, min: 2, max: 100)",
  "email": "string (required, valid email)",
  "password": "string (required, min: 8, must contain uppercase, lowercase, number)"
}
```

**Response:** `201 Created`
```json
{
  "success": true,
  "data": {
    "user": {
      "id": "string (UUID)",
      "name": "string",
      "email": "string",
      "createdAt": "ISO 8601 timestamp"
    },
    "tokens": {
      "accessToken": "string (JWT)",
      "refreshToken": "string (JWT)",
      "expiresIn": "number (seconds)"
    }
  }
}
```

---

### 2. User Login
**Endpoint:** `POST /auth/login`

**Request Body:**
```json
{
  "email": "string (required)",
  "password": "string (required)"
}
```

**Response:** `200 OK`
```json
{
  "success": true,
  "data": {
    "user": {
      "id": "string",
      "name": "string",
      "email": "string",
      "subscription": {
        "plan": "Free | Pro | Agency",
        "status": "active | cancelled | expired"
      }
    },
    "tokens": {
      "accessToken": "string",
      "refreshToken": "string",
      "expiresIn": number
    }
  }
}
```

---

### 3. Google OAuth
**Endpoint:** `POST /auth/google`

**Request Body:**
```json
{
  "idToken": "string (Google ID token)",
  "clientId": "string (Google OAuth client ID)"
}
```

**Response:** `200 OK` (Same structure as login)

---

### 4. Refresh Token
**Endpoint:** `POST /auth/refresh`

**Request Body:**
```json
{
  "refreshToken": "string (required)"
}
```

**Response:** `200 OK`
```json
{
  "success": true,
  "data": {
    "accessToken": "string",
    "refreshToken": "string",
    "expiresIn": number
  }
}
```

---

### 5. Logout
**Endpoint:** `POST /auth/logout`

**Headers:** `Authorization: Bearer {token}`

**Response:** `200 OK`
```json
{
  "success": true,
  "data": {
    "message": "Logged out successfully"
  }
}
```

---

## User Profile Endpoints

### 6. Get User Profile
**Endpoint:** `GET /user/profile`

**Headers:** `Authorization: Bearer {token}`

**Response:** `200 OK`
```json
{
  "success": true,
  "data": {
    "id": "string",
    "name": "string",
    "email": "string",
    "niches": ["string"],
    "connectedPlatforms": {
      "tiktok": {
        "connected": boolean,
        "username": "string | null",
        "connectedAt": "timestamp | null"
      },
      "instagram": {
        "connected": boolean,
        "username": "string | null",
        "connectedAt": "timestamp | null"
      },
      "youtube": {
        "connected": boolean,
        "channelId": "string | null",
        "connectedAt": "timestamp | null"
      }
    },
    "subscription": {
      "plan": "Free | Pro | Agency",
      "status": "active | cancelled | expired",
      "currentPeriodEnd": "timestamp"
    },
    "stats": {
      "savedVideos": number,
      "savedScripts": number,
      "channelsAnalyzed": number,
      "postsThisMonth": number
    }
  }
}
```

---

### 7. Update User Profile
**Endpoint:** `PATCH /user/profile`

**Headers:** `Authorization: Bearer {token}`

**Request Body:**
```json
{
  "name": "string (optional)",
  "email": "string (optional)"
}
```

**Response:** `200 OK`

---

### 8. Update Password
**Endpoint:** `POST /user/password`

**Headers:** `Authorization: Bearer {token}`

**Request Body:**
```json
{
  "currentPassword": "string (required)",
  "newPassword": "string (required, min: 8)"
}
```

**Response:** `200 OK`

---

### 9. Delete Account
**Endpoint:** `DELETE /user/account`

**Headers:** `Authorization: Bearer {token}`

**Response:** `200 OK`

---

## Onboarding Endpoints

### 10. Complete Onboarding
**Endpoint:** `POST /user/onboarding`

**Headers:** `Authorization: Bearer {token}`

**Request Body:**
```json
{
  "niches": ["Gaming", "Tech & Gadgets"],
  "connectedPlatforms": {
    "tiktok": boolean,
    "instagram": boolean,
    "youtube": boolean
  }
}
```

**Response:** `200 OK`

---

## Viral Content Discovery Endpoints

### 11. Get Viral Content
**Endpoint:** `GET /viral-content`

**Headers:** `Authorization: Bearer {token}`

**Query Parameters:**
```
platform: string (optional) - "TikTok" | "Instagram" | "all"
trending: string (optional) - "daily" | "weekly"
region: string (optional) - "US" | "UK" | "Global" | "all"
duration: string (optional) - "0-15" | "15-30" | "30+"
minViews: number (optional) - minimum views filter
search: string (optional) - search query for title/hashtags
page: number (optional, default: 1)
limit: number (optional, default: 20, max: 100)
```

**Response:** `200 OK`
```json
{
  "success": true,
  "data": {
    "videos": [
      {
        "id": "string",
        "title": "string",
        "platform": "TikTok | Instagram",
        "url": "string",
        "thumbnailUrl": "string",
        "hashtags": ["string"],
        "views": number,
        "likes": number,
        "comments": number,
        "shares": number,
        "duration": number (seconds),
        "region": "string",
        "publishedAt": "timestamp",
        "trendingType": "daily | weekly",
        "creatorInfo": {
          "username": "string",
          "followers": number,
          "verified": boolean
        }
      }
    ],
    "pagination": {
      "currentPage": number,
      "totalPages": number,
      "totalItems": number,
      "hasNext": boolean,
      "hasPrev": boolean
    }
  }
}
```

**Integration Notes:**
- Uses Apify for TikTok & Instagram scraping
- Apify Actor for TikTok: `clockworks/tiktok-scraper`
- Apify Actor for Instagram: `apify/instagram-reel-scraper`
- Cache results for 1 hour to reduce API costs
- Update trending videos every 6 hours via cron job

---

### 12. Save Video to Idea Board
**Endpoint:** `POST /viral-content/save`

**Headers:** `Authorization: Bearer {token}`

**Request Body:**
```json
{
  "videoId": "string (required)",
  "notes": "string (optional)"
}
```

**Response:** `201 Created`

---

### 13. Get Saved Videos
**Endpoint:** `GET /viral-content/saved`

**Headers:** `Authorization: Bearer {token}`

**Query Parameters:**
```
page: number (default: 1)
limit: number (default: 20)
```

**Response:** `200 OK` (Similar structure to Get Viral Content)

---

### 14. Delete Saved Video
**Endpoint:** `DELETE /viral-content/saved/{videoId}`

**Headers:** `Authorization: Bearer {token}`

**Response:** `200 OK`

---

## YouTube Shorts Analytics Endpoints

### 15. Analyze YouTube Channel
**Endpoint:** `POST /analytics/channel`

**Headers:** `Authorization: Bearer {token}`

**Request Body:**
```json
{
  "channelUrl": "string (required) - YouTube channel URL",
  "analyzeShorts": boolean (default: true)
}
```

**Response:** `200 OK`
```json
{
  "success": true,
  "data": {
    "channelInfo": {
      "channelId": "string",
      "channelName": "string",
      "channelUrl": "string",
      "subscriberCount": number,
      "totalViews": number,
      "channelCreatedAt": "timestamp"
    },
    "shortsMetrics": {
      "totalShorts": number,
      "avgViews": number,
      "avgLikes": number,
      "avgComments": number,
      "totalViews": number,
      "uploadFrequency": "string (e.g., '3.2 per week')"
    },
    "performanceTrend": [
      {
        "period": "string (e.g., 'Week 1')",
        "avgViews": number,
        "totalUploads": number
      }
    ],
    "outlierVideos": [
      {
        "id": "string",
        "title": "string",
        "url": "string",
        "thumbnailUrl": "string",
        "views": number,
        "likes": number,
        "comments": number,
        "publishedAt": "timestamp",
        "isOutlier": true,
        "outlierScore": number (how many times better than average)
      }
    ],
    "recentVideos": [
      {
        "id": "string",
        "title": "string",
        "url": "string",
        "thumbnailUrl": "string",
        "views": number,
        "likes": number,
        "comments": number,
        "publishedAt": "timestamp",
        "isOutlier": boolean
      }
    ]
  }
}
```

**Integration Notes:**
- Use YouTube Data API v3
- Endpoint: `GET https://www.googleapis.com/youtube/v3/search`
- Filter for: `type=video&videoDuration=short`
- Outlier detection: Videos with views >2x channel average
- Rate limit: 10,000 quota units per day

---

### 16. Get Analysis History
**Endpoint:** `GET /analytics/history`

**Headers:** `Authorization: Bearer {token}`

**Query Parameters:**
```
page: number (default: 1)
limit: number (default: 20)
```

**Response:** `200 OK`
```json
{
  "success": true,
  "data": {
    "analyses": [
      {
        "id": "string",
        "channelName": "string",
        "channelUrl": "string",
        "analyzedAt": "timestamp",
        "summary": {
          "totalShorts": number,
          "avgViews": number,
          "outlierCount": number
        }
      }
    ]
  }
}
```

---

## Advanced Search Endpoints

### 17. Search Creators
**Endpoint:** `GET /search/creators`

**Headers:** `Authorization: Bearer {token}`

**Query Parameters:**
```
minShorts: number (optional) - minimum shorts count
maxShorts: number (optional) - maximum shorts count
minAvgViews: number (optional)
minGrowth: number (optional) - growth percentage
niche: string (optional)
uploadActivity: string (optional) - "daily" | "weekly" | "monthly"
sortBy: string (optional) - "avgViews" | "shorts" | "growth"
page: number (default: 1)
limit: number (default: 20)
```

**Response:** `200 OK`
```json
{
  "success": true,
  "data": {
    "creators": [
      {
        "id": "string",
        "channelId": "string",
        "channelName": "string",
        "channelUrl": "string",
        "thumbnailUrl": "string",
        "niche": "string",
        "subscriberCount": number,
        "totalShorts": number,
        "avgViews": number,
        "growth": "string (e.g., '+15%')",
        "lastUpload": "timestamp",
        "uploadFrequency": "string"
      }
    ],
    "pagination": {
      "currentPage": number,
      "totalPages": number,
      "totalItems": number
    }
  }
}
```

**Integration Notes:**
- Use YouTube Data API v3 for channel data
- Store creator database for faster queries
- Update creator stats daily via cron job

---

## Competitor Finder Endpoints

### 18. Find Similar Competitors
**Endpoint:** `POST /competitors/find`

**Headers:** `Authorization: Bearer {token}`

**Request Body:**
```json
{
  "channelUrl": "string (required)",
  "maxResults": number (optional, default: 10, max: 50)
}
```

**Response:** `200 OK`
```json
{
  "success": true,
  "data": {
    "sourceChannel": {
      "channelId": "string",
      "channelName": "string",
      "channelUrl": "string"
    },
    "analysis": {
      "commonTitles": ["string"],
      "commonDescriptions": ["string"],
      "commonTags": ["string"],
      "transcriptInsights": ["string"]
    },
    "competitors": [
      {
        "id": "string",
        "channelId": "string",
        "channelName": "string",
        "channelUrl": "string",
        "thumbnailUrl": "string",
        "subscriberCount": number,
        "avgViews": number,
        "similarity": number (0-100 percentage),
        "commonTopics": ["string"],
        "matchedTags": ["string"],
        "contentOverlap": number (0-1)
      }
    ]
  }
}
```

**Algorithm Notes:**
- Use TF-IDF (Term Frequency-Inverse Document Frequency) for content similarity
- Extract features from:
  - Video titles
  - Video descriptions
  - Video tags/hashtags
  - Video transcripts (if available)
- Calculate cosine similarity between channel vectors
- Rank by similarity score

**Implementation Steps:**
1. Extract all video metadata from source channel (last 50 videos)
2. Build TF-IDF vectors from titles + descriptions + tags
3. Query similar channels from YouTube API (same niche/category)
4. Calculate similarity scores
5. Return top N most similar channels

**Python Libraries Suggestion:**
```python
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import cosine_similarity
```

---

## Script Tools Endpoints

### 19. Analyze Script
**Endpoint:** `POST /scripts/analyze`

**Headers:** `Authorization: Bearer {token}`

**Request Body:**
```json
{
  "script": "string (required, max: 10000 characters)"
}
```

**Response:** `200 OK`
```json
{
  "success": true,
  "data": {
    "analysis": {
      "hookType": "string (Question Hook | Story Hook | Stat Hook | etc.)",
      "hookScore": number (0-10),
      "pacing": "string (Fast-paced | Medium | Slow)",
      "pacingScore": number (0-10),
      "tone": "string (Energetic & Casual | Professional | etc.)",
      "toneScore": number (0-10),
      "ctaPresence": boolean,
      "ctaStrength": "string (Strong | Moderate | Weak | None)",
      "wordCount": number,
      "readingTime": number (seconds),
      "sentimentScore": number (-1 to 1),
      "strengths": ["string"],
      "retentionIssues": ["string"],
      "suggestions": ["string"]
    }
  }
}
```

**AI Model Notes:**
- Use OpenAI GPT-4 or Claude API for script analysis
- Prompt engineering is crucial for consistent results

**Example Prompt Structure:**
```
Analyze this short-form video script and provide:
1. Hook type and score (0-10)
2. Pacing analysis and score (0-10)
3. Tone description and score (0-10)
4. CTA presence and strength
5. List 4 strengths
6. List 3 retention issues
7. List 4 improvement suggestions

Script:
{user_script}

Respond in JSON format.
```

---

### 20. Rewrite Script
**Endpoint:** `POST /scripts/rewrite`

**Headers:** `Authorization: Bearer {token}`

**Request Body:**
```json
{
  "originalScript": "string (required)",
  "referenceChannel": "string (required) - YouTube channel URL or @handle",
  "targetTone": "string (optional) - 'casual' | 'professional' | 'energetic'",
  "targetLength": "string (optional) - 'shorter' | 'same' | 'longer'"
}
```

**Response:** `200 OK`
```json
{
  "success": true,
  "data": {
    "rewrittenScript": "string",
    "styleAnalysis": {
      "toneAdjustments": ["string"],
      "structureChanges": ["string"],
      "referenceChannelStyle": {
        "tone": "string",
        "avgPacing": "string",
        "commonPatterns": ["string"]
      }
    }
  }
}
```

**AI Implementation:**
1. Fetch reference channel's top 10 videos via YouTube API
2. Extract transcripts using YouTube Transcript API
3. Analyze style patterns with AI
4. Rewrite user script to match reference style

**Example AI Prompt:**
```
Reference Channel Style Analysis:
{extracted_style_patterns}

Original Script:
{original_script}

Rewrite the script to match the reference channel's style while maintaining the original message and key points. Match their tone, pacing, and delivery patterns.
```

---

### 21. Save Script
**Endpoint:** `POST /scripts/save`

**Headers:** `Authorization: Bearer {token}`

**Request Body:**
```json
{
  "title": "string (required)",
  "content": "string (required)",
  "type": "original | analyzed | rewritten",
  "analysis": object (optional) - analysis results if applicable,
  "referenceChannel": "string (optional)"
}
```

**Response:** `201 Created`

---

### 22. Get Saved Scripts
**Endpoint:** `GET /scripts/saved`

**Headers:** `Authorization: Bearer {token}`

**Query Parameters:**
```
page: number (default: 1)
limit: number (default: 20)
type: string (optional) - filter by type
```

**Response:** `200 OK`
```json
{
  "success": true,
  "data": {
    "scripts": [
      {
        "id": "string",
        "title": "string",
        "content": "string",
        "type": "string",
        "createdAt": "timestamp",
        "analysis": object (if analyzed),
        "referenceChannel": "string (if rewritten)"
      }
    ]
  }
}
```

---

## Manual Posting Endpoints

### 23. Connect Platform Account
**Endpoint:** `POST /posting/connect/{platform}`

**Headers:** `Authorization: Bearer {token}`

**Path Parameters:**
- `platform`: "tiktok" | "instagram" | "youtube"

**Request Body:**
```json
{
  "accessToken": "string (OAuth access token from platform)",
  "refreshToken": "string (optional)",
  "expiresIn": number (optional)
}
```

**Response:** `200 OK`
```json
{
  "success": true,
  "data": {
    "platform": "string",
    "connected": true,
    "username": "string",
    "connectedAt": "timestamp"
  }
}
```

**Integration Notes:**

**TikTok:**
- Use TikTok for Developers API
- OAuth 2.0 flow
- Endpoint: `https://open-api.tiktok.com/share/video/upload/`

**Instagram:**
- Use Instagram Graph API
- Requires Facebook Business Account
- Endpoint: `POST /{ig-user-id}/media`

**YouTube:**
- Use YouTube Data API v3
- OAuth 2.0 flow
- Endpoint: `POST https://www.googleapis.com/upload/youtube/v3/videos`

---

### 24. Disconnect Platform Account
**Endpoint:** `DELETE /posting/disconnect/{platform}`

**Headers:** `Authorization: Bearer {token}`

**Response:** `200 OK`

---

### 25. Upload Video
**Endpoint:** `POST /posting/upload`

**Headers:** 
```
Authorization: Bearer {token}
Content-Type: multipart/form-data
```

**Request Body (Form Data):**
```
video: File (required, max: 500MB, formats: mp4, mov)
caption: string (optional)
hashtags: string (optional, comma-separated)
platforms: array of strings (required) - ["tiktok", "instagram", "youtube"]
scheduledAt: timestamp (optional) - for scheduled posting
```

**Response:** `202 Accepted`
```json
{
  "success": true,
  "data": {
    "postId": "string",
    "status": "processing | scheduled",
    "platforms": ["tiktok", "instagram", "youtube"],
    "scheduledAt": "timestamp (if scheduled)"
  }
}
```

**Implementation Notes:**
- Upload video to cloud storage (AWS S3, Google Cloud Storage)
- Process video in background job queue (Redis/Bull)
- Validate video format, duration, size per platform requirements
- Transcode if necessary (FFmpeg)

**Platform Requirements:**
```
TikTok: MP4/MOV, 3s-10min, max 287.6MB, 9:16 recommended
Instagram: MP4/MOV, 3s-90s, max 100MB, 9:16 or 1:1
YouTube: MP4/MOV, <60s for Shorts, max 256GB, 9:16 recommended
```

---

### 26. Get Post Status
**Endpoint:** `GET /posting/status/{postId}`

**Headers:** `Authorization: Bearer {token}`

**Response:** `200 OK`
```json
{
  "success": true,
  "data": {
    "postId": "string",
    "status": "processing | publishing | published | failed",
    "platforms": [
      {
        "platform": "tiktok",
        "status": "published | failed | pending",
        "postUrl": "string (if published)",
        "error": "string (if failed)"
      }
    ],
    "createdAt": "timestamp",
    "publishedAt": "timestamp (if completed)"
  }
}
```

---

### 27. Get Post History
**Endpoint:** `GET /posting/history`

**Headers:** `Authorization: Bearer {token}`

**Query Parameters:**
```
page: number (default: 1)
limit: number (default: 20)
status: string (optional) - filter by status
platform: string (optional) - filter by platform
```

**Response:** `200 OK`
```json
{
  "success": true,
  "data": {
    "posts": [
      {
        "id": "string",
        "caption": "string",
        "platforms": ["string"],
        "status": "string",
        "createdAt": "timestamp",
        "videoUrl": "string (cloud storage URL)",
        "thumbnailUrl": "string"
      }
    ]
  }
}
```

---

## Billing & Subscription Endpoints

### 28. Get Subscription Info
**Endpoint:** `GET /billing/subscription`

**Headers:** `Authorization: Bearer {token}`

**Response:** `200 OK`
```json
{
  "success": true,
  "data": {
    "subscription": {
      "id": "string",
      "plan": "Free | Pro | Agency",
      "status": "active | cancelled | past_due | expired",
      "currentPeriodStart": "timestamp",
      "currentPeriodEnd": "timestamp",
      "cancelAtPeriodEnd": boolean,
      "billingCycle": "monthly | yearly",
      "amount": number,
      "currency": "USD"
    },
    "paymentMethod": {
      "type": "card",
      "last4": "string",
      "brand": "visa | mastercard | amex",
      "expiryMonth": number,
      "expiryYear": number
    },
    "usage": {
      "viralContentQueries": number,
      "analyticsQueries": number,
      "scriptAnalyses": number,
      "postsThisMonth": number,
      "limits": {
        "viralContentQueries": number | null (null = unlimited),
        "analyticsQueries": number | null,
        "scriptAnalyses": number | null
      }
    }
  }
}
```

---

### 29. Create Checkout Session
**Endpoint:** `POST /billing/checkout`

**Headers:** `Authorization: Bearer {token}`

**Request Body:**
```json
{
  "plan": "Pro | Agency",
  "billingCycle": "monthly | yearly",
  "successUrl": "string (return URL after success)",
  "cancelUrl": "string (return URL if cancelled)"
}
```

**Response:** `200 OK`
```json
{
  "success": true,
  "data": {
    "sessionId": "string (Stripe session ID)",
    "checkoutUrl": "string (redirect user to this URL)"
  }
}
```

**Stripe Integration:**
```javascript
// Backend (Node.js example)
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

const session = await stripe.checkout.sessions.create({
  customer: stripeCustomerId,
  payment_method_types: ['card'],
  line_items: [{
    price: priceId, // 'price_xxx' from Stripe Dashboard
    quantity: 1,
  }],
  mode: 'subscription',
  success_url: successUrl,
  cancel_url: cancelUrl,
});
```

---

### 30. Update Subscription
**Endpoint:** `PATCH /billing/subscription`

**Headers:** `Authorization: Bearer {token}`

**Request Body:**
```json
{
  "plan": "Pro | Agency | Free" (optional),
  "billingCycle": "monthly | yearly" (optional)
}
```

**Response:** `200 OK`

---

### 31. Cancel Subscription
**Endpoint:** `POST /billing/subscription/cancel`

**Headers:** `Authorization: Bearer {token}`

**Request Body:**
```json
{
  "cancelAtPeriodEnd": boolean (default: true),
  "reason": "string (optional)"
}
```

**Response:** `200 OK`

---

### 32. Update Payment Method
**Endpoint:** `POST /billing/payment-method`

**Headers:** `Authorization: Bearer {token}`

**Request Body:**
```json
{
  "paymentMethodId": "string (Stripe PaymentMethod ID)"
}
```

**Response:** `200 OK`

**Implementation:**
- Use Stripe Elements on frontend to collect card details
- Create PaymentMethod on frontend
- Send PaymentMethod ID to backend
- Attach to Stripe Customer

---

### 33. Get Billing History
**Endpoint:** `GET /billing/history`

**Headers:** `Authorization: Bearer {token}`

**Query Parameters:**
```
page: number (default: 1)
limit: number (default: 20)
```

**Response:** `200 OK`
```json
{
  "success": true,
  "data": {
    "invoices": [
      {
        "id": "string",
        "invoiceNumber": "string",
        "date": "timestamp",
        "amount": number,
        "currency": "string",
        "status": "paid | pending | failed",
        "invoiceUrl": "string (Stripe hosted invoice)",
        "pdfUrl": "string"
      }
    ]
  }
}
```

---

### 34. Download Invoice
**Endpoint:** `GET /billing/invoice/{invoiceId}/download`

**Headers:** `Authorization: Bearer {token}`

**Response:** PDF file or redirect to Stripe hosted invoice

---

## Webhook Endpoints (No Authentication)

### 35. Stripe Webhook
**Endpoint:** `POST /webhooks/stripe`

**Headers:**
```
stripe-signature: string (verify webhook signature)
```

**Events to Handle:**
```
- customer.subscription.created
- customer.subscription.updated
- customer.subscription.deleted
- invoice.paid
- invoice.payment_failed
- checkout.session.completed
```

**Implementation:**
```javascript
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

app.post('/webhooks/stripe', express.raw({type: 'application/json'}), async (req, res) => {
  const sig = req.headers['stripe-signature'];
  
  try {
    const event = stripe.webhooks.constructEvent(
      req.body,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET
    );
    
    // Handle event
    switch (event.type) {
      case 'customer.subscription.updated':
        // Update user subscription in database
        break;
      case 'invoice.paid':
        // Record payment
        break;
      // ... other cases
    }
    
    res.json({received: true});
  } catch (err) {
    res.status(400).send(`Webhook Error: ${err.message}`);
  }
});
```

---

## Rate Limiting

### General Rate Limits
```
Free Plan:
- 100 requests/hour
- 1000 requests/day

Pro Plan:
- 500 requests/hour
- 10000 requests/day

Agency Plan:
- 2000 requests/hour
- 50000 requests/day
```

### Specific Endpoint Limits
```
POST /scripts/analyze: 
  - Free: 3/day
  - Pro: Unlimited
  
POST /analytics/channel:
  - Free: 5/month
  - Pro: Unlimited

GET /viral-content:
  - Free: 20/day
  - Pro: Unlimited
```

---

## Database Schema Suggestions

### Users Table
```sql
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  email VARCHAR(255) UNIQUE NOT NULL,
  name VARCHAR(255) NOT NULL,
  password_hash VARCHAR(255),
  google_id VARCHAR(255),
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW(),
  onboarding_completed BOOLEAN DEFAULT FALSE
);
```

### User Niches Table
```sql
CREATE TABLE user_niches (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  niche VARCHAR(100) NOT NULL
);
```

### Platform Connections Table
```sql
CREATE TABLE platform_connections (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  platform VARCHAR(50) NOT NULL,
  access_token TEXT,
  refresh_token TEXT,
  token_expires_at TIMESTAMP,
  username VARCHAR(255),
  platform_user_id VARCHAR(255),
  connected_at TIMESTAMP DEFAULT NOW(),
  UNIQUE(user_id, platform)
);
```

### Subscriptions Table
```sql
CREATE TABLE subscriptions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  stripe_customer_id VARCHAR(255),
  stripe_subscription_id VARCHAR(255),
  plan VARCHAR(50) NOT NULL,
  status VARCHAR(50) NOT NULL,
  current_period_start TIMESTAMP,
  current_period_end TIMESTAMP,
  cancel_at_period_end BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);
```

### Saved Videos Table
```sql
CREATE TABLE saved_videos (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  platform VARCHAR(50) NOT NULL,
  video_id VARCHAR(255) NOT NULL,
  title TEXT,
  url TEXT,
  thumbnail_url TEXT,
  views BIGINT,
  likes BIGINT,
  notes TEXT,
  saved_at TIMESTAMP DEFAULT NOW()
);
```

### Scripts Table
```sql
CREATE TABLE scripts (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  title VARCHAR(255) NOT NULL,
  content TEXT NOT NULL,
  type VARCHAR(50),
  analysis JSONB,
  reference_channel VARCHAR(255),
  created_at TIMESTAMP DEFAULT NOW()
);
```

### Channel Analyses Table
```sql
CREATE TABLE channel_analyses (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  channel_id VARCHAR(255) NOT NULL,
  channel_name VARCHAR(255),
  channel_url TEXT,
  analysis_data JSONB NOT NULL,
  analyzed_at TIMESTAMP DEFAULT NOW()
);
```

### Posts Table
```sql
CREATE TABLE posts (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  caption TEXT,
  video_url TEXT,
  thumbnail_url TEXT,
  platforms JSONB,
  status VARCHAR(50),
  scheduled_at TIMESTAMP,
  created_at TIMESTAMP DEFAULT NOW(),
  published_at TIMESTAMP
);
```

### Invoices Table
```sql
CREATE TABLE invoices (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  stripe_invoice_id VARCHAR(255),
  invoice_number VARCHAR(255),
  amount DECIMAL(10,2),
  currency VARCHAR(3),
  status VARCHAR(50),
  invoice_url TEXT,
  pdf_url TEXT,
  created_at TIMESTAMP DEFAULT NOW()
);
```

---

## Environment Variables

```bash
# Server
NODE_ENV=production
PORT=3000
API_BASE_URL=https://api.yourplatform.com

# Database
DATABASE_URL=postgresql://user:password@localhost:5432/creator_platform
REDIS_URL=redis://localhost:6379

# JWT
JWT_SECRET=your-jwt-secret-key
JWT_EXPIRES_IN=7d
REFRESH_TOKEN_SECRET=your-refresh-token-secret
REFRESH_TOKEN_EXPIRES_IN=30d

# OAuth - Google
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret

# Stripe
STRIPE_SECRET_KEY=sk_test_xxx
STRIPE_PUBLISHABLE_KEY=pk_test_xxx
STRIPE_WEBHOOK_SECRET=whsec_xxx
STRIPE_PRICE_PRO_MONTHLY=price_xxx
STRIPE_PRICE_PRO_YEARLY=price_xxx
STRIPE_PRICE_AGENCY_MONTHLY=price_xxx
STRIPE_PRICE_AGENCY_YEARLY=price_xxx

# YouTube API
YOUTUBE_API_KEY=your-youtube-api-key

# Apify (for viral content scraping)
APIFY_API_TOKEN=your-apify-token

# OpenAI (for script analysis)
OPENAI_API_KEY=sk-xxx

# TikTok API
TIKTOK_CLIENT_KEY=your-tiktok-client-key
TIKTOK_CLIENT_SECRET=your-tiktok-client-secret

# Instagram/Facebook API
FACEBOOK_APP_ID=your-facebook-app-id
FACEBOOK_APP_SECRET=your-facebook-app-secret

# Cloud Storage (AWS S3)
AWS_ACCESS_KEY_ID=your-aws-access-key
AWS_SECRET_ACCESS_KEY=your-aws-secret-key
AWS_S3_BUCKET=your-bucket-name
AWS_REGION=us-east-1

# Email (optional - for notifications)
SENDGRID_API_KEY=your-sendgrid-key
FROM_EMAIL=noreply@yourplatform.com
```

---

## Third-Party API Integration Details

### 1. Apify - Viral Content Scraping

**TikTok Scraper:**
```javascript
const ApifyClient = require('apify-client');
const client = new ApifyClient({ token: process.env.APIFY_API_TOKEN });

const input = {
  "hashtags": ["fyp", "viral"],
  "resultsPerPage": 20,
  "shouldDownloadVideos": false,
  "shouldDownloadCovers": true
};

const run = await client.actor("clockworks/tiktok-scraper").call(input);
const { items } = await client.dataset(run.defaultDatasetId).listItems();
```

**Instagram Scraper:**
```javascript
const input = {
  "directUrls": ["https://www.instagram.com/p/xxxxx/"],
  "resultsLimit": 20
};

const run = await client.actor("apify/instagram-reel-scraper").call(input);
```

### 2. YouTube Data API

**Get Channel Videos:**
```
GET https://www.googleapis.com/youtube/v3/search?
  part=snippet&
  channelId={channelId}&
  type=video&
  videoDuration=short&
  maxResults=50&
  order=date&
  key={API_KEY}
```

**Get Video Stats:**
```
GET https://www.googleapis.com/youtube/v3/videos?
  part=statistics,contentDetails&
  id={videoId1,videoId2}&
  key={API_KEY}
```

### 3. OpenAI - Script Analysis

```javascript
const { Configuration, OpenAIApi } = require("openai");

const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});
const openai = new OpenAIApi(configuration);

const completion = await openai.createChatCompletion({
  model: "gpt-4",
  messages: [
    {
      role: "system",
      content: "You are an expert in analyzing short-form video scripts..."
    },
    {
      role: "user",
      content: `Analyze this script: ${userScript}`
    }
  ],
  temperature: 0.7,
});

const analysis = JSON.parse(completion.data.choices[0].message.content);
```

### 4. Stripe - Billing

**Create Customer:**
```javascript
const customer = await stripe.customers.create({
  email: user.email,
  name: user.name,
  metadata: {
    userId: user.id
  }
});
```

**Create Subscription:**
```javascript
const subscription = await stripe.subscriptions.create({
  customer: customerId,
  items: [{ price: priceId }],
  payment_behavior: 'default_incomplete',
  expand: ['latest_invoice.payment_intent'],
});
```

---

## Cron Jobs / Background Tasks

### Daily Tasks
```
- Update viral trending content (every 6 hours)
- Update creator statistics (once per day at 2 AM)
- Clean up expired sessions
- Process scheduled posts
```

### Weekly Tasks
```
- Generate weekly analytics reports
- Clean up old analysis data (>90 days)
- Update competitor similarity scores
```

### Monthly Tasks
```
- Generate monthly usage reports for billing
- Archive old invoices
```

**Example (Node.js with node-cron):**
```javascript
const cron = require('node-cron');

// Update viral content every 6 hours
cron.schedule('0 */6 * * *', async () => {
  await updateViralContent();
});

// Process scheduled posts every 5 minutes
cron.schedule('*/5 * * * *', async () => {
  await processScheduledPosts();
});
```

---

## Security Best Practices

1. **Authentication:**
   - Use bcrypt for password hashing (cost factor: 10-12)
   - Implement JWT with short expiration (7 days max)
   - Use refresh tokens for long-term sessions
   - Implement OAuth 2.0 for social logins

2. **API Security:**
   - Validate all inputs (use libraries like Joi, Yup)
   - Sanitize user inputs to prevent XSS/SQL injection
   - Implement CORS properly
   - Use helmet.js for security headers
   - Rate limiting per IP and per user
   - API key rotation for third-party services

3. **Data Protection:**
   - Encrypt sensitive data at rest
   - Use HTTPS/TLS for all API communications
   - Store access tokens encrypted in database
   - Never log sensitive information

4. **Stripe Security:**
   - Verify webhook signatures
   - Use Stripe's test mode in development
   - Never expose secret keys in frontend
   - Implement idempotency keys for payment requests

---

## Testing Endpoints

### Test Accounts (Development Only)
```
Email: test@example.com
Password: Test1234!

Plans: Free, Pro (Stripe test card: 4242 4242 4242 4242)
```

### Postman Collection
A complete Postman collection will be provided separately with:
- Pre-configured environment variables
- All endpoints with example requests
- Authentication flows
- Mock responses

---

## Support & Contact

For backend implementation questions, please contact:
- Technical Lead: [email]
- Documentation: [link to full docs]
- API Status: [status page]

---

**Last Updated:** December 18, 2024
**API Version:** 1.0
**Document Version:** 1.0
