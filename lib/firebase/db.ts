import {
  collection,
  doc,
  setDoc,
  getDoc,
  updateDoc,
  deleteDoc,
  query,
  where,
  orderBy,
  limit,
  getDocs,
  QueryConstraint,
  Timestamp,
} from 'firebase/firestore'
import { db } from './config'
import { UserProfile } from '@/lib/types/database'

const COLLECTIONS = {
  USERS: 'users',
  FARMS: 'farms',
  CROP_SCANS: 'cropScans',
  MARKETPLACE_LISTINGS: 'marketplaceListings',
  TRUCK_BOOKINGS: 'truckBookings',
  NOTIFICATIONS: 'notifications',
  CHAT_MESSAGES: 'chatMessages',
  OFFLINE_QUEUE: 'offlineSyncQueue',
  ANALYTICS: 'analytics',
} as const

/**
 * User Profile Operations
 */

export async function createUserProfile(uid: string, userData: Partial<UserProfile>) {
  try {
    if (!db) throw new Error('Firestore not initialized')
    
    const userRef = doc(db, COLLECTIONS.USERS, uid)
    await setDoc(userRef, {
      uid,
      ...userData,
    })
  } catch (error) {
    console.error('[v0] Failed to create user profile:', error)
    throw error
  }
}

export async function getUserProfile(uid: string): Promise<UserProfile | null> {
  try {
    if (!db) throw new Error('Firestore not initialized')
    
    const userRef = doc(db, COLLECTIONS.USERS, uid)
    const userSnap = await getDoc(userRef)
    
    return userSnap.exists() ? (userSnap.data() as UserProfile) : null
  } catch (error) {
    console.error('[v0] Failed to get user profile:', error)
    throw error
  }
}

export async function updateUserProfile(uid: string, updates: Partial<UserProfile>) {
  try {
    if (!db) throw new Error('Firestore not initialized')
    
    const userRef = doc(db, COLLECTIONS.USERS, uid)
    await updateDoc(userRef, {
      ...updates,
      updatedAt: Date.now(),
    })
  } catch (error) {
    console.error('[v0] Failed to update user profile:', error)
    throw error
  }
}

export async function getUserByEmail(email: string): Promise<UserProfile | null> {
  try {
    if (!db) throw new Error('Firestore not initialized')
    
    const q = query(
      collection(db, COLLECTIONS.USERS),
      where('email', '==', email),
      limit(1)
    )
    
    const querySnapshot = await getDocs(q)
    return querySnapshot.empty ? null : (querySnapshot.docs[0].data() as UserProfile)
  } catch (error) {
    console.error('[v0] Failed to get user by email:', error)
    throw error
  }
}

/**
 * Generic CRUD Operations
 */

export async function createDocument(
  collectionName: keyof typeof COLLECTIONS,
  documentId: string,
  data: any
) {
  try {
    if (!db) throw new Error('Firestore not initialized')
    
    const docRef = doc(db, COLLECTIONS[collectionName], documentId)
    await setDoc(docRef, {
      id: documentId,
      ...data,
      createdAt: Date.now(),
    })
  } catch (error) {
    console.error(`[v0] Failed to create document in ${collectionName}:`, error)
    throw error
  }
}

export async function getDocument(
  collectionName: keyof typeof COLLECTIONS,
  documentId: string
) {
  try {
    if (!db) throw new Error('Firestore not initialized')
    
    const docRef = doc(db, COLLECTIONS[collectionName], documentId)
    const docSnap = await getDoc(docRef)
    
    return docSnap.exists() ? docSnap.data() : null
  } catch (error) {
    console.error(`[v0] Failed to get document from ${collectionName}:`, error)
    throw error
  }
}

export async function updateDocument(
  collectionName: keyof typeof COLLECTIONS,
  documentId: string,
  updates: any
) {
  try {
    if (!db) throw new Error('Firestore not initialized')
    
    const docRef = doc(db, COLLECTIONS[collectionName], documentId)
    await updateDoc(docRef, {
      ...updates,
      updatedAt: Date.now(),
    })
  } catch (error) {
    console.error(`[v0] Failed to update document in ${collectionName}:`, error)
    throw error
  }
}

export async function deleteDocument(
  collectionName: keyof typeof COLLECTIONS,
  documentId: string
) {
  try {
    if (!db) throw new Error('Firestore not initialized')
    
    const docRef = doc(db, COLLECTIONS[collectionName], documentId)
    await deleteDoc(docRef)
  } catch (error) {
    console.error(`[v0] Failed to delete document from ${collectionName}:`, error)
    throw error
  }
}

/**
 * Query Operations
 */

export async function queryDocuments(
  collectionName: keyof typeof COLLECTIONS,
  constraints: QueryConstraint[]
) {
  try {
    if (!db) throw new Error('Firestore not initialized')
    
    const q = query(collection(db, COLLECTIONS[collectionName]), ...constraints)
    const querySnapshot = await getDocs(q)
    
    return querySnapshot.docs.map((doc) => ({
      ...doc.data(),
      id: doc.id,
    }))
  } catch (error) {
    console.error(`[v0] Failed to query documents from ${collectionName}:`, error)
    throw error
  }
}

export async function queryUserDocuments(
  collectionName: keyof typeof COLLECTIONS,
  userId: string,
  additionalConstraints: QueryConstraint[] = []
) {
  try {
    if (!db) throw new Error('Firestore not initialized')
    
    const constraints: QueryConstraint[] = [
      where('userId', '==', userId),
      ...additionalConstraints,
    ]
    
    return queryDocuments(collectionName, constraints)
  } catch (error) {
    console.error(`[v0] Failed to query user documents from ${collectionName}:`, error)
    throw error
  }
}

/**
 * Verification Document Operations
 */

export async function addVerificationDocument(
  userId: string,
  document: {
    type: string
    url: string
    status: string
  }
) {
  try {
    if (!db) throw new Error('Firestore not initialized')
    
    const userRef = doc(db, COLLECTIONS.USERS, userId)
    const userDoc = await getDoc(userRef)
    
    if (!userDoc.exists()) throw new Error('User not found')
    
    const currentDocs = userDoc.data().verificationDocuments || []
    
    await updateDoc(userRef, {
      verificationDocuments: [
        ...currentDocs,
        {
          ...document,
          uploadedAt: Date.now(),
        },
      ],
    })
  } catch (error) {
    console.error('[v0] Failed to add verification document:', error)
    throw error
  }
}

/**
 * Pagination Helper
 */

export async function queryPaginated(
  collectionName: keyof typeof COLLECTIONS,
  constraints: QueryConstraint[],
  pageSize: number = 10,
  pageNumber: number = 1
) {
  try {
    if (!db) throw new Error('Firestore not initialized')
    
    // Get total count
    const countQ = query(collection(db, COLLECTIONS[collectionName]), ...constraints)
    const countSnapshot = await getDocs(countQ)
    const total = countSnapshot.size
    
    // Get paginated results
    const skipCount = (pageNumber - 1) * pageSize
    const paginatedConstraints = [
      ...constraints,
      limit(pageSize + skipCount), // Get extra to skip
    ]
    
    const q = query(collection(db, COLLECTIONS[collectionName]), ...paginatedConstraints)
    const querySnapshot = await getDocs(q)
    
    const items = querySnapshot.docs
      .slice(skipCount)
      .map((doc) => ({
        ...doc.data(),
        id: doc.id,
      }))
    
    return {
      items,
      total,
      page: pageNumber,
      pageSize,
      hasMore: pageNumber * pageSize < total,
    }
  } catch (error) {
    console.error(`[v0] Failed to query paginated documents from ${collectionName}:`, error)
    throw error
  }
}

export { COLLECTIONS }
