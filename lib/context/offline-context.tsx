'use client'

import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react'
import {
  initializeOfflineService,
  getSyncStatus,
  getOfflineIndicator,
} from '@/lib/services/offline-service'
import { onlineStatusListener } from '@/lib/utils/indexeddb'

interface OfflineContextType {
  isOnline: boolean
  isOffline: boolean
  pendingItems: number
  isSyncing: boolean
  syncStatus: string
}

const OfflineContext = createContext<OfflineContextType | undefined>(undefined)

/**
 * OfflineProvider - Manages offline state
 */
export function OfflineProvider({ children }: { children: ReactNode }) {
  const [isOnline, setIsOnline] = useState(true)
  const [pendingItems, setPendingItems] = useState(0)
  const [isSyncing, setIsSyncing] = useState(false)

  useEffect(() => {
    // Initialize offline service
    const cleanup = initializeOfflineService()

    // Listen to online/offline changes
    const unsubscribe = onlineStatusListener((online) => {
      setIsOnline(online)
    })

    // Update sync status periodically
    const statusInterval = setInterval(async () => {
      const status = await getSyncStatus()
      setPendingItems(status.pendingItems)
      setIsSyncing(status.isSyncing)
    }, 2000)

    return () => {
      cleanup()
      unsubscribe()
      clearInterval(statusInterval)
    }
  }, [])

  const indicator = getOfflineIndicator()

  const value: OfflineContextType = {
    isOnline,
    isOffline: !isOnline,
    pendingItems,
    isSyncing,
    syncStatus: indicator.message,
  }

  return <OfflineContext.Provider value={value}>{children}</OfflineContext.Provider>
}

/**
 * useOffline - Hook to access offline context
 */
export function useOffline() {
  const context = useContext(OfflineContext)

  if (context === undefined) {
    throw new Error('useOffline must be used within OfflineProvider')
  }

  return context
}
