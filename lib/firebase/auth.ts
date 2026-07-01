import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  sendPasswordResetEmail,
  sendEmailVerification,
  updateProfile,
  User,
  signInWithPopup,
  GoogleAuthProvider,
  setPersistence,
  browserLocalPersistence,
} from 'firebase/auth'
import { auth } from './config'
import { createUserProfile } from './db'

// Email/Password Registration
export async function registerWithEmail(
  email: string,
  password: string,
  name: string
) {
  try {
    if (!auth) throw new Error('Firebase auth not initialized')
    
    // Create user account
    const userCredential = await createUserWithEmailAndPassword(auth, email, password)
    const user = userCredential.user
    
    // Update profile with name
    await updateProfile(user, { displayName: name })
    
    // Send verification email
    await sendEmailVerification(user)
    
    // Create user profile document in Firestore
    await createUserProfile(user.uid, {
      email,
      name,
      phone: '',
      role: 'farmer', // default role
      isVerified: false,
      verificationDocuments: [],
      rating: 0,
      reviewCount: 0,
      totalTransactions: 0,
      isPremium: false,
      isActive: true,
      createdAt: Date.now(),
      updatedAt: Date.now(),
    })
    
    return user
  } catch (error: any) {
    console.error('[v0] Registration error:', error)
    throw new Error(error.message || 'Failed to register')
  }
}

// Email/Password Login
export async function loginWithEmail(email: string, password: string) {
  try {
    if (!auth) throw new Error('Firebase auth not initialized')
    
    // Set persistence to LOCAL for automatic re-login
    await setPersistence(auth, browserLocalPersistence)
    
    const userCredential = await signInWithEmailAndPassword(auth, email, password)
    return userCredential.user
  } catch (error: any) {
    console.error('[v0] Login error:', error)
    throw new Error(error.message || 'Failed to login')
  }
}

// Google Sign-In
export async function loginWithGoogle() {
  try {
    if (!auth) throw new Error('Firebase auth not initialized')
    
    const provider = new GoogleAuthProvider()
    provider.addScope('profile')
    provider.addScope('email')
    
    const result = await signInWithPopup(auth, provider)
    const user = result.user
    
    // Check if this is a new user (first login)
    const isNewUser = result.additionalUserInfo?.isNewUser
    
    if (isNewUser) {
      // Create user profile for new Google users
      await createUserProfile(user.uid, {
        email: user.email || '',
        name: user.displayName || 'User',
        phone: '',
        role: 'farmer', // default role
        isVerified: false,
        verificationDocuments: [],
        rating: 0,
        reviewCount: 0,
        totalTransactions: 0,
        isPremium: false,
        isActive: true,
        createdAt: Date.now(),
        updatedAt: Date.now(),
      })
    }
    
    return user
  } catch (error: any) {
    console.error('[v0] Google sign-in error:', error)
    throw new Error(error.message || 'Failed to sign in with Google')
  }
}

// Logout
export async function logout() {
  try {
    if (!auth) throw new Error('Firebase auth not initialized')
    await signOut(auth)
  } catch (error: any) {
    console.error('[v0] Logout error:', error)
    throw new Error(error.message || 'Failed to logout')
  }
}

// Send Password Reset Email
export async function sendPasswordReset(email: string) {
  try {
    if (!auth) throw new Error('Firebase auth not initialized')
    await sendPasswordResetEmail(auth, email)
  } catch (error: any) {
    console.error('[v0] Password reset error:', error)
    throw new Error(error.message || 'Failed to send reset email')
  }
}

// Verify Email
export async function verifyEmail(user: User) {
  try {
    await sendEmailVerification(user)
  } catch (error: any) {
    console.error('[v0] Email verification error:', error)
    throw new Error(error.message || 'Failed to send verification email')
  }
}

// Get current user
export function getCurrentUser() {
  return auth?.currentUser || null
}

// Check if user is authenticated
export function isAuthenticated() {
  return auth?.currentUser !== null
}

// Get auth token
export async function getAuthToken() {
  try {
    if (!auth?.currentUser) return null
    return await auth.currentUser.getIdToken()
  } catch (error) {
    console.error('[v0] Failed to get auth token:', error)
    return null
  }
}
