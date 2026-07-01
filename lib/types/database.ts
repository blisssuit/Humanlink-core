// TerraIQ Database Models - Firestore Collections

export type UserRole = 'farmer' | 'buyer' | 'driver' | 'admin' | 'expert'

export interface VerificationDocument {
  type: 'id' | 'farming_license' | 'driver_license' | 'farm_proof' | 'insurance'
  url: string
  uploadedAt: number // timestamp
  status: 'pending' | 'approved' | 'rejected'
  rejectionReason?: string
}

export interface UserProfile {
  // Core
  uid: string // Firebase UID (document ID)
  email: string
  name: string
  phone: string
  profileImage?: string
  bio?: string
  
  // Role & Verification
  role: UserRole
  isVerified: boolean
  verificationDocuments: VerificationDocument[]
  verificationDate?: number // timestamp
  
  // Trust & Ratings
  rating: number // 0-5
  reviewCount: number
  totalTransactions: number
  
  // Farmer-specific fields
  farmName?: string
  farmLocation?: {
    lat: number
    lng: number
    address: string
  }
  farmSize?: number // hectares
  soilType?: string // e.g., "loamy", "sandy", "clay"
  cropTypes?: string[]
  
  // Driver-specific fields
  truckCapacity?: number // tons
  truckModel?: string
  licensePlate?: string
  licenseExpiry?: number // timestamp
  insuranceProvider?: string
  insuranceExpiry?: number // timestamp
  yearsOfExperience?: number
  
  // Account
  isPremium: boolean
  premiumExpiryDate?: number // timestamp
  referralCode?: string
  language?: 'en' | 'yo' | 'ig' | 'ha' // Nigerian languages
  
  // Metadata
  createdAt: number // timestamp
  updatedAt: number // timestamp
  lastLoginAt?: number // timestamp
  isActive: boolean
}

export interface Farm {
  id: string
  userId: string
  
  name: string
  location: {
    lat: number
    lng: number
    address: string
  }
  size: number // hectares
  soilType: string
  
  cropHistory: {
    crop: string
    plantedAt: number
    harvestedAt?: number
    yield: number // tons
    success: boolean
  }[]
  
  totalHarvest: number // tons
  totalProfit: number // NGN
  totalExpenses: number // NGN
  
  createdAt: number // timestamp
  updatedAt: number // timestamp
}

export interface CropScan {
  id: string
  userId: string
  farmId?: string
  
  // Image
  imageUrl: string
  originalImageSize: number // bytes
  compressedImageSize: number // bytes
  
  // Diagnosis (Enhanced)
  disease: string
  confidence: number // 0-100
  severity: 'low' | 'medium' | 'high'
  symptoms: string[]
  
  // AI Response (Complete)
  aiExplanation: string // Why the AI detected this disease
  treatment: string // Treatment recommendations
  preventiveMeasures: string[] // How to prevent
  recoveryEstimate: number // days
  disclaimer: string // Legal disclaimer
  
  // Metadata
  status: 'pending' | 'completed' | 'error'
  aiProvider: string // 'openai', 'claude', 'gemini', 'huggingface', 'mock'
  errorMessage?: string
  
  createdAt: number // timestamp
}

export interface MarketplaceListing {
  id: string
  userId: string // seller
  
  // Product info
  cropName: string
  quantity: number
  unit: 'ton' | 'kg' | 'bag'
  price: number // NGN per unit
  grade: 'A' | 'B+' | 'B' | 'C'
  
  // Details
  image: string
  location: {
    lat: number
    lng: number
    address: string
  }
  description: string
  
  // Seller info (cached for quick access)
  sellerName: string
  sellerRating: number
  sellerIsVerified: boolean
  sellerPhone?: string
  
  // Status
  status: 'active' | 'sold' | 'inactive'
  views: number
  
  // Timestamps
  createdAt: number // timestamp
  updatedAt: number // timestamp
  soldAt?: number // timestamp
}

export interface TruckBooking {
  id: string
  userId: string // farmer or buyer who booked
  
  // Route
  pickupLocation: {
    lat: number
    lng: number
    address: string
  }
  destination: {
    lat: number
    lng: number
    address: string
  }
  
  // Cargo
  cargoWeight: number // tons
  cargoType: string
  estimatedCost: number // NGN
  
  // Status
  status: 'pending' | 'driver_assigned' | 'in_transit' | 'delivered' | 'cancelled'
  
  // Driver assignment
  driverId?: string
  driverName?: string
  driverRating?: number
  driverPhone?: string
  driverIsVerified?: boolean
  
  // Truck details
  truckPlate?: string
  truckCapacity?: number // tons
  
  // Tracking
  estimatedArrival?: number // timestamp
  actualArrival?: number // timestamp
  trackingUrl?: string
  
  // Additional
  notes?: string
  paymentStatus: 'pending' | 'completed' | 'failed'
  paymentMethod?: 'card' | 'transfer' | 'cash'
  
  createdAt: number // timestamp
  completedAt?: number // timestamp
}

export interface Notification {
  id: string
  userId: string
  
  type: 'weather' | 'disease' | 'market' | 'booking' | 'sale' | 'message' | 'verification' | 'system'
  title: string
  message: string
  
  // Optional data for context
  data?: {
    listingId?: string
    bookingId?: string
    scanId?: string
    userId?: string
  }
  
  // Status
  read: boolean
  readAt?: number // timestamp
  
  // Action
  actionUrl?: string
  actionLabel?: string
  
  // Metadata
  imageUrl?: string
  priority: 'low' | 'medium' | 'high'
  
  createdAt: number // timestamp
}

export interface ChatMessage {
  id: string
  userId: string
  
  // Message
  role: 'user' | 'assistant'
  message: string
  
  // Optional attachments
  imageUrl?: string // photo upload for analysis
  
  // AI Metadata
  metadata?: {
    aiProvider: string
    conversationId: string
    tokensUsed: number
    responseTime: number // milliseconds
  }
  
  createdAt: number // timestamp
}

export interface OfflineSyncQueue {
  id: string
  userId: string
  
  // Action description
  action: 'create' | 'update' | 'delete'
  collection: string
  documentId: string
  
  // Data
  data: Record<string, any>
  
  // Status
  status: 'pending' | 'synced' | 'error'
  errorMessage?: string
  retryCount: number
  
  // Timestamps
  timestamp: number // milliseconds since epoch
  syncedAt?: number // timestamp
}

export interface AnalyticsData {
  userId: string
  
  // Financial
  totalRevenue: number // NGN
  monthlyRevenue: number // current month
  totalExpenses: number // NGN
  monthlyExpenses: number // current month
  profit: number // NGN
  
  // Harvest
  totalHarvest: number // tons
  monthlyHarvest: number // current month
  averageYield: number // tons per hectare
  
  // Productivity
  cropsPlanted: number
  cropSuccessRate: number // 0-100 percent
  averageCropCycle: number // days
  
  // Crops by type
  cropData: {
    cropName: string
    planted: number
    harvested: number
    yield: number
    successRate: number
  }[]
  
  // Insights
  insights: string[] // AI-generated insights
  recommendations: string[] // AI recommendations
  
  updatedAt: number // timestamp
}

// API Response Types
export interface ApiResponse<T = any> {
  success: boolean
  data?: T
  error?: string
  message?: string
}

export interface PaginatedResponse<T> {
  items: T[]
  total: number
  page: number
  pageSize: number
  hasMore: boolean
}
