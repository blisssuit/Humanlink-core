import {
  setCacheData,
  getCacheData,
  addToSyncQueue,
  getSyncQueue,
  removeSyncQueueItem,
  isOnline,
  onlineStatusListener,
} from '@/lib/utils/indexeddb'
import { createDocument, updateDocument, deleteDocument } from '@/lib/firebase/db'

/**
 * Offline Service
 * Manages offline-first functionality with automatic sync
 */

export interface OfflineAction {
  id: number
  action: 'create' | 'update' | 'delete'
  collection: string
  documentId: string
  data: any
  timestamp: number
  status: 'pending' | 'synced' | 'error'
}

let syncInProgress = false
let isOffline = !isOnline()

/**
 * Initialize offline service
 */
export function initializeOfflineService() {
  console.log('[v0] Initializing offline service')

  // Listen to online/offline changes
  const unsubscribe = onlineStatusListener((online) => {
    isOffline = !online
    console.log('[v0] Network status:', online ? 'online' : 'offline')

    if (online) {
      // Sync when coming back online
      syncOfflineQueue()
    }
  })

  // Setup periodic sync (every 30 seconds when online)
  const syncInterval = setInterval(() => {
    if (!isOffline && !syncInProgress) {
      syncOfflineQueue()
    }
  }, 30000)

  return () => {
    unsubscribe()
    clearInterval(syncInterval)
  }
}

/**
 * Perform action offline if no connection
 */
export async function performActionOffline(
  action: 'create' | 'update' | 'delete',
  collection: string,
  documentId: string,
  data?: any
) {
  if (isOnline()) {
    // We're online, perform action directly
    try {
      switch (action) {
        case 'create':
          return await createDocument(collection as any, documentId, data)
        case 'update':
          return await updateDocument(collection as any, documentId, data)
        case 'delete':
          return await deleteDocument(collection as any, documentId)
      }
    } catch (error) {
      console.error('[v0] Online action failed:', error)
      // Fall through to offline queue
    }
  }

  // Queue for offline sync
  console.log('[v0] Queuing offline action:', { action, collection, documentId })

  const queueId = await addToSyncQueue({
    action,
    collection,
    documentId,
    data,
  })

  // Cache result if it's a create/update
  if (action !== 'delete' && data) {
    await setCacheData(`${collection}_${documentId}`, data)
  }

  return { queueId, offline: true }
}

/**
 * Cache data locally
 */
export async function cacheData(key: string, value: any, ttl?: number) {
  try {
    await setCacheData(key, value, ttl)
    console.log('[v0] Data cached:', key)
  } catch (error) {
    console.error('[v0] Failed to cache data:', error)
  }
}

/**
 * Get cached data
 */
export async function getCachedData(key: string) {
  try {
    return await getCacheData(key)
  } catch (error) {
    console.error('[v0] Failed to get cached data:', error)
    return null
  }
}

/**
 * Cache crops locally (for offline recommendation)
 */
export async function cacheRecommendedCrops(crops: any[]) {
  const ttl = 7 * 24 * 60 * 60 * 1000 // 7 days
  await cacheData('recommended_crops', crops, ttl)
}

/**
 * Get cached crops
 */
export async function getCachedCrops() {
  return getCachedData('recommended_crops')
}

/**
 * Cache weather data
 */
export async function cacheWeather(weatherData: any) {
  const ttl = 60 * 60 * 1000 // 1 hour
  await cacheData('weather_data', weatherData, ttl)
}

/**
 * Get cached weather
 */
export async function getCachedWeather() {
  return getCachedData('weather_data')
}

/**
 * Cache recent scans
 */
export async function cacheRecentScans(scans: any[]) {
  const ttl = 30 * 24 * 60 * 60 * 1000 // 30 days
  await cacheData('recent_scans', scans, ttl)
}

/**
 * Get cached scans
 */
export async function getCachedScans() {
  return getCachedData('recent_scans')
}

/**
 * Sync offline queue with Firebase
 */
export async function syncOfflineQueue() {
  if (syncInProgress || isOffline) {
    return
  }

  syncInProgress = true

  try {
    console.log('[v0] Starting offline sync...')

    const queue = await getSyncQueue()

    if (queue.length === 0) {
      console.log('[v0] No items to sync')
      syncInProgress = false
      return
    }

    console.log('[v0] Syncing', queue.length, 'items')

    let successCount = 0
    let errorCount = 0

    for (const item of queue) {
      try {
        switch (item.action) {
          case 'create':
            await createDocument(item.collection as any, item.documentId, item.data)
            break
          case 'update':
            await updateDocument(item.collection as any, item.documentId, item.data)
            break
          case 'delete':
            await deleteDocument(item.collection as any, item.documentId)
            break
        }

        // Remove from queue on success
        await removeSyncQueueItem(item.id)
        successCount++
      } catch (error) {
        console.error('[v0] Failed to sync item:', item, error)
        errorCount++
      }
    }

    console.log('[v0] Sync complete:', { successCount, errorCount })
  } catch (error) {
    console.error('[v0] Sync queue error:', error)
  } finally {
    syncInProgress = false
  }
}

/**
 * Get sync status
 */
export async function getSyncStatus() {
  const queue = await getSyncQueue()
  const pendingCount = queue.filter((item) => item.status === 'pending').length

  return {
    isOnline: isOnline(),
    pendingItems: pendingCount,
    totalItems: queue.length,
    isSyncing: syncInProgress,
  }
}

/**
 * Get offline status indicator
 */
export function getOfflineIndicator() {
  return {
    isOffline,
    message: isOffline
      ? 'You are offline. Changes will sync when online.'
      : 'Online - syncing automatically',
  }
}
