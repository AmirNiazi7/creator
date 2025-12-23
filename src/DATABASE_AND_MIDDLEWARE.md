# Database, Middleware & Background Jobs Guide

## Table of Contents
1. [Database Queries & ORM](#database-queries-orm)
2. [Middleware Examples](#middleware-examples)
3. [Video Processing & Upload](#video-processing-upload)
4. [Background Jobs](#background-jobs)
5. [Rate Limiting](#rate-limiting)
6. [Testing Examples](#testing-examples)

---

## Database Queries & ORM

### 1. PostgreSQL with node-postgres

```javascript
const { Pool } = require('pg');

// Database connection pool
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  max: 20,
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 2000,
});

// Helper function for transactions
async function withTransaction(callback) {
  const client = await pool.connect();
  try {
    await client.query('BEGIN');
    const result = await callback(client);
    await client.query('COMMIT');
    return result;
  } catch (error) {
    await client.query('ROLLBACK');
    throw error;
  } finally {
    client.release();
  }
}

// Database queries
class Database {
  
  // User queries
  static async createUser(name, email, passwordHash) {
    return withTransaction(async (client) => {
      // Create user
      const userResult = await client.query(
        `INSERT INTO users (name, email, password_hash, created_at, updated_at)
         VALUES ($1, $2, $3, NOW(), NOW())
         RETURNING id, name, email, created_at`,
        [name, email, passwordHash]
      );

      const user = userResult.rows[0];

      // Create default subscription
      await client.query(
        `INSERT INTO subscriptions (user_id, plan, status, created_at, updated_at)
         VALUES ($1, 'Free', 'active', NOW(), NOW())`,
        [user.id]
      );

      return user;
    });
  }

  static async getUserById(userId) {
    const result = await pool.query(
      `SELECT u.*, s.plan, s.status as subscription_status, s.current_period_end
       FROM users u
       LEFT JOIN subscriptions s ON u.id = s.user_id
       WHERE u.id = $1`,
      [userId]
    );

    return result.rows[0] || null;
  }

  static async getUserByEmail(email) {
    const result = await pool.query(
      `SELECT u.*, s.plan, s.status as subscription_status
       FROM users u
       LEFT JOIN subscriptions s ON u.id = s.user_id
       WHERE u.email = $1`,
      [email]
    );

    return result.rows[0] || null;
  }

  static async updateUser(userId, updates) {
    const fields = [];
    const values = [];
    let paramCount = 1;

    Object.entries(updates).forEach(([key, value]) => {
      fields.push(`${key} = $${paramCount}`);
      values.push(value);
      paramCount++;
    });

    fields.push(`updated_at = NOW()`);
    values.push(userId);

    const query = `
      UPDATE users 
      SET ${fields.join(', ')}
      WHERE id = $${paramCount}
      RETURNING *
    `;

    const result = await pool.query(query, values);
    return result.rows[0];
  }

  // Saved videos queries
  static async saveVideo(userId, videoData) {
    const result = await pool.query(
      `INSERT INTO saved_videos 
       (user_id, platform, video_id, title, url, thumbnail_url, views, likes, notes, saved_at)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, NOW())
       RETURNING *`,
      [
        userId,
        videoData.platform,
        videoData.videoId,
        videoData.title,
        videoData.url,
        videoData.thumbnailUrl,
        videoData.views,
        videoData.likes,
        videoData.notes
      ]
    );

    return result.rows[0];
  }

  static async getSavedVideos(userId, page = 1, limit = 20) {
    const offset = (page - 1) * limit;

    const countResult = await pool.query(
      'SELECT COUNT(*) FROM saved_videos WHERE user_id = $1',
      [userId]
    );

    const result = await pool.query(
      `SELECT * FROM saved_videos 
       WHERE user_id = $1 
       ORDER BY saved_at DESC 
       LIMIT $2 OFFSET $3`,
      [userId, limit, offset]
    );

    return {
      videos: result.rows,
      pagination: {
        currentPage: page,
        totalPages: Math.ceil(parseInt(countResult.rows[0].count) / limit),
        totalItems: parseInt(countResult.rows[0].count)
      }
    };
  }

  static async deleteSavedVideo(userId, videoId) {
    const result = await pool.query(
      'DELETE FROM saved_videos WHERE user_id = $1 AND id = $2 RETURNING *',
      [userId, videoId]
    );

    return result.rows[0];
  }

  // Script queries
  static async saveScript(userId, scriptData) {
    const result = await pool.query(
      `INSERT INTO scripts 
       (user_id, title, content, type, analysis, reference_channel, created_at)
       VALUES ($1, $2, $3, $4, $5, $6, NOW())
       RETURNING *`,
      [
        userId,
        scriptData.title,
        scriptData.content,
        scriptData.type,
        JSON.stringify(scriptData.analysis),
        scriptData.referenceChannel
      ]
    );

    return result.rows[0];
  }

  static async getSavedScripts(userId, filters = {}) {
    let query = 'SELECT * FROM scripts WHERE user_id = $1';
    const params = [userId];
    let paramCount = 2;

    if (filters.type) {
      query += ` AND type = $${paramCount}`;
      params.push(filters.type);
      paramCount++;
    }

    query += ` ORDER BY created_at DESC`;

    if (filters.limit) {
      const offset = ((filters.page || 1) - 1) * filters.limit;
      query += ` LIMIT $${paramCount} OFFSET $${paramCount + 1}`;
      params.push(filters.limit, offset);
    }

    const result = await pool.query(query, params);
    return result.rows;
  }

  // Channel analysis queries
  static async saveChannelAnalysis(userId, analysisData) {
    const result = await pool.query(
      `INSERT INTO channel_analyses 
       (user_id, channel_id, channel_name, channel_url, analysis_data, analyzed_at)
       VALUES ($1, $2, $3, $4, $5, NOW())
       RETURNING *`,
      [
        userId,
        analysisData.channelId,
        analysisData.channelName,
        analysisData.channelUrl,
        JSON.stringify(analysisData.data)
      ]
    );

    return result.rows[0];
  }

  static async getAnalysisHistory(userId, page = 1, limit = 20) {
    const offset = (page - 1) * limit;

    const result = await pool.query(
      `SELECT id, channel_name, channel_url, analyzed_at,
              (analysis_data->>'totalShorts')::int as total_shorts,
              (analysis_data->>'avgViews')::int as avg_views
       FROM channel_analyses 
       WHERE user_id = $1 
       ORDER BY analyzed_at DESC 
       LIMIT $2 OFFSET $3`,
      [userId, limit, offset]
    );

    return result.rows;
  }

  // Post queries
  static async createPost(userId, postData) {
    const result = await pool.query(
      `INSERT INTO posts 
       (user_id, caption, video_url, thumbnail_url, platforms, status, scheduled_at, created_at)
       VALUES ($1, $2, $3, $4, $5, $6, $7, NOW())
       RETURNING *`,
      [
        userId,
        postData.caption,
        postData.videoUrl,
        postData.thumbnailUrl,
        JSON.stringify(postData.platforms),
        postData.status,
        postData.scheduledAt
      ]
    );

    return result.rows[0];
  }

  static async updatePostStatus(postId, status, platformResults = null) {
    const updates = { status };
    if (platformResults) {
      updates.platforms = JSON.stringify(platformResults);
    }

    const result = await pool.query(
      `UPDATE posts 
       SET status = $1, platforms = COALESCE($2, platforms), updated_at = NOW()
       WHERE id = $3
       RETURNING *`,
      [status, platformResults ? JSON.stringify(platformResults) : null, postId]
    );

    return result.rows[0];
  }

  static async getPostById(postId) {
    const result = await pool.query(
      'SELECT * FROM posts WHERE id = $1',
      [postId]
    );

    return result.rows[0];
  }

  static async getPostHistory(userId, filters = {}) {
    let query = 'SELECT * FROM posts WHERE user_id = $1';
    const params = [userId];
    let paramCount = 2;

    if (filters.status) {
      query += ` AND status = $${paramCount}`;
      params.push(filters.status);
      paramCount++;
    }

    if (filters.platform) {
      query += ` AND platforms::jsonb @> $${paramCount}::jsonb`;
      params.push(JSON.stringify([filters.platform]));
      paramCount++;
    }

    query += ` ORDER BY created_at DESC`;

    if (filters.limit) {
      const offset = ((filters.page || 1) - 1) * filters.limit;
      query += ` LIMIT $${paramCount} OFFSET $${paramCount + 1}`;
      params.push(filters.limit, offset);
    }

    const result = await pool.query(query, params);
    return result.rows;
  }

  // Usage tracking (for plan limits)
  static async trackUsage(userId, feature, increment = 1) {
    await pool.query(
      `INSERT INTO usage_tracking (user_id, feature, count, period_start, period_end)
       VALUES ($1, $2, $3, date_trunc('month', NOW()), date_trunc('month', NOW()) + INTERVAL '1 month')
       ON CONFLICT (user_id, feature, period_start) 
       DO UPDATE SET count = usage_tracking.count + $3`,
      [userId, feature, increment]
    );
  }

  static async getUsage(userId, feature, period = 'month') {
    const result = await pool.query(
      `SELECT COALESCE(SUM(count), 0) as total
       FROM usage_tracking 
       WHERE user_id = $1 
         AND feature = $2 
         AND period_start >= date_trunc($3, NOW())`,
      [userId, feature, period]
    );

    return parseInt(result.rows[0].total);
  }

  // Platform connections
  static async savePlatformConnection(userId, platform, connectionData) {
    const result = await pool.query(
      `INSERT INTO platform_connections 
       (user_id, platform, access_token, refresh_token, token_expires_at, username, platform_user_id, connected_at)
       VALUES ($1, $2, $3, $4, $5, $6, $7, NOW())
       ON CONFLICT (user_id, platform) 
       DO UPDATE SET 
         access_token = $3,
         refresh_token = $4,
         token_expires_at = $5,
         username = $6,
         platform_user_id = $7,
         connected_at = NOW()
       RETURNING *`,
      [
        userId,
        platform,
        connectionData.accessToken,
        connectionData.refreshToken,
        connectionData.tokenExpiresAt,
        connectionData.username,
        connectionData.platformUserId
      ]
    );

    return result.rows[0];
  }

  static async getPlatformConnection(userId, platform) {
    const result = await pool.query(
      'SELECT * FROM platform_connections WHERE user_id = $1 AND platform = $2',
      [userId, platform]
    );

    return result.rows[0];
  }

  static async deletePlatformConnection(userId, platform) {
    await pool.query(
      'DELETE FROM platform_connections WHERE user_id = $1 AND platform = $2',
      [userId, platform]
    );
  }
}

module.exports = Database;
```

---

## Middleware Examples

### 1. Authentication Middleware

```javascript
const jwt = require('jsonwebtoken');

// Authenticate user from JWT
async function authenticateUser(req, res, next) {
  try {
    // Get token from header
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      throw new AuthenticationError('No token provided');
    }

    const token = authHeader.substring(7);

    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Get user from database
    const user = await Database.getUserById(decoded.userId);

    if (!user) {
      throw new AuthenticationError('User not found');
    }

    // Attach user to request
    req.user = user;
    next();

  } catch (error) {
    if (error.name === 'TokenExpiredError') {
      next(new AuthenticationError('Token expired'));
    } else if (error.name === 'JsonWebTokenError') {
      next(new AuthenticationError('Invalid token'));
    } else {
      next(error);
    }
  }
}

// Optional authentication (doesn't fail if no token)
async function optionalAuth(req, res, next) {
  try {
    const authHeader = req.headers.authorization;

    if (authHeader && authHeader.startsWith('Bearer ')) {
      const token = authHeader.substring(7);
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      req.user = await Database.getUserById(decoded.userId);
    }

    next();
  } catch (error) {
    // Continue without user
    next();
  }
}
```

---

### 2. Plan Limits Middleware

```javascript
const PLAN_LIMITS = {
  Free: {
    viralContentQueries: 20,
    analyticsQueries: 5,
    scriptAnalyses: 3,
    postsPerMonth: 0
  },
  Pro: {
    viralContentQueries: null, // unlimited
    analyticsQueries: null,
    scriptAnalyses: null,
    postsPerMonth: null
  },
  Agency: {
    viralContentQueries: null,
    analyticsQueries: null,
    scriptAnalyses: null,
    postsPerMonth: null
  }
};

// Middleware to check plan limits
function checkPlanLimits(feature) {
  return async (req, res, next) => {
    try {
      const user = req.user;
      
      if (!user) {
        throw new AuthenticationError('User not authenticated');
      }

      const plan = user.plan || 'Free';
      const limit = PLAN_LIMITS[plan][feature];

      // Unlimited access
      if (limit === null) {
        return next();
      }

      // Check current usage
      const usage = await Database.getUsage(user.id, feature, 'month');

      if (usage >= limit) {
        throw new APIError(
          'PLAN_LIMIT_REACHED',
          `You've reached your ${plan} plan limit for ${feature}. Upgrade to Pro for unlimited access.`,
          403,
          {
            feature,
            limit,
            currentUsage: usage,
            plan
          }
        );
      }

      // Track this usage
      await Database.trackUsage(user.id, feature, 1);

      // Add usage info to request
      req.usage = {
        feature,
        limit,
        current: usage + 1,
        remaining: limit - usage - 1
      };

      next();

    } catch (error) {
      next(error);
    }
  };
}

// Usage in routes
router.get('/viral-content', 
  authenticateUser, 
  checkPlanLimits('viralContentQueries'), 
  async (req, res, next) => {
    // Route handler
  }
);

router.post('/scripts/analyze', 
  authenticateUser, 
  checkPlanLimits('scriptAnalyses'), 
  async (req, res, next) => {
    // Route handler
  }
);
```

---

### 3. Rate Limiting Middleware

```javascript
const redis = require('redis');
const redisClient = redis.createClient({ url: process.env.REDIS_URL });

redisClient.on('error', err => console.error('Redis error:', err));
redisClient.connect();

// Rate limit by IP
function rateLimitByIP(maxRequests = 100, windowSeconds = 3600) {
  return async (req, res, next) => {
    try {
      const ip = req.ip || req.connection.remoteAddress;
      const key = `ratelimit:ip:${ip}`;

      // Get current count
      const current = await redisClient.get(key);

      if (current && parseInt(current) >= maxRequests) {
        const ttl = await redisClient.ttl(key);
        
        throw new RateLimitError(
          new Date(Date.now() + ttl * 1000).toISOString()
        );
      }

      // Increment counter
      await redisClient.incr(key);
      
      // Set expiry on first request
      if (!current) {
        await redisClient.expire(key, windowSeconds);
      }

      next();

    } catch (error) {
      next(error);
    }
  };
}

// Rate limit by user
function rateLimitByUser(maxRequests = 500, windowSeconds = 3600) {
  return async (req, res, next) => {
    try {
      if (!req.user) {
        return next();
      }

      const userId = req.user.id;
      const key = `ratelimit:user:${userId}`;

      const current = await redisClient.get(key);

      if (current && parseInt(current) >= maxRequests) {
        const ttl = await redisClient.ttl(key);
        
        throw new RateLimitError(
          new Date(Date.now() + ttl * 1000).toISOString()
        );
      }

      await redisClient.incr(key);
      
      if (!current) {
        await redisClient.expire(key, windowSeconds);
      }

      next();

    } catch (error) {
      next(error);
    }
  };
}

// Apply rate limiting
app.use(rateLimitByIP(100, 3600)); // 100 requests per hour per IP

router.use(authenticateUser, rateLimitByUser(500, 3600)); // 500 per hour per user
```

---

### 4. Request ID & Logging Middleware

```javascript
const { v4: uuidv4 } = require('uuid');

// Add request ID
function addRequestId(req, res, next) {
  req.id = uuidv4();
  res.setHeader('X-Request-ID', req.id);
  next();
}

// Request logging
function logRequest(req, res, next) {
  const start = Date.now();

  // Log when response finishes
  res.on('finish', () => {
    const duration = Date.now() - start;

    console.log({
      requestId: req.id,
      method: req.method,
      path: req.path,
      statusCode: res.statusCode,
      duration: `${duration}ms`,
      userId: req.user?.id,
      userAgent: req.headers['user-agent'],
      ip: req.ip
    });
  });

  next();
}

app.use(addRequestId);
app.use(logRequest);
```

---

## Video Processing & Upload

### 1. Video Upload with Multer & AWS S3

```javascript
const multer = require('multer');
const AWS = require('aws-sdk');
const ffmpeg = require('fluent-ffmpeg');
const { promisify } = require('util');
const fs = require('fs');
const path = require('path');

// Configure AWS S3
const s3 = new AWS.S3({
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  region: process.env.AWS_REGION
});

// Multer configuration
const upload = multer({
  dest: '/tmp/uploads/',
  limits: {
    fileSize: 500 * 1024 * 1024 // 500MB
  },
  fileFilter: (req, file, cb) => {
    const allowedMimes = ['video/mp4', 'video/quicktime', 'video/x-msvideo'];
    
    if (allowedMimes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new ValidationError([{
        field: 'video',
        message: 'Only MP4, MOV, and AVI files are allowed'
      }]));
    }
  }
});

class VideoProcessor {
  
  async processUpload(file, userId) {
    try {
      // 1. Validate video
      const metadata = await this.getVideoMetadata(file.path);
      this.validateVideo(metadata);

      // 2. Generate thumbnail
      const thumbnailPath = await this.generateThumbnail(file.path, 5.0);

      // 3. Upload to S3
      const videoUrl = await this.uploadToS3(
        file.path,
        `uploads/${userId}/${Date.now()}_${file.originalname}`
      );

      const thumbnailUrl = await this.uploadToS3(
        thumbnailPath,
        `thumbnails/${userId}/${Date.now()}_thumb.jpg`
      );

      // 4. Cleanup temp files
      await fs.promises.unlink(file.path);
      await fs.promises.unlink(thumbnailPath);

      return {
        videoUrl,
        thumbnailUrl,
        metadata
      };

    } catch (error) {
      // Cleanup on error
      if (fs.existsSync(file.path)) {
        await fs.promises.unlink(file.path);
      }
      throw error;
    }
  }

  getVideoMetadata(filePath) {
    return new Promise((resolve, reject) => {
      ffmpeg.ffprobe(filePath, (err, metadata) => {
        if (err) return reject(err);

        const videoStream = metadata.streams.find(s => s.codec_type === 'video');
        
        if (!videoStream) {
          return reject(new Error('No video stream found'));
        }

        resolve({
          duration: metadata.format.duration,
          size: metadata.format.size,
          width: videoStream.width,
          height: videoStream.height,
          fps: eval(videoStream.r_frame_rate), // e.g., "30/1" -> 30
          codec: videoStream.codec_name,
          bitrate: metadata.format.bit_rate,
          format: metadata.format.format_name
        });
      });
    });
  }

  validateVideo(metadata) {
    const errors = [];

    // Check duration (max 10 minutes for TikTok)
    if (metadata.duration > 600) {
      errors.push({
        field: 'duration',
        message: `Video duration (${Math.floor(metadata.duration)}s) exceeds maximum (600s)`
      });
    }

    // Check aspect ratio (should be 9:16 for Shorts)
    const aspectRatio = metadata.width / metadata.height;
    if (aspectRatio < 0.5 || aspectRatio > 0.6) {
      console.warn(`Non-optimal aspect ratio: ${aspectRatio.toFixed(2)} (recommended: 0.5625 for 9:16)`);
    }

    // Check resolution
    if (metadata.height < 720) {
      errors.push({
        field: 'resolution',
        message: 'Minimum resolution is 720p'
      });
    }

    if (errors.length > 0) {
      throw new ValidationError(errors);
    }
  }

  generateThumbnail(videoPath, timestamp = 5.0) {
    return new Promise((resolve, reject) => {
      const outputPath = path.join('/tmp', `thumb_${Date.now()}.jpg`);

      ffmpeg(videoPath)
        .screenshots({
          timestamps: [timestamp],
          filename: path.basename(outputPath),
          folder: path.dirname(outputPath),
          size: '720x1280'
        })
        .on('end', () => resolve(outputPath))
        .on('error', reject);
    });
  }

  async uploadToS3(filePath, s3Key) {
    const fileContent = await fs.promises.readFile(filePath);
    
    const params = {
      Bucket: process.env.AWS_S3_BUCKET,
      Key: s3Key,
      Body: fileContent,
      ContentType: path.extname(filePath) === '.jpg' ? 'image/jpeg' : 'video/mp4',
      ACL: 'public-read'
    };

    const result = await s3.upload(params).promise();
    return result.Location;
  }

  // Transcode video for different platforms (if needed)
  async transcodeForPlatform(inputPath, platform) {
    return new Promise((resolve, reject) => {
      const outputPath = path.join('/tmp', `transcoded_${Date.now()}.mp4`);

      let ffmpegCommand = ffmpeg(inputPath)
        .videoCodec('libx264')
        .audioCodec('aac')
        .format('mp4');

      // Platform-specific settings
      switch (platform) {
        case 'tiktok':
          ffmpegCommand
            .size('1080x1920')
            .videoBitrate('8000k')
            .fps(30);
          break;

        case 'instagram':
          ffmpegCommand
            .size('1080x1920')
            .videoBitrate('5000k')
            .fps(30);
          break;

        case 'youtube':
          ffmpegCommand
            .size('1080x1920')
            .videoBitrate('8000k')
            .fps(60);
          break;
      }

      ffmpegCommand
        .on('end', () => resolve(outputPath))
        .on('error', reject)
        .save(outputPath);
    });
  }
}

// Route handler
router.post('/posting/upload',
  authenticateUser,
  upload.single('video'),
  async (req, res, next) => {
    try {
      if (!req.file) {
        throw new ValidationError([{
          field: 'video',
          message: 'Video file is required'
        }]);
      }

      const { caption, hashtags, platforms, scheduledAt } = req.body;

      // Parse platforms
      const platformsArray = JSON.parse(platforms || '[]');

      if (platformsArray.length === 0) {
        throw new ValidationError([{
          field: 'platforms',
          message: 'At least one platform must be selected'
        }]);
      }

      // Process video
      const processor = new VideoProcessor();
      const { videoUrl, thumbnailUrl, metadata } = await processor.processUpload(
        req.file,
        req.user.id
      );

      // Create post record
      const post = await Database.createPost(req.user.id, {
        caption,
        videoUrl,
        thumbnailUrl,
        platforms: platformsArray,
        status: scheduledAt ? 'scheduled' : 'processing',
        scheduledAt: scheduledAt || null
      });

      // Queue for publishing (background job)
      if (!scheduledAt) {
        await publishQueue.add('publish-video', {
          postId: post.id,
          userId: req.user.id,
          videoUrl,
          caption,
          hashtags,
          platforms: platformsArray
        });
      }

      res.status(202).json({
        success: true,
        data: {
          postId: post.id,
          status: post.status,
          uploadedFile: {
            originalFilename: req.file.originalname,
            size: req.file.size,
            duration: metadata.duration,
            resolution: `${metadata.width}x${metadata.height}`,
            aspectRatio: `${metadata.width}:${metadata.height}`,
            storageUrl: videoUrl,
            thumbnailUrl
          },
          platforms: platformsArray.map(p => ({
            platform: p,
            status: 'queued'
          })),
          scheduledAt,
          createdAt: post.created_at
        }
      });

    } catch (error) {
      next(error);
    }
  }
);
```

---

## Background Jobs

### 1. Bull Queue Setup

```javascript
const Queue = require('bull');

// Create queues
const publishQueue = new Queue('publish-video', process.env.REDIS_URL);
const scrapingQueue = new Queue('viral-scraping', process.env.REDIS_URL);
const emailQueue = new Queue('emails', process.env.REDIS_URL);

// Video publishing processor
publishQueue.process('publish-video', async (job) => {
  const { postId, userId, videoUrl, caption, hashtags, platforms } = job.data;

  console.log(`Processing post ${postId} for user ${userId}`);

  const results = [];

  for (const platform of platforms) {
    try {
      job.progress(results.length / platforms.length * 100);

      let result;
      switch (platform) {
        case 'tiktok':
          result = await publishToTikTok(userId, videoUrl, caption, hashtags);
          break;
        case 'instagram':
          result = await publishToInstagram(userId, videoUrl, caption, hashtags);
          break;
        case 'youtube':
          result = await publishToYouTube(userId, videoUrl, caption, hashtags);
          break;
      }

      results.push({
        platform,
        status: 'published',
        postUrl: result.url,
        platformPostId: result.id,
        publishedAt: new Date().toISOString()
      });

    } catch (error) {
      console.error(`Failed to publish to ${platform}:`, error);
      
      results.push({
        platform,
        status: 'failed',
        error: {
          code: error.code || 'UNKNOWN_ERROR',
          message: error.message
        },
        failedAt: new Date().toISOString()
      });
    }
  }

  // Update post status
  const allPublished = results.every(r => r.status === 'published');
  const allFailed = results.every(r => r.status === 'failed');

  const status = allPublished ? 'published' : allFailed ? 'failed' : 'partially_published';

  await Database.updatePostStatus(postId, status, results);

  return { postId, status, results };
});

// Handle job completion
publishQueue.on('completed', (job, result) => {
  console.log(`Job ${job.id} completed:`, result);
  
  // Send notification email
  emailQueue.add('post-published', {
    userId: job.data.userId,
    postId: result.postId,
    status: result.status
  });
});

publishQueue.on('failed', (job, err) => {
  console.error(`Job ${job.id} failed:`, err);
});

// Viral content scraping processor
scrapingQueue.process('scrape-tiktok', async (job) => {
  const { platform, trending, region } = job.data;

  const videos = await scrapeViralTikTokVideos({ trending, region, limit: 50 });

  // Cache results
  await redis.setex(
    `viral_${platform}:${trending}:${region}`,
    3600,
    JSON.stringify(videos)
  );

  return { count: videos.length };
});

// Schedule periodic scraping
const cron = require('node-cron');

// Every 6 hours
cron.schedule('0 */6 * * *', async () => {
  console.log('Starting viral content scraping...');

  await scrapingQueue.add('scrape-tiktok', {
    platform: 'TikTok',
    trending: 'daily',
    region: 'US'
  });

  await scrapingQueue.add('scrape-tiktok', {
    platform: 'TikTok',
    trending: 'weekly',
    region: 'US'
  });
});

// Email processor
emailQueue.process('post-published', async (job) => {
  const { userId, postId, status } = job.data;

  const user = await Database.getUserById(userId);
  
  if (!user) return;

  await sendEmail({
    to: user.email,
    subject: 'Your post has been published',
    template: 'post-published',
    data: {
      name: user.name,
      postId,
      status
    }
  });
});
```

---

### 2. Platform Publishing Functions

```javascript
// TikTok publishing
async function publishToTikTok(userId, videoUrl, caption, hashtags) {
  const connection = await Database.getPlatformConnection(userId, 'tiktok');

  if (!connection) {
    throw new Error('TikTok account not connected');
  }

  // Download video from S3
  const videoPath = await downloadVideo(videoUrl);

  try {
    // Upload to TikTok
    const response = await axios.post(
      'https://open-api.tiktok.com/share/video/upload/',
      {
        video: fs.createReadStream(videoPath),
        title: caption,
        hashtags: hashtags ? hashtags.split(',').map(h => h.trim()) : []
      },
      {
        headers: {
          'Authorization': `Bearer ${connection.access_token}`,
          'Content-Type': 'multipart/form-data'
        }
      }
    );

    // Cleanup
    await fs.promises.unlink(videoPath);

    return {
      id: response.data.share_id,
      url: `https://www.tiktok.com/@${connection.username}/video/${response.data.share_id}`
    };

  } catch (error) {
    await fs.promises.unlink(videoPath);
    throw error;
  }
}

// Instagram publishing
async function publishToInstagram(userId, videoUrl, caption, hashtags) {
  const connection = await Database.getPlatformConnection(userId, 'instagram');

  if (!connection) {
    throw new Error('Instagram account not connected');
  }

  const fullCaption = hashtags ? `${caption}\n\n${hashtags}` : caption;

  // Create media container
  const containerResponse = await axios.post(
    `https://graph.facebook.com/v18.0/${connection.platform_user_id}/media`,
    {
      media_type: 'REELS',
      video_url: videoUrl,
      caption: fullCaption,
      access_token: connection.access_token
    }
  );

  const containerId = containerResponse.data.id;

  // Publish media
  const publishResponse = await axios.post(
    `https://graph.facebook.com/v18.0/${connection.platform_user_id}/media_publish`,
    {
      creation_id: containerId,
      access_token: connection.access_token
    }
  );

  return {
    id: publishResponse.data.id,
    url: `https://www.instagram.com/reel/${publishResponse.data.id}/`
  };
}

// YouTube publishing
async function publishToYouTube(userId, videoUrl, caption, hashtags) {
  const connection = await Database.getPlatformConnection(userId, 'youtube');

  if (!connection) {
    throw new Error('YouTube account not connected');
  }

  const google = require('googleapis').google;
  const OAuth2 = google.auth.OAuth2;

  const oauth2Client = new OAuth2(
    process.env.YOUTUBE_CLIENT_ID,
    process.env.YOUTUBE_CLIENT_SECRET
  );

  oauth2Client.setCredentials({
    access_token: connection.access_token,
    refresh_token: connection.refresh_token
  });

  const youtube = google.youtube({ version: 'v3', auth: oauth2Client });

  const videoPath = await downloadVideo(videoUrl);

  try {
    const response = await youtube.videos.insert({
      part: 'snippet,status',
      requestBody: {
        snippet: {
          title: caption.substring(0, 100),
          description: caption + (hashtags ? `\n\n${hashtags}` : ''),
          categoryId: '22' // People & Blogs
        },
        status: {
          privacyStatus: 'public',
          selfDeclaredMadeForKids: false
        }
      },
      media: {
        body: fs.createReadStream(videoPath)
      }
    });

    await fs.promises.unlink(videoPath);

    return {
      id: response.data.id,
      url: `https://www.youtube.com/watch?v=${response.data.id}`
    };

  } catch (error) {
    await fs.promises.unlink(videoPath);
    throw error;
  }
}

async function downloadVideo(url) {
  const response = await axios({
    method: 'get',
    url,
    responseType: 'stream'
  });

  const tempPath = `/tmp/video_${Date.now()}.mp4`;
  const writer = fs.createWriteStream(tempPath);

  response.data.pipe(writer);

  return new Promise((resolve, reject) => {
    writer.on('finish', () => resolve(tempPath));
    writer.on('error', reject);
  });
}
```

---

## Testing Examples

### 1. Unit Tests with Jest

```javascript
// tests/auth.test.js
const request = require('supertest');
const app = require('../app');
const Database = require('../database');

describe('Authentication', () => {
  
  beforeEach(async () => {
    // Clean database before each test
    await Database.query('DELETE FROM users WHERE email LIKE \'test%\'');
  });

  describe('POST /auth/register', () => {
    it('should create a new user', async () => {
      const res = await request(app)
        .post('/auth/register')
        .send({
          name: 'Test User',
          email: 'test@example.com',
          password: 'TestPass123'
        });

      expect(res.statusCode).toBe(201);
      expect(res.body.success).toBe(true);
      expect(res.body.data.user).toHaveProperty('id');
      expect(res.body.data.user.email).toBe('test@example.com');
      expect(res.body.data.tokens).toHaveProperty('accessToken');
    });

    it('should reject weak passwords', async () => {
      const res = await request(app)
        .post('/auth/register')
        .send({
          name: 'Test User',
          email: 'test@example.com',
          password: 'weak'
        });

      expect(res.statusCode).toBe(400);
      expect(res.body.error.code).toBe('VALIDATION_ERROR');
    });

    it('should reject duplicate emails', async () => {
      // First registration
      await request(app)
        .post('/auth/register')
        .send({
          name: 'Test User',
          email: 'test@example.com',
          password: 'TestPass123'
        });

      // Duplicate registration
      const res = await request(app)
        .post('/auth/register')
        .send({
          name: 'Test User 2',
          email: 'test@example.com',
          password: 'TestPass123'
        });

      expect(res.statusCode).toBe(409);
      expect(res.body.error.code).toBe('EMAIL_EXISTS');
    });
  });

  describe('POST /auth/login', () => {
    beforeEach(async () => {
      // Create test user
      await request(app)
        .post('/auth/register')
        .send({
          name: 'Test User',
          email: 'test@example.com',
          password: 'TestPass123'
        });
    });

    it('should login with valid credentials', async () => {
      const res = await request(app)
        .post('/auth/login')
        .send({
          email: 'test@example.com',
          password: 'TestPass123'
        });

      expect(res.statusCode).toBe(200);
      expect(res.body.data.tokens).toHaveProperty('accessToken');
    });

    it('should reject invalid credentials', async () => {
      const res = await request(app)
        .post('/auth/login')
        .send({
          email: 'test@example.com',
          password: 'WrongPassword'
        });

      expect(res.statusCode).toBe(401);
      expect(res.body.error.code).toBe('INVALID_CREDENTIALS');
    });
  });
});
```

---

### 2. Integration Tests

```javascript
// tests/viral-content.test.js
describe('Viral Content', () => {
  let authToken;
  let userId;

  beforeAll(async () => {
    // Register and login
    const registerRes = await request(app)
      .post('/auth/register')
      .send({
        name: 'Test User',
        email: 'test-viral@example.com',
        password: 'TestPass123'
      });

    authToken = registerRes.body.data.tokens.accessToken;
    userId = registerRes.body.data.user.id;
  });

  describe('GET /viral-content', () => {
    it('should return viral videos', async () => {
      const res = await request(app)
        .get('/viral-content')
        .set('Authorization', `Bearer ${authToken}`)
        .query({ platform: 'TikTok', trending: 'daily' });

      expect(res.statusCode).toBe(200);
      expect(res.body.data.videos).toBeInstanceOf(Array);
      expect(res.body.data.pagination).toHaveProperty('currentPage');
    });

    it('should require authentication', async () => {
      const res = await request(app)
        .get('/viral-content');

      expect(res.statusCode).toBe(401);
    });

    it('should respect plan limits', async () => {
      // Make 21 requests (Free plan limit is 20/day)
      for (let i = 0; i < 21; i++) {
        const res = await request(app)
          .get('/viral-content')
          .set('Authorization', `Bearer ${authToken}`);

        if (i < 20) {
          expect(res.statusCode).toBe(200);
        } else {
          expect(res.statusCode).toBe(403);
          expect(res.body.error.code).toBe('PLAN_LIMIT_REACHED');
        }
      }
    });
  });

  describe('POST /viral-content/save', () => {
    it('should save a video', async () => {
      const res = await request(app)
        .post('/viral-content/save')
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          videoId: 'tiktok_123',
          platform: 'TikTok',
          notes: 'Great hook!'
        });

      expect(res.statusCode).toBe(201);
      expect(res.body.data.savedVideo).toHaveProperty('id');
    });
  });
});
```

---

This completes the comprehensive backend implementation guide! You now have:

1. **Complete API documentation** with all endpoints, payloads, and responses
2. **Detailed code examples** for all major integrations
3. **Database schemas** and query examples
4. **Middleware** for authentication, rate limiting, and plan limits
5. **Video processing** and multi-platform publishing
6. **Background jobs** with Bull queues
7. **Testing examples** for unit and integration tests

Your backend developer has everything needed to implement the full platform! 🚀