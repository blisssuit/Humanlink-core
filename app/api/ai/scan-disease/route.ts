import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/lib/firebase/config'
import { getUserProfile } from '@/lib/firebase/db'
import { aiService } from '@/lib/services/ai/ai-service'
import { createDocument } from '@/lib/firebase/db'

/**
 * POST /api/ai/scan-disease
 * Analyzes crop image for disease detection
 * Returns comprehensive diagnosis with AI explanation, treatment, and prevention
 */

// Simple in-memory rate limiting (in production use Redis)
const rateLimitMap = new Map<string, { count: number; resetTime: number }>()

const RATE_LIMIT_PER_HOUR = 10
const RATE_LIMIT_WINDOW = 60 * 60 * 1000 // 1 hour

function checkRateLimit(userId: string): boolean {
  const now = Date.now()
  const limit = rateLimitMap.get(userId)

  if (!limit || now > limit.resetTime) {
    rateLimitMap.set(userId, { count: 1, resetTime: now + RATE_LIMIT_WINDOW })
    return true
  }

  if (limit.count >= RATE_LIMIT_PER_HOUR) {
    return false
  }

  limit.count++
  return true
}

export async function POST(request: NextRequest) {
  try {
    // Get user ID from auth header
    const authHeader = request.headers.get('Authorization')
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      )
    }

    // In production, verify the token with Firebase
    // For now, extract from header
    const token = authHeader.substring(7)
    console.log('[v0] Scan request with token')

    // Parse request body
    const body = await request.json()
    const { imageUrl, farmId } = body

    if (!imageUrl) {
      return NextResponse.json(
        { success: false, error: 'Image URL is required' },
        { status: 400 }
      )
    }

    // Validate image URL
    if (!aiService.isValidImageUrl(imageUrl)) {
      return NextResponse.json(
        { success: false, error: 'Invalid image URL' },
        { status: 400 }
      )
    }

    // For demo purposes, we'll use a placeholder user ID
    // In production, extract from verified token
    const userId = 'demo-user'

    // Check rate limit
    if (!checkRateLimit(userId)) {
      return NextResponse.json(
        {
          success: false,
          error: 'Rate limit exceeded. Maximum 10 scans per hour.',
        },
        { status: 429 }
      )
    }

    console.log('[v0] Starting crop analysis...')

    // Analyze crop image
    const analysisResult = await aiService.analyzeCropImage({
      imageUrl,
      farmContext: farmId
        ? {
            farmLocation: 'Unknown',
          }
        : undefined,
    })

    if (!analysisResult.success) {
      return NextResponse.json(
        {
          success: false,
          error: analysisResult.error || 'Analysis failed',
        },
        { status: 500 }
      )
    }

    // Store scan in Firestore
    const scanId = `scan_${Date.now()}_${Math.random().toString(36).substring(7)}`

    try {
      await createDocument('CROP_SCANS', scanId, {
        userId,
        farmId,
        imageUrl,
        disease: analysisResult.data?.disease,
        confidence: analysisResult.data?.confidence,
        severity: analysisResult.data?.severity,
        symptoms: analysisResult.data?.symptoms,
        aiExplanation: analysisResult.data?.aiExplanation,
        treatment: analysisResult.data?.treatment,
        preventiveMeasures: analysisResult.data?.preventiveMeasures,
        recoveryEstimate: analysisResult.data?.recoveryEstimate,
        disclaimer: analysisResult.data?.disclaimer,
        status: 'completed',
        aiProvider: analysisResult.metadata?.provider,
      })

      console.log('[v0] Scan stored:', scanId)
    } catch (error) {
      console.error('[v0] Failed to store scan:', error)
      // Don't fail the response - analysis was successful
    }

    // Return analysis result
    return NextResponse.json(
      {
        success: true,
        data: {
          scanId,
          ...analysisResult.data,
        },
        metadata: {
          analysisTime: analysisResult.metadata?.analysisTime,
          provider: analysisResult.metadata?.provider,
          rateLimitRemaining: RATE_LIMIT_PER_HOUR - (rateLimitMap.get(userId)?.count || 0),
        },
      },
      { status: 200 }
    )
  } catch (error) {
    console.error('[v0] API error:', error)

    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    )
  }
}
