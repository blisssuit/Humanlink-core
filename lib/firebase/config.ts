import { initializeApp, getApp, getApps } from 'firebase/app'
import { getAuth, connectAuthEmulator, Auth } from 'firebase/auth'
import { getFirestore, connectFirestoreEmulator, Firestore } from 'firebase/firestore'
import { getStorage, connectStorageEmulator, FirebaseStorage } from 'firebase/storage'

// Firebase config from environment variables
const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
  measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID,
}

// Validate required config (only warn, don't fail)
const requiredFields = ['apiKey', 'projectId', 'storageBucket'] as const
const missingFields = requiredFields.filter(field => !firebaseConfig[field])
if (missingFields.length > 0 && typeof window !== 'undefined') {
  console.warn(`[v0] Missing Firebase config: ${missingFields.map(f => f.toUpperCase()).join(', ')}. Using mock data.`)
}

// Initialize Firebase (singleton)
let app = getApps().length > 0 ? getApp() : initializeApp(firebaseConfig)

// Initialize services
let auth: Auth | null = null
let db: Firestore | null = null
let storage: FirebaseStorage | null = null

try {
  auth = getAuth(app)
  db = getFirestore(app)
  storage = getStorage(app)
  
  // Connect to emulators in development (if running)
  if (process.env.NODE_ENV === 'development' && typeof window !== 'undefined') {
    try {
      const authEmulatorUrl = process.env.NEXT_PUBLIC_FIREBASE_AUTH_EMULATOR_URL
      if (authEmulatorUrl && auth.currentUser === null) {
        connectAuthEmulator(auth, authEmulatorUrl, { disableWarnings: true })
      }
    } catch (e) {
      // Emulator might not be running
    }
  }
} catch (error) {
  console.error('[v0] Failed to initialize Firebase services:', error)
}

export { app, auth, db, storage }

export const getFirebaseServices = () => ({
  app,
  auth: auth!,
  db: db!,
  storage: storage!,
})
