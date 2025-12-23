# Additional Code Examples & Integration Guides

## Table of Contents
1. [YouTube Data API Integration](#youtube-data-api-integration)
2. [OpenAI Script Analysis](#openai-script-analysis)
3. [Stripe Billing Integration](#stripe-billing-integration)
4. [Video Upload & Processing](#video-upload-processing)
5. [Database Queries](#database-queries)
6. [Middleware](#middleware)
7. [Background Jobs](#background-jobs)
8. [Testing Examples](#testing-examples)

---

## YouTube Data API Integration

### 1. Channel Analysis with Outlier Detection

```javascript
const { google } = require('googleapis');
const youtube = google.youtube('v3');

class YouTubeAnalytics {
  constructor(apiKey) {
    this.apiKey = apiKey;
  }

  async analyzeChannel(channelUrl) {
    try {
      // 1. Extract channel ID from URL
      const channelId = this.extractChannelId(channelUrl);

      // 2. Get channel info
      const channelInfo = await this.getChannelInfo(channelId);

      // 3. Get all Shorts from channel
      const shorts = await this.getChannelShorts(channelId, 50);

      // 4. Get detailed stats for each Short
      const shortsWithStats = await this.getVideoStats(shorts);

      // 5. Calculate metrics
      const metrics = this.calculateMetrics(shortsWithStats);

      // 6. Detect outliers
      const outliers = this.detectOutliers(shortsWithStats, metrics.avgViews);

      // 7. Generate performance trend
      const trend = this.generateTrend(shortsWithStats);

      return {
        channelInfo,
        shortsMetrics: metrics,
        outlierVideos: outliers,
        recentVideos: shortsWithStats.slice(0, 10),
        performanceTrend: trend,
        analyzedAt: new Date().toISOString()
      };

    } catch (error) {
      throw new ExternalAPIError('YouTube', error);
    }
  }

  extractChannelId(url) {
    // Handle different URL formats
    // https://www.youtube.com/@channelname
    // https://www.youtube.com/channel/UCxxxxxx
    // https://www.youtube.com/c/channelname
    
    const patterns = [
      /youtube\.com\/@([^\/\?]+)/,
      /youtube\.com\/channel\/([^\/\?]+)/,
      /youtube\.com\/c\/([^\/\?]+)/,
      /youtube\.com\/user\/([^\/\?]+)/
    ];

    for (const pattern of patterns) {
      const match = url.match(pattern);
      if (match) return match[1];
    }

    throw new ValidationError([{
      field: 'channelUrl',
      message: 'Invalid YouTube channel URL'
    }]);
  }

  async getChannelInfo(channelId) {
    // Try as channel ID first
    let response = await youtube.channels.list({
      key: this.apiKey,
      part: 'snippet,statistics,contentDetails',
      id: channelId
    });

    // If not found, try as custom URL
    if (!response.data.items || response.data.items.length === 0) {
      response = await youtube.channels.list({
        key: this.apiKey,
        part: 'snippet,statistics,contentDetails',
        forUsername: channelId
      });
    }

    if (!response.data.items || response.data.items.length === 0) {
      throw new NotFoundError('YouTube channel');
    }

    const channel = response.data.items[0];

    return {
      channelId: channel.id,
      channelName: channel.snippet.title,
      channelUrl: `https://www.youtube.com/channel/${channel.id}`,
      customUrl: channel.snippet.customUrl || null,
      description: channel.snippet.description,
      thumbnailUrl: channel.snippet.thumbnails.high.url,
      subscriberCount: parseInt(channel.statistics.subscriberCount),
      totalViews: parseInt(channel.statistics.viewCount),
      totalVideos: parseInt(channel.statistics.videoCount),
      channelCreatedAt: channel.snippet.publishedAt,
      country: channel.snippet.country || null,
      verified: channel.snippet.customUrl ? true : false
    };
  }

  async getChannelShorts(channelId, maxResults = 50) {
    const shorts = [];
    let pageToken = null;

    try {
      // YouTube Shorts are videos with duration < 60 seconds
      do {
        const response = await youtube.search.list({
          key: this.apiKey,
          part: 'snippet',
          channelId: channelId,
          type: 'video',
          videoDuration: 'short', // Under 4 minutes
          maxResults: 50,
          order: 'date',
          pageToken: pageToken
        });

        if (response.data.items) {
          shorts.push(...response.data.items.map(item => ({
            videoId: item.id.videoId,
            title: item.snippet.title,
            description: item.snippet.description,
            thumbnailUrl: item.snippet.thumbnails.high.url,
            publishedAt: item.snippet.publishedAt
          })));
        }

        pageToken = response.data.nextPageToken;

        // Stop if we have enough or no more pages
        if (shorts.length >= maxResults || !pageToken) break;

      } while (pageToken);

      return shorts.slice(0, maxResults);

    } catch (error) {
      console.error('Error fetching shorts:', error);
      throw error;
    }
  }

  async getVideoStats(videos) {
    // YouTube API allows max 50 videos per request
    const videoIds = videos.map(v => v.videoId);
    const chunks = this.chunkArray(videoIds, 50);
    const allStats = [];

    for (const chunk of chunks) {
      const response = await youtube.videos.list({
        key: this.apiKey,
        part: 'statistics,contentDetails',
        id: chunk.join(',')
      });

      if (response.data.items) {
        allStats.push(...response.data.items);
      }
    }

    // Merge stats with video info
    return videos.map(video => {
      const stats = allStats.find(s => s.id === video.videoId);
      
      if (!stats) return video;

      // Parse duration (ISO 8601: PT1M30S = 90 seconds)
      const duration = this.parseDuration(stats.contentDetails.duration);

      // Filter out videos longer than 60 seconds (not Shorts)
      if (duration > 60) return null;

      return {
        ...video,
        duration,
        metrics: {
          views: parseInt(stats.statistics.viewCount || 0),
          likes: parseInt(stats.statistics.likeCount || 0),
          comments: parseInt(stats.statistics.commentCount || 0),
          favorites: parseInt(stats.statistics.favoriteCount || 0)
        }
      };
    }).filter(v => v !== null);
  }

  parseDuration(isoDuration) {
    // Convert ISO 8601 duration to seconds
    // PT1M30S -> 90
    // PT45S -> 45
    const match = isoDuration.match(/PT(?:(\d+)M)?(?:(\d+)S)?/);
    if (!match) return 0;
    
    const minutes = parseInt(match[1] || 0);
    const seconds = parseInt(match[2] || 0);
    
    return minutes * 60 + seconds;
  }

  calculateMetrics(shorts) {
    if (shorts.length === 0) {
      return {
        totalShorts: 0,
        avgViews: 0,
        medianViews: 0,
        avgLikes: 0,
        avgComments: 0,
        totalViews: 0,
        uploadFrequency: { perWeek: 0, perMonth: 0 }
      };
    }

    const views = shorts.map(s => s.metrics.views).sort((a, b) => a - b);
    const totalViews = views.reduce((sum, v) => sum + v, 0);
    const avgViews = Math.floor(totalViews / shorts.length);
    const medianViews = views[Math.floor(views.length / 2)];

    const avgLikes = Math.floor(
      shorts.reduce((sum, s) => sum + s.metrics.likes, 0) / shorts.length
    );

    const avgComments = Math.floor(
      shorts.reduce((sum, s) => sum + s.metrics.comments, 0) / shorts.length
    );

    // Calculate upload frequency
    const dates = shorts.map(s => new Date(s.publishedAt));
    const oldestDate = new Date(Math.min(...dates));
    const newestDate = new Date(Math.max(...dates));
    const daysDiff = (newestDate - oldestDate) / (1000 * 60 * 60 * 24);
    const weeksActive = daysDiff / 7 || 1;
    
    const uploadsPerWeek = parseFloat((shorts.length / weeksActive).toFixed(1));
    const uploadsPerMonth = parseFloat((uploadsPerWeek * 4.33).toFixed(0));

    return {
      totalShorts: shorts.length,
      avgViews,
      medianViews,
      avgLikes,
      avgComments,
      avgEngagementRate: avgViews > 0 
        ? parseFloat(((avgLikes + avgComments) / avgViews * 100).toFixed(2))
        : 0,
      totalViews,
      uploadFrequency: {
        perWeek: uploadsPerWeek,
        perMonth: uploadsPerMonth,
        description: `${uploadsPerWeek} per week`
      }
    };
  }

  detectOutliers(shorts, avgViews) {
    // Videos with views > 2x average are outliers
    const threshold = avgViews * 2;

    return shorts
      .filter(short => short.metrics.views >= threshold)
      .map(short => ({
        ...short,
        isOutlier: true,
        outlierScore: parseFloat((short.metrics.views / avgViews).toFixed(2)),
        outlierReason: `${(short.metrics.views / avgViews).toFixed(2)}x better than channel average (${avgViews.toLocaleString()} views)`
      }))
      .sort((a, b) => b.metrics.views - a.metrics.views);
  }

  generateTrend(shorts) {
    // Group by weeks
    const weeklyData = {};

    shorts.forEach(short => {
      const date = new Date(short.publishedAt);
      const weekStart = this.getWeekStart(date);
      const weekKey = weekStart.toISOString().split('T')[0];

      if (!weeklyData[weekKey]) {
        weeklyData[weekKey] = {
          videos: [],
          totalViews: 0
        };
      }

      weeklyData[weekKey].videos.push(short);
      weeklyData[weekKey].totalViews += short.metrics.views;
    });

    // Convert to array and calculate averages
    const trend = Object.entries(weeklyData)
      .map(([weekStart, data], index) => ({
        period: `Week ${index + 1}`,
        dateRange: weekStart,
        avgViews: Math.floor(data.totalViews / data.videos.length),
        totalUploads: data.videos.length,
        topVideo: data.videos.sort((a, b) => b.metrics.views - a.metrics.views)[0]
      }))
      .sort((a, b) => new Date(a.dateRange) - new Date(b.dateRange))
      .slice(-8); // Last 8 weeks

    return trend;
  }

  getWeekStart(date) {
    const d = new Date(date);
    const day = d.getDay();
    const diff = d.getDate() - day;
    return new Date(d.setDate(diff));
  }

  chunkArray(array, size) {
    const chunks = [];
    for (let i = 0; i < array.length; i += size) {
      chunks.push(array.slice(i, i + size));
    }
    return chunks;
  }
}

// Usage in route
router.post('/analytics/channel', authenticateUser, async (req, res, next) => {
  try {
    const { channelUrl } = req.body;

    if (!channelUrl) {
      throw new ValidationError([{
        field: 'channelUrl',
        message: 'Channel URL is required'
      }]);
    }

    const analytics = new YouTubeAnalytics(process.env.YOUTUBE_API_KEY);
    const data = await analytics.analyzeChannel(channelUrl);

    // Save to database
    await db.query(
      `INSERT INTO channel_analyses (user_id, channel_id, channel_name, channel_url, analysis_data, analyzed_at)
       VALUES ($1, $2, $3, $4, $5, NOW())`,
      [
        req.user.id,
        data.channelInfo.channelId,
        data.channelInfo.channelName,
        channelUrl,
        JSON.stringify(data)
      ]
    );

    res.json({
      success: true,
      data
    });

  } catch (error) {
    next(error);
  }
});
```

---

## OpenAI Script Analysis

### 1. GPT-4 Script Analyzer

```javascript
const OpenAI = require('openai');

class ScriptAnalyzer {
  constructor() {
    this.openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY
    });
  }

  async analyzeScript(script, options = {}) {
    const {
      targetPlatform = 'general',
      targetAudience = '',
      analyzeDepth = 'standard'
    } = options;

    try {
      const systemPrompt = this.buildSystemPrompt(analyzeDepth);
      const userPrompt = this.buildUserPrompt(script, targetPlatform, targetAudience);

      const completion = await this.openai.chat.completions.create({
        model: 'gpt-4-turbo-preview',
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: userPrompt }
        ],
        temperature: 0.3, // Lower for more consistent analysis
        max_tokens: 2500,
        response_format: { type: 'json_object' }
      });

      const analysis = JSON.parse(completion.choices[0].message.content);

      // Add computed metrics
      analysis.scriptMetrics = this.computeMetrics(script);
      analysis.overallScore = this.calculateOverallScore(analysis);
      analysis.aiConfidence = 0.92; // Could be derived from token probabilities
      analysis.modelVersion = completion.model;

      return analysis;

    } catch (error) {
      console.error('OpenAI API error:', error);
      throw new ExternalAPIError('OpenAI', error);
    }
  }

  buildSystemPrompt(depth) {
    const basePrompt = `You are an expert short-form video content analyst specializing in YouTube Shorts, TikTok, and Instagram Reels. Your task is to analyze video scripts and provide actionable insights.

You must respond with a valid JSON object containing the following structure:

{
  "hookAnalysis": {
    "hookType": "string (Question Hook | Story Hook | Stat Hook | Problem Hook | Statement Hook)",
    "hookScore": number (0-10),
    "hookText": "string (first sentence of script)",
    "hookLength": number (words in hook),
    "hookStrengths": ["string"],
    "hookWeaknesses": ["string"],
    "suggestions": ["string"]
  },
  "structureAnalysis": {
    "hasHook": boolean,
    "hasIntro": boolean,
    "hasBody": boolean,
    "hasCTA": boolean,
    "structureScore": number (0-10),
    "structureStrengths": ["string"]
  },
  "pacingAnalysis": {
    "pacing": "string (Fast-paced | Medium | Slow)",
    "pacingScore": number (0-10),
    "wordsPerSecond": number,
    "patternInterrupts": [{
      "timestamp": "string (e.g., '15 seconds')",
      "type": "string",
      "text": "string"
    }],
    "pacingStrengths": ["string"],
    "suggestions": ["string"]
  },
  "toneAnalysis": {
    "tone": "string (e.g., 'Energetic & Casual')",
    "toneScore": number (0-10),
    "toneAttributes": ["string"],
    "emotionalTriggers": ["string"],
    "toneStrengths": ["string"]
  },
  "ctaAnalysis": {
    "ctaPresence": boolean,
    "ctaStrength": "string (Strong | Moderate | Weak | None)",
    "ctaScore": number (0-10),
    "ctaType": "string",
    "primaryCTA": "string",
    "secondaryCTA": "string or null",
    "ctaStrengths": ["string"],
    "ctaSuggestions": ["string"]
  },
  "retentionAnalysis": {
    "retentionScore": number (0-10),
    "strongPoints": ["string"],
    "weakPoints": [{
      "timestamp": "string",
      "issue": "string",
      "suggestion": "string"
    }],
    "dropOffRisks": [{
      "timestamp": "string",
      "risk": "string (low | medium | high)",
      "reason": "string",
      "mitigation": "string"
    }]
  },
  "strengths": ["string (minimum 4 items)"],
  "retentionIssues": ["string (minimum 3 items)"],
  "suggestions": ["string (minimum 4 items)"]
}`;

    if (depth === 'comprehensive') {
      return basePrompt + `

Additionally, include these sections:
- sentimentAnalysis
- keywordAnalysis
- platformOptimization
- competitorComparison`;
    }

    return basePrompt;
  }

  buildUserPrompt(script, platform, audience) {
    let prompt = `Analyze this short-form video script:\n\n"${script}"\n\n`;

    if (platform !== 'general') {
      prompt += `Target Platform: ${platform}\n`;
    }

    if (audience) {
      prompt += `Target Audience: ${audience}\n`;
    }

    prompt += `\nProvide a comprehensive analysis following the JSON structure specified. Be specific and actionable in your feedback.`;

    return prompt;
  }

  computeMetrics(script) {
    const words = script.trim().split(/\s+/);
    const sentences = script.split(/[.!?]+/).filter(s => s.trim().length > 0);
    
    return {
      wordCount: words.length,
      characterCount: script.length,
      estimatedDuration: Math.ceil(words.length / 3), // Assuming 3 words per second
      readingLevel: this.calculateReadingLevel(script),
      readabilityScore: this.calculateReadabilityScore(words, sentences),
      sentenceCount: sentences.length,
      avgWordsPerSentence: parseFloat((words.length / sentences.length).toFixed(1))
    };
  }

  calculateReadingLevel(text) {
    // Simplified Flesch-Kincaid Grade Level
    const words = text.split(/\s+/).length;
    const sentences = text.split(/[.!?]+/).filter(s => s.trim()).length;
    const syllables = this.countSyllables(text);

    const score = 0.39 * (words / sentences) + 11.8 * (syllables / words) - 15.59;
    
    if (score <= 5) return '5th grade or below';
    if (score <= 8) return '6th-8th grade';
    if (score <= 12) return '9th-12th grade';
    return 'College level';
  }

  countSyllables(text) {
    // Simplified syllable counter
    const words = text.toLowerCase().split(/\s+/);
    let count = 0;
    
    words.forEach(word => {
      const vowels = word.match(/[aeiouy]+/g);
      count += vowels ? vowels.length : 0;
    });
    
    return count;
  }

  calculateReadabilityScore(words, sentences) {
    // Flesch Reading Ease Score (0-100)
    const avgWordsPerSentence = words.length / sentences.length;
    const avgSyllablesPerWord = this.countSyllables(words.join(' ')) / words.length;
    
    const score = 206.835 - 1.015 * avgWordsPerSentence - 84.6 * avgSyllablesPerWord;
    return Math.max(0, Math.min(100, score)).toFixed(1);
  }

  calculateOverallScore(analysis) {
    const scores = [
      analysis.hookAnalysis?.hookScore || 0,
      analysis.structureAnalysis?.structureScore || 0,
      analysis.pacingAnalysis?.pacingScore || 0,
      analysis.toneAnalysis?.toneScore || 0,
      analysis.ctaAnalysis?.ctaScore || 0,
      analysis.retentionAnalysis?.retentionScore || 0
    ];

    const average = scores.reduce((a, b) => a + b, 0) / scores.length;
    return parseFloat(average.toFixed(1));
  }

  async rewriteScript(originalScript, referenceChannel, options = {}) {
    try {
      // 1. Analyze reference channel style
      const channelStyle = await this.analyzeChannelStyle(referenceChannel);

      // 2. Build rewrite prompt
      const systemPrompt = `You are an expert content writer specializing in adapting scripts to match successful creator styles. Maintain the original message and key points while transforming the delivery style.`;

      const userPrompt = `
Reference Channel Style Analysis:
${JSON.stringify(channelStyle, null, 2)}

Original Script:
"${originalScript}"

Rewrite the script to match the reference channel's style while:
1. Preserving all key points and information
2. Matching their tone, pacing, and delivery patterns
3. Using similar opening/closing styles
4. Incorporating their common phrases naturally
5. Maintaining the approximate length (unless otherwise specified)

Respond with a JSON object:
{
  "rewrittenScript": "the rewritten script",
  "appliedChanges": [
    {
      "category": "Opening | Tone | Structure | Language | etc.",
      "original": "original text",
      "rewritten": "new text",
      "reason": "explanation"
    }
  ],
  "keyPointsPreserved": ["list of preserved points"],
  "confidence": number (0-1)
}`;

      const completion = await this.openai.chat.completions.create({
        model: 'gpt-4-turbo-preview',
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: userPrompt }
        ],
        temperature: 0.7, // Higher for more creativity
        max_tokens: 2000,
        response_format: { type: 'json_object' }
      });

      const result = JSON.parse(completion.choices[0].message.content);

      return {
        ...result,
        styleAnalysis: {
          referenceChannelStyle: channelStyle,
          toneAdjustments: this.extractToneChanges(originalScript, result.rewrittenScript),
          structureChanges: this.extractStructureChanges(originalScript, result.rewrittenScript),
          pacingChanges: this.extractPacingChanges(originalScript, result.rewrittenScript)
        },
        comparisonMetrics: this.compareScripts(originalScript, result.rewrittenScript)
      };

    } catch (error) {
      throw new ExternalAPIError('OpenAI', error);
    }
  }

  async analyzeChannelStyle(channelUrl) {
    // This would fetch transcripts from top videos and analyze patterns
    // For now, return mock data structure
    return {
      channelName: "Reference Channel",
      tone: "Energetic and enthusiastic",
      pacing: "Fast with rapid-fire delivery",
      commonPhrases: ["Check this out", "Let's go", "This is insane"],
      openingStyle: "High-energy greeting",
      emphasisPattern: "Uses ALL CAPS for key words"
    };
  }

  extractToneChanges(original, rewritten) {
    return [
      "Increased energy level",
      "Added personal challenge framing",
      "Incorporated emphasis words"
    ];
  }

  extractStructureChanges(original, rewritten) {
    return [
      "Restructured to problem → solution format",
      "Strengthened hook",
      "Made CTA more direct"
    ];
  }

  extractPacingChanges(original, rewritten) {
    const origWords = original.split(/\s+/).length;
    const rewrittenWords = rewritten.split(/\s+/).length;
    const origDuration = Math.ceil(origWords / 3);
    const rewrittenDuration = Math.ceil(rewrittenWords / 3);

    return [
      `Changed from ${(origWords / origDuration).toFixed(1)} to ${(rewrittenWords / rewrittenDuration).toFixed(1)} words per second`,
      "Added more transition words",
      "Compressed explanations for speed"
    ];
  }

  compareScripts(original, rewritten) {
    const origWords = original.split(/\s+/).length;
    const rewrittenWords = rewritten.split(/\s+/).length;

    return {
      original: {
        wordCount: origWords,
        characterCount: original.length,
        estimatedDuration: Math.ceil(origWords / 3)
      },
      rewritten: {
        wordCount: rewrittenWords,
        characterCount: rewritten.length,
        estimatedDuration: Math.ceil(rewrittenWords / 3)
      }
    };
  }
}

// Usage in routes
router.post('/scripts/analyze', authenticateUser, checkPlanLimits, async (req, res, next) => {
  try {
    const validation = await validateRequest(scriptAnalysisSchema, req.body);
    if (!validation.valid) {
      throw new ValidationError(validation.errors);
    }

    const analyzer = new ScriptAnalyzer();
    const analysis = await analyzer.analyzeScript(
      validation.data.script,
      {
        targetPlatform: validation.data.targetPlatform,
        targetAudience: validation.data.targetAudience,
        analyzeDepth: validation.data.analyzeDepth
      }
    );

    analysis.analyzedAt = new Date().toISOString();

    res.json({
      success: true,
      data: { analysis }
    });

  } catch (error) {
    next(error);
  }
});

router.post('/scripts/rewrite', authenticateUser, checkPlanLimits, async (req, res, next) => {
  try {
    const { originalScript, referenceChannel } = req.body;

    if (!originalScript || !referenceChannel) {
      throw new ValidationError([
        { field: 'originalScript', message: 'Original script is required' },
        { field: 'referenceChannel', message: 'Reference channel is required' }
      ]);
    }

    const analyzer = new ScriptAnalyzer();
    const result = await analyzer.rewriteScript(originalScript, referenceChannel);

    res.json({
      success: true,
      data: result
    });

  } catch (error) {
    next(error);
  }
});
```

---

## Stripe Billing Integration

### 1. Complete Stripe Setup

```javascript
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

class BillingService {
  
  // Create customer when user registers
  async createCustomer(user) {
    try {
      const customer = await stripe.customers.create({
        email: user.email,
        name: user.name,
        metadata: {
          userId: user.id
        }
      });

      // Store Stripe customer ID
      await db.query(
        `UPDATE subscriptions SET stripe_customer_id = $1 WHERE user_id = $2`,
        [customer.id, user.id]
      );

      return customer;

    } catch (error) {
      throw new ExternalAPIError('Stripe', error);
    }
  }

  // Create checkout session for subscription
  async createCheckoutSession(userId, plan, billingCycle, successUrl, cancelUrl) {
    try {
      // Get user's subscription
      const result = await db.query(
        `SELECT stripe_customer_id FROM subscriptions WHERE user_id = $1`,
        [userId]
      );

      if (result.rows.length === 0) {
        throw new NotFoundError('Subscription');
      }

      const customerId = result.rows[0].stripe_customer_id;

      // Determine price ID based on plan and cycle
      const priceId = this.getPriceId(plan, billingCycle);

      // Create checkout session
      const session = await stripe.checkout.sessions.create({
        customer: customerId,
        payment_method_types: ['card'],
        line_items: [
          {
            price: priceId,
            quantity: 1
          }
        ],
        mode: 'subscription',
        success_url: successUrl + '?session_id={CHECKOUT_SESSION_ID}',
        cancel_url: cancelUrl,
        billing_address_collection: 'required',
        allow_promotion_codes: true,
        metadata: {
          userId: userId,
          plan: plan,
          billingCycle: billingCycle
        }
      });

      return {
        sessionId: session.id,
        checkoutUrl: session.url
      };

    } catch (error) {
      throw new ExternalAPIError('Stripe', error);
    }
  }

  getPriceId(plan, billingCycle) {
    const prices = {
      'Pro': {
        'monthly': process.env.STRIPE_PRICE_PRO_MONTHLY,
        'yearly': process.env.STRIPE_PRICE_PRO_YEARLY
      },
      'Agency': {
        'monthly': process.env.STRIPE_PRICE_AGENCY_MONTHLY,
        'yearly': process.env.STRIPE_PRICE_AGENCY_YEARLY
      }
    };

    const priceId = prices[plan]?.[billingCycle];
    
    if (!priceId) {
      throw new ValidationError([
        { field: 'plan', message: 'Invalid plan or billing cycle' }
      ]);
    }

    return priceId;
  }

  // Update subscription
  async updateSubscription(userId, newPlan, newBillingCycle) {
    try {
      // Get current subscription
      const result = await db.query(
        `SELECT stripe_subscription_id FROM subscriptions WHERE user_id = $1`,
        [userId]
      );

      if (!result.rows[0]?.stripe_subscription_id) {
        throw new NotFoundError('Active subscription');
      }

      const subscriptionId = result.rows[0].stripe_subscription_id;

      // Get subscription from Stripe
      const subscription = await stripe.subscriptions.retrieve(subscriptionId);

      // Get new price ID
      const newPriceId = this.getPriceId(newPlan, newBillingCycle);

      // Update subscription
      const updated = await stripe.subscriptions.update(subscriptionId, {
        items: [
          {
            id: subscription.items.data[0].id,
            price: newPriceId
          }
        ],
        proration_behavior: 'create_prorations'
      });

      // Update database
      await db.query(
        `UPDATE subscriptions 
         SET plan = $1, updated_at = NOW()
         WHERE user_id = $2`,
        [newPlan, userId]
      );

      return updated;

    } catch (error) {
      throw new ExternalAPIError('Stripe', error);
    }
  }

  // Cancel subscription
  async cancelSubscription(userId, cancelAtPeriodEnd = true) {
    try {
      const result = await db.query(
        `SELECT stripe_subscription_id FROM subscriptions WHERE user_id = $1`,
        [userId]
      );

      if (!result.rows[0]?.stripe_subscription_id) {
        throw new NotFoundError('Active subscription');
      }

      const subscriptionId = result.rows[0].stripe_subscription_id;

      if (cancelAtPeriodEnd) {
        // Cancel at period end
        await stripe.subscriptions.update(subscriptionId, {
          cancel_at_period_end: true
        });

        await db.query(
          `UPDATE subscriptions 
           SET cancel_at_period_end = true, updated_at = NOW()
           WHERE user_id = $1`,
          [userId]
        );
      } else {
        // Cancel immediately
        await stripe.subscriptions.cancel(subscriptionId);

        await db.query(
          `UPDATE subscriptions 
           SET status = 'cancelled', updated_at = NOW()
           WHERE user_id = $1`,
          [userId]
        );
      }

      return { success: true };

    } catch (error) {
      throw new ExternalAPIError('Stripe', error);
    }
  }

  // Update payment method
  async updatePaymentMethod(userId, paymentMethodId) {
    try {
      const result = await db.query(
        `SELECT stripe_customer_id FROM subscriptions WHERE user_id = $1`,
        [userId]
      );

      if (!result.rows[0]?.stripe_customer_id) {
        throw new NotFoundError('Customer');
      }

      const customerId = result.rows[0].stripe_customer_id;

      // Attach payment method to customer
      await stripe.paymentMethods.attach(paymentMethodId, {
        customer: customerId
      });

      // Set as default payment method
      await stripe.customers.update(customerId, {
        invoice_settings: {
          default_payment_method: paymentMethodId
        }
      });

      return { success: true };

    } catch (error) {
      throw new ExternalAPIError('Stripe', error);
    }
  }

  // Get billing history
  async getBillingHistory(userId, page = 1, limit = 20) {
    try {
      const result = await db.query(
        `SELECT stripe_customer_id FROM subscriptions WHERE user_id = $1`,
        [userId]
      );

      if (!result.rows[0]?.stripe_customer_id) {
        return { invoices: [], pagination: {} };
      }

      const customerId = result.rows[0].stripe_customer_id;

      // Fetch invoices from Stripe
      const invoices = await stripe.invoices.list({
        customer: customerId,
        limit: limit,
        starting_after: page > 1 ? await this.getStartingAfter(customerId, page, limit) : undefined
      });

      const formattedInvoices = invoices.data.map(invoice => ({
        id: invoice.id,
        invoiceNumber: invoice.number,
        date: new Date(invoice.created * 1000).toISOString(),
        amount: invoice.amount_paid / 100, // Convert from cents
        currency: invoice.currency.toUpperCase(),
        status: invoice.status,
        invoiceUrl: invoice.hosted_invoice_url,
        pdfUrl: invoice.invoice_pdf
      }));

      return {
        invoices: formattedInvoices,
        pagination: {
          currentPage: page,
          hasMore: invoices.has_more
        }
      };

    } catch (error) {
      throw new ExternalAPIError('Stripe', error);
    }
  }

  // Webhook handler
  async handleWebhook(rawBody, signature) {
    let event;

    try {
      // Verify webhook signature
      event = stripe.webhooks.constructEvent(
        rawBody,
        signature,
        process.env.STRIPE_WEBHOOK_SECRET
      );
    } catch (err) {
      throw new Error(`Webhook signature verification failed: ${err.message}`);
    }

    console.log(`Received webhook: ${event.type}`);

    // Handle different event types
    switch (event.type) {
      case 'checkout.session.completed':
        await this.handleCheckoutCompleted(event.data.object);
        break;

      case 'customer.subscription.created':
      case 'customer.subscription.updated':
        await this.handleSubscriptionUpdated(event.data.object);
        break;

      case 'customer.subscription.deleted':
        await this.handleSubscriptionDeleted(event.data.object);
        break;

      case 'invoice.paid':
        await this.handleInvoicePaid(event.data.object);
        break;

      case 'invoice.payment_failed':
        await this.handlePaymentFailed(event.data.object);
        break;

      default:
        console.log(`Unhandled event type: ${event.type}`);
    }

    return { received: true };
  }

  async handleCheckoutCompleted(session) {
    const userId = session.metadata.userId;
    const plan = session.metadata.plan;

    await db.query(
      `UPDATE subscriptions 
       SET stripe_subscription_id = $1, plan = $2, status = 'active', updated_at = NOW()
       WHERE user_id = $3`,
      [session.subscription, plan, userId]
    );
  }

  async handleSubscriptionUpdated(subscription) {
    await db.query(
      `UPDATE subscriptions 
       SET status = $1, 
           current_period_start = to_timestamp($2),
           current_period_end = to_timestamp($3),
           cancel_at_period_end = $4,
           updated_at = NOW()
       WHERE stripe_subscription_id = $5`,
      [
        subscription.status,
        subscription.current_period_start,
        subscription.current_period_end,
        subscription.cancel_at_period_end,
        subscription.id
      ]
    );
  }

  async handleSubscriptionDeleted(subscription) {
    await db.query(
      `UPDATE subscriptions 
       SET status = 'cancelled', plan = 'Free', updated_at = NOW()
       WHERE stripe_subscription_id = $1`,
      [subscription.id]
    );
  }

  async handleInvoicePaid(invoice) {
    // Get user ID from customer
    const result = await db.query(
      `SELECT user_id FROM subscriptions WHERE stripe_customer_id = $1`,
      [invoice.customer]
    );

    if (result.rows.length === 0) return;

    const userId = result.rows[0].user_id;

    // Record invoice
    await db.query(
      `INSERT INTO invoices (user_id, stripe_invoice_id, invoice_number, amount, currency, status, invoice_url, pdf_url, created_at)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, to_timestamp($9))
       ON CONFLICT (stripe_invoice_id) DO UPDATE 
       SET status = $6, invoice_url = $7, pdf_url = $8`,
      [
        userId,
        invoice.id,
        invoice.number,
        invoice.amount_paid / 100,
        invoice.currency,
        'paid',
        invoice.hosted_invoice_url,
        invoice.invoice_pdf,
        invoice.created
      ]
    );
  }

  async handlePaymentFailed(invoice) {
    // Send notification email
    const result = await db.query(
      `SELECT u.email, u.name 
       FROM users u
       JOIN subscriptions s ON u.id = s.user_id
       WHERE s.stripe_customer_id = $1`,
      [invoice.customer]
    );

    if (result.rows.length > 0) {
      const { email, name } = result.rows[0];
      // Send payment failed email
      await sendPaymentFailedEmail(email, name);
    }
  }
}

// Routes
router.post('/billing/checkout', authenticateUser, async (req, res, next) => {
  try {
    const { plan, billingCycle, successUrl, cancelUrl } = req.body;

    const billing = new BillingService();
    const session = await billing.createCheckoutSession(
      req.user.id,
      plan,
      billingCycle,
      successUrl,
      cancelUrl
    );

    res.json({
      success: true,
      data: session
    });

  } catch (error) {
    next(error);
  }
});

router.post('/billing/subscription/cancel', authenticateUser, async (req, res, next) => {
  try {
    const { cancelAtPeriodEnd = true } = req.body;

    const billing = new BillingService();
    await billing.cancelSubscription(req.user.id, cancelAtPeriodEnd);

    res.json({
      success: true,
      data: { message: 'Subscription cancelled successfully' }
    });

  } catch (error) {
    next(error);
  }
});

// Webhook endpoint (no authentication!)
router.post('/webhooks/stripe', express.raw({ type: 'application/json' }), async (req, res, next) => {
  try {
    const signature = req.headers['stripe-signature'];
    
    const billing = new BillingService();
    const result = await billing.handleWebhook(req.body, signature);

    res.json(result);

  } catch (error) {
    console.error('Webhook error:', error.message);
    res.status(400).send(`Webhook Error: ${error.message}`);
  }
});
```

---

**(Continued in final section...)**
