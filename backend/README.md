# Primary Cell Assessment API

FastAPI backend for the Primary Cell chronic pain assessment application.

## Features

- **Complete Assessment Submission** - Save completed assessments with lead qualification
- **Auto-Save Progress** - Save incomplete assessments for later completion
- **Email Results** - Send personalized assessment results via email
- **Lead Management** - Automatic lead creation and qualification
- **Rate Limiting** - Protect against API abuse
- **PII Protection** - Secure handling of personally identifiable information
- **Type Safety** - Full Pydantic validation for all requests/responses
- **MongoDB Integration** - Scalable NoSQL database with indexes
- **Comprehensive Error Handling** - Structured error responses
- **Production Ready** - Designed for Emergent.sh deployment

## Quick Start

### Prerequisites

- Python 3.10+
- MongoDB (local or Atlas)
- SendGrid API key (or AWS SES)

### Installation

```bash
# Clone repository
git clone <repository-url>
cd backend

# Create virtual environment
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt

# Configure environment
cp .env.example .env
nano .env  # Edit with your values
```

### Configuration

Edit `.env` with your settings:

```bash
# Database
MONGODB_URI=mongodb://localhost:27017
MONGODB_DATABASE=primary_cell_assessment

# Email
EMAIL_PROVIDER=sendgrid
SENDGRID_API_KEY=your_api_key
SENDGRID_FROM_EMAIL=noreply@primarycell.com
```

### Run Locally

```bash
# Development mode with auto-reload
uvicorn main:app --reload

# Production mode
uvicorn main:app --host 0.0.0.0 --port 8000
```

API will be available at `http://localhost:8000`

### API Documentation

Once running, visit:
- **Swagger UI:** http://localhost:8000/docs
- **ReDoc:** http://localhost:8000/redoc

## Project Structure

```
backend/
├── main.py                 # FastAPI application entry point
├── requirements.txt        # Python dependencies
├── .env.example           # Environment template
├── app/
│   ├── config.py          # Configuration settings
│   ├── database.py        # MongoDB connection
│   ├── models.py          # Pydantic models
│   ├── routers/           # API endpoints
│   │   ├── assessment.py  # Assessment endpoints
│   │   ├── email.py       # Email endpoints
│   │   └── health.py      # Health check
│   ├── services/          # Business logic
│   │   ├── email_service.py
│   │   └── qualification.py
│   ├── middleware/        # Request middleware
│   │   ├── rate_limiter.py
│   │   └── request_logger.py
│   └── utils/            # Utility functions
│       └── sanitizer.py
└── docs/                 # Documentation
    ├── API_ENDPOINTS.md
    ├── MONGODB_MODELS.md
    ├── DEPLOYMENT_GUIDE.md
    └── INTEGRATION_SETUP.md
```

## API Endpoints

### Health Check
- `GET /health` - Check API health and database connectivity

### Assessment
- `POST /api/assessment/submit` - Submit complete assessment
- `POST /api/assessment/save-progress` - Save incomplete assessment

### Email
- `POST /api/email/send-results` - Send assessment results via email

See [API_ENDPOINTS.md](../docs/backend/API_ENDPOINTS.md) for complete documentation.

## Database Schema

Collections:
- **assessments** - Completed and draft assessments
- **leads** - Lead information for follow-up
- **email_logs** - Email delivery tracking

See [MONGODB_MODELS.md](../docs/backend/MONGODB_MODELS.md) for complete schema.

## Deployment

### Emergent.sh

```bash
# Install Emergent CLI
npm install -g emergent-cli

# Login
emergent login

# Deploy
emergent deploy
```

See [DEPLOYMENT_GUIDE.md](../docs/backend/DEPLOYMENT_GUIDE.md) for detailed instructions.

### Docker (Optional)

```bash
# Build image
docker build -t primary-cell-api .

# Run container
docker run -p 8000:8000 --env-file .env primary-cell-api
```

## Testing

```bash
# Install test dependencies
pip install pytest pytest-asyncio httpx

# Run tests
pytest

# Run with coverage
pytest --cov=app
```

## Environment Variables

See `.env.example` for all available configuration options.

### Required Variables

- `MONGODB_URI` - MongoDB connection string
- `MONGODB_DATABASE` - Database name
- `SENDGRID_API_KEY` - SendGrid API key (if using SendGrid)

### Optional Variables

- `CORS_ORIGINS` - Additional allowed origins
- `RATE_LIMIT_*` - Custom rate limits
- `SENTRY_DSN` - Error tracking
- `REDIS_URL` - Redis for rate limiting (production)

## Security

- ✅ Input validation with Pydantic
- ✅ SQL/NoSQL injection protection
- ✅ XSS prevention with sanitization
- ✅ Rate limiting to prevent abuse
- ✅ PII encryption at rest
- ✅ Secure password hashing (if auth added)
- ✅ HTTPS enforcement in production
- ✅ CORS properly configured

## Monitoring

### Logs

```bash
# View logs in development
uvicorn main:app --log-level debug

# View logs in production (Emergent.sh)
emergent logs --tail
```

### Metrics

Monitor in Emergent.sh dashboard:
- Request volume
- Error rates
- Response times
- Database performance

### Error Tracking

Configure Sentry for error tracking:

```bash
SENTRY_DSN=https://xxxxxx@sentry.io/xxxxxx
SENTRY_ENVIRONMENT=production
```

## Performance

### Optimization Tips

1. **Database Indexes** - Already configured automatically
2. **Redis Caching** - Enable for production rate limiting
3. **Connection Pooling** - Motor handles automatically
4. **Async Operations** - All DB operations are async

### Expected Performance

- Health check: <50ms
- Assessment submission: <500ms
- Email sending: <1s
- Auto-save: <200ms

## Troubleshooting

### Database Connection Fails

```bash
# Check MongoDB is running
mongosh

# Verify connection string
echo $MONGODB_URI
```

### Email Not Sending

```bash
# Verify SendGrid API key
curl -X GET "https://api.sendgrid.com/v3/user/profile" \
  -H "Authorization: Bearer $SENDGRID_API_KEY"

# Check email logs in MongoDB
db.email_logs.find().sort({createdAt: -1}).limit(10)
```

### Rate Limit Issues

```bash
# Temporarily disable rate limiting
RATE_LIMIT_ENABLED=false

# Or increase limits
RATE_LIMIT_SUBMIT_ASSESSMENT=100
```

## Contributing

1. Create feature branch
2. Write tests
3. Update documentation
4. Submit pull request

## License

Proprietary - Primary Cell

## Support

- **Documentation:** See `docs/` directory
- **Issues:** Open GitHub issue
- **Email:** support@primarycell.com
