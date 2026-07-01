'use client'

import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react'
import { User, onAuthStateChanged } from 'firebase/auth'
import { auth } from '@/lib/firebase/config'
import { getUserProfile } from '@/lib/firebase/db'
import { UserProfile } from '@/lib/types/database'

interface AuthContextType {
  user: User | null
  userProfile: UserProfile | null
  isLoading: boolean
  isAuthenticated: boolean
  error: string | null
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

/**
 * AuthProvider - Wraps the entire app to provide auth state
 */
export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!auth) {
      console.error('[v0] Firebase auth not initialized')
      setIsLoading(false)
      return
    }

    // Listen to auth state changes
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      try {
        setError(null)

        if (firebaseUser) {
          // User is signed in
          setUser(firebaseUser)

          // Load user profile from Firestore
          try {
            const profile = await getUserProfile(firebaseUser.uid)
            setUserProfile(profile)
          } catch (err) {
            console.error('[v0] Failed to load user profile:', err)
            setError('Failed to load user profile')
          }
        } else {
          // User is signed out
          setUser(null)
          setUserProfile(null)
        }
      } catch (err) {
        console.error('[v0] Auth state change error:', err)
        setError(err instanceof Error ? err.message : 'Unknown auth error')
      } finally {
        setIsLoading(false)
      }
    })

    return () => unsubscribe()
  }, [])

  const value: AuthContextType = {
    user,
    userProfile,
    isLoading,
    isAuthenticated: !!user,
    error,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

/**
 * useAuth - Hook to access auth context
 */
export function useAuth() {
  const context = useContext(AuthContext)

  if (context === undefined) {
    throw new Error('useAuth must be used within AuthProvider')
  }

  return context
}
