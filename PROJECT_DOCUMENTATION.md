# DanceLink Platform - Complete Project Documentation

## Table of Contents

1. [Project Overview](#project-overview)
2. [Technology Stack](#technology-stack)
3. [System Architecture](#system-architecture)
4. [Installation & Setup](#installation--setup)
5. [Database Schema](#database-schema)
6. [Core Features & Functionalities](#core-features--functionalities)
7. [User Roles & Permissions](#user-roles--permissions)
8. [Payment Integration](#payment-integration)
9. [Content Management System (CMS)](#content-management-system-cms)
10. [API Documentation](#api-documentation)
11. [Frontend Architecture](#frontend-architecture)
12. [Security & Authentication](#security--authentication)
13. [Deployment](#deployment)
14. [Environment Configuration](#environment-configuration)
15. [Scripts & Utilities](#scripts--utilities)

---

## Project Overview

**DanceLink** is a comprehensive dance platform that connects dancers, instructors, hosts, and event organizers. The platform enables:

- **Dance Class Management**: Browse, book, and manage dance classes
- **Event Management**: Discover and register for dance events, workshops, and competitions
- **Instructor Profiles**: Find qualified dance instructors with ratings and reviews
- **Host Dashboard**: Event organizers and venue owners can manage their offerings
- **Partner Matching**: Connect with dance partners based on skill level and preferences
- **Content Management**: Dynamic website content managed through admin CMS
- **Payment Processing**: Integrated PayPal payment gateway for bookings
- **Community Features**: Forum discussions, testimonials, and feedback

**Version**: 2.0.0  
**Framework**: Next.js 14.2.3 (App Router)  
**Database**: PostgreSQL with Prisma ORM

---

## Technology Stack

### Frontend
- **Next.js 14.2.3**: React framework with App Router architecture
- **React 18.3.1**: UI library
- **TypeScript**: Type-safe development
- **Tailwind CSS**: Utility-first CSS framework
- **React Hot Toast**: Toast notifications
- **Chart.js**: Analytics visualization
- **Lucide React**: Icon library
- **React i18next**: Internationalization (i18n) support for multiple languages

### Backend
- **Next.js API Routes**: Serverless API endpoints
- **Prisma 6.16.2**: Database ORM
- **PostgreSQL**: Primary database
- **NextAuth.js**: Authentication framework
- **Zod**: Schema validation

### Payment Processing
- **PayPal Checkout Server SDK**: Live payment processing
- **Stripe**: Alternative payment provider (configured but inactive)

### DevOps & Deployment
- **Vercel**: Hosting and deployment platform
- **Railway**: PostgreSQL database hosting
- **Vercel Blob**: File storage for uploads

### Development Tools
- **ESLint**: Code linting
- **Autoprefixer**: CSS compatibility
- **Mermaid CLI**: Diagram rendering

### Additional Libraries
- **bcryptjs**: Password hashing
- **jsonwebtoken & jose**: JWT token management
- **nodemailer**: Email notifications
- **socket.io**: Real-time features
- **ioredis/redis**: Caching layer
- **axios**: HTTP client
- **nanoid**: Unique ID generation

---

## System Architecture

### Application Structure

```
dance-platform-staging/
├── app/
│   ├── (public)/              # Public-facing pages
│   │   ├── about/
│   │   ├── classes/
│   │   ├── events/
│   │   ├── instructors/
│   │   ├── contact/
│   │   ├── forum/
│   │   ├── partner-match/
│   │   └── layout.tsx         # Public layout with header/footer
│   ├── admin/                 # Admin dashboard
│   │   ├── sections/          # Admin management panels
│   │   └── page.tsx
│   ├── api/                   # API routes
│   │   ├── admin/             # Admin-only endpoints
│   │   ├── public/            # Public endpoints
│   │   └── payments/          # Payment processing
│   ├── booking/               # Booking flow
│   │   ├── payment/
│   │   └── confirmation/
│   ├── dashboard/             # User dashboard
│   ├── host/                  # Host dashboard
│   ├── instructor/            # Instructor dashboard
│   ├── components/            # Shared components
│   └── lib/                   # Utility functions
├── prisma/
│   └── schema.prisma          # Database schema
├── public/                    # Static assets
└── scripts/                   # Utility scripts
```

### Key Architecture Patterns

1. **Server/Client Component Separation**: Next.js 14 App Router pattern
2. **API Route Handlers**: RESTful endpoints for data operations
3. **Database Access Layer**: Prisma ORM with connection pooling
4. **Authentication Middleware**: Token-based session management
5. **Role-Based Access Control (RBAC)**: User, Instructor, Host, Admin roles

---


### Prerequisites

- **Node.js**: Version 18 (use `nvm use 18`)
- **PostgreSQL**: Database instance (local or cloud)
- **PayPal Developer Account**: For payment processing

### Step 1: Clone Repository

Database Schema

### Core Models

#### User Management
- **User**: Platform users with roles (USER, INSTRUCTOR, HOST, ADMIN)
- **Instructor**: Specialized instructor profiles with ratings and experience
- **Host**: Event/class organizers with verification status
- **UserProfile**: Partner matching profiles with preferences

#### Content Models
- **Class**: Dance class listings with scheduling and capacity
- **Event**: Dance events, workshops, competitions
- **Venue**: Physical locations for classes/events
- **Academy**: Dance academy/studio profiles
- **DanceStyle**: Dance style taxonomy (Salsa, Bachata, Tango, etc.)

#### Booking & Payments
- **Booking**: Class/event reservations with status tracking
- **Transaction**: Payment records with provider details (PayPal)
- **SeatLock**: Temporary seat reservations during checkout

#### Analytics & Engagement
- **ClassAttendance**: Attendance tracking with check-in/out
- **StudentFeedback**: Detailed ratings and reviews
- **StudentEngagement**: Participation and progress metrics
- **InstructorPerformance**: Aggregated performance analytics
- **ClassAnalytics**: Per-class performance data

#### Community Features
- **ForumPost**: Discussion board posts
- **ForumReply**: Threaded replies to forum posts
- **Testimonial**: User testimonials and reviews
- **ContactMessage**: Contact form submissions
- **Notification**: User notification system

#### Content Management
- **SiteSettings**: Global site configuration
- **HomepageContent**: Homepage CMS content
- **AboutPageContent**: About page CMS content
- **EventsPageContent**: Events page CMS content
- **InstructorsPageContent**: Instructors page CMS content
- **ContactPageContent**: Contact page CMS content
- **SeoPage**: SEO metadata per page

#### Partner Matching
- **UserProfile**: User profiles for matching
- **UserProfileDanceStyle**: Dance styles with proficiency levels
- **MatchRequest**: Partner match requests
- **Match**: Confirmed matches between users

#### Security & Audit
- **Session**: User session management with device tracking
- **LoginToken**: Magic link and token-based authentication
- **LoginAttempt**: Login attempt tracking
- **AuditLog**: Complete audit trail of admin actions

---

## Core Features & Functionalities

### 1. User-Facing Features

#### 1.1 Class Discovery & Booking
- **Browse Classes**: Filter by style, level, location, price
- **Class Details**: View instructor info, schedule, capacity
- **Booking Flow**: 
  1. Select class/event
  2. Lock seats (15-minute hold)
  3. Enter user details
  4. Process payment via PayPal
  5. Receive confirmation email
- **Booking Management**: View/cancel bookings in user dashboard

#### 1.2 Event Management
- **Featured Events**: Highlighted events on homepage
- **Event Search**: Filter by date, location, style, price range
- **Event Details**: Full event information with organizer details
- **Registration**: Multi-step booking with payment

#### 1.3 Instructor Profiles
- **Instructor Directory**: Searchable instructor listing
- **Profile Details**: Bio, specialties, experience, ratings
- **Performance Metrics**: Average ratings, total students taught
- **Class Schedule**: View all classes by instructor

#### 1.4 Partner Matching
- **Create Profile**: Set preferences, dance styles, experience level
- **Browse Partners**: Filter by location, style, level
- **Send Requests**: Request to connect with potential partners
- **Match Management**: Accept/decline match requests
- **Messaging**: (Planned feature)

#### 1.5 Community Forum
- **Post Discussions**: Create topics in categories
- **Reply Threads**: Nested replies with threading
- **Moderation**: Admin moderation tools
- **Reactions**: Like posts and replies

#### 1.6 Multilingual Support
- **i18n Integration**: Full internationalization support
- **Supported Languages**: English, Korean, Vietnamese, Spanish
- **Auto-Translation**: Google Cloud Translate API integration
- **Language Switcher**: User preference storage

### 2. Instructor Features

#### 2.1 Instructor Dashboard
- **Class Management**: Create/edit/cancel classes
- **Student Roster**: View enrolled students
- **Attendance Tracking**: Check-in/check-out students
- **Performance Analytics**:
  - Total students taught
  - Average class ratings
  - Attendance rates
  - Revenue tracking
  - Student retention metrics

#### 2.2 Student Engagement
- **Track Participation**: Score student engagement levels
- **Progress Notes**: Document student improvement
- **Feedback Collection**: Receive student ratings

#### 2.3 Schedule Management
- **Recurring Classes**: Set weekly schedules
- **Availability Calendar**: Manage teaching availability
- **Conflict Detection**: Prevent double-booking

### 3. Host Features

#### 3.1 Host Dashboard
- **Application Process**: Apply to become verified host
- **Venue Management**: Add/manage multiple venues
- **Event Creation**: Organize events and competitions
- **Class Hosting**: Host multiple instructors/classes
- **Academy Management**: Create academy profiles

#### 3.2 Financial Management
- **Revenue Reports**: Track earnings per class/event
- **Booking Analytics**: Monitor booking trends
- **Capacity Management**: Set max attendees per event

#### 3.3 Competition Requests
- **Submit Requests**: Request to host competitions
- **Status Tracking**: Monitor approval status
- **Participant Management**: Track expected attendance

### 4. Admin Features

#### 4.1 User Management
- **User CRUD**: Create, edit, delete users
- **Role Assignment**: Change user roles
- **Account Verification**: Verify email addresses
- **Account Status**: Enable/disable accounts

#### 4.2 Content Management System (CMS)
Comprehensive CMS covering:

##### Homepage Management
- Hero section (title, subtitle, CTA)
- Featured classes/events
- Testimonials toggle
- Newsletter signup

##### Page Content Management
- **About Page**: Hero, stats, story, features, CTA
- **Events Page**: Hero, featured events, search UI, CTA
- **Instructors Page**: Hero, stats, error messages, CTA
- **Contact Page**: Hero, contact sections

##### Site Settings
- Site name and description
- Contact information
- Social media links (Facebook, Instagram, Twitter, YouTube, TikTok, LinkedIn)
- Footer configuration:
  - Layout (multi-column, centered)
  - Copyright text
  - Quick links
  - Custom HTML injection
  - Tagline

##### SEO Management
- Page-level SEO metadata
- Open Graph tags
- Twitter Card configuration
- Structured data (JSON-LD)
- Sitemap generation

##### Dance Style Management
- Create/edit dance styles
- Category assignment
- Featured styles
- Style images and videos
- Ordering/sorting

#### 4.3 Booking Management
- View all bookings
- Filter by status, date, user
- Refund processing
- Confirmation code search
- Booking status updates

#### 4.4 Payment Management
- Transaction history
- Payment provider breakdown (PayPal)
- Revenue analytics
- Refund management
- Failed payment tracking

#### 4.5 Venue Management
- Approve/reject venue submissions
- Edit venue details
- Location management
- Status tracking (DRAFT, PENDING_APPROVAL, APPROVED, REJECTED)

#### 4.6 Host Management
- Review host applications
- Approve/reject hosts
- Verification status
- Host activity monitoring

#### 4.7 Notification System
- **Notification Center**: Send targeted notifications
- **Templates**: Pre-defined notification templates
- **Analytics**: Track open rates and engagement
- **Composer**: Create custom notifications with targeting

#### 4.8 Forum Moderation
- Moderate posts and replies
- Pin/unpin important topics
- Lock discussions
- Remove inappropriate content

#### 4.9 Audit Trail
- Complete activity log
- Filter by user, action, table
- View old/new values
- IP address and user agent tracking

#### 4.10 Analytics Dashboards
- **Transaction Analytics**: Revenue trends, payment methods
- **Notification Analytics**: Delivery rates, engagement
- **Class Analytics**: Attendance, ratings, capacity utilization

### 5. Payment Processing

#### PayPal Integration (Primary)
- **Live Mode**: Production PayPal credentials configured
- **Order Creation**: Server-side order generation
- **Redirect Flow**: User redirected to PayPal for approval
- **Payment Capture**: Automatic capture on return
- **Transaction Recording**: Full transaction audit trail

**Payment Flow**:
1. User initiates booking
2. Backend creates PayPal order with amount breakdown
3. User redirected to PayPal login
4. User approves payment
5. PayPal redirects back with order ID
6. Backend captures payment
7. Booking confirmed
8. Email confirmation sent

#### Stripe (Configured, Inactive)
- Infrastructure in place for Stripe Checkout
- Can be activated by updating `PaymentProviderSelector`

### 6. Security Features

#### Authentication
- **Session-based Auth**: Secure device-specific sessions
- **Magic Links**: Token-based login links
- **Password Hashing**: bcryptjs with salt
- **JWT Tokens**: Signed tokens with expiration

#### Authorization
- **Role-Based Access Control**: User, Instructor, Host, Admin
- **Route Protection**: Middleware-based route guards
- **API Security**: Token validation on all protected endpoints

#### Audit & Compliance
- **Audit Logs**: Every admin action logged
- **Login Attempts**: Track failed/successful logins
- **Session Management**: Device tracking, IP logging
- **Data Privacy**: GDPR-ready structure

---

## User Roles & Permissions

### Role Hierarchy

```
ADMIN
  ├── Full system access
  ├── User management
  ├── Content management
  ├── Booking management
  ├── Payment management
  └── Analytics access

HOST
  ├── Venue management (own venues)
  ├── Event creation
  ├── Class hosting
  ├── Academy management
  └── Competition requests

INSTRUCTOR
  ├── Class management (own classes)
  ├── Student roster access
  ├── Attendance tracking
  ├── Feedback viewing
  └── Performance analytics

USER
  ├── Browse classes/events
  ├── Book classes/events
  ├── View bookings
  ├── Partner matching
  ├── Forum participation
  └── Profile management
```

### Permission Matrix

| Feature | User | Instructor | Host | Admin |
|---------|------|------------|------|-------|
| Browse Classes/Events | ✅ | ✅ | ✅ | ✅ |
| Book Classes/Events | ✅ | ✅ | ✅ | ✅ |
| Create Classes | ❌ | ✅ | ✅ | ✅ |
| Create Events | ❌ | ❌ | ✅ | ✅ |
| Manage Users | ❌ | ❌ | ❌ | ✅ |
| CMS Access | ❌ | ❌ | ❌ | ✅ |
| View Analytics | ❌ | Own Only | Own Only | All |
| Refund Bookings | ❌ | ❌ | ❌ | ✅ |

---

## Payment Integration

### PayPal Configuration

#### Environment Variables
```env
PAYPAL_CLIENT_ID=ASrjLl6zXPt_8r3pFPJOMSdsYEXy1GMdgJn3OtaxucWNtT22s4Sqawb_bV_rX8cAC-dflANp6tOZZrrn
PAYPAL_CLIENT_SECRET=EPzD6jG9HfivZZ6_j3gOZ9d10rKfIq57PCIeUb--N69O6PD9oAp2qF-3v7A77BDB0GYXqEpQh7tZR6bO
PAYPAL_MODE=live
```

#### PayPal SDK Implementation

**Location**: `/lib/paypal.ts`

```typescript
const checkoutNodeJssdk = require('@paypal/checkout-server-sdk')

function environment() {
  const clientId = process.env.PAYPAL_CLIENT_ID || ''
  const clientSecret = process.env.PAYPAL_CLIENT_SECRET || ''
  const mode = process.env.PAYPAL_MODE || 'sandbox'

  if (mode === 'live') {
    return new checkoutNodeJssdk.core.LiveEnvironment(clientId, clientSecret)
  } else {
    return new checkoutNodeJssdk.core.SandboxEnvironment(clientId, clientSecret)
  }
}

function client() {
  return new checkoutNodeJssdk.core.PayPalHttpClient(environment())
}

export { client, checkoutNodeJssdk }
```

#### Payment Creation Endpoint

**Location**: `/app/api/payments/create-session/route.ts`

**Request Body**:
```json
{
  "paymentProvider": "PAYPAL",
  "bookingType": "class" | "event",
  "itemId": "class_or_event_id",
  "userId": "user_id",
  "successUrl": "https://domain.com/booking/confirmation/{CHECKOUT_SESSION_ID}",
  "cancelUrl": "https://domain.com/booking/payment"
}
```

**Response**:
```json
{
  "success": true,
  "paymentProvider": "PAYPAL",
  "orderId": "paypal_order_id",
  "sessionUrl": "https://paypal.com/checkoutnow?token=...",
  "booking": {
    "id": "booking_id",
    "confirmationCode": "ABC123",
    "totalAmount": 50.00,
    "discountAmount": 0,
    "taxAmount": 0,
    "finalAmount": 50.00
  }
}
```

#### Payment Capture Endpoint

**Location**: `/app/api/payments/paypal-capture/route.ts`

**Request Body**:
```json
{
  "orderId": "paypal_order_id",
  "bookingId": "booking_id"
}
```

**Response**:
```json
{
  "success": true,
  "message": "Payment captured successfully",
  "orderStatus": "COMPLETED"
}
```

### Payment Flow Diagram

```
User → Select Class/Event
  ↓
Lock Seats (15 min)
  ↓
Enter Details
  ↓
Create Payment Session
  ↓
Redirect to PayPal
  ↓
User Approves Payment
  ↓
PayPal Redirects Back
  ↓
Capture Payment
  ↓
Update Booking Status
  ↓
Send Confirmation Email
  ↓
Display Confirmation Page
```

### Transaction Records

All payments are recorded in the `transactions` table:

```typescript
{
  id: string
  bookingId: string
  userId: string
  provider: "PAYPAL"
  providerPaymentId: string    // PayPal Order ID
  type: "PAYMENT"
  status: "CREATED" | "COMPLETED" | "FAILED"
  amount: Decimal
  currency: "USD"
  payload: JSON                 // Full PayPal response
  createdAt: DateTime
  updatedAt: DateTime
}
```

---

## Content Management System (CMS)

### CMS Structure

The CMS is located at `/admin` and provides comprehensive content editing:

#### 1. Settings Tab

**Site Information**:
- Site Name
- Site Description
- Contact Email
- Phone Number
- Physical Address

**Social Media**:
- Facebook URL
- Instagram URL
- Twitter URL
- YouTube URL
- TikTok URL
- LinkedIn URL

**Footer Configuration**:
- Layout: Multi-column or Centered
- Show/Hide Tagline
- Custom Tagline Text
- Show/Hide Quick Links
- Quick Links (title, URL, open in new tab)
- Show/Hide Social Links
- Custom Copyright Text
- Copyright Year
- Custom HTML Injection

#### 2. Homepage Tab

**Hero Section**:
- Hero Title
- Hero Subtitle
- Hero Button Text
- Hero Background Image (Vercel Blob upload)

**About Section**:
- About Title
- About Description

**Toggles**:
- Enable/Disable Testimonials
- Enable/Disable Newsletter Signup

#### 3. About Page Tab

**Hero Section**:
- Badge Text
- Hero Title
- Hero Subtitle
- Features List (icon + text)

**Stats Section**:
- Stats Title
- Stats Description
- Stats Items (label, value, icon)

**Story Section**:
- Story Title
- Story Description (2 paragraphs)

**Features Section**:
- "Why Choose Us" Title
- Feature Cards (title, description, icon)

**CTA Section**:
- Badge Text
- CTA Title
- CTA Description
- CTA Buttons (text, link, style)
- CTA Features (icon + text)

**Newsletter Section**:
- Newsletter Title
- Newsletter Description
- Newsletter Benefits (list items)

#### 4. Events Page Tab

**Hero Section**:
- Badge Text
- Hero Title
- Hero Subtitle
- Features (icon + text)

**Featured Events**:
- Featured Section Title
- Featured Section Description

**Search Section**:
- Search Title
- Search Description

**CTA Section**:
- Badge Text
- CTA Title
- CTA Description
- CTA Buttons
- CTA Features

#### 5. Instructors Page Tab

**Hero Section**:
- Badge Text
- Hero Title
- Hero Subtitle
- Features

**Stats Section**:
- Stats configuration

**No Instructors Section**:
- Empty state messaging

**Error Section**:
- Error messaging

**CTA Section**:
- Call-to-action configuration

#### 6. Contact Page Tab

**Hero Section**:
- Hero Title
- Hero Subtitle

**Contact Sections**:
- Section configuration (JSON)

#### 7. Dance Styles Tab

**Dance Style Management**:
- Create/Edit/Delete styles
- Name
- Description
- Category
- Difficulty Level
- Origin
- Music Style
- Benefits
- Characteristics
- Icon
- Image URL
- Video URL
- Featured Status
- Active Status
- Sort Order

#### 8. SEO Tab

**SEO Management**:
- Page Path
- Meta Title
- Meta Description
- Meta Keywords
- Author
- Robots Meta
- Canonical URL
- Open Graph (title, description, image, type, URL)
- Twitter Card (card type, title, description, image, creator)
- Structured Data (JSON-LD)
- Custom Meta Tags
- Active Status
- Priority (for sitemap)

### CMS API Endpoints

**Get Settings**:
```
GET /api/admin/settings
```

**Update Settings**:
```
POST /api/admin/settings
```

**Get Homepage Content**:
```
GET /api/admin/content/homepage
```

**Update Homepage Content**:
```
POST /api/admin/content/homepage
```

**Get About Page Content**:
```
GET /api/admin/content/about
```

**Update About Page Content**:
```
POST /api/admin/content/about
```

*(Similar patterns for Events, Instructors, Contact pages)*

---

## API Documentation

### Public API Routes

#### Events

**Get All Events**:
```
GET /api/public/events
Query Params: featuredOnly=true
```

**Get Single Event**:
```
GET /api/public/events/[id]
```

#### Classes

**Get All Classes**:
```
GET /api/public/classes
```

**Get Single Class**:
```
GET /api/public/classes/[id]
```

#### Instructors

**Get All Instructors**:
```
GET /api/public/instructors
```

#### Users

**Create or Find User**:
```
POST /api/public/users
Body: { name, email, phone }
```

#### Dance Styles

**Get All Styles**:
```
GET /api/public/dance-styles
```

### Admin API Routes

#### Content Management

**Get/Update Settings**:
```
GET/POST /api/admin/settings
```

**Get/Update Homepage**:
```
GET/POST /api/admin/content/homepage
```

**Get/Update About Page**:
```
GET/POST /api/admin/content/about
```

**Get/Update Events Page**:
```
GET/POST /api/admin/content/events
```

**Get/Update Instructors Page**:
```
GET/POST /api/admin/content/instructors
```

**Get/Update Contact Page**:
```
GET/POST /api/admin/content/contact
```

#### Resource Management

**Users**:
```
GET/POST /api/admin/users
PUT/DELETE /api/admin/users/[id]
```

**Classes**:
```
GET/POST /api/admin/classes
PUT/DELETE /api/admin/classes/[id]
```

**Events**:
```
GET/POST /api/admin/events
PUT/DELETE /api/admin/events/[id]
```

**Bookings**:
```
GET /api/admin/bookings
PUT /api/admin/bookings/[id]
```

**Venues**:
```
GET/POST /api/admin/venues
PUT/DELETE /api/admin/venues/[id]
```

**Hosts**:
```
GET/POST /api/admin/hosts
PUT /api/admin/hosts/[id]
```

#### Upload

**Hero Background Upload**:
```
POST /api/admin/upload/hero-bg
Content-Type: multipart/form-data
Body: { file: File }
```

### Payment API Routes

**Create Payment Session**:
```
POST /api/payments/create-session
Body: {
  paymentProvider: "PAYPAL",
  bookingType: "class" | "event",
  itemId: string,
  userId: string,
  successUrl: string,
  cancelUrl: string,
  lockId?: string
}
```

**Capture PayPal Payment**:
```
POST /api/payments/paypal-capture
Body: {
  orderId: string,
  bookingId: string
}
```

---

## Frontend Architecture

### Component Organization

#### Public Components (`/app/(public)/components/`)
- `Header.tsx`: Main navigation with role-based menu
- `Footer.tsx`: Dynamic footer from CMS settings
- `Hero.tsx`: Hero section component
- `TranslatedText.tsx`: i18n wrapper component

#### Shared Components (`/app/components/`)
- `LoadingSpinner.tsx`: Loading indicator
- `ErrorBoundary.tsx`: Error handling wrapper
- `Modal.tsx`: Modal dialog
- `Toast.tsx`: Notification toast

#### Admin Components (`/app/admin/sections/`)
- `ContentManagement.tsx`: CMS interface
- `UserManagement.tsx`: User CRUD
- `BookingManagement.tsx`: Booking administration
- `EventManagement.tsx`: Event CRUD
- `ClassManagement.tsx`: Class CRUD
- `VenueManagement.tsx`: Venue administration
- `HostManagement.tsx`: Host approval
- `InstructorManagement.tsx`: Instructor management
- `PaymentManagement.tsx`: Transaction viewing
- `SEOManagement.tsx`: SEO configuration
- `DanceStyleManagement.tsx`: Style management
- `ForumModeration.tsx`: Forum moderation
- `NotificationCenter.tsx`: Notification system
- `AuditTrail.tsx`: Audit log viewer

### State Management

- **React State**: Local component state with `useState`
- **Server State**: Fetched from API routes
- **URL State**: Search params for filters
- **Form State**: Controlled inputs

### Routing

Next.js 14 App Router:

```
/ (homepage)
/about
/classes
/classes/[id]
/events
/events/[id]
/instructors
/contact
/forum
/partner-match
/booking/payment
/booking/confirmation/[sessionId]
/admin (protected)
/dashboard (protected)
/host (protected)
/instructor (protected)
```

---

## Security & Authentication

### Authentication Flow

1. **Login**: User enters email/password
2. **Verification**: bcryptjs hash comparison
3. **Session Creation**: JWT token generated
4. **Session Storage**: Stored in `sessions` table with device info
5. **Token Return**: HTTP-only cookie set
6. **Subsequent Requests**: Token validated via middleware

### Session Management

Sessions include:
- Device ID (unique identifier)
- IP Address
- User Agent
- Expiration (configurable)
- Last Accessed timestamp

### Magic Link Authentication

1. Admin generates login token
2. Token emailed to user
3. User clicks link
4. Token validated and consumed
5. Session created

### API Security

- **Protected Routes**: Middleware checks session validity
- **Role Verification**: Endpoints verify user role
- **CSRF Protection**: Token-based protection
- **Rate Limiting**: (Planned with Redis)

---

## Deployment

### Production Deployment (Vercel)

#### Prerequisites
- Vercel account
- GitHub repository connected
- Railway PostgreSQL database

#### Deployment Steps

1. **Connect Repository**:
   - Link GitHub repo to Vercel
   - Select `dance-platform-staging` directory

2. **Configure Environment**:
   - Add all environment variables from `.env.example`
   - Set `DATABASE_URL` to Railway PostgreSQL
   - Set `PAYPAL_MODE=live`

3. **Build Settings**:
   ```
   Build Command: npm run build
   Output Directory: .next
   Install Command: npm install --legacy-peer-deps
   ```

4. **Deploy**:
   - Push to `main` branch
   - Vercel auto-deploys

#### Database Migration

```bash
# Connect to production database
DATABASE_URL="postgresql://..." npx prisma db push
```




**Deployment URL**: Auto-generated by Vercel

---

## Environment Configuration

### Required Environment Variables

#### Database
```env
DATABASE_URL=postgresql://user:pass@host:port/db
```

#### PayPal (Production)
```env
PAYPAL_CLIENT_ID=your_live_client_id
PAYPAL_CLIENT_SECRET=your_live_secret
PAYPAL_MODE=live
```

#### NextAuth
```env
NEXTAUTH_SECRET=random_32_char_string
NEXTAUTH_URL=https://yourdomain.com
```

#### Vercel Blob
```env
BLOB_READ_WRITE_TOKEN=vercel_blob_token
```

#### Optional
```env
REDIS_URL=redis://localhost:6379
JWT_SECRET=your_jwt_secret
```

### Environment-Specific Configuration

**Development**:
- `PAYPAL_MODE=sandbox`
- `NEXTAUTH_URL=http://localhost:3000`
- Local PostgreSQL database

**Production**:
- `PAYPAL_MODE=live`
- `NEXTAUTH_URL=https://production-domain.com`
- Railway PostgreSQL database

---

## Scripts & Utilities

### NPM Scripts

```json
{
  "dev": "next dev",
  "build": "prisma generate && next build",
  "start": "next start -p $PORT -H 0.0.0.0",
  "lint": "next lint",
  "seed": "node prisma/seed-comprehensive.js",
  "generate-translations": "node scripts/generate-translations.js",
  "generate:favicon": "node scripts/generate-favicon.js"
}
```

### Utility Scripts

Located in `/scripts/` directory:

- `generate-translations.js`: Auto-translate i18n files using Google Translate API
- `generate-favicon.js`: Generate favicon from text/SVG
- Database seed scripts (in `/prisma/`)

### Database Utilities

**Generate Prisma Client**:
```bash
npx prisma generate
```

**Push Schema Changes**:
```bash
npx prisma db push
```

**Open Prisma Studio**:
```bash
npx prisma studio
```

**Create Migration**:
```bash
npx prisma migrate dev --name migration_name
```

---

## Development Workflow

### Local Development

1. **Start Development Server**:
   ```bash
   nvm use 18
   npm run dev
   ```

2. **Access Application**:
   - Public Site: `http://localhost:3000`
   - Admin Panel: `http://localhost:3000/admin`

3. **Database Studio**:
   ```bash
   npx prisma studio
   ```
   - Opens at `http://localhost:5555`

### Code Quality

**Linting**:
```bash
npm run lint
```

**Type Checking**:
```bash
npx tsc --noEmit
```

### Git Workflow

1. **Create Feature Branch**:
   ```bash
   git checkout -b feature/feature-name
   ```

2. **Commit Changes**:
   ```bash
   git add .
   git commit -m "Description of changes"
   ```

3. **Push to Staging**:
   ```bash
   git push staging main
   ```

---

## Troubleshooting

### Common Issues

#### 1. Database Connection Error
**Solution**: Verify `DATABASE_URL` in `.env` is correct

#### 2. PayPal Authentication Failed
**Solution**: 
- Check `PAYPAL_MODE` matches credentials (sandbox vs live)
- Verify credentials have no line breaks

#### 3. Build Fails with ESLint Error
**Solution**:
```bash
npm install --legacy-peer-deps
```

#### 4. Port Already in Use
**Solution**:
```bash
lsof -i :3000 | grep LISTEN
kill [PID]
```

#### 5. Prisma Client Not Generated
**Solution**:
```bash
npx prisma generate
```

---

## Performance Optimization

### Current Optimizations

1. **Image Optimization**: Next.js Image component with automatic optimization
2. **Code Splitting**: Automatic route-based code splitting
3. **Font Optimization**: `next/font` for optimized font loading
4. **Database Indexing**: Strategic indexes on frequently queried fields
5. **API Caching**: Static page generation where possible

### Planned Optimizations

1. **Redis Caching**: Cache frequently accessed data
2. **CDN Integration**: Static asset delivery via CDN
3. **Database Connection Pooling**: Optimize database connections
4. **Image CDN**: Separate CDN for user-uploaded images

---

## Future Roadmap

### Phase 1: Core Enhancements
- [ ] Email notification system (Nodemailer configured)
- [ ] Real-time messaging between matched partners
- [ ] Advanced search filters
- [ ] Mobile app (React Native)

### Phase 2: Advanced Features
- [ ] Video lessons integration
- [ ] Live streaming for virtual classes
- [ ] Membership/subscription model
- [ ] Loyalty points system

### Phase 3: Marketplace
- [ ] Instructor marketplace
- [ ] Dance equipment store
- [ ] Event ticketing system
- [ ] Affiliate program

### Phase 4: Social Features
- [ ] Social media integration
- [ ] User-generated content
- [ ] Dance challenges
- [ ] Leaderboards

---

## Support & Maintenance

### Monitoring

- **Error Tracking**: Implement Sentry or similar
- **Performance Monitoring**: Vercel Analytics
- **Database Monitoring**: Railway metrics
- **Uptime Monitoring**: External service recommended

### Backup Strategy

- **Database Backups**: Railway automatic backups
- **Code Backups**: Git version control
- **Asset Backups**: Vercel Blob has redundancy

### Maintenance Schedule

- **Weekly**: Review error logs
- **Monthly**: Database optimization
- **Quarterly**: Security audit
- **Annually**: Dependency updates

---

## Appendix

### Key Files Reference

- **Main Layout**: `/app/(public)/layout.tsx`
- **Admin Dashboard**: `/app/admin/page.tsx`
- **Payment Creation**: `/app/api/payments/create-session/route.ts`
- **PayPal Client**: `/lib/paypal.ts`
- **Database Schema**: `/prisma/schema.prisma`
- **Next Config**: `/next.config.js`
- **Tailwind Config**: `/tailwind.config.js`
- **TypeScript Config**: `/tsconfig.json`

