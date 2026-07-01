/**
 * IndexedDB Utilities for Offline Support
 * Stores data locally for offline access and sync
 */

const DB_NAME = 'TerraIQ'
const DB_VERSION = 1

export interface OfflineData {
  key: string
  value: any
  timestamp: number
  ttl?: number // time to live in milliseconds
}

let db: IDBDatabase | null = null

/**
 * Initialize IndexedDB
 */
export async function initializeIndexedDB(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, DB_VERSION)

    request.onerror = () => {
      console.error('[v0] IndexedDB error:', request.error)
      reject(request.error)
    }

    request.onsuccess = () => {
      db = request.result
      console.log('[v0] IndexedDB initialized')
      resolve(db)
    }

    request.onupgradeneeded = (event) => {
      const database = (event.target as IDBOpenDBRequest).result

      // Create object stores
      if (!database.objectStoreNames.contains('cache')) {
        database.createObjectStore('cache', { keyPath: 'key' })
      }

      if (!database.objectStoreNames.contains('syncQueue')) {
        database.createObjectStore('syncQueue', { keyPath: 'id', autoIncrement: true })
      }

      if (!database.objectStoreNames.contains('weather')) {
        database.createObjectStore('weather', { keyPath: 'timestamp' })
      }

      if (!database.objectStoreNames.contains('crops')) {
        database.createObjectStore('crops', { keyPath: 'id' })
      }

      if (!database.objectStoreNames.contains('scans')) {
        database.createObjectStore('scans', { keyPath: 'id' })
      }
    }
  })
}

/**
 * Get database instance
 */
async function getDatabase(): Promise<IDBDatabase> {
  if (db) return db
  return initializeIndexedDB()
}

/**
 * Store data in cache
 */
export async function setCacheData(key: string, value: any, ttl?: number): Promise<void> {
  try {
    const database = await getDatabase()
    const transaction = database.transaction(['cache'], 'readwrite')
    const store = transaction.objectStore('cache')

    const data: OfflineData = {
      key,
      value,
      timestamp: Date.now(),
      ttl,
    }

    return new Promise((resolve, reject) => {
      const request = store.put(data)
      request.onerror = () => reject(request.error)
      request.onsuccess = () => resolve()
    })
  } catch (error) {
    console.error('[v0] Failed to set cache data:', error)
    throw error
  }
}

/**
 * Get data from cache
 */
export async function getCacheData(key: string): Promise<any | null> {
  try {
    const database = await getDatabase()
    const transaction = database.transaction(['cache'], 'readonly')
    const store = transaction.objectStore('cache')

    return new Promise((resolve, reject) => {
      const request = store.get(key)
      request.onerror = () => reject(request.error)
      request.onsuccess = () => {
        const data = request.result as OfflineData | undefined

        if (!data) {
          resolve(null)
          return
        }

        // Check if expired
        if (data.ttl && Date.now() - data.timestamp > data.ttl) {
          deleteCacheData(key) // async, but don't await
          resolve(null)
          return
        }

        resolve(data.value)
      }
    })
  } catch (error) {
    console.error('[v0] Failed to get cache data:', error)
    return null
  }
}

/**
 * Delete cache data
 */
export async function deleteCacheData(key: string): Promise<void> {
  try {
    const database = await getDatabase()
    const transaction = database.transaction(['cache'], 'readwrite')
    const store = transaction.objectStore('cache')

    return new Promise((resolve, reject) => {
      const request = store.delete(key)
      request.onerror = () => reject(request.error)
      request.onsuccess = () => resolve()
    })
  } catch (error) {
    console.error('[v0] Failed to delete cache data:', error)
    throw error
  }
}

/**
 * Clear all cache
 */
export async function clearCache(): Promise<void> {
  try {
    const database = await getDatabase()
    const transaction = database.transaction(['cache'], 'readwrite')
    const store = transaction.objectStore('cache')

    return new Promise((resolve, reject) => {
      const request = store.clear()
      request.onerror = () => reject(request.error)
      request.onsuccess = () => resolve()
    })
  } catch (error) {
    console.error('[v0] Failed to clear cache:', error)
    throw error
  }
}

/**
 * Add to sync queue (for offline actions)
 */
export async function addToSyncQueue(item: {
  action: 'create' | 'update' | 'delete'
  collection: string
  documentId: string
  data: any
}): Promise<number> {
  try {
    const database = await getDatabase()
    const transaction = database.transaction(['syncQueue'], 'readwrite')
    const store = transaction.objectStore('syncQueue')

    const queueItem = {
      ...item,
      timestamp: Date.now(),
      status: 'pending',
    }

    return new Promise((resolve, reject) => {
      const request = store.add(queueItem)
      request.onerror = () => reject(request.error)
      request.onsuccess = () => resolve(request.result as number)
    })
  } catch (error) {
    console.error('[v0] Failed to add to sync queue:', error)
    throw error
  }
}

/**
 * Get sync queue items
 */
export async function getSyncQueue(): Promise<any[]> {
  try {
    const database = await getDatabase()
    const transaction = database.transaction(['syncQueue'], 'readonly')
    const store = transaction.objectStore('syncQueue')

    return new Promise((resolve, reject) => {
      const request = store.getAll()
      request.onerror = () => reject(request.error)
      request.onsuccess = () => resolve(request.result)
    })
  } catch (error) {
    console.error('[v0] Failed to get sync queue:', error)
    return []
  }
}

/**
 * Remove from sync queue
 */
export async function removeSyncQueueItem(id: number): Promise<void> {
  try {
    const database = await getDatabase()
    const transaction = database.transaction(['syncQueue'], 'readwrite')
    const store = transaction.objectStore('syncQueue')

    return new Promise((resolve, reject) => {
      const request = store.delete(id)
      request.onerror = () => reject(request.error)
      request.onsuccess = () => resolve()
    })
  } catch (error) {
    console.error('[v0] Failed to remove sync queue item:', error)
    throw error
  }
}

/**
 * Store offline scans
 */
export async function storeOfflineScan(scan: any): Promise<void> {
  return setCacheData(`scan_${scan.id}`, scan, 24 * 60 * 60 * 1000) // 24 hour TTL
}

/**
 * Get offline scans
 */
export async function getOfflineScans(): Promise<any[]> {
  try {
    const database = await getDatabase()
    const transaction = database.transaction(['scans'], 'readonly')
    const store = transaction.objectStore('scans')

    return new Promise((resolve, reject) => {
      const request = store.getAll()
      request.onerror = () => reject(request.error)
      request.onsuccess = () => resolve(request.result)
    })
  } catch (error) {
    console.error('[v0] Failed to get offline scans:', error)
    return []
  }
}

/**
 * Check if online
 */
export function isOnline(): boolean {
  return typeof window !== 'undefined' && navigator.onLine
}

/**
 * Listen to online/offline changes
 */
export function onlineStatusListener(callback: (isOnline: boolean) => void) {
  if (typeof window === 'undefined') return () => {}

  const handleOnline = () => callback(true)
  const handleOffline = () => callback(false)

  window.addEventListener('online', handleOnline)
  window.addEventListener('offline', handleOffline)

  return () => {
    window.removeEventListener('online', handleOnline)
    window.removeEventListener('offline', handleOffline)
  }
}
