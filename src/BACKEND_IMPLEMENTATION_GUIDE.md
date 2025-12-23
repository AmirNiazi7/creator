# Backend Implementation Guide - Technical Details

## Table of Contents
1. [Request/Response Payloads](#request-response-payloads)
2. [Validation Schemas](#validation-schemas)
3. [Error Handling](#error-handling)
4. [Code Examples](#code-examples)
5. [Database Queries](#database-queries)
6. [Middleware](#middleware)
7. [Testing](#testing)
8. [Deployment](#deployment)

---

## Request/Response Payloads

### Authentication Payloads

#### POST /auth/register

**Request Validation:**
```javascript
{
  "name": {
    "type": "string",
    "required": true,
    "minLength": 2,
    "maxLength": 100,
    "pattern": "^[a-zA-Z\\s'-]+$",
    "trim": true
  },
  "email": {
    "type": "string",
    "required": true,
    "format": "email",
    "lowercase": true,
    "trim": true,
    "maxLength": 255
  },
  "password": {
    "type": "string",
    "required": true,
    "minLength": 8,
    "maxLength": 128,
    "pattern": "^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d).+$",
    "description": "Must contain at least one uppercase, one lowercase, and one number"
  }
}
```

**Success Response (201):**
```json
{
  "success": true,
  "data": {
    "user": {
      "id": "550e8400-e29b-41d4-a716-446655440000",
      "name": "John Doe",
      "email": "john@example.com",
      "emailVerified": false,
      "subscription": {
        "plan": "Free",
        "status": "active"
      },
      "createdAt": "2024-12-18T10:30:00.000Z",
      "updatedAt": "2024-12-18T10:30:00.000Z"
    },
    "tokens": {
      "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
      "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
      "expiresIn": 604800,
      "tokenType": "Bearer"
    }
  },
  "meta": {
    "timestamp": "2024-12-18T10:30:00.000Z",
    "requestId": "req_1234567890"
  }
}
```

**Error Response (400 - Validation Error):**
```json
{
  "success": false,
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Validation failed",
    "details": [
      {
        "field": "password",
        "message": "Password must contain at least one uppercase letter",
        "value": "weakpass"
      },
      {
        "field": "email",
        "message": "Invalid email format",
        "value": "notanemail"
      }
    ]
  },
  "meta": {
    "timestamp": "2024-12-18T10:30:00.000Z",
    "requestId": "req_1234567890"
  }
}
```

**Error Response (409 - Email Already Exists):**
```json
{
  "success": false,
  "error": {
    "code": "EMAIL_EXISTS",
    "message": "An account with this email already exists",
    "statusCode": 409
  },
  "meta": {
    "timestamp": "2024-12-18T10:30:00.000Z",
    "requestId": "req_1234567890"
  }
}
```

---

#### POST /auth/login

**Request Body:**
```json
{
  "email": "john@example.com",
  "password": "MySecurePass123",
  "rememberMe": true
}
```

**Success Response (200):**
```json
{
  "success": true,
  "data": {
    "user": {
      "id": "550e8400-e29b-41d4-a716-446655440000",
      "name": "John Doe",
      "email": "john@example.com",
      "emailVerified": true,
      "avatar": "https://storage.example.com/avatars/user123.jpg",
      "subscription": {
        "plan": "Pro",
        "status": "active",
        "currentPeriodEnd": "2025-01-18T10:30:00.000Z"
      },
      "onboardingCompleted": true,
      "createdAt": "2024-11-18T10:30:00.000Z"
    },
    "tokens": {
      "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
      "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
      "expiresIn": 604800,
      "tokenType": "Bearer"
    }
  }
}
```

**Error Response (401 - Invalid Credentials):**
```json
{
  "success": false,
  "error": {
    "code": "INVALID_CREDENTIALS",
    "message": "Invalid email or password",
    "statusCode": 401
  }
}
```

**Error Response (403 - Account Locked):**
```json
{
  "success": false,
  "error": {
    "code": "ACCOUNT_LOCKED",
    "message": "Your account has been locked due to too many failed login attempts. Please try again in 30 minutes.",
    "statusCode": 403,
    "lockedUntil": "2024-12-18T11:00:00.000Z"
  }
}
```

---

### Viral Content Payloads

#### GET /viral-content

**Request Query Parameters:**
```
GET /viral-content?platform=TikTok&trending=daily&region=US&minViews=1000000&page=1&limit=20&search=dance
```

**Full Success Response (200):**
```json
{
  "success": true,
  "data": {
    "videos": [
      {
        "id": "vid_7234567890123456789",
        "platform": "TikTok",
        "title": "POV: When you finally master that dance trend",
        "description": "This took me 100 tries but I finally got it! #dance #fyp",
        "url": "https://www.tiktok.com/@user/video/7234567890123456789",
        "thumbnailUrl": "https://cdn.example.com/thumbnails/vid123.jpg",
        "videoUrl": "https://cdn.example.com/videos/vid123.mp4",
        "hashtags": [
          "#fyp",
          "#dance",
          "#trending",
          "#viral",
          "#foryou"
        ],
        "metrics": {
          "views": 3200000,
          "likes": 450000,
          "comments": 12500,
          "shares": 78000,
          "saves": 32000,
          "engagementRate": 17.8
        },
        "duration": 15,
        "aspectRatio": "9:16",
        "region": "US",
        "language": "en",
        "publishedAt": "2024-12-17T15:30:00.000Z",
        "scrapedAt": "2024-12-18T08:00:00.000Z",
        "trendingType": "daily",
        "trendingRank": 1,
        "creator": {
          "id": "user_123456",
          "username": "dancequeen",
          "displayName": "Dance Queen 👑",
          "avatarUrl": "https://cdn.example.com/avatars/user123.jpg",
          "followers": 2500000,
          "verified": true,
          "profileUrl": "https://www.tiktok.com/@dancequeen"
        },
        "music": {
          "title": "Trending Sound 2024",
          "artist": "DJ Mix",
          "url": "https://music.example.com/sound123"
        },
        "isSaved": false
      }
    ],
    "pagination": {
      "currentPage": 1,
      "totalPages": 25,
      "totalItems": 500,
      "itemsPerPage": 20,
      "hasNext": true,
      "hasPrev": false
    },
    "filters": {
      "platform": "TikTok",
      "trending": "daily",
      "region": "US",
      "minViews": 1000000,
      "search": "dance"
    }
  },
  "meta": {
    "timestamp": "2024-12-18T10:30:00.000Z",
    "requestId": "req_1234567890",
    "cacheHit": true,
    "cacheAge": 1800
  }
}
```

---

#### POST /viral-content/save

**Request Body:**
```json
{
  "videoId": "vid_7234567890123456789",
  "platform": "TikTok",
  "notes": "Great hook in the first 3 seconds. Notice the pattern interrupt at 0:08",
  "tags": ["inspiration", "hook-ideas", "dance"]
}
```

**Success Response (201):**
```json
{
  "success": true,
  "data": {
    "savedVideo": {
      "id": "saved_550e8400-e29b-41d4-a716",
      "videoId": "vid_7234567890123456789",
      "platform": "TikTok",
      "title": "POV: When you finally master that dance trend",
      "url": "https://www.tiktok.com/@user/video/7234567890123456789",
      "thumbnailUrl": "https://cdn.example.com/thumbnails/vid123.jpg",
      "notes": "Great hook in the first 3 seconds. Notice the pattern interrupt at 0:08",
      "tags": ["inspiration", "hook-ideas", "dance"],
      "savedAt": "2024-12-18T10:30:00.000Z"
    }
  }
}
```

---

### YouTube Analytics Payloads

#### POST /analytics/channel

**Request Body:**
```json
{
  "channelUrl": "https://www.youtube.com/@TechReviewsDaily",
  "analyzeShorts": true,
  "includeTrends": true,
  "dateRange": {
    "start": "2024-11-01",
    "end": "2024-12-18"
  }
}
```

**Success Response (200):**
```json
{
  "success": true,
  "data": {
    "channelInfo": {
      "channelId": "UC1234567890abcdef",
      "channelName": "Tech Reviews Daily",
      "channelUrl": "https://www.youtube.com/@TechReviewsDaily",
      "customUrl": "@TechReviewsDaily",
      "description": "Daily tech reviews and unboxings",
      "thumbnailUrl": "https://yt3.ggpht.com/...",
      "bannerUrl": "https://yt3.ggpht.com/...",
      "subscriberCount": 850000,
      "totalViews": 125000000,
      "totalVideos": 547,
      "channelCreatedAt": "2020-03-15T10:00:00.000Z",
      "country": "US",
      "verified": true
    },
    "shortsMetrics": {
      "totalShorts": 47,
      "avgViews": 245000,
      "medianViews": 180000,
      "avgLikes": 15200,
      "avgComments": 450,
      "avgEngagementRate": 6.3,
      "totalViews": 11515000,
      "uploadFrequency": {
        "perWeek": 3.2,
        "perMonth": 14,
        "description": "3.2 per week"
      },
      "bestPostingTimes": [
        {
          "day": "Tuesday",
          "hour": 15,
          "avgViews": 320000
        },
        {
          "day": "Friday",
          "hour": 18,
          "avgViews": 290000
        }
      ]
    },
    "performanceTrend": [
      {
        "period": "Week 1",
        "dateRange": "2024-11-01 to 2024-11-07",
        "avgViews": 180000,
        "totalUploads": 3,
        "topVideo": {
          "title": "iPhone 15 Review",
          "views": 310000
        }
      },
      {
        "period": "Week 2",
        "dateRange": "2024-11-08 to 2024-11-14",
        "avgViews": 220000,
        "totalUploads": 4,
        "topVideo": {
          "title": "Samsung vs iPhone",
          "views": 420000
        }
      }
    ],
    "outlierDetection": {
      "threshold": 490000,
      "method": "2x average",
      "outlierCount": 3
    },
    "outlierVideos": [
      {
        "id": "vid_abc123",
        "videoId": "dQw4w9WgXcQ",
        "title": "iPhone 15 Pro Review - Worth It?",
        "description": "Full in-depth review of the iPhone 15 Pro...",
        "url": "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
        "thumbnailUrl": "https://i.ytimg.com/vi/dQw4w9WgXcQ/maxresdefault.jpg",
        "duration": 58,
        "publishedAt": "2024-12-15T10:00:00.000Z",
        "metrics": {
          "views": 780000,
          "likes": 45000,
          "dislikes": null,
          "comments": 2300,
          "favorites": 0,
          "viewsPerHour": 8500,
          "likeRatio": 5.8
        },
        "isOutlier": true,
        "outlierScore": 3.18,
        "outlierReason": "3.18x better than channel average (245,000 views)",
        "tags": ["iphone", "review", "tech", "apple", "iphone15pro"],
        "category": "Science & Technology",
        "hasClosedCaptions": true
      }
    ],
    "recentVideos": [
      {
        "id": "vid_def456",
        "videoId": "abc123xyz",
        "title": "Top 5 Budget Phones 2024",
        "url": "https://www.youtube.com/watch?v=abc123xyz",
        "thumbnailUrl": "https://i.ytimg.com/vi/abc123xyz/maxresdefault.jpg",
        "duration": 45,
        "publishedAt": "2024-12-11T14:00:00.000Z",
        "metrics": {
          "views": 520000,
          "likes": 32000,
          "comments": 1800
        },
        "isOutlier": true,
        "outlierScore": 2.12
      },
      {
        "id": "vid_ghi789",
        "videoId": "xyz789abc",
        "title": "Samsung Galaxy S24 Unboxing",
        "url": "https://www.youtube.com/watch?v=xyz789abc",
        "thumbnailUrl": "https://i.ytimg.com/vi/xyz789abc/maxresdefault.jpg",
        "duration": 42,
        "publishedAt": "2024-12-04T12:00:00.000Z",
        "metrics": {
          "views": 310000,
          "likes": 21000,
          "comments": 950
        },
        "isOutlier": false,
        "outlierScore": 1.27
      }
    ],
    "insights": [
      "Channel uploads 3.2 Shorts per week on average",
      "Best performing day: Tuesday at 3 PM",
      "3 videos performing 2x+ better than average",
      "Engagement rate: 6.3% (above average for tech niche)",
      "Review videos get 40% more views than unboxings"
    ],
    "analyzedAt": "2024-12-18T10:30:00.000Z",
    "dataFreshness": "real-time"
  }
}
```

---

### Script Analysis Payloads

#### POST /scripts/analyze

**Request Body:**
```json
{
  "script": "Are you making these mistakes with your morning routine? I used to wake up tired every single day until I discovered this simple 5-minute hack. In today's video, I'm sharing the exact routine that changed my life. First, instead of hitting snooze, I immediately drink a full glass of water. This kickstarts my metabolism and wakes up my brain. Then, I spend just 2 minutes doing light stretching. Nothing crazy - just some basic movements to get the blood flowing. The game-changer? I write down 3 things I'm grateful for. Sounds cheesy, but it completely shifts my mindset. Finally, I take a cold shower for 30 seconds. Yes, it sucks at first, but you feel AMAZING after. Try this for just one week and let me know how it goes in the comments. And if you want more productivity tips, make sure to subscribe!",
  "targetPlatform": "YouTube Shorts",
  "targetAudience": "productivity enthusiasts, 18-35",
  "analyzeDepth": "comprehensive"
}
```

**Success Response (200):**
```json
{
  "success": true,
  "data": {
    "scriptMetrics": {
      "wordCount": 157,
      "characterCount": 892,
      "estimatedDuration": 52,
      "readingLevel": "8th grade",
      "readabilityScore": 72.5,
      "sentenceCount": 15,
      "avgWordsPerSentence": 10.5
    },
    "hookAnalysis": {
      "hookType": "Question Hook",
      "hookScore": 8.5,
      "hookText": "Are you making these mistakes with your morning routine?",
      "hookLength": 8,
      "hookStrengths": [
        "Opens with a question to create curiosity",
        "Uses word 'mistakes' which triggers fear of missing out",
        "Immediately addresses viewer's pain point",
        "Creates relatability with 'your morning routine'"
      ],
      "hookWeaknesses": [
        "Could be more specific (which mistakes?)",
        "Somewhat generic phrasing"
      ],
      "suggestions": [
        "Consider: '5 Morning Routine Mistakes Keeping You Tired All Day'",
        "Try: 'Still Tired After 8 Hours Sleep? You're Making These 3 Mistakes'"
      ]
    },
    "structureAnalysis": {
      "hasHook": true,
      "hasIntro": true,
      "hasBody": true,
      "hasCTA": true,
      "structure": [
        {
          "section": "Hook",
          "duration": "0-3 seconds",
          "content": "Are you making these mistakes with your morning routine?"
        },
        {
          "section": "Problem Identification",
          "duration": "3-8 seconds",
          "content": "I used to wake up tired every single day..."
        },
        {
          "section": "Solution Promise",
          "duration": "8-12 seconds",
          "content": "...until I discovered this simple 5-minute hack"
        },
        {
          "section": "Value Delivery",
          "duration": "12-45 seconds",
          "content": "Step-by-step breakdown of the routine"
        },
        {
          "section": "Call to Action",
          "duration": "45-52 seconds",
          "content": "Try this for just one week..."
        }
      ],
      "structureScore": 9.0,
      "structureStrengths": [
        "Clear hook → problem → solution → value → CTA flow",
        "Natural transitions between sections",
        "Maintains viewer interest throughout"
      ]
    },
    "pacingAnalysis": {
      "pacing": "Fast-paced",
      "pacingScore": 9.0,
      "wordsPerSecond": 3.0,
      "sentencePacing": "varied",
      "patternInterrupts": [
        {
          "timestamp": "15 seconds",
          "type": "Rhetorical Question",
          "text": "The game-changer?"
        },
        {
          "timestamp": "35 seconds",
          "type": "Emphasis",
          "text": "Yes, it sucks at first, but you feel AMAZING after"
        }
      ],
      "pacingStrengths": [
        "Maintains momentum with short, punchy sentences",
        "Good use of pattern interrupts to maintain attention",
        "Varied sentence length prevents monotony"
      ],
      "suggestions": [
        "Consider adding one more pattern interrupt around 25-second mark"
      ]
    },
    "toneAnalysis": {
      "tone": "Energetic & Casual",
      "toneScore": 8.0,
      "toneAttributes": [
        "conversational",
        "relatable",
        "motivational",
        "authentic"
      ],
      "personalPronouns": {
        "firstPerson": 8,
        "secondPerson": 6,
        "ratio": "balanced"
      },
      "emotionalTriggers": [
        "pain point (waking up tired)",
        "transformation (changed my life)",
        "achievability (simple 5-minute hack)",
        "social proof (try for one week)"
      ],
      "toneStrengths": [
        "Authentic voice with personal story",
        "Good balance of 'I' and 'you' pronouns",
        "Casual language makes it relatable",
        "Motivational without being preachy"
      ]
    },
    "ctaAnalysis": {
      "ctaPresence": true,
      "ctaStrength": "Strong",
      "ctaScore": 8.5,
      "ctaType": "Dual CTA",
      "primaryCTA": "Try this for just one week and let me know how it goes in the comments",
      "secondaryCTA": "if you want more productivity tips, make sure to subscribe",
      "ctaStrengths": [
        "Clear action (try for one week)",
        "Low commitment threshold (just one week)",
        "Encourages engagement (comment results)",
        "Value-driven subscribe CTA"
      ],
      "ctaSuggestions": [
        "Make the subscribe CTA more urgent",
        "Consider adding a specific benefit for subscribing"
      ]
    },
    "retentionAnalysis": {
      "retentionScore": 8.2,
      "strongPoints": [
        "0-3s: Strong hook captures attention",
        "3-8s: Problem identification creates resonance",
        "8-15s: Solution promise maintains interest",
        "15-45s: Value delivery keeps viewers engaged"
      ],
      "weakPoints": [
        {
          "timestamp": "25-30 seconds",
          "issue": "Content delivery becomes slightly monotonous",
          "suggestion": "Add a pattern interrupt or surprising fact here"
        }
      ],
      "dropOffRisks": [
        {
          "timestamp": "45 seconds",
          "risk": "medium",
          "reason": "CTA section might lose some viewers",
          "mitigation": "Keep CTA concise and punchy"
        }
      ]
    },
    "sentimentAnalysis": {
      "overallSentiment": "positive",
      "sentimentScore": 0.78,
      "positiveWords": ["amazing", "game-changer", "grateful"],
      "negativeWords": ["mistakes", "tired", "sucks"],
      "emotionalTone": "motivational",
      "sentimentProgression": [
        { "section": "hook", "sentiment": "negative", "score": -0.2 },
        { "section": "problem", "sentiment": "negative", "score": -0.4 },
        { "section": "solution", "sentiment": "positive", "score": 0.6 },
        { "section": "value", "sentiment": "positive", "score": 0.8 },
        { "section": "cta", "sentiment": "positive", "score": 0.9 }
      ]
    },
    "keywordAnalysis": {
      "primaryKeywords": [
        "morning routine",
        "productivity",
        "wake up",
        "5-minute hack"
      ],
      "keywordDensity": {
        "morning": 2,
        "routine": 2,
        "wake": 1,
        "productivity": 1
      },
      "seoScore": 7.5,
      "suggestedKeywords": [
        "morning habits",
        "productivity tips",
        "morning motivation"
      ]
    },
    "overallScore": 8.4,
    "strengths": [
      "Excellent pacing keeps viewer engaged throughout",
      "Clear value proposition in first 5 seconds",
      "Strong emotional appeal with personal transformation story",
      "Natural conversational flow feels authentic",
      "Good use of specific, actionable steps",
      "Pattern interrupts maintain attention"
    ],
    "retentionIssues": [
      "Consider adding a pattern interrupt at 0:15 to prevent mid-video drop-off",
      "Hook could be more specific to target audience (productivity enthusiasts)",
      "Add a visual element description in the middle section for better retention",
      "The '30 seconds cold shower' might feel intimidating - consider softening"
    ],
    "suggestions": [
      "Add more specific numbers or statistics to boost credibility",
      "Include a personal story or anecdote in the middle section",
      "Make the CTA more urgent (e.g., 'Starting tomorrow morning')",
      "Consider a callback to the hook at the end for better cohesion",
      "Add a teaser for next video to improve channel retention"
    ],
    "platformOptimization": {
      "platform": "YouTube Shorts",
      "durationMatch": true,
      "formatScore": 9.0,
      "platformSpecificNotes": [
        "Perfect length for Shorts (under 60 seconds)",
        "Fast pacing matches Shorts viewer behavior",
        "Clear CTA drives engagement metrics",
        "Consider adding text overlays for key points"
      ]
    },
    "competitorComparison": {
      "averageHookScore": 7.2,
      "averagePacingScore": 7.8,
      "averageCTAScore": 7.0,
      "yourPerformance": "Above average in all categories",
      "percentile": 85
    },
    "aiConfidence": 0.92,
    "analyzedAt": "2024-12-18T10:30:00.000Z",
    "modelVersion": "gpt-4-turbo-2024-04-09"
  }
}
```

---

### Script Rewriting Payloads

#### POST /scripts/rewrite

**Request Body:**
```json
{
  "originalScript": "This video will show you the best morning routine tips. First, wake up early. Then, drink water. Exercise is important too. Also meditate. These things will help you be more productive.",
  "referenceChannel": "https://www.youtube.com/@MrBeast",
  "targetTone": "energetic",
  "targetLength": "same",
  "preserveKeyPoints": true,
  "creativityLevel": 0.8
}
```

**Success Response (200):**
```json
{
  "success": true,
  "data": {
    "rewrittenScript": "YO WHAT'S UP! So I just spent 30 days testing the PERFECT morning routine and the results are INSANE. Check this out - I wake up at 5 AM every single day. Yeah, it's brutal at first, but here's the secret... I chug a FULL liter of water the second my eyes open. Your body is literally dehydrated after 8 hours, so this is a game-changer. Then boom - 10 minutes of exercise. Not a full workout, just enough to get your heart pumping and wake you up. And here's where it gets interesting... I meditate for just 5 minutes. Sounds boring but trust me, it clears your mind like nothing else. Do this for ONE WEEK and I GUARANTEE you'll feel like a different person. Let's goooo!",
    "styleAnalysis": {
      "referenceChannelStyle": {
        "channelName": "MrBeast",
        "channelId": "UCX6OQ3DkcsbYNE6H8uQQuVA",
        "subscriberCount": 225000000,
        "analyzedVideos": 10,
        "styleCharacteristics": {
          "tone": "Extremely energetic and enthusiastic",
          "pacing": "Very fast with rapid-fire delivery",
          "vocabulary": "Simple, casual, lots of emphasis words",
          "sentenceStructure": "Short, punchy sentences",
          "commonPhrases": [
            "Check this out",
            "Here's the thing",
            "This is insane",
            "Trust me",
            "Let's go"
          ],
          "openingStyle": "High-energy greeting (YO, WHAT'S UP)",
          "emphasisPattern": "Uses ALL CAPS for key words",
          "storytellingApproach": "Personal challenge/experiment format",
          "ctaStyle": "Direct and motivational"
        }
      },
      "appliedChanges": [
        {
          "category": "Opening",
          "original": "This video will show you",
          "rewritten": "YO WHAT'S UP! So I just spent 30 days testing",
          "reason": "Matches MrBeast's energetic opening style"
        },
        {
          "category": "Tone",
          "original": "These things will help you",
          "rewritten": "I GUARANTEE you'll feel like a different person",
          "reason": "More emphatic and confident like reference channel"
        },
        {
          "category": "Structure",
          "original": "Long explanatory sentences",
          "rewritten": "Short, punchy sentences with emphasis",
          "reason": "Matches fast-paced delivery style"
        },
        {
          "category": "Language",
          "original": "Exercise is important too",
          "rewritten": "Then boom - 10 minutes of exercise",
          "reason": "Added energy words and casual language"
        }
      ],
      "toneAdjustments": [
        "Increased energy level by 85%",
        "Added personal challenge framing",
        "Incorporated emphasis words (INSANE, GUARANTEE, FULL)",
        "Added casual interjections (YO, boom, Let's goooo)",
        "Simplified vocabulary for broader appeal"
      ],
      "structureChanges": [
        "Reduced average sentence length from 12 to 8 words",
        "Added pattern interrupt mid-script ('And here's where it gets interesting')",
        "Restructured to problem → experiment → results format",
        "Strengthened hook with personal challenge angle",
        "Made CTA more direct and motivational"
      ],
      "pacingChanges": [
        "Increased words per second from 2.5 to 3.2",
        "Added more transition words for flow",
        "Created momentum with 'Then boom' style transitions",
        "Compressed explanations to maintain speed"
      ]
    },
    "comparisonMetrics": {
      "original": {
        "wordCount": 38,
        "characterCount": 212,
        "estimatedDuration": 15,
        "energyScore": 3.2,
        "engagementScore": 4.5
      },
      "rewritten": {
        "wordCount": 132,
        "characterCount": 687,
        "estimatedDuration": 41,
        "energyScore": 9.1,
        "engagementScore": 8.7
      },
      "improvements": {
        "energyIncrease": "+184%",
        "engagementIncrease": "+93%",
        "retentionProjection": "+67%"
      }
    },
    "keyPointsPreserved": [
      "Wake up early - ✓ Preserved (5 AM specified)",
      "Drink water - ✓ Preserved (emphasized with 'FULL liter')",
      "Exercise - ✓ Preserved (10 minutes specified)",
      "Meditate - ✓ Preserved (5 minutes specified)",
      "Productivity - ✓ Preserved ('feel like a different person')"
    ],
    "additionalEnhancements": [
      "Added personal experiment framing (30 days testing)",
      "Included specific metrics (5 AM, 1 liter, 10 minutes, 5 minutes)",
      "Added urgency ('ONE WEEK')",
      "Strengthened guarantee element",
      "Improved call-to-action"
    ],
    "suggestedImprovements": [
      "Consider adding a specific result/metric from your experiment",
      "Could include a relatable problem in the hook",
      "Add a teaser for next video to improve retention"
    ],
    "confidence": 0.94,
    "processingTime": 3.2,
    "modelVersion": "gpt-4-turbo-2024-04-09",
    "createdAt": "2024-12-18T10:30:00.000Z"
  }
}
```

---

### Manual Posting Payloads

#### POST /posting/upload

**Request (Multipart Form Data):**
```javascript
// Headers
Content-Type: multipart/form-data; boundary=----WebKitFormBoundary7MA4YWxkTrZu0gW
Authorization: Bearer {token}

// Form Fields
{
  video: File (binary),
  caption: "Check out this amazing transformation! #fitness #motivation",
  hashtags: "#fitness,#motivation,#transformation,#gym,#workout",
  platforms: ["tiktok", "instagram", "youtube"],
  scheduledAt: "2024-12-19T15:00:00.000Z", // optional
  thumbnailTimestamp: 5.0, // optional, seconds into video for thumbnail
  enableComments: true,
  visibility: "public" // public, private, unlisted
}
```

**Success Response (202 Accepted):**
```json
{
  "success": true,
  "data": {
    "postId": "post_550e8400-e29b-41d4-a716",
    "status": "processing",
    "uploadedFile": {
      "originalFilename": "my_video.mp4",
      "size": 45678900,
      "duration": 45.5,
      "resolution": "1080x1920",
      "aspectRatio": "9:16",
      "format": "mp4",
      "codec": "h264",
      "bitrate": 8000000,
      "fps": 30,
      "storageUrl": "https://storage.example.com/uploads/user123/post_550e8400.mp4",
      "thumbnailUrl": "https://storage.example.com/thumbnails/user123/post_550e8400.jpg"
    },
    "platforms": [
      {
        "platform": "tiktok",
        "status": "queued",
        "estimatedPublishTime": "2024-12-18T10:32:00.000Z"
      },
      {
        "platform": "instagram",
        "status": "queued",
        "estimatedPublishTime": "2024-12-18T10:32:00.000Z"
      },
      {
        "platform": "youtube",
        "status": "queued",
        "estimatedPublishTime": "2024-12-18T10:32:00.000Z"
      }
    ],
    "scheduledAt": "2024-12-19T15:00:00.000Z",
    "caption": "Check out this amazing transformation! #fitness #motivation",
    "createdAt": "2024-12-18T10:30:00.000Z",
    "estimatedCompletionTime": "2024-12-18T10:35:00.000Z"
  }
}
```

**Error Response (400 - Invalid Video):**
```json
{
  "success": false,
  "error": {
    "code": "INVALID_VIDEO",
    "message": "Video validation failed",
    "details": [
      {
        "field": "duration",
        "message": "Video duration (95 seconds) exceeds TikTok limit of 10 minutes",
        "platform": "tiktok",
        "limit": 600,
        "actual": 95
      },
      {
        "field": "format",
        "message": "Video format 'avi' is not supported. Supported formats: mp4, mov",
        "supportedFormats": ["mp4", "mov"]
      }
    ]
  }
}
```

---

#### GET /posting/status/{postId}

**Success Response (200):**
```json
{
  "success": true,
  "data": {
    "postId": "post_550e8400-e29b-41d4-a716",
    "overallStatus": "partially_published",
    "caption": "Check out this amazing transformation!",
    "videoUrl": "https://storage.example.com/uploads/user123/post_550e8400.mp4",
    "thumbnailUrl": "https://storage.example.com/thumbnails/user123/post_550e8400.jpg",
    "platforms": [
      {
        "platform": "tiktok",
        "status": "published",
        "postUrl": "https://www.tiktok.com/@user/video/7234567890",
        "platformPostId": "7234567890",
        "publishedAt": "2024-12-18T10:32:15.000Z",
        "metrics": {
          "views": 1250,
          "likes": 87,
          "comments": 12,
          "shares": 5,
          "lastUpdated": "2024-12-18T11:00:00.000Z"
        }
      },
      {
        "platform": "instagram",
        "status": "published",
        "postUrl": "https://www.instagram.com/reel/ABC123xyz",
        "platformPostId": "ABC123xyz",
        "publishedAt": "2024-12-18T10:33:42.000Z",
        "metrics": {
          "views": 850,
          "likes": 65,
          "comments": 8,
          "shares": 3,
          "lastUpdated": "2024-12-18T11:00:00.000Z"
        }
      },
      {
        "platform": "youtube",
        "status": "failed",
        "error": {
          "code": "QUOTA_EXCEEDED",
          "message": "YouTube API quota exceeded. Will retry at 2024-12-19T00:00:00.000Z",
          "retryAt": "2024-12-19T00:00:00.000Z",
          "retryCount": 1,
          "maxRetries": 3
        },
        "failedAt": "2024-12-18T10:34:00.000Z"
      }
    ],
    "processingSteps": [
      {
        "step": "upload",
        "status": "completed",
        "completedAt": "2024-12-18T10:30:30.000Z"
      },
      {
        "step": "transcode",
        "status": "completed",
        "completedAt": "2024-12-18T10:31:15.000Z"
      },
      {
        "step": "publish_tiktok",
        "status": "completed",
        "completedAt": "2024-12-18T10:32:15.000Z"
      },
      {
        "step": "publish_instagram",
        "status": "completed",
        "completedAt": "2024-12-18T10:33:42.000Z"
      },
      {
        "step": "publish_youtube",
        "status": "failed",
        "failedAt": "2024-12-18T10:34:00.000Z"
      }
    ],
    "createdAt": "2024-12-18T10:30:00.000Z",
    "updatedAt": "2024-12-18T10:34:00.000Z"
  }
}
```

---

## Validation Schemas

### Using Joi (Node.js)

```javascript
const Joi = require('joi');

// User Registration Schema
const registerSchema = Joi.object({
  name: Joi.string()
    .min(2)
    .max(100)
    .pattern(/^[a-zA-Z\s'-]+$/)
    .trim()
    .required()
    .messages({
      'string.pattern.base': 'Name can only contain letters, spaces, hyphens, and apostrophes',
      'string.min': 'Name must be at least 2 characters long',
      'any.required': 'Name is required'
    }),
  
  email: Joi.string()
    .email()
    .lowercase()
    .trim()
    .max(255)
    .required()
    .messages({
      'string.email': 'Please provide a valid email address',
      'any.required': 'Email is required'
    }),
  
  password: Joi.string()
    .min(8)
    .max(128)
    .pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/)
    .required()
    .messages({
      'string.pattern.base': 'Password must contain at least one uppercase letter, one lowercase letter, and one number',
      'string.min': 'Password must be at least 8 characters long',
      'any.required': 'Password is required'
    })
});

// Viral Content Query Schema
const viralContentQuerySchema = Joi.object({
  platform: Joi.string()
    .valid('TikTok', 'Instagram', 'all')
    .default('all'),
  
  trending: Joi.string()
    .valid('daily', 'weekly')
    .default('daily'),
  
  region: Joi.string()
    .valid('US', 'UK', 'Global', 'all')
    .default('all'),
  
  duration: Joi.string()
    .valid('0-15', '15-30', '30+', 'all')
    .default('all'),
  
  minViews: Joi.number()
    .integer()
    .min(0)
    .max(1000000000)
    .optional(),
  
  search: Joi.string()
    .max(200)
    .trim()
    .optional(),
  
  page: Joi.number()
    .integer()
    .min(1)
    .default(1),
  
  limit: Joi.number()
    .integer()
    .min(1)
    .max(100)
    .default(20)
});

// Script Analysis Schema
const scriptAnalysisSchema = Joi.object({
  script: Joi.string()
    .min(10)
    .max(10000)
    .trim()
    .required()
    .messages({
      'string.min': 'Script must be at least 10 characters',
      'string.max': 'Script must not exceed 10,000 characters',
      'any.required': 'Script content is required'
    }),
  
  targetPlatform: Joi.string()
    .valid('YouTube Shorts', 'TikTok', 'Instagram Reels', 'general')
    .default('general'),
  
  targetAudience: Joi.string()
    .max(500)
    .optional(),
  
  analyzeDepth: Joi.string()
    .valid('quick', 'standard', 'comprehensive')
    .default('standard')
});

// Video Upload Schema (for form validation)
const videoUploadSchema = Joi.object({
  caption: Joi.string()
    .max(2200)
    .trim()
    .optional()
    .allow(''),
  
  hashtags: Joi.string()
    .pattern(/^#?[\w]+(?:,\s*#?[\w]+)*$/)
    .max(500)
    .optional()
    .messages({
      'string.pattern.base': 'Hashtags must be comma-separated words'
    }),
  
  platforms: Joi.array()
    .items(Joi.string().valid('tiktok', 'instagram', 'youtube'))
    .min(1)
    .required()
    .messages({
      'array.min': 'At least one platform must be selected'
    }),
  
  scheduledAt: Joi.date()
    .iso()
    .min('now')
    .optional()
    .messages({
      'date.min': 'Scheduled time must be in the future'
    }),
  
  visibility: Joi.string()
    .valid('public', 'private', 'unlisted')
    .default('public')
});

// Usage Example
async function validateRequest(schema, data) {
  try {
    const validated = await schema.validateAsync(data, {
      abortEarly: false, // Return all errors, not just the first one
      stripUnknown: true // Remove unknown keys
    });
    return { valid: true, data: validated };
  } catch (error) {
    const errors = error.details.map(detail => ({
      field: detail.path.join('.'),
      message: detail.message,
      value: detail.context.value
    }));
    return { valid: false, errors };
  }
}
```

---

## Error Handling

### Standard Error Response Format

```javascript
class APIError extends Error {
  constructor(code, message, statusCode = 500, details = null) {
    super(message);
    this.code = code;
    this.statusCode = statusCode;
    this.details = details;
    this.timestamp = new Date().toISOString();
  }

  toJSON() {
    return {
      success: false,
      error: {
        code: this.code,
        message: this.message,
        statusCode: this.statusCode,
        ...(this.details && { details: this.details })
      },
      meta: {
        timestamp: this.timestamp,
        requestId: this.requestId
      }
    };
  }
}

// Specific Error Classes
class ValidationError extends APIError {
  constructor(details) {
    super('VALIDATION_ERROR', 'Validation failed', 400, details);
  }
}

class AuthenticationError extends APIError {
  constructor(message = 'Authentication failed') {
    super('AUTHENTICATION_ERROR', message, 401);
  }
}

class AuthorizationError extends APIError {
  constructor(message = 'Insufficient permissions') {
    super('AUTHORIZATION_ERROR', message, 403);
  }
}

class NotFoundError extends APIError {
  constructor(resource = 'Resource') {
    super('NOT_FOUND', `${resource} not found`, 404);
  }
}

class RateLimitError extends APIError {
  constructor(resetTime) {
    super(
      'RATE_LIMIT_EXCEEDED',
      'Too many requests. Please try again later.',
      429,
      { resetTime }
    );
  }
}

class ExternalAPIError extends APIError {
  constructor(service, originalError) {
    super(
      'EXTERNAL_API_ERROR',
      `${service} API request failed`,
      502,
      { service, originalError: originalError.message }
    );
  }
}

// Error Response Middleware
function errorHandler(err, req, res, next) {
  // Add request ID to error
  if (req.id) {
    err.requestId = req.id;
  }

  // Log error
  console.error({
    error: err.message,
    stack: err.stack,
    requestId: req.id,
    path: req.path,
    method: req.method,
    userId: req.user?.id
  });

  // Send error response
  if (err instanceof APIError) {
    res.status(err.statusCode).json(err.toJSON());
  } else {
    // Unexpected errors
    res.status(500).json({
      success: false,
      error: {
        code: 'INTERNAL_SERVER_ERROR',
        message: process.env.NODE_ENV === 'production'
          ? 'An unexpected error occurred'
          : err.message,
        statusCode: 500
      },
      meta: {
        timestamp: new Date().toISOString(),
        requestId: req.id
      }
    });
  }
}
```

### Error Code Reference

```javascript
const ERROR_CODES = {
  // Authentication & Authorization (401-403)
  INVALID_CREDENTIALS: { status: 401, message: 'Invalid email or password' },
  TOKEN_EXPIRED: { status: 401, message: 'Access token has expired' },
  TOKEN_INVALID: { status: 401, message: 'Invalid access token' },
  ACCOUNT_LOCKED: { status: 403, message: 'Account has been locked' },
  EMAIL_NOT_VERIFIED: { status: 403, message: 'Please verify your email' },
  INSUFFICIENT_PERMISSIONS: { status: 403, message: 'Insufficient permissions' },
  
  // Validation (400)
  VALIDATION_ERROR: { status: 400, message: 'Validation failed' },
  INVALID_REQUEST: { status: 400, message: 'Invalid request format' },
  MISSING_REQUIRED_FIELD: { status: 400, message: 'Required field missing' },
  
  // Resource Errors (404, 409)
  NOT_FOUND: { status: 404, message: 'Resource not found' },
  USER_NOT_FOUND: { status: 404, message: 'User not found' },
  VIDEO_NOT_FOUND: { status: 404, message: 'Video not found' },
  EMAIL_EXISTS: { status: 409, message: 'Email already registered' },
  RESOURCE_CONFLICT: { status: 409, message: 'Resource conflict' },
  
  // Rate Limiting (429)
  RATE_LIMIT_EXCEEDED: { status: 429, message: 'Rate limit exceeded' },
  QUOTA_EXCEEDED: { status: 429, message: 'API quota exceeded' },
  
  // External Services (502, 503)
  YOUTUBE_API_ERROR: { status: 502, message: 'YouTube API error' },
  APIFY_ERROR: { status: 502, message: 'Apify scraping error' },
  STRIPE_ERROR: { status: 502, message: 'Payment processing error' },
  OPENAI_ERROR: { status: 502, message: 'AI analysis service error' },
  SERVICE_UNAVAILABLE: { status: 503, message: 'Service temporarily unavailable' },
  
  // File Upload (400, 413)
  FILE_TOO_LARGE: { status: 413, message: 'File size exceeds limit' },
  INVALID_FILE_FORMAT: { status: 400, message: 'Invalid file format' },
  VIDEO_PROCESSING_FAILED: { status: 500, message: 'Video processing failed' },
  
  // Subscription & Billing (402, 403)
  PAYMENT_REQUIRED: { status: 402, message: 'Subscription required' },
  PLAN_LIMIT_REACHED: { status: 403, message: 'Plan limit reached' },
  SUBSCRIPTION_EXPIRED: { status: 403, message: 'Subscription has expired' },
  
  // Server Errors (500)
  INTERNAL_SERVER_ERROR: { status: 500, message: 'Internal server error' },
  DATABASE_ERROR: { status: 500, message: 'Database error' }
};
```

---

## Code Examples

### 1. Authentication Flow (Node.js + Express + JWT)

```javascript
const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { registerSchema } = require('./validators');

const router = express.Router();

// POST /auth/register
router.post('/register', async (req, res, next) => {
  try {
    // 1. Validate input
    const validation = await validateRequest(registerSchema, req.body);
    if (!validation.valid) {
      throw new ValidationError(validation.errors);
    }

    const { name, email, password } = validation.data;

    // 2. Check if user exists
    const existingUser = await db.query(
      'SELECT id FROM users WHERE email = $1',
      [email]
    );

    if (existingUser.rows.length > 0) {
      throw new APIError('EMAIL_EXISTS', 'Email already registered', 409);
    }

    // 3. Hash password
    const saltRounds = 12;
    const passwordHash = await bcrypt.hash(password, saltRounds);

    // 4. Create user
    const result = await db.query(
      `INSERT INTO users (name, email, password_hash, created_at, updated_at)
       VALUES ($1, $2, $3, NOW(), NOW())
       RETURNING id, name, email, created_at`,
      [name, email, passwordHash]
    );

    const user = result.rows[0];

    // 5. Create default subscription
    await db.query(
      `INSERT INTO subscriptions (user_id, plan, status, created_at)
       VALUES ($1, 'Free', 'active', NOW())`,
      [user.id]
    );

    // 6. Generate tokens
    const accessToken = jwt.sign(
      { userId: user.id, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );

    const refreshToken = jwt.sign(
      { userId: user.id, type: 'refresh' },
      process.env.REFRESH_TOKEN_SECRET,
      { expiresIn: '30d' }
    );

    // 7. Store refresh token
    await db.query(
      `INSERT INTO refresh_tokens (user_id, token, expires_at)
       VALUES ($1, $2, NOW() + INTERVAL '30 days')`,
      [user.id, refreshToken]
    );

    // 8. Send success response
    res.status(201).json({
      success: true,
      data: {
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
          createdAt: user.created_at
        },
        tokens: {
          accessToken,
          refreshToken,
          expiresIn: 604800,
          tokenType: 'Bearer'
        }
      },
      meta: {
        timestamp: new Date().toISOString(),
        requestId: req.id
      }
    });

    // 9. Send welcome email (async, don't wait)
    sendWelcomeEmail(user.email, user.name).catch(console.error);

  } catch (error) {
    next(error);
  }
});

// POST /auth/login
router.post('/login', async (req, res, next) => {
  try {
    const { email, password, rememberMe } = req.body;

    // 1. Validate input
    if (!email || !password) {
      throw new ValidationError([
        { field: 'email', message: 'Email is required' },
        { field: 'password', message: 'Password is required' }
      ]);
    }

    // 2. Check rate limiting for failed attempts
    const failedAttempts = await redis.get(`login_attempts:${email}`);
    if (failedAttempts && parseInt(failedAttempts) >= 5) {
      throw new APIError(
        'ACCOUNT_LOCKED',
        'Too many failed login attempts. Please try again in 30 minutes.',
        403,
        { lockedUntil: new Date(Date.now() + 30 * 60 * 1000).toISOString() }
      );
    }

    // 3. Get user
    const result = await db.query(
      `SELECT u.*, s.plan, s.status as subscription_status
       FROM users u
       LEFT JOIN subscriptions s ON u.id = s.user_id
       WHERE u.email = $1`,
      [email]
    );

    if (result.rows.length === 0) {
      // Increment failed attempts
      await incrementFailedAttempts(email);
      throw new AuthenticationError('Invalid email or password');
    }

    const user = result.rows[0];

    // 4. Verify password
    const passwordMatch = await bcrypt.compare(password, user.password_hash);

    if (!passwordMatch) {
      await incrementFailedAttempts(email);
      throw new AuthenticationError('Invalid email or password');
    }

    // 5. Clear failed attempts
    await redis.del(`login_attempts:${email}`);

    // 6. Generate tokens
    const tokenExpiry = rememberMe ? '30d' : '7d';
    const accessToken = jwt.sign(
      { 
        userId: user.id,
        email: user.email,
        plan: user.plan
      },
      process.env.JWT_SECRET,
      { expiresIn: tokenExpiry }
    );

    const refreshToken = jwt.sign(
      { userId: user.id, type: 'refresh' },
      process.env.REFRESH_TOKEN_SECRET,
      { expiresIn: '30d' }
    );

    // 7. Store refresh token
    await db.query(
      `INSERT INTO refresh_tokens (user_id, token, expires_at)
       VALUES ($1, $2, NOW() + INTERVAL '30 days')
       ON CONFLICT (user_id) DO UPDATE SET token = $2, expires_at = NOW() + INTERVAL '30 days'`,
      [user.id, refreshToken]
    );

    // 8. Update last login
    await db.query(
      'UPDATE users SET last_login_at = NOW() WHERE id = $1',
      [user.id]
    );

    // 9. Send response
    res.json({
      success: true,
      data: {
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
          subscription: {
            plan: user.plan,
            status: user.subscription_status
          }
        },
        tokens: {
          accessToken,
          refreshToken,
          expiresIn: rememberMe ? 2592000 : 604800,
          tokenType: 'Bearer'
        }
      }
    });

  } catch (error) {
    next(error);
  }
});

// Helper function
async function incrementFailedAttempts(email) {
  const key = `login_attempts:${email}`;
  await redis.incr(key);
  await redis.expire(key, 1800); // 30 minutes
}
```

---

### 2. Apify Integration for Viral Content Scraping

```javascript
const ApifyClient = require('apify-client');
const client = new ApifyClient({ token: process.env.APIFY_API_TOKEN });

async function scrapeViralTikTokVideos(filters) {
  const {
    trending = 'daily',
    region = 'US',
    minViews = 100000,
    limit = 20
  } = filters;

  try {
    // Determine hashtags based on trending type
    const hashtags = trending === 'daily'
      ? ['fyp', 'viral', 'trending']
      : ['trending', 'foryou'];

    // Prepare Apify input
    const input = {
      hashtags,
      resultsPerPage: limit,
      maxRequestRetries: 3,
      shouldDownloadVideos: false,
      shouldDownloadCovers: true,
      shouldDownloadSlideshowImages: false,
      proxy: {
        useApifyProxy: true,
        apifyProxyGroups: ['RESIDENTIAL'],
        apifyProxyCountry: region
      }
    };

    // Run the actor
    console.log('Starting TikTok scraper...');
    const run = await client.actor("clockworks/tiktok-scraper").call(input);

    // Fetch results
    const { items } = await client.dataset(run.defaultDatasetId).listItems();

    // Transform data to our format
    const videos = items
      .filter(item => item.stats?.viewCount >= minViews)
      .map(item => ({
        id: `tiktok_${item.id}`,
        platform: 'TikTok',
        title: item.text || '',
        description: item.text,
        url: item.webVideoUrl,
        thumbnailUrl: item.covers?.default || item.covers?.origin,
        videoUrl: item.videoUrl,
        hashtags: item.hashtags?.map(tag => `#${tag.name}`) || [],
        metrics: {
          views: item.stats?.viewCount || 0,
          likes: item.stats?.diggCount || 0,
          comments: item.stats?.commentCount || 0,
          shares: item.stats?.shareCount || 0,
          saves: item.stats?.collectCount || 0,
          engagementRate: calculateEngagementRate(item.stats)
        },
        duration: item.video?.duration || 0,
        aspectRatio: '9:16',
        region: region,
        language: item.video?.language || 'en',
        publishedAt: new Date(item.createTimeISO).toISOString(),
        scrapedAt: new Date().toISOString(),
        trendingType: trending,
        creator: {
          id: `user_${item.authorMeta?.id}`,
          username: item.authorMeta?.name,
          displayName: item.authorMeta?.nickName,
          avatarUrl: item.authorMeta?.avatar,
          followers: item.authorMeta?.fans || 0,
          verified: item.authorMeta?.verified || false,
          profileUrl: `https://www.tiktok.com/@${item.authorMeta?.name}`
        },
        music: item.musicMeta ? {
          title: item.musicMeta.musicName,
          artist: item.musicMeta.musicAuthor,
          url: item.musicMeta.musicOriginal ? `https://www.tiktok.com/music/${item.musicMeta.musicId}` : null
        } : null
      }));

    // Cache results
    await redis.setex(
      `viral_tiktok:${trending}:${region}`,
      3600, // 1 hour cache
      JSON.stringify(videos)
    );

    return videos;

  } catch (error) {
    console.error('TikTok scraping error:', error);
    throw new ExternalAPIError('Apify/TikTok', error);
  }
}

async function scrapeViralInstagramReels(filters) {
  const { minViews = 100000, limit = 20 } = filters;

  try {
    // Instagram uses different approach - scrape from trending hashtags
    const trendingHashtags = ['reels', 'viral', 'trending', 'explore'];

    const input = {
      hashtags: trendingHashtags,
      resultsLimit: limit,
      searchLimit: 50,
      searchType: 'hashtag',
      addParentData: true
    };

    const run = await client.actor("apify/instagram-reel-scraper").call(input);
    const { items } = await client.dataset(run.defaultDatasetId).listItems();

    const reels = items
      .filter(item => item.videoViewCount >= minViews)
      .map(item => ({
        id: `instagram_${item.id}`,
        platform: 'Instagram',
        title: item.caption?.substring(0, 100) || '',
        description: item.caption,
        url: item.url,
        thumbnailUrl: item.displayUrl,
        videoUrl: item.videoUrl,
        hashtags: extractHashtags(item.caption),
        metrics: {
          views: item.videoViewCount || 0,
          likes: item.likesCount || 0,
          comments: item.commentsCount || 0,
          shares: 0, // Not available from Instagram
          saves: 0,
          engagementRate: ((item.likesCount + item.commentsCount) / item.videoViewCount * 100).toFixed(2)
        },
        duration: item.videoDuration || 0,
        aspectRatio: '9:16',
        publishedAt: new Date(item.timestamp * 1000).toISOString(),
        scrapedAt: new Date().toISOString(),
        creator: {
          id: `user_${item.ownerUsername}`,
          username: item.ownerUsername,
          displayName: item.ownerFullName,
          avatarUrl: item.ownerProfilePicUrl,
          followers: 0, // Would need separate API call
          verified: item.isVerified || false,
          profileUrl: `https://www.instagram.com/${item.ownerUsername}/`
        }
      }));

    return reels;

  } catch (error) {
    console.error('Instagram scraping error:', error);
    throw new ExternalAPIError('Apify/Instagram', error);
  }
}

function calculateEngagementRate(stats) {
  if (!stats || !stats.viewCount) return 0;
  const totalEngagement = (stats.diggCount || 0) + (stats.commentCount || 0) + (stats.shareCount || 0);
  return ((totalEngagement / stats.viewCount) * 100).toFixed(2);
}

function extractHashtags(text) {
  if (!text) return [];
  const hashtagRegex = /#[\w]+/g;
  return text.match(hashtagRegex) || [];
}

// GET /viral-content endpoint
router.get('/viral-content', authenticateUser, checkPlanLimits, async (req, res, next) => {
  try {
    const filters = await validateRequest(viralContentQuerySchema, req.query);

    // Check cache first
    const cacheKey = `viral:${filters.data.platform}:${filters.data.trending}:${filters.data.region}`;
    const cached = await redis.get(cacheKey);

    if (cached) {
      return res.json({
        success: true,
        data: JSON.parse(cached),
        meta: {
          timestamp: new Date().toISOString(),
          requestId: req.id,
          cacheHit: true
        }
      });
    }

    // Fetch from Apify
    let videos = [];

    if (filters.data.platform === 'TikTok' || filters.data.platform === 'all') {
      const tiktokVideos = await scrapeViralTikTokVideos(filters.data);
      videos.push(...tiktokVideos);
    }

    if (filters.data.platform === 'Instagram' || filters.data.platform === 'all') {
      const igReels = await scrapeViralInstagramReels(filters.data);
      videos.push(...igReels);
    }

    // Apply additional filters
    if (filters.data.search) {
      videos = videos.filter(v =>
        v.title.toLowerCase().includes(filters.data.search.toLowerCase()) ||
        v.hashtags.some(tag => tag.toLowerCase().includes(filters.data.search.toLowerCase()))
      );
    }

    // Sort by views
    videos.sort((a, b) => b.metrics.views - a.metrics.views);

    // Paginate
    const start = (filters.data.page - 1) * filters.data.limit;
    const paginatedVideos = videos.slice(start, start + filters.data.limit);

    const response = {
      videos: paginatedVideos,
      pagination: {
        currentPage: filters.data.page,
        totalPages: Math.ceil(videos.length / filters.data.limit),
        totalItems: videos.length,
        itemsPerPage: filters.data.limit,
        hasNext: start + filters.data.limit < videos.length,
        hasPrev: filters.data.page > 1
      },
      filters: filters.data
    };

    // Cache for 1 hour
    await redis.setex(cacheKey, 3600, JSON.stringify(response));

    res.json({
      success: true,
      data: response,
      meta: {
        timestamp: new Date().toISOString(),
        requestId: req.id,
        cacheHit: false
      }
    });

  } catch (error) {
    next(error);
  }
});
```

---

**(Continued in next message due to length...)**
