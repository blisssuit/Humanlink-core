import { uploadCropScanImage } from '@/lib/firebase/storage'
import { createDocument, queryUserDocuments } from '@/lib/firebase/db'
import { CropScan } from '@/lib/types/database'
import { where, orderBy, limit } from 'firebase/firestore'

/**
 * Crop Scan Service
 * Handles image upload, AI analysis, and scan history
 */

export interface ScanResult {
  scanId: string
  disease: string
  confidence: number
  severity: 'low' | 'medium' | 'high'
  symptoms: string[]
  aiExplanation: string
  treatment: string
  preventiveMeasures: string[]
  recoveryEstimate: number
  disclaimer: string
  analysisTime: number
  provider: string
}

/**
 * Upload crop image and analyze for disease
 */
export async function scanCropImage(
  file: File,
  userId: string,
  farmId?: string
): Promise<ScanResult> {
  try {
    console.log('[v0] Starting crop scan...', file.name)

    // Upload image to Firebase Storage
    const { url, originalSize, compressedSize } = await uploadCropScanImage(file, userId)

    console.log('[v0] Image uploaded successfully')
    console.log('[v0] Compression ratio:', (
      ((originalSize - compressedSize) / originalSize) *
      100
    ).toFixed(1) + '%')

    // Call API to analyze image
    const response = await fetch('/api/ai/scan-disease', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${await getAuthToken()}`,
      },
      body: JSON.stringify({
        imageUrl: url,
        farmId,
      }),
    })

    if (!response.ok) {
      const error = await response.json()
      throw new Error(error.error || 'Analysis failed')
    }

    const result = await response.json()

    if (!result.success) {
      throw new Error(result.error || 'Analysis failed')
    }

    console.log('[v0] Analysis complete')

    // Store scan locally for offline access
    await cacheRecentScan(result.data)

    return result.data as ScanResult
  } catch (error) {
    console.error('[v0] Scan failed:', error)
    throw error
  }
}

/**
 * Get auth token (demo - in production use proper token management)
 */
async function getAuthToken(): Promise<string> {
  // This is a placeholder - in production, get from auth context
  return 'demo-token'
}

/**
 * Get scan history for user
 */
export async function getUserScans(userId: string): Promise<CropScan[]> {
  try {
    const scans = await queryUserDocuments('CROP_SCANS', userId, [
      orderBy('createdAt', 'desc'),
      limit(50),
    ])

    return scans as CropScan[]
  } catch (error) {
    console.error('[v0] Failed to get user scans:', error)
    return []
  }
}

/**
 * Get recent scans (last 7 days)
 */
export async function getRecentScans(userId: string): Promise<CropScan[]> {
  try {
    const sevenDaysAgo = Date.now() - 7 * 24 * 60 * 60 * 1000

    const scans = await queryUserDocuments('CROP_SCANS', userId, [
      where('createdAt', '>=', sevenDaysAgo),
      orderBy('createdAt', 'desc'),
    ])

    return scans as CropScan[]
  } catch (error) {
    console.error('[v0] Failed to get recent scans:', error)
    return []
  }
}

/**
 * Get scan by ID
 */
export async function getScanById(scanId: string): Promise<CropScan | null> {
  try {
    const scan = await (
      await import('@/lib/firebase/db').then((m) => m.getDocument('CROP_SCANS', scanId))
    )

    return scan as CropScan | null
  } catch (error) {
    console.error('[v0] Failed to get scan:', error)
    return null
  }
}

/**
 * Get disease statistics for user
 */
export async function getDiseaseStatistics(userId: string): Promise<{
  [disease: string]: number
}> {
  try {
    const scans = await getUserScans(userId)

    const stats: { [disease: string]: number } = {}

    scans.forEach((scan) => {
      if (scan.disease) {
        stats[scan.disease] = (stats[scan.disease] || 0) + 1
      }
    })

    return stats
  } catch (error) {
    console.error('[v0] Failed to get disease statistics:', error)
    return {}
  }
}

/**
 * Get most common diseases
 */
export async function getMostCommonDiseases(
  userId: string,
  limit: number = 5
): Promise<{ disease: string; count: number }[]> {
  try {
    const stats = await getDiseaseStatistics(userId)

    return Object.entries(stats)
      .map(([disease, count]) => ({ disease, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, limit)
  } catch (error) {
    console.error('[v0] Failed to get common diseases:', error)
    return []
  }
}

/**
 * Get success rate (healthy crops)
 */
export async function getSuccessRate(userId: string): Promise<number> {
  try {
    const scans = await getUserScans(userId)

    if (scans.length === 0) return 0

    const healthyCount = scans.filter((scan) => scan.disease === 'Healthy Crop').length

    return Math.round((healthyCount / scans.length) * 100)
  } catch (error) {
    console.error('[v0] Failed to get success rate:', error)
    return 0
  }
}

/**
 * Cache recent scan locally
 */
async function cacheRecentScan(scan: ScanResult) {
  try {
    const { cacheRecentScans, getCachedScans } = await import(
      '@/lib/services/offline-service'
    )

    const cached = await getCachedScans()
    const scans = Array.isArray(cached) ? cached : []

    scans.unshift(scan)
    await cacheRecentScans(scans.slice(0, 50)) // Keep last 50
  } catch (error) {
    // Offline service might not be available
    console.log('[v0] Could not cache scan')
  }
}

/**
 * Export scan as PDF (future feature)
 */
export async function exportScanAsPDF(scan: CropScan): Promise<Blob | null> {
  try {
    // TODO: Implement PDF export using jspdf or similar
    console.log('[v0] PDF export not yet implemented')
    return null
  } catch (error) {
    console.error('[v0] Failed to export PDF:', error)
    return null
  }
}

/**
 * Share scan with another user
 */
export async function shareScan(scanId: string, userId: string, shareWithUserId: string) {
  try {
    // TODO: Implement scan sharing
    console.log('[v0] Scan sharing not yet implemented')
  } catch (error) {
    console.error('[v0] Failed to share scan:', error)
    throw error
  }
}
