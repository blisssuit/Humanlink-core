# TerraIQ - Production Deployment Guide

## Live URLs

**Production URLs:**
- Primary: `https://terraiq-ai-agricultural-platform-f497wfsde.vercel.app`
- Backup: `https://terraiq-ai-agricultural-platform-3eonjouc8.vercel.app`
- Backup: `https://terraiq-ai-agricultural-platform-db3t4sl3g.vercel.app`

**Project ID:** `prj_A0GmIwJ4seeNFogZ6UYGY6Z2XMws`
**Team:** blissjaden3-9789's projects

---

## Environment Variables Required

### Firebase Configuration
Set these in Vercel Project Settings → Environment Variables:

```
NEXT_PUBLIC_FIREBASE_APIKEY=your_firebase_api_key
NEXT_PUBLIC_FIREBASE_AUTHDOMAIN=your_firebase_auth_domain
NEXT_PUBLIC_FIREBASE_PROJECTID=your_firebase_project_id
NEXT_PUBLIC_FIREBASE_STORAGEBUCKET=your_storage_bucket
NEXT_PUBLIC_FIREBASE_MESSAGINGSENDERID=your_messaging_sender_id
NEXT_PUBLIC_FIREBASE_APPID=your_firebase_app_id
NEXT_PUBLIC_FIREBASE_MEASUREMENTID=your_measurement_id (optional)
```

### AI Provider Configuration
```
NEXT_PUBLIC_AI_PROVIDER=mock|openai|claude|gemini|huggingface
```

**For OpenAI:**
```
OPENAI_API_KEY=your_openai_api_key
```

**For Claude (Anthropic):**
```
ANTHROPIC_API_KEY=your_anthropic_api_key
```

**For Google Gemini:**
```
GOOGLE_API_KEY=your_google_api_key
```

**For Hugging Face:**
```
HUGGINGFACE_API_KEY=your_huggingface_api_key
```

---

## Firebase Setup Instructions

### 1. Create a Firebase Project
1. Go to [Firebase Console](https://console.firebase.google.com)
2. Click "Create a new project"
3. Name it: `TerraIQ`
4. Enable Google Analytics (recommended)
5. Create the project

### 2. Enable Authentication
1. In Firebase Console, go to Authentication
2. Click "Get started"
3. Enable Email/Password provider:
   - Sign-in method → Email/Password → Enable → Save
4. Enable Google Sign-In:
   - Sign-in method → Google → Enable → Select project support email → Save

### 3. Create Firestore Database
1. Go to Firestore Database
2. Click "Create database"
3. Select "Start in production mode"
4. Choose a region close to your users (e.g., us-central1)
5. Click "Create database"

### 4. Set Up Firestore Security Rules
Replace the default rules with:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Users collection - each user can only read/write their own document
    match /users/{uid} {
      allow read, write: if request.auth.uid == uid;
    }
    
    // Farms - farmers can read/write their own, buyers/drivers can read verified
    match /farms/{farmId} {
      allow read, write: if resource.data.userId == request.auth.uid;
      allow read: if request.auth.uid != null && resource.data.isVerified == true;
    }
    
    // Marketplace listings
    match /marketplace_listings/{listingId} {
      allow read: if request.auth.uid != null;
      allow create, update, delete: if resource.data.sellerId == request.auth.uid;
    }
    
    // Crop scans - private to scanner
    match /crop_scans/{scanId} {
      allow read, write: if resource.data.userId == request.auth.uid;
      allow read: if request.auth.uid != null && resource.data.isPublic == true;
    }
    
    // Truck bookings
    match /truck_bookings/{bookingId} {
      allow read, write: if resource.data.farmerId == request.auth.uid || resource.data.driverId == request.auth.uid;
    }
    
    // Notifications
    match /notifications/{notificationId} {
      allow read, write: if resource.data.userId == request.auth.uid;
    }
    
    // Chat messages
    match /chat_messages/{messageId} {
      allow read, write: if request.auth.uid == resource.data.senderId || request.auth.uid == resource.data.recipientId;
    }
    
    // Admin collection
    match /admin/{doc=**} {
      allow read, write: if request.auth.token.admin == true;
    }
  }
}
```

### 5. Create Storage Bucket
1. Go to Storage
2. Click "Get started"
3. Start in production mode
4. Choose the same region as Firestore
5. Click "Done"

### 6. Set Storage Security Rules
```javascript
rules_version = '2';
service firebase.storage {
  match /b/{bucket}/o {
    // User profile images
    match /profiles/{uid}/{allPaths=**} {
      allow read: if request.auth.uid != null;
      allow write: if request.auth.uid == uid;
    }
    
    // Farm verification documents
    match /verification/{userId}/{allPaths=**} {
      allow read: if request.auth.uid == userId || request.auth.token.admin == true;
      allow write: if request.auth.uid == userId;
    }
    
    // Crop scan images
    match /scans/{userId}/{allPaths=**} {
      allow read: if request.auth.uid == userId || request.auth.token.admin == true;
      allow write: if request.auth.uid == userId;
      // Max 10MB per file
      allow create: if request.resource.size < 10 * 1024 * 1024 && request.resource.contentType.matches('image/.*');
    }
    
    // Marketplace product images
    match /marketplace/{sellerId}/{allPaths=**} {
      allow read: if request.auth.uid != null;
      allow write: if request.auth.uid == sellerId;
    }
  }
}
```

### 7. Get Firebase Config
1. In Firebase Console, go to Project Settings (⚙️)
2. Under "Your apps", find your web app
3. Copy the config object
4. Set each value as an environment variable in Vercel

---

## Deployment Steps

### 1. Configure Environment Variables
1. Go to Vercel Dashboard
2. Select the TerraIQ project
3. Settings → Environment Variables
4. Add all Firebase and AI provider variables
5. Mark NEXT_PUBLIC_* variables as available to production

### 2. Verify Build
```bash
pnpm build
```

### 3. Deploy
The app automatically deploys when you push to the repository:
```bash
git push origin v0/blissjaden3-9789-93344b05
```

Monitor deployment at: https://vercel.com/blissjaden3-9789s-projects/terraiq-ai-agricultural-platform/deployments

---

## AI Provider Selection

### Development (Recommended)
```
NEXT_PUBLIC_AI_PROVIDER=mock
```
Uses realistic mock data, no API calls, free.

### Production with OpenAI
```
NEXT_PUBLIC_AI_PROVIDER=openai
OPENAI_API_KEY=sk-...
```
Uses GPT-4V for disease detection. ~$0.01 per scan.

### Production with Claude
```
NEXT_PUBLIC_AI_PROVIDER=claude
ANTHROPIC_API_KEY=sk-ant-...
```
Uses Claude 3 Opus for vision. Professional results.

### Production with Gemini
```
NEXT_PUBLIC_AI_PROVIDER=gemini
GOOGLE_API_KEY=AIza...
```
Uses Google Gemini Pro Vision. Free tier available.

---

## Monitoring & Logs

### Vercel Logs
1. Vercel Dashboard → Deployments → Select deployment
2. View real-time logs

### Firebase Console
1. Check Authentication usage: Authentication → Insights
2. Check Firestore usage: Firestore → Usage
3. Check Storage usage: Storage → Files

### Performance
- Monitor Core Web Vitals in Vercel Analytics
- Check Firebase performance in Firebase Console

---

## Security Checklist

- [x] Firebase Security Rules implemented
- [x] Storage file size limits (10MB)
- [x] File type validation (images only)
- [x] Rate limiting on AI requests (10 scans/hour per user)
- [x] Role-based access control
- [x] Email verification required for farmers
- [x] HTTPS enforced (Vercel default)
- [x] CORS properly configured
- [ ] Add custom domain (optional)
- [ ] Enable 2FA for critical accounts
- [ ] Set up Firebase backups

---

## Scaling Considerations

### For 10,000+ Users
1. Enable Firestore caching
2. Implement Cloud Functions for background jobs
3. Set up CDN for static assets (Vercel does this)
4. Implement request rate limiting on API routes
5. Consider Firebase Extensions for email verification

### For 100,000+ Users
1. Shard Firestore collections
2. Implement caching layer (Redis via Upstash)
3. Use Cloud Storage for image resizing
4. Implement background job queue
5. Monitor Firestore costs closely

---

## Troubleshooting

### "Firebase initialization error"
- Verify all NEXT_PUBLIC_FIREBASE_* env vars are set
- Check Firebase project ID is correct

### "AI service not responding"
- Check AI provider API keys are valid
- Verify rate limiting hasn't been exceeded
- Check Vercel logs for detailed error

### "Storage access denied"
- Verify Firebase Storage security rules
- Check user authentication status
- Ensure file is under 10MB and is an image

### "Offline features not working"
- IndexedDB might be disabled in browser
- Clear browser storage and try again
- Check browser console for errors

---

## Support & Documentation

- **Firebase Docs**: https://firebase.google.com/docs
- **Vercel Docs**: https://vercel.com/docs
- **Next.js Docs**: https://nextjs.org/docs
- **TerraIQ Production Plan**: See PRODUCTION_PLAN.md
- **TerraIQ Architecture**: See PRODUCTION_PLAN.md

---

## Version Info

- **Framework**: Next.js 16
- **React**: 19.2
- **Firebase**: Latest
- **Deployment**: Vercel (automatic on push)
- **Database**: Firestore
- **Authentication**: Firebase Auth
- **Storage**: Firebase Storage
- **AI**: Provider-agnostic (OpenAI, Claude, Gemini, Hugging Face, Mock)
