# MongoDB Data Models Documentation

This document defines the MongoDB data models for the Primary Cell Assessment application.

## Collections Overview

- **assessments** - Stores completed and draft assessment responses
- **leads** - Stores lead information for follow-up and CRM integration
- **email_logs** - Tracks email communications sent to users

---

## 1. Assessments Collection

**Collection Name:** `assessments`

### Schema Definition

```typescript
interface Assessment {
  _id: ObjectId;
  assessmentId: string;          // Unique identifier (UUID)

  // Assessment Data (from AssessmentResponse)
  conditions: string[];           // Selected pain conditions
  sensations: string[];           // Selected pain sensations
  duration?: string;              // Pain duration
  intensity?: number;             // Pain intensity (1-10)
  previousTreatments?: string[];  // Previous treatments tried
  hasBudget?: boolean;            // Has budget for treatment
  budgetRange?: string;           // Budget range if applicable
  urgency?: string;               // Treatment urgency level
  activityImpact?: string;        // Impact on daily activities
  goals?: string;                 // Treatment goals (free text)

  // Contact Information
  contactInfo: {
    name: string;
    email: string;
    phone?: string;
  };

  // Lead Qualification
  leadSource: string;             // Source of lead (e.g., 'website', 'referral')
  qualificationStatus: 'qualified' | 'disqualified' | 'pending';
  disqualificationReason?: string; // Reason if disqualified

  // Assessment Metadata
  status: 'completed' | 'draft';
  startedAt?: Date;               // When assessment was started
  completedAt?: Date;             // When assessment was completed

  // Technical Metadata
  metadata: {
    userAgent: string;
    referrer: string;
    ipAddress?: string;           // Optional: for fraud detection
    sessionId?: string;
  };

  // Timestamps
  createdAt: Date;
  updatedAt: Date;
}
```

### Indexes

```javascript
// Unique index on assessmentId
db.assessments.createIndex({ "assessmentId": 1 }, { unique: true });

// Index on email for quick lookup
db.assessments.createIndex({ "contactInfo.email": 1 });

// Index on status for filtering
db.assessments.createIndex({ "status": 1 });

// Index on qualificationStatus for reporting
db.assessments.createIndex({ "qualificationStatus": 1 });

// Compound index for date range queries
db.assessments.createIndex({ "createdAt": -1, "status": 1 });

// Index on completedAt for reporting
db.assessments.createIndex({ "completedAt": -1 });
```

### Validation Rules

```javascript
db.createCollection("assessments", {
  validator: {
    $jsonSchema: {
      bsonType: "object",
      required: ["assessmentId", "conditions", "sensations", "contactInfo", "status", "createdAt", "updatedAt"],
      properties: {
        assessmentId: {
          bsonType: "string",
          description: "Unique assessment identifier - required"
        },
        conditions: {
          bsonType: "array",
          minItems: 1,
          description: "Must have at least one condition selected"
        },
        sensations: {
          bsonType: "array",
          minItems: 1,
          description: "Must have at least one sensation selected"
        },
        contactInfo: {
          bsonType: "object",
          required: ["name", "email"],
          properties: {
            name: {
              bsonType: "string",
              minLength: 2,
              maxLength: 100
            },
            email: {
              bsonType: "string",
              pattern: "^[^\\s@]+@[^\\s@]+\\.[^\\s@]+$"
            }
          }
        },
        status: {
          enum: ["completed", "draft"],
          description: "Assessment status"
        },
        qualificationStatus: {
          enum: ["qualified", "disqualified", "pending"],
          description: "Lead qualification status"
        },
        intensity: {
          bsonType: "int",
          minimum: 1,
          maximum: 10
        }
      }
    }
  }
});
```

### Example Document

```json
{
  "_id": ObjectId("507f1f77bcf86cd799439011"),
  "assessmentId": "a1b2c3d4-e5f6-7890-abcd-ef1234567890",
  "conditions": ["Chronic Back Pain", "Joint Pain"],
  "sensations": ["Sharp", "Aching", "Stiffness"],
  "duration": "2-to-5-years",
  "intensity": 7,
  "previousTreatments": ["Physical Therapy", "Pain Medication", "Chiropractic"],
  "hasBudget": true,
  "budgetRange": "15k-30k",
  "urgency": "within-month",
  "activityImpact": "significant",
  "goals": "Return to running and reduce daily pain",
  "contactInfo": {
    "name": "John Doe",
    "email": "john.doe@example.com",
    "phone": "+1-555-123-4567"
  },
  "leadSource": "website",
  "qualificationStatus": "qualified",
  "status": "completed",
  "startedAt": ISODate("2025-01-15T10:30:00Z"),
  "completedAt": ISODate("2025-01-15T10:45:00Z"),
  "metadata": {
    "userAgent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7)...",
    "referrer": "https://google.com",
    "sessionId": "sess_abc123"
  },
  "createdAt": ISODate("2025-01-15T10:30:00Z"),
  "updatedAt": ISODate("2025-01-15T10:45:00Z")
}
```

---

## 2. Leads Collection

**Collection Name:** `leads`

### Schema Definition

```typescript
interface Lead {
  _id: ObjectId;
  leadId: string;                 // Unique identifier (UUID)

  // Contact Information
  name: string;
  email: string;
  phone?: string;

  // Lead Source and Context
  source: string;                 // 'assessment', 'waiting_list', 'direct'
  assessmentId?: string;          // Reference to assessment if applicable

  // Lead Status
  status: 'new' | 'contacted' | 'qualified' | 'disqualified' | 'converted';
  qualificationStatus: 'qualified' | 'disqualified' | 'pending';
  disqualificationReason?: string;

  // Assessment Summary (denormalized for quick access)
  assessmentSummary?: {
    conditions: string[];
    urgency: string;
    budgetRange?: string;
    intensity?: number;
  };

  // Follow-up Information
  discoveryCallScheduled: boolean;
  discoveryCallDate?: Date;
  followUpDate?: Date;
  lastContacted?: Date;
  contactAttempts: number;

  // Notes and Tags
  notes?: string[];
  tags?: string[];                // e.g., ['high-priority', 'follow-up-needed']

  // CRM Integration
  crmSyncStatus?: 'pending' | 'synced' | 'failed';
  crmLeadId?: string;            // ID in external CRM system
  crmLastSyncedAt?: Date;

  // Timestamps
  createdAt: Date;
  updatedAt: Date;
}
```

### Indexes

```javascript
// Unique index on leadId
db.leads.createIndex({ "leadId": 1 }, { unique: true });

// Index on email for quick lookup
db.leads.createIndex({ "email": 1 });

// Index on status for filtering
db.leads.createIndex({ "status": 1 });

// Index on assessmentId for linking
db.leads.createIndex({ "assessmentId": 1 });

// Index on followUpDate for task management
db.leads.createIndex({ "followUpDate": 1 });

// Index on discoveryCallScheduled for filtering
db.leads.createIndex({ "discoveryCallScheduled": 1 });

// Compound index for lead pipeline queries
db.leads.createIndex({ "status": 1, "createdAt": -1 });
```

### Example Document

```json
{
  "_id": ObjectId("507f1f77bcf86cd799439012"),
  "leadId": "lead_xyz789abc123",
  "name": "John Doe",
  "email": "john.doe@example.com",
  "phone": "+1-555-123-4567",
  "source": "assessment",
  "assessmentId": "a1b2c3d4-e5f6-7890-abcd-ef1234567890",
  "status": "qualified",
  "qualificationStatus": "qualified",
  "assessmentSummary": {
    "conditions": ["Chronic Back Pain", "Joint Pain"],
    "urgency": "within-month",
    "budgetRange": "15k-30k",
    "intensity": 7
  },
  "discoveryCallScheduled": false,
  "followUpDate": ISODate("2025-01-20T09:00:00Z"),
  "lastContacted": null,
  "contactAttempts": 0,
  "notes": [],
  "tags": ["high-priority", "qualified"],
  "crmSyncStatus": "pending",
  "createdAt": ISODate("2025-01-15T10:45:00Z"),
  "updatedAt": ISODate("2025-01-15T10:45:00Z")
}
```

---

## 3. Email Logs Collection

**Collection Name:** `email_logs`

### Schema Definition

```typescript
interface EmailLog {
  _id: ObjectId;
  messageId: string;              // Unique email message identifier

  // Recipient Information
  recipientEmail: string;
  recipientName?: string;

  // Email Details
  subject: string;
  emailType: 'results' | 'follow_up' | 'welcome' | 'disqualification';
  templateId?: string;            // Template used for email

  // Related Records
  assessmentId?: string;
  leadId?: string;

  // Delivery Status
  status: 'queued' | 'sent' | 'delivered' | 'bounced' | 'failed';
  sentAt?: Date;
  deliveredAt?: Date;
  openedAt?: Date;
  clickedAt?: Date;

  // Error Information
  error?: {
    code: string;
    message: string;
  };

  // Provider Information
  provider: string;               // e.g., 'sendgrid', 'aws-ses', 'mailgun'
  providerMessageId?: string;

  // Timestamps
  createdAt: Date;
  updatedAt: Date;
}
```

### Indexes

```javascript
// Index on messageId
db.email_logs.createIndex({ "messageId": 1 }, { unique: true });

// Index on recipient email
db.email_logs.createIndex({ "recipientEmail": 1 });

// Index on assessmentId
db.email_logs.createIndex({ "assessmentId": 1 });

// Index on status
db.email_logs.createIndex({ "status": 1 });

// Compound index for date range queries
db.email_logs.createIndex({ "createdAt": -1, "status": 1 });
```

### Example Document

```json
{
  "_id": ObjectId("507f1f77bcf86cd799439013"),
  "messageId": "msg_abc123xyz789",
  "recipientEmail": "john.doe@example.com",
  "recipientName": "John Doe",
  "subject": "Your Primary Cell Assessment Results",
  "emailType": "results",
  "templateId": "results-email-v2",
  "assessmentId": "a1b2c3d4-e5f6-7890-abcd-ef1234567890",
  "leadId": "lead_xyz789abc123",
  "status": "delivered",
  "sentAt": ISODate("2025-01-15T10:46:00Z"),
  "deliveredAt": ISODate("2025-01-15T10:46:30Z"),
  "provider": "sendgrid",
  "providerMessageId": "sg_abc123",
  "createdAt": ISODate("2025-01-15T10:46:00Z"),
  "updatedAt": ISODate("2025-01-15T10:46:30Z")
}
```

---

## Data Relationships

### Assessment → Lead
- One-to-one relationship
- `leads.assessmentId` references `assessments.assessmentId`

### Assessment → Email Logs
- One-to-many relationship
- `email_logs.assessmentId` references `assessments.assessmentId`

### Lead → Email Logs
- One-to-many relationship
- `email_logs.leadId` references `leads.leadId`

---

## Data Retention Policy

### Assessments
- **Completed assessments:** Retain for 7 years (compliance)
- **Draft assessments:** Auto-delete after 90 days of inactivity

### Leads
- **Active leads:** Retain indefinitely
- **Disqualified leads:** Retain for 2 years, then archive

### Email Logs
- **All email logs:** Retain for 1 year, then archive to cold storage

---

## Privacy and Security

### PII Fields
The following fields contain Personally Identifiable Information (PII):
- `contactInfo.name`
- `contactInfo.email`
- `contactInfo.phone`
- `metadata.ipAddress`

### Security Measures
1. **Encryption at Rest:** All collections encrypted using MongoDB encryption
2. **Field-Level Encryption:** PII fields encrypted with customer-managed keys
3. **Access Control:** Role-based access control (RBAC) for database access
4. **Audit Logging:** All database operations logged for compliance
5. **Data Anonymization:** For analytics, use anonymized copies

### HIPAA Compliance
- This application does NOT collect Protected Health Information (PHI)
- Assessment responses are self-reported and non-diagnostic
- No medical records, diagnoses, or treatment plans stored

---

## Migration Scripts

### Initial Setup

```javascript
// Run in MongoDB shell or migration script

// 1. Create assessments collection with validation
db.createCollection("assessments", {
  validator: { /* See validation rules above */ }
});

// 2. Create indexes
db.assessments.createIndex({ "assessmentId": 1 }, { unique: true });
db.assessments.createIndex({ "contactInfo.email": 1 });
db.assessments.createIndex({ "status": 1 });
db.assessments.createIndex({ "qualificationStatus": 1 });
db.assessments.createIndex({ "createdAt": -1, "status": 1 });

// 3. Create leads collection
db.createCollection("leads");

// 4. Create lead indexes
db.leads.createIndex({ "leadId": 1 }, { unique: true });
db.leads.createIndex({ "email": 1 });
db.leads.createIndex({ "status": 1 });
db.leads.createIndex({ "assessmentId": 1 });

// 5. Create email_logs collection
db.createCollection("email_logs");

// 6. Create email log indexes
db.email_logs.createIndex({ "messageId": 1 }, { unique: true });
db.email_logs.createIndex({ "recipientEmail": 1 });
db.email_logs.createIndex({ "assessmentId": 1 });
```

---

## Query Examples

### Find all qualified leads from the last 7 days

```javascript
db.leads.find({
  qualificationStatus: "qualified",
  createdAt: { $gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) }
}).sort({ createdAt: -1 });
```

### Find assessments needing follow-up

```javascript
db.leads.find({
  status: "qualified",
  discoveryCallScheduled: false,
  followUpDate: { $lte: new Date() }
}).sort({ followUpDate: 1 });
```

### Get assessment with email history

```javascript
db.assessments.aggregate([
  { $match: { assessmentId: "a1b2c3d4-e5f6-7890-abcd-ef1234567890" } },
  {
    $lookup: {
      from: "email_logs",
      localField: "assessmentId",
      foreignField: "assessmentId",
      as: "emailHistory"
    }
  }
]);
```

---

## Backup and Recovery

### Backup Strategy
- **Frequency:** Daily automated backups
- **Retention:** 30 days of daily backups, 12 months of monthly backups
- **Location:** Encrypted backups stored in separate geographic region

### Recovery Procedures
1. Point-in-time recovery available for last 30 days
2. Test recovery procedures quarterly
3. RTO (Recovery Time Objective): 4 hours
4. RPO (Recovery Point Objective): 1 hour
