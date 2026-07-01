'use client'

import React, { ReactNode } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/lib/context/auth-context'
import { UserRole } from '@/lib/types/database'

interface ProtectedRouteProps {
  children: ReactNode
  requiredRole?: UserRole | UserRole[]
  fallback?: ReactNode
}

/**
 * ProtectedRoute - Wraps components that require authentication
 * Redirects to login if not authenticated
 * Redirects to unauthorized if user lacks required role
 */
export function ProtectedRoute({
  children,
  requiredRole,
  fallback,
}: ProtectedRouteProps) {
  const router = useRouter()
  const { isLoading, isAuthenticated, userProfile, error } = useAuth()

  // Show loading state
  if (isLoading) {
    return (
      fallback || (
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-4 border-primary border-t-transparent mx-auto mb-4" />
            <p className="text-muted-foreground">Loading...</p>
          </div>
        </div>
      )
    )
  }

  // Not authenticated - redirect to login
  if (!isAuthenticated) {
    React.useEffect(() => {
      router.push('/auth/login')
    }, [router])

    return (
      fallback || (
        <div className="flex items-center justify-center min-h-screen">
          <p className="text-muted-foreground">Redirecting to login...</p>
        </div>
      )
    )
  }

  // Check role if required
  if (requiredRole && userProfile) {
    const requiredRoles = Array.isArray(requiredRole) ? requiredRole : [requiredRole]
    const hasRequiredRole = requiredRoles.includes(userProfile.role)

    if (!hasRequiredRole) {
      React.useEffect(() => {
        router.push('/unauthorized')
      }, [router])

      return (
        fallback || (
          <div className="flex items-center justify-center min-h-screen">
            <p className="text-muted-foreground">You don&apos;t have permission to access this page.</p>
          </div>
        )
      )
    }
  }

  // Authenticated and authorized
  return <>{children}</>
}
