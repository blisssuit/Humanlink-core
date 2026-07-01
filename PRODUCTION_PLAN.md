# TerraIQ Production Refactor - Complete Plan

## Overview
Convert TerraIQ from prototype to production with real auth, role-based access, offline-first architecture, comprehensive AI features, advanced analytics, and enterprise security.

## Tech Stack
- **Frontend**: Next.js 16, React, TypeScript, Tailwind CSS
- **Auth**: Firebase Authentication (Email/Password + Google)
- **Database**: Firestore with real-time sync
- **AI**: Provider-agnostic service (OpenAI, Claude, Gemini, Hugging Face, mock)
- **Storage**: Firebase Storage with image compression
- **Notifications**: Firebase Cloud Messaging (FCM)
- **Offline**: IndexedDB + Service Workers + auto-sync
- **Analytics**: Firestore queries + Firebase Analytics

## Core Enhancements

### 1. Role-Based System
- **Farmer** - Plant, scan crops, sell, book transport
- **Buyer** - Browse, purchase, message sellers
- **Driver** - Accept bookings, track, verify
- **Admin** - Manage users, verify, moderate
- **Expert** (future) - Consult, create guides

### 2. Verification & Trust
- Farmers verify with ID + farm proof → Verified ✅ badge
- Drivers verify with license + insurance → Verified ✅ badge
- Trust scores from transaction history
- Dispute resolution system

### 3. Enhanced AI Scanner
Returns comprehensive diagnosis:
- Disease name
- Confidence % (0-100)
- Severity (low/medium/high)
- Symptoms detected
- AI Explanation
- Treatment recommendations
- Preventive measures
- Recovery time estimate
- Disclaimer

### 4. Offline-First
- Local cache: weather, crops, scans in IndexedDB
- Sync queue: offline actions queued
- Auto-sync when internet returns
- Service Worker for offline pages
- Sync status indicator

### 5. Push Notifications
- Heavy rainfall alerts
- Disease outbreaks
- Price increases
- Truck arrivals
- Buyer messages
- Payment confirmations
- AI insights

### 6. Analytics Dashboard
- Revenue (total, monthly, trends)
- Harvest (tons, yield improvements)
- Expenses (input, service, ROI)
- AI Insights (disease trends, planting times)
- Productivity (crops/hectare)
- Crop Success Rate (% by type)

### 7. AI Chat
Conversational farming advisor:
- Ask: "My cassava leaves are turning yellow"
- AI responds with diagnosis
- Follow-up questions
- Photo requests for analysis
- Actionable advice
- Conversation history

### 8. Security
- Firebase Security Rules (role-based, field-level)
- File validation (type/size)
- Image compression (auto)
- Rate limiting (endpoints)
- CORS configuration
- Input validation (Zod)
- Encryption (sensitive fields)

## Folder Structure

```
lib/services/
├── auth-service.ts
├── user-service.ts (roles)
├── verification-service.ts
├── marketplace-service.ts
├── booking-service.ts
├── notification-service.ts
├── analytics-service.ts
├── offline-service.ts
├── ai/
│   ├── types.ts (interface)
│   ├── providers/
│   │   ├── openai-provider.ts
│   │   ├── claude-provider.ts
│   │   ├── gemini-provider.ts
│   │   ├── huggingface-provider.ts
│   │   └── mock-provider.ts
│   ├── ai-factory.ts
│   └── ai-service.ts
└── chat-service.ts

lib/hooks/
├── use-auth.ts
├── use-user.ts
├── use-role.ts
├── use-offline.ts
├── use-notifications.ts
└── use-analytics.ts

lib/types/
├── database.ts
├── roles.ts
├── offline.ts
└── ai.ts

components/
├── verification/
├── analytics/
├── chat/
├── notifications/
└── ...existing components
```

## Database Models (Firestore)

### Users (with Roles)
```
{
  uid, email, name, phone, profileImage
  role: 'farmer'|'buyer'|'driver'|'admin'|'expert'
  isVerified: boolean
  verificationDocuments: [{type, url, uploadedAt}]
  rating: number (0-5)
  reviewCount: number
  
  // Farmer-specific
  farmName, farmLocation, farmSize, soilType
  
  // Driver-specific
  truckCapacity, licensePlate, licenseExpiry
}
```

### CropScans (Enhanced)
```
{
  userId, farmId, imageUrl
  disease, confidence, severity
  symptoms: string[]
  aiExplanation: string
  treatment, preventiveMeasures
  recoveryEstimate: number
  disclaimer: string
  status: 'pending'|'completed'|'error'
  aiProvider: string
}
```

### Other Collections
- `Farms`, `MarketplaceListings`, `TruckBookings`
- `Notifications`, `ChatMessages`, `OfflineSyncQueue`

## AI Service (Provider-Agnostic)

**Interface**
```typescript
interface AIProvider {
  analyzeCropImage(imageUrl: string): Promise<DiagnosisResult>
}

interface DiagnosisResult {
  disease, confidence, severity, symptoms
  aiExplanation, treatment, preventiveMeasures
  recoveryEstimate, disclaimer
}
```

**Providers**
- `NEXT_PUBLIC_AI_PROVIDER=openai|claude|gemini|huggingface|mock`
- Each provider implements same interface
- Factory pattern selects provider at runtime
- Swap providers without code changes

## Implementation Phases (9 Phases)

1. **Foundation**: Firebase setup, auth, roles, security rules
2. **User Management**: Profiles, verification, onboarding
3. **Offline Architecture**: IndexedDB, Service Worker, sync
4. **Enhanced Marketplace**: CRUD, compression, verification badges
5. **AI Scanner**: Enhanced diagnosis, all fields, caching
6. **AI Chat**: Conversational UI, history, follow-ups
7. **Transport & Bookings**: Full booking system, tracking
8. **Analytics & Notifications**: Dashboards, push alerts
9. **Security & Polish**: Error handling, loading states, testing

## Security Architecture

**Firebase Rules** - Role-based access control
**Image Validation** - MIME type, file size checks
**Compression** - Auto-compress before upload (max 2MB)
**Rate Limiting** - 10 AI scans/hour, 50 chat/day per user
**Input Validation** - Zod schemas for all inputs
**Encryption** - Sensitive fields encrypted in Firestore

## Code Quality

- TypeScript strict mode
- Reusable components
- Service layer separation
- Complete error handling
- Loading states on all async
- Zod validation schemas
- Offline support
- Accessibility (ARIA)
- Performance optimized
- Testing ready

## Key Deliverables

✅ Production folder structure
✅ Role-based authentication
✅ Verification system
✅ Offline-first architecture
✅ Enhanced AI scanner (all fields)
✅ Conversational AI chat
✅ Advanced analytics
✅ Push notifications
✅ Security rules & validation
✅ Complete TypeScript types
✅ Service layer
✅ Error handling & loading states
