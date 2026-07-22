'use client'

import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react'

interface AuthContextType {
  firebaseUser: unknown | null
  userProfile: unknown | null
  isLoading: boolean
  isAuthenticated: boolean
  isFirebaseReady: boolean
  error: string | null
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [firebaseUser, setFirebaseUser] = useState<unknown | null>(null)
  const [userProfile, setUserProfile] = useState<unknown | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isFirebaseReady, setIsFirebaseReady] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    // Dynamically import Firebase only on the client, only when configured.
    // This prevents the module from being evaluated server-side with empty env vars.
    let unsubscribe: (() => void) | null = null

    const initAuth = async () => {
      try {
        const { isFirebaseConfigured, auth } = await import('@/lib/firebase/config')

        if (!isFirebaseConfigured || !auth) {
          // Running in demo mode — no Firebase
          setIsLoading(false)
          return
        }

        const { onAuthStateChanged } = await import('firebase/auth')
        const { getUserProfile } = await import('@/lib/firebase/db')

        setIsFirebaseReady(true)

        unsubscribe = onAuthStateChanged(auth, async (user) => {
          try {
            setError(null)
            if (user) {
              setFirebaseUser(user)
              try {
                const profile = await getUserProfile(user.uid)
                setUserProfile(profile)
              } catch {
                // Profile may not exist yet
              }
            } else {
              setFirebaseUser(null)
              setUserProfile(null)
            }
          } catch (err) {
            setError(err instanceof Error ? err.message : 'Auth error')
          } finally {
            setIsLoading(false)
          }
        })
      } catch (err) {
        console.warn('[TerraIQ] Auth init failed:', err)
        setIsLoading(false)
      }
    }

    initAuth()
    return () => { if (unsubscribe) unsubscribe() }
  }, [])

  return (
    <AuthContext.Provider
      value={{
        firebaseUser,
        userProfile,
        isLoading,
        isAuthenticated: !!firebaseUser,
        isFirebaseReady,
        error,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within AuthProvider')
  }
  return context
}
