import { initializeApp, getApp, getApps, FirebaseApp } from 'firebase/app'
import { Auth } from 'firebase/auth'
import { Firestore } from 'firebase/firestore'
import { FirebaseStorage } from 'firebase/storage'

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
  measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID,
}

// Only initialize Firebase when a valid API key is present.
// Without this guard, initializeApp throws "Invalid API key" at module-load
// time (even on the server), which crashes the entire Next.js module graph
// and causes a 404 on every route.
export const isFirebaseConfigured =
  typeof firebaseConfig.apiKey === 'string' && firebaseConfig.apiKey.length > 0

let app: FirebaseApp | null = null
let auth: Auth | null = null
let db: Firestore | null = null
let storage: FirebaseStorage | null = null

if (isFirebaseConfigured) {
  try {
    app = getApps().length > 0 ? getApp() : initializeApp(firebaseConfig)

    // Lazy-import so Firebase SDK modules are not evaluated at all when
    // Firebase is not configured (avoids SSR crashes).
    const { getAuth } = require('firebase/auth')
    const { getFirestore } = require('firebase/firestore')
    const { getStorage } = require('firebase/storage')

    auth = getAuth(app)
    db = getFirestore(app)
    storage = getStorage(app)
  } catch (error) {
    console.warn('[TerraIQ] Firebase initialization failed:', error)
  }
} else {
  if (typeof window !== 'undefined') {
    console.info(
      '[TerraIQ] Firebase env vars not set — running in demo mode. ' +
        'Add NEXT_PUBLIC_FIREBASE_* vars to enable auth and database.'
    )
  }
}

export { app, auth, db, storage }
