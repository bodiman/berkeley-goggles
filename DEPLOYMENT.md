# Berkeley Goggles - Production Deployment Guide

This guide walks you through deploying Berkeley Goggles to production using Vercel (frontend) and Railway (backend).

## 📋 Prerequisites

- [Node.js](https://nodejs.org/) >= 18.0.0
- [Railway CLI](https://docs.railway.app/develop/cli) (optional)
- [Vercel CLI](https://vercel.com/cli) (optional)
- AWS Account for S3 storage
- GitHub account

## 🏗️ Architecture Overview

```
┌─────────────────┐    ┌──────────────────┐    ┌─────────────────┐
│   Vercel        │    │     Railway      │    │   Railway       │
│   Frontend      │───▶│   Backend API    │───▶│   PostgreSQL    │
│   (React/Vite)  │    │   (Node.js)      │    │   Database      │
└─────────────────┘    └──────────────────┘    └─────────────────┘
                                │
                                ▼
                       ┌─────────────────┐
                       │   Railway       │
                       │   Redis Cache   │
                       └─────────────────┘
                                │
                                ▼
                       ┌─────────────────┐
                       │   AWS S3        │
                       │   File Storage  │
                       └─────────────────┘
```

## 🚢 Backend Deployment (Railway)

### Step 1: Create Railway Project

1. Go to [Railway.app](https://railway.app) and sign in
2. Click "New Project" → "Deploy from GitHub repo"
3. Select your Berkeley Goggles repository
4. **Important**: Railway will only deploy the backend API
   - The `.railwayignore` file excludes the frontend (`web/` folder)
   - Frontend should be deployed separately to Vercel
5. Choose "Deploy Now"

### Step 2: Add Services

Add these services to your Railway project:

1. **PostgreSQL Database**:
   - Click "Add Service" → "Database" → "PostgreSQL"
   - Note the connection details

2. **Redis Cache**:
   - Click "Add Service" → "Database" → "Redis"
   - Note the connection details

### Step 3: Configure Environment Variables

In Railway dashboard, go to your backend service → Variables:

```bash
# Server Configuration
NODE_ENV=production
PORT=3001

# Frontend URL (update after Vercel deployment)
FRONTEND_URL=https://your-app.vercel.app

# Database (automatically set by Railway)
DATABASE_URL=${{Postgres.DATABASE_URL}}

# Redis (automatically set by Railway)
REDIS_URL=${{Redis.REDIS_URL}}

# JWT Secrets (generate secure values)
JWT_SECRET=your_super_secure_jwt_secret_here_make_it_long
JWT_REFRESH_SECRET=your_super_secure_refresh_secret_here_make_it_long
JWT_EXPIRES_IN=1h
JWT_REFRESH_EXPIRES_IN=7d

# AWS S3 Configuration
AWS_ACCESS_KEY_ID=your_aws_access_key
AWS_SECRET_ACCESS_KEY=your_aws_secret_key
AWS_REGION=us-east-1
S3_BUCKET_NAME=berkeley-goggles-photos-prod
CLOUDFRONT_DOMAIN=your-cloudfront-domain.cloudfront.net

# Rate Limiting
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100

# Email (Optional)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your_email@gmail.com
SMTP_PASS=your_app_password

# Logging
LOG_LEVEL=info
```

### Step 4: Deploy Backend

1. Railway will automatically deploy from your main branch
2. Check deployment logs in Railway dashboard
3. Once deployed, note your backend URL: `https://your-app.railway.app`

## 🌐 Frontend Deployment (Vercel)

### Step 1: Create Vercel Project

1. Go to [Vercel.com](https://vercel.com) and sign in
2. Click "Add New" → "Project"
3. Import your Berkeley Goggles repository
4. Framework Preset: Vite
5. Root Directory: `web`
6. Build Command: `npm run build:vercel`
7. Output Directory: `dist`

### Step 2: Configure Environment Variables

In Vercel dashboard → Settings → Environment Variables:

```bash
# API Configuration
VITE_API_BASE_URL=https://your-backend-url.railway.app

# App Configuration
VITE_APP_NAME=Berkeley Goggles
VITE_APP_DESCRIPTION=Social beauty ranking community
```

### Step 3: Update Backend CORS

Update the `FRONTEND_URL` in your Railway backend environment variables with your Vercel URL:
```bash
FRONTEND_URL=https://your-app.vercel.app
```

### Step 4: Deploy Frontend

1. Vercel will automatically deploy from your main branch
2. Your app will be available at: `https://your-app.vercel.app`

## 🗄️ Database Setup

### Initialize Production Database

1. **Connect to Railway backend**:
   ```bash
   railway login
   railway environment
   railway connect
   ```

2. **Run migrations**:
   ```bash
   npx prisma migrate deploy
   ```

3. **Generate Prisma client**:
   ```bash
   npx prisma generate
   ```

## ☁️ AWS S3 Setup

### Step 1: Create S3 Bucket

1. Go to AWS Console → S3
2. Create bucket: `berkeley-goggles-photos-prod`
3. Enable versioning
4. Configure CORS:

```json
[
    {
        "AllowedHeaders": ["*"],
        "AllowedMethods": ["GET", "PUT", "POST", "DELETE"],
        "AllowedOrigins": [
            "https://your-app.vercel.app",
            "https://your-backend-url.railway.app"
        ],
        "ExposeHeaders": ["ETag"]
    }
]
```

### Step 2: Create IAM User

1. Go to AWS Console → IAM
2. Create user: `berkeley-goggles-s3`
3. Attach policy: `AmazonS3FullAccess`
4. Generate access keys
5. Add keys to Railway environment variables

### Step 3: CloudFront (Optional)

1. Create CloudFront distribution
2. Origin: Your S3 bucket
3. Update `CLOUDFRONT_DOMAIN` in Railway

## 🔍 Verification Checklist

- [ ] Backend API responds at: `https://your-backend-url.railway.app/health`
- [ ] Frontend loads at: `https://your-app.vercel.app`
- [ ] Database connection successful (check Railway logs)
- [ ] Redis connection successful (check Railway logs)
- [ ] User registration works
- [ ] User login works
- [ ] Photo upload works (if S3 configured)
- [ ] API calls work between frontend and backend
- [ ] CORS headers allow frontend domain

## 🚨 Security Considerations

1. **JWT Secrets**: Use long, random strings (>256 bits)
2. **Database**: Enable connection encryption
3. **S3**: Use IAM roles with minimal permissions
4. **Rate Limiting**: Monitor and adjust based on usage
5. **HTTPS**: Ensure all communications use HTTPS
6. **Environment Variables**: Never commit secrets to git

## 📊 Monitoring

### Railway Monitoring

- Monitor service health in Railway dashboard
- Set up usage alerts
- Monitor database performance
- Check application logs regularly

### Vercel Monitoring

- Monitor function invocations
- Check build logs for errors
- Monitor Core Web Vitals
- Set up performance alerts

## 🔄 Continuous Deployment

Both Vercel and Railway automatically deploy when you push to your main branch:

1. **Development workflow**:
   ```bash
   git add .
   git commit -m "feat: new feature"
   git push origin main
   ```

2. **Deployments will trigger automatically**
3. **Monitor deployment status in respective dashboards**

## 🐛 Troubleshooting

### Common Issues

1. **CORS Error**:
   - Verify `FRONTEND_URL` in Railway
   - Check backend CORS configuration

2. **Database Connection Failed**:
   - Check `DATABASE_URL` in Railway
   - Ensure Prisma migrations ran

3. **API Timeout**:
   - Increase timeout in `web/src/config/api.ts`
   - Check Railway service health

4. **Build Failed**:
   - Check build logs in Vercel/Railway
   - Verify environment variables

### Getting Help

- Railway: [docs.railway.app](https://docs.railway.app)
- Vercel: [vercel.com/docs](https://vercel.com/docs)
- PostgreSQL: Check Railway logs
- Redis: Check Railway logs

## 📈 Scaling Considerations

As your app grows, consider:

1. **Database**: Railway Pro for better performance
2. **CDN**: CloudFront for global distribution
3. **Monitoring**: Add error tracking (Sentry)
4. **Analytics**: Add usage tracking
5. **Caching**: Implement Redis caching strategies
6. **Load Balancing**: Multiple Railway services

---

🎉 **Congratulations!** Berkeley Goggles is now deployed to production!

Visit your app at: `https://your-app.vercel.app`