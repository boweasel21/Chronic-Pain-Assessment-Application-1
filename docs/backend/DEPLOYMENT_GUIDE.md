# Deployment Guide - Emergent.sh Integration

Complete step-by-step guide for deploying the Primary Cell Assessment application to Emergent.sh.

---

## Table of Contents

1. [Prerequisites](#prerequisites)
2. [MongoDB Setup](#mongodb-setup)
3. [Backend Deployment](#backend-deployment)
4. [Frontend Configuration](#frontend-configuration)
5. [Environment Variables](#environment-variables)
6. [Email Configuration](#email-configuration)
7. [Testing Checklist](#testing-checklist)
8. [Monitoring & Maintenance](#monitoring--maintenance)
9. [Troubleshooting](#troubleshooting)

---

## Prerequisites

### Required Accounts

- **Emergent.sh Account** - For backend hosting
- **MongoDB Atlas Account** - For database (free tier available)
- **SendGrid Account** - For email delivery (or AWS SES)
- **GitHub Account** - For version control

### Local Development Tools

```bash
# Node.js 18+ and npm
node --version  # Should be 18.0.0 or higher
npm --version   # Should be 9.0.0 or higher

# Python 3.10+ and pip
python --version  # Should be 3.10 or higher
pip --version

# Git
git --version
```

---

## MongoDB Setup

### 1. Create MongoDB Atlas Cluster (Free Tier)

1. Go to [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Sign up or log in
3. Create a new cluster (M0 Free tier is sufficient for development)
4. Select your preferred cloud provider and region
5. Create cluster (takes 1-3 minutes)

### 2. Configure Database Access

1. In Atlas, navigate to **Database Access**
2. Click **Add New Database User**
3. Create user with username/password
4. Grant **Read and Write to any database** role
5. Save credentials securely

### 3. Configure Network Access

1. Navigate to **Network Access**
2. Click **Add IP Address**
3. For development: **Allow Access from Anywhere** (0.0.0.0/0)
4. For production: Add specific IP addresses only

### 4. Get Connection String

1. Click **Connect** on your cluster
2. Choose **Connect your application**
3. Copy the connection string:
   ```
   mongodb+srv://<username>:<password>@cluster0.xxxxx.mongodb.net/?retryWrites=true&w=majority
   ```
4. Replace `<username>` and `<password>` with your credentials

### 5. Initialize Database

Run the database initialization script:

```bash
cd backend
python scripts/init_database.py
```

This will create collections and indexes automatically.

---

## Backend Deployment

### 1. Prepare Backend Code

Ensure your backend directory structure looks like this:

```
backend/
├── main.py
├── requirements.txt
├── .env.example
├── app/
│   ├── config.py
│   ├── database.py
│   ├── models.py
│   ├── routers/
│   │   ├── assessment.py
│   │   ├── email.py
│   │   └── health.py
│   ├── services/
│   │   ├── email_service.py
│   │   └── qualification.py
│   ├── middleware/
│   │   ├── rate_limiter.py
│   │   └── request_logger.py
│   └── utils/
│       └── sanitizer.py
```

### 2. Create Emergent.sh Configuration

Create `emergent.config.json` in the backend directory:

```json
{
  "name": "primary-cell-assessment-api",
  "runtime": "python",
  "version": "3.10",
  "entry": "main.py",
  "install": "pip install -r requirements.txt",
  "start": "uvicorn main:app --host 0.0.0.0 --port $PORT",
  "env": {
    "ENVIRONMENT": "production"
  }
}
```

### 3. Deploy to Emergent.sh

#### Option A: Using Emergent.sh CLI

```bash
# Install Emergent CLI (if not already installed)
npm install -g emergent-cli

# Login
emergent login

# Deploy backend
cd backend
emergent deploy
```

#### Option B: Using Git Integration

1. Push your code to GitHub
2. Go to Emergent.sh dashboard
3. Click **New App** → **Import from Git**
4. Select your repository
5. Configure:
   - **Root Directory:** `backend/`
   - **Build Command:** `pip install -r requirements.txt`
   - **Start Command:** `uvicorn main:app --host 0.0.0.0 --port $PORT`
6. Add environment variables (see next section)
7. Click **Deploy**

### 4. Configure Environment Variables in Emergent.sh

In the Emergent.sh dashboard, add these environment variables:

```bash
# Application
ENVIRONMENT=production

# Database
MONGODB_URI=mongodb+srv://username:password@cluster0.xxxxx.mongodb.net/
MONGODB_DATABASE=primary_cell_assessment

# Email (SendGrid)
EMAIL_PROVIDER=sendgrid
SENDGRID_API_KEY=SG.xxxxxxxxxxxxx
SENDGRID_FROM_EMAIL=noreply@primarycell.com
SENDGRID_FROM_NAME=Primary Cell Assessment

# CORS
CORS_ORIGINS=https://primarycell.com,https://www.primarycell.com

# Rate Limiting
RATE_LIMIT_ENABLED=true

# Logging
LOG_LEVEL=INFO
```

### 5. Verify Deployment

Once deployed, test the health endpoint:

```bash
curl https://your-app.emergent.sh/health
```

Expected response:
```json
{
  "status": "healthy",
  "version": "1.0.0",
  "environment": "production",
  "timestamp": "2025-01-15T10:30:00Z"
}
```

---

## Frontend Configuration

### 1. Update Environment Variables

Create `.env` from `.env.example`:

```bash
cp .env.example .env
```

Update `.env` with your production values:

```bash
# API Configuration
VITE_API_BASE_URL=https://your-app.emergent.sh

# Video Configuration
VITE_VIDEO_HIGHLIGHTS_ID=your_youtube_id
VITE_VIDEO_DEMO_ID=your_youtube_id
VITE_VIDEO_FINAL_ID=your_youtube_id

# External Links
VITE_CALENDLY_URL=https://calendly.com/your-team/discovery-call
VITE_PRIVACY_POLICY_URL=https://primarycell.com/privacy

# Feature Flags
VITE_ENABLE_EMAIL_RESULTS=true
VITE_ENABLE_AUTO_SAVE=true
```

### 2. Build Frontend

```bash
npm install
npm run build
```

This creates a `dist/` directory with production-ready files.

### 3. Deploy Frontend

#### Option A: Deploy to Vercel

```bash
# Install Vercel CLI
npm install -g vercel

# Deploy
vercel --prod
```

#### Option B: Deploy to Netlify

```bash
# Install Netlify CLI
npm install -g netlify-cli

# Deploy
netlify deploy --prod --dir=dist
```

#### Option C: Deploy to Emergent.sh

```bash
# Deploy frontend to Emergent.sh
emergent deploy --dir=dist
```

---

## Email Configuration

### SendGrid Setup

1. **Create SendGrid Account**
   - Go to [SendGrid](https://sendgrid.com)
   - Sign up for free tier (100 emails/day)

2. **Create API Key**
   - Navigate to **Settings** → **API Keys**
   - Click **Create API Key**
   - Select **Full Access**
   - Copy the API key immediately (shown only once)

3. **Verify Sender Email**
   - Navigate to **Settings** → **Sender Authentication**
   - Verify single sender email address
   - Or set up domain authentication for production

4. **Create Email Template (Optional)**
   - Navigate to **Email API** → **Dynamic Templates**
   - Create new template for assessment results
   - Copy template ID

5. **Add to Environment**
   ```bash
   SENDGRID_API_KEY=SG.xxxxxxxxxxxxx
   SENDGRID_FROM_EMAIL=noreply@primarycell.com
   SENDGRID_FROM_NAME=Primary Cell Assessment
   RESULTS_EMAIL_TEMPLATE_ID=d-xxxxxxxxxxxxxx
   ```

### AWS SES Setup (Alternative)

1. **Create AWS Account**
   - Go to [AWS Console](https://aws.amazon.com)

2. **Set Up SES**
   - Navigate to **Amazon SES**
   - Verify email address or domain
   - Request production access (by default, SES is in sandbox mode)

3. **Create IAM User**
   - Navigate to **IAM** → **Users**
   - Create user with **AmazonSESFullAccess** policy
   - Save access key and secret key

4. **Add to Environment**
   ```bash
   EMAIL_PROVIDER=aws-ses
   AWS_ACCESS_KEY_ID=AKIAxxxxxxxxxxxxx
   AWS_SECRET_ACCESS_KEY=xxxxxxxxxxxxxxxx
   AWS_REGION=us-east-1
   ```

---

## Testing Checklist

### Backend API Tests

- [ ] Health check endpoint
  ```bash
  curl https://your-app.emergent.sh/health
  ```

- [ ] Submit assessment
  ```bash
  curl -X POST https://your-app.emergent.sh/api/assessment/submit \
    -H "Content-Type: application/json" \
    -d @test-assessment.json
  ```

- [ ] Save progress
  ```bash
  curl -X POST https://your-app.emergent.sh/api/assessment/save-progress \
    -H "Content-Type: application/json" \
    -d '{"progress": {"conditions": ["Test"]}}'
  ```

- [ ] Send email results
  ```bash
  curl -X POST https://your-app.emergent.sh/api/email/send-results \
    -H "Content-Type: application/json" \
    -d '{"email": "test@example.com", "assessmentId": "test-id"}'
  ```

### Frontend Tests

- [ ] Landing page loads
- [ ] Assessment flow works end-to-end
- [ ] Form validation works
- [ ] API integration works
- [ ] Email results button works
- [ ] Video embeds load
- [ ] Calendly link works
- [ ] Mobile responsive design

### Database Tests

- [ ] Assessments saved correctly
- [ ] Leads created properly
- [ ] Email logs recorded
- [ ] Indexes working efficiently
- [ ] TTL indexes working (drafts auto-delete)

### Email Tests

- [ ] Test email delivery
- [ ] Email formatting looks good
- [ ] Links in email work
- [ ] Unsubscribe link works (if applicable)

---

## Monitoring & Maintenance

### Application Monitoring

1. **Emergent.sh Dashboard**
   - Monitor request volume
   - Track error rates
   - View response times
   - Check resource usage

2. **MongoDB Atlas Monitoring**
   - Database performance
   - Connection count
   - Storage usage
   - Slow queries

3. **SendGrid Analytics**
   - Email delivery rate
   - Open rates
   - Bounce rates

### Error Tracking with Sentry (Optional)

1. Create [Sentry](https://sentry.io) account
2. Create new project
3. Copy DSN
4. Add to environment variables:
   ```bash
   SENTRY_DSN=https://xxxxxx@sentry.io/xxxxxx
   SENTRY_ENVIRONMENT=production
   ```

### Log Management

View logs in Emergent.sh:
```bash
emergent logs --tail --app=your-app-name
```

### Backup Strategy

1. **MongoDB Backups**
   - Atlas provides automatic backups (M10+ clusters)
   - Or use `mongodump` for manual backups

2. **Code Backups**
   - Keep code in Git repository
   - Tag releases: `git tag v1.0.0`

### Performance Optimization

1. **Enable Redis for Rate Limiting**
   - Improves rate limiting performance
   - Reduces memory usage

2. **Add CDN for Frontend**
   - Use Cloudflare or similar CDN
   - Improves load times globally

3. **Database Indexing**
   - Monitor slow queries in Atlas
   - Add indexes as needed

---

## Troubleshooting

### Common Issues

#### 1. Database Connection Fails

**Error:** `Failed to connect to MongoDB`

**Solutions:**
- Verify MongoDB URI is correct
- Check network access whitelist in Atlas
- Ensure database user has correct permissions
- Test connection locally first

#### 2. CORS Errors

**Error:** `Access to fetch blocked by CORS policy`

**Solutions:**
- Add frontend domain to `CORS_ORIGINS` env variable
- Ensure protocol matches (http vs https)
- Check for typos in domain name

#### 3. Email Not Sending

**Error:** `Failed to send email`

**Solutions:**
- Verify SendGrid API key is valid
- Check sender email is verified
- Ensure daily send limit not exceeded
- Check spam folder

#### 4. Rate Limit Issues

**Error:** `Too many requests`

**Solutions:**
- Increase rate limits in environment variables
- Implement Redis for distributed rate limiting
- Check if bot/scraper is hitting API

#### 5. High Response Times

**Symptoms:** API responses > 2 seconds

**Solutions:**
- Check database indexes
- Review slow queries in MongoDB Atlas
- Enable caching
- Optimize database queries
- Upgrade Emergent.sh plan if needed

### Debug Mode

Enable debug mode for detailed logs:

```bash
# In Emergent.sh environment variables
LOG_LEVEL=DEBUG
```

View detailed logs:
```bash
emergent logs --tail --app=your-app-name
```

### Health Check Script

Create `scripts/health-check.sh`:

```bash
#!/bin/bash

API_URL="https://your-app.emergent.sh"

# Check health endpoint
health=$(curl -s $API_URL/health)
echo "Health: $health"

# Check API docs (dev only)
docs=$(curl -s -o /dev/null -w "%{http_code}" $API_URL/docs)
echo "Docs status: $docs"

# Test assessment endpoint
test=$(curl -s -X POST $API_URL/api/assessment/save-progress \
  -H "Content-Type: application/json" \
  -d '{"progress": {}}')
echo "Test save: $test"
```

Run regularly to ensure API is healthy.

---

## Rollback Procedure

If deployment fails:

1. **Revert to previous version in Emergent.sh**
   ```bash
   emergent rollback --app=your-app-name
   ```

2. **Or redeploy specific Git commit**
   ```bash
   git checkout <previous-commit>
   emergent deploy
   ```

3. **Restore database backup (if needed)**
   ```bash
   mongorestore --uri="mongodb+srv://..." --archive=backup.archive
   ```

---

## Production Checklist

Before going live, verify:

- [ ] All environment variables configured
- [ ] MongoDB in production cluster (not free tier)
- [ ] SendGrid verified and out of sandbox mode
- [ ] HTTPS enabled on all domains
- [ ] Rate limiting enabled
- [ ] Error tracking configured (Sentry)
- [ ] Backups configured
- [ ] Privacy policy linked
- [ ] Terms of service linked (if applicable)
- [ ] Monitoring alerts set up
- [ ] Load testing completed
- [ ] Security audit completed
- [ ] Documentation updated

---

## Support

For issues:
- **Emergent.sh:** [support@emergent.sh](mailto:support@emergent.sh)
- **MongoDB Atlas:** [MongoDB Support](https://support.mongodb.com)
- **SendGrid:** [SendGrid Support](https://support.sendgrid.com)

For code issues, open a GitHub issue in the repository.
