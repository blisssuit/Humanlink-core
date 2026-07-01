import { aiFactory } from './ai-factory'
import { DiagnosisResult, CropAnalysisRequest, CropAnalysisResponse } from './types'

/**
 * Unified AI Service
 * Single interface for all AI operations
 * Automatically routes to active provider
 */

class AIService {
  /**
   * Analyze crop image for disease detection
   * Returns comprehensive diagnosis
   */
  async analyzeCropImage(request: CropAnalysisRequest): Promise<CropAnalysisResponse> {
    const startTime = Date.now()

    try {
      const provider = aiFactory.getActiveProvider()
      const providerName = provider.getName()

      console.log(`[v0] Starting crop analysis with ${providerName}`)

      const result = await provider.analyzeCropImage(request.imageUrl)

      const analysisTime = Date.now() - startTime

      console.log(`[v0] Crop analysis completed in ${analysisTime}ms with ${providerName}`)

      return {
        success: true,
        data: result,
        metadata: {
          provider: providerName,
          analysisTime,
        },
      }
    } catch (error) {
      console.error('[v0] Crop analysis failed:', error)

      const analysisTime = Date.now() - startTime

      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error during analysis',
        metadata: {
          provider: aiFactory.getActiveProvider().getName(),
          analysisTime,
        },
      }
    }
  }

  /**
   * Quick diagnosis for a common disease
   * Used for quick checks without full analysis
   */
  async quickDiagnosis(diseaseName: string): Promise<Partial<DiagnosisResult> | null> {
    // This could be extended to fetch from a database of known diseases
    // For now, just return null to indicate use full analysis
    return null
  }

  /**
   * Get provider information
   */
  getProviderInfo() {
    const provider = aiFactory.getActiveProvider()
    const providerType = aiFactory.getCurrentProviderType()

    return {
      name: provider.getName(),
      type: providerType,
      isConfigured: provider.isConfigured(),
      availableProviders: aiFactory.getAvailableProviders(),
      configuredProviders: aiFactory.getConfiguredProviders(),
    }
  }

  /**
   * Switch AI provider at runtime
   */
  switchProvider(providerType: string) {
    aiFactory.switchProvider(providerType as any)
    return this.getProviderInfo()
  }

  /**
   * Validate image URL or base64
   */
  isValidImageUrl(urlOrBase64: string): boolean {
    // Check if it's a valid URL
    if (urlOrBase64.startsWith('http://') || urlOrBase64.startsWith('https://')) {
      try {
        new URL(urlOrBase64)
        return true
      } catch {
        return false
      }
    }

    // Check if it's valid base64
    if (urlOrBase64.startsWith('data:image/')) {
      try {
        atob(urlOrBase64.split(',')[1])
        return true
      } catch {
        return false
      }
    }

    return false
  }

  /**
   * Get rate limit info (for future implementation)
   */
  getRateLimitInfo() {
    return {
      daily_limit: 50,
      hourly_limit: 10,
      current_usage: 0, // Would query from database
      reset_time: new Date().getTime() + 24 * 60 * 60 * 1000,
    }
  }
}

// Singleton instance
export const aiService = new AIService()

export default aiService
