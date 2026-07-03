'use client'

import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react'

interface User {
  id: string
  name: string
  email: string
  phone?: string
  farmName?: string
  farmLocation?: string
  profileImage?: string
  isPremium?: boolean
}

interface AppContextType {
  user: User | null
  isLoggedIn: boolean
  setUser: (user: User | null) => void
  logout: () => void
  updateUser: (updates: Partial<User>) => void
}

const AppContext = createContext<AppContextType | undefined>(undefined)

export function AppProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [hydrated, setHydrated] = useState(false)

  useEffect(() => {
    // Load user from localStorage only after hydration completes on client
    if (typeof window === 'undefined') return
    
    try {
      const savedUser = localStorage.getItem('terraiq_user')
      if (savedUser) {
        setUser(JSON.parse(savedUser))
      }
    } catch (e) {
      console.error('[v0] Failed to load user from storage:', e)
    }
    
    setHydrated(true)
  }, [])

  const logout = () => {
    setUser(null)
    if (typeof window !== 'undefined') {
      localStorage.removeItem('terraiq_user')
    }
  }

  const updateUser = (updates: Partial<User>) => {
    if (user) {
      const updatedUser = { ...user, ...updates }
      setUser(updatedUser)
      if (typeof window !== 'undefined') {
        localStorage.setItem('terraiq_user', JSON.stringify(updatedUser))
      }
    }
  }

  return (
    <AppContext.Provider
      value={{
        user,
        isLoggedIn: !!user,
        setUser: (newUser) => {
          setUser(newUser)
          if (newUser && typeof window !== 'undefined') {
            localStorage.setItem('terraiq_user', JSON.stringify(newUser))
          }
        },
        logout,
        updateUser,
      }}
    >
      {children}
    </AppContext.Provider>
  )
}

export function useApp() {
  const context = useContext(AppContext)
  if (context === undefined) {
    throw new Error('useApp must be used within AppProvider')
  }
  return context
}
