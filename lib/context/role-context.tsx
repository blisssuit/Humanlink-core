'use client'

import React, { createContext, useContext, ReactNode } from 'react'
import { useAuth } from './auth-context'
import { UserRole } from '@/lib/types/database'

interface RoleContextType {
  role: UserRole | null
  hasRole: (role: UserRole | UserRole[]) => boolean
  isVerified: boolean
  canAccess: (requiredRole: UserRole | UserRole[]) => boolean
}

const RoleContext = createContext<RoleContextType | undefined>(undefined)

/**
 * RoleProvider - Provides role-based access control utilities
 */
export function RoleProvider({ children }: { children: ReactNode }) {
  const { userProfile } = useAuth()

  const hasRole = (roles: UserRole | UserRole[]): boolean => {
    if (!userProfile?.role) return false

    const roleArray = Array.isArray(roles) ? roles : [roles]
    return roleArray.includes(userProfile.role)
  }

  const canAccess = (requiredRole: UserRole | UserRole[]): boolean => {
    return hasRole(requiredRole)
  }

  const value: RoleContextType = {
    role: userProfile?.role || null,
    hasRole,
    isVerified: userProfile?.isVerified || false,
    canAccess,
  }

  return <RoleContext.Provider value={value}>{children}</RoleContext.Provider>
}

/**
 * useRole - Hook to access role context
 */
export function useRole() {
  const context = useContext(RoleContext)

  if (context === undefined) {
    throw new Error('useRole must be used within RoleProvider')
  }

  return context
}
