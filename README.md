# TerraIQ - AI-Powered Agriculture Platform

**Intelligence for Every Farm** 🌾

TerraIQ is a production-ready, AI-powered agricultural platform designed to help African farmers make smarter decisions, maximize yields, and access markets directly.

## 🚀 Live Demo

**Production URLs:**
- https://terraiq-ai-agricultural-platform-f497wfsde.vercel.app
- https://terraiq-ai-agricultural-platform-3eonjouc8.vercel.app
- https://terraiq-ai-agricultural-platform-db3t4sl3g.vercel.app

## 🌟 Features

### Core Functionality
- **AI Crop Scanner**: Instantly detect crop diseases with AI vision analysis
- **AI Chat Interface**: Conversational farming advisor with follow-up recommendations
- **Crop Planner**: Get AI-powered crop recommendations based on location, soil, and season
- **Marketplace**: Direct farmer-to-buyer marketplace with verified sellers
- **TerraMove**: Truck booking for easy harvest transport
- **Farm Dashboard**: Real-time analytics, weather, and farm health scores
- **Offline Support**: Works offline with automatic sync when connection returns

### Advanced Features
- **Role-Based Access**: Farmer, Buyer, Driver, Admin, Agricultural Expert roles
- **Verification System**: Verified badges for farmers and drivers (builds trust)
- **Provider-Agnostic AI**: Swap between OpenAI, Claude, Gemini, Hugging Face providers
- **Real-Time Notifications**: Weather alerts, disease outbreaks, price changes, truck arrivals
- **Analytics Dashboard**: Revenue, expenses, harvest data, productivity metrics
- **Image Compression**: Automatic optimization before upload (10MB → ~2MB)
- **Rate Limiting**: Prevents AI request abuse (10 scans/hour per user)
- **Security**: Firebase security rules, input validation, file type checking

## 🏗️ Architecture

### Tech Stack
- **Frontend**: Next.js 16, React 19.2, TypeScript, Tailwind CSS
- **Backend**: Firebase (Auth, Firestore, Storage)
- **AI**: Provider-agnostic service (OpenAI, Claude, Gemini, Hugging Face, Mock)
- **Deployment**: Vercel (automatic on push)
- **Database**: Firestore (NoSQL)
- **Storage**: Firebase Storage (images, documents)
- **Offline**: IndexedDB + service worker ready

### Folder Structure
```
terraiq/
├── app/                    # Next.js app router
│   ├── api/                # API routes (scan-disease, chat)
│   ├── auth/               # Authentication pages (login, signup, forgot-password)
│   ├── dashboard/          # Protected dashboard
│   ├── scanner/            # AI crop scanner
│   ├── marketplace/        # Marketplace pages
│   ├── transport/          # TerraMove booking
│   └── profile/            # User profile
├── lib/
│   ├── firebase/           # Firebase config, auth, db, storage
│   ├── services/           # Business logic
│   │   ├── ai/             # Provider-agnostic AI service
│   │   ├── auth-service.ts
│   │   ├── scan-service.ts
│   │   ├── chat-service.ts
│   │   ├── verification-service.ts
│   │   └── offline-service.ts
│   ├── context/            # React contexts
│   ├── hooks/              # Custom hooks
│   ├── types/              # TypeScript types
│   └── utils/              # Utilities (validation, IndexedDB, compression)
├── components/             # Reusable components
│   ├── protected/          # Protected route wrappers
│   ├── verification/       # Verification components
│   ├── chat/               # Chat UI components
│   └── ...
└── public/                 # Static assets
```

## 🔐 Security & Production Ready

- **Firebase Security Rules**: Role-based access control in database
- **Input Validation**: Zod schemas for all inputs
- **File Validation**: MIME type and size checks (10MB max, images only)
- **Image Compression**: Automatic optimization before upload
- **Rate Limiting**: 10 AI scans per hour per user
- **Error Handling**: Comprehensive error handling throughout
- **TypeScript**: Strict mode for type safety
- **Environment Variables**: All secrets properly configured

## 📱 Offline-First Architecture

TerraIQ works great even without internet:

1. **Automatic Caching**: Weather, crops, and recent scans cached locally
2. **Offline Sync Queue**: Actions queued while offline, synced automatically when online
3. **IndexedDB Storage**: Persistent local storage for crop data
4. **Smart Sync**: Only syncs changed data, not full datasets

Perfect for farmers in remote areas with unreliable internet.

## 🤖 AI Models

### Supported Providers
- **OpenAI**: GPT-4V for advanced vision analysis
- **Claude**: Anthropic Claude 3 Opus
- **Gemini**: Google Gemini Pro Vision
- **Hugging Face**: Open-source models
- **Mock**: Development/testing mode with realistic data

### Swap Providers Easily
Change one environment variable to switch AI providers:

```env
NEXT_PUBLIC_AI_PROVIDER=openai  # or: claude, gemini, huggingface, mock
OPENAI_API_KEY=sk-...           # API key for selected provider
```

No code changes needed!

### Disease Detection Output
- Disease name
- Confidence percentage (0-100%)
- Severity level (low, medium, high)
- Symptoms detected
- AI explanation
- Treatment recommendations
- Preventive measures
- Recovery time estimate
- Professional disclaimer

## 📊 Role-Based System

### Farmer
- Profile with farm details
- Verification badge
- AI crop scanner
- Marketplace seller
- Farm analytics
- Weather alerts

### Buyer
- Search marketplace
- Message farmers
- Buy directly
- Ratings & reviews

### Transport Driver
- Verification badge
- Truck listing
- Booking management
- Rating system

### Admin
- User management
- Verification approvals
- Marketplace moderation
- Analytics

### Agricultural Expert
- Create content
- AI training
- User support

## 🚀 Quick Start

### Prerequisites
- Node.js 18+
- Firebase account
- Vercel account (optional, for deployment)

### Local Development

1. **Clone the repository**
```bash
git clone <repo-url>
cd terraiq
```

2. **Install dependencies**
```bash
pnpm install
```

3. **Set up environment variables**
Create `.env.local`:
```env
NEXT_PUBLIC_FIREBASE_APIKEY=...
NEXT_PUBLIC_FIREBASE_AUTHDOMAIN=...
NEXT_PUBLIC_FIREBASE_PROJECTID=...
NEXT_PUBLIC_FIREBASE_STORAGEBUCKET=...
NEXT_PUBLIC_FIREBASE_MESSAGINGSENDERID=...
NEXT_PUBLIC_FIREBASE_APPID=...
NEXT_PUBLIC_AI_PROVIDER=mock  # Use mock for development
```

4. **Run the development server**
```bash
pnpm dev
```

5. **Open** http://localhost:3000

### Production Deployment

See [DEPLOYMENT.md](./DEPLOYMENT.md) for complete Firebase setup and Vercel deployment instructions.

## 📚 Documentation

- **[DEPLOYMENT.md](./DEPLOYMENT.md)** - Firebase setup, environment variables, security rules
- **[PRODUCTION_PLAN.md](./PRODUCTION_PLAN.md)** - Architecture, database models, implementation details

## 🔑 Key Features Explained

### AI Crop Scanner
1. Take or upload crop photo
2. AI analyzes image (disease detection)
3. Get comprehensive diagnosis with:
   - Disease identification
   - Confidence score
   - Severity assessment
   - Treatment plan
   - Recovery timeline
4. Save scan to history
5. Share with agricultural expert

### AI Chat Interface
A conversational farming advisor that:
- Answers agricultural questions
- Provides crop recommendations
- Offers disease prevention tips
- Can analyze photos sent in chat
- Asks follow-up questions for better advice
- Saves conversation history

### Marketplace
1. Farmers list produce with:
   - Photos
   - Price
   - Quantity
   - Grade (A, B+, etc.)
   - Verification badge
2. Buyers search and filter
3. Direct messaging
4. Verified seller ratings

### TerraMove Transport
1. Enter pickup location
2. Specify destination
3. Enter cargo weight and type
4. Select available truck
5. Get real-time driver updates
6. Track delivery

### Offline Mode
- Browse recent scans offline
- Access weather forecasts (cached)
- Read crop recommendations
- View marketplace offline
- All actions sync automatically when online

## 💡 Use Cases

### Small Farmer (1-10 hectares)
"My cassava leaves are turning yellow. Should I spray?"
→ AI Chat identifies deficiency, recommends treatment

### Commercial Farmer (50+ hectares)
"Which crop should I plant this season?"
→ AI Crop Planner analyzes soil, weather, market prices

### Cooperative/Agric Association
"We need to sell 500 tons of maize"
→ Marketplace lists products, TerraMove books trucks

### Agric Business
"Which farmers need disease prevention?"
→ Analytics shows disease patterns, send targeted alerts

## 📈 Metrics & Analytics

Dashboard includes:
- **Revenue**: Total sales, avg price per crop
- **Harvest**: Tons produced, yield per hectare
- **Expenses**: Input costs, labor, equipment
- **AI Insights**: Disease patterns, crop success rates
- **Productivity**: Farm health score, efficiency metrics
- **Crop Success Rate**: Which crops perform best

## 🔔 Notifications

Get alerts for:
- Heavy rainfall warnings
- Disease outbreak alerts
- Price increase notifications
- Truck arrival updates
- Buyer messages
- Custom agricultural alerts

## 🌍 Accessibility

- **Mobile-First**: Optimized for phones (many farmers use only phones)
- **Offline Support**: Works with unreliable internet
- **Simple UI**: Minimal navigation, large touch targets
- **Local Languages**: Framework for language support
- **Low Data**: Optimized for slow connections

## 🤝 Contributing

TerraIQ is built for African farmers. We welcome contributions:

1. Fork the repository
2. Create a feature branch
3. Make changes
4. Submit a pull request

## 📜 License

MIT License - See LICENSE file

## 📞 Support

For deployment help, see [DEPLOYMENT.md](./DEPLOYMENT.md)
For architecture details, see [PRODUCTION_PLAN.md](./PRODUCTION_PLAN.md)

---

**TerraIQ: Intelligent Farming for Every African Farm** 🌾✨
