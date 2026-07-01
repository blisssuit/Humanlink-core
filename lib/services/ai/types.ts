/**
 * Provider-Agnostic AI Service Types
 * All AI providers must implement this interface
 */

export type AIProviderType = 'openai' | 'claude' | 'gemini' | 'huggingface' | 'mock'

export interface DiagnosisResult {
  // Disease identification
  disease: string
  confidence: number // 0-100 percentage
  severity: 'low' | 'medium' | 'high'
  
  // Detailed findings
  symptoms: string[]
  aiExplanation: string // Why AI detected this disease
  
  // Treatment and prevention
  treatment: string
  preventiveMeasures: string[] // How to prevent future occurrence
  recoveryEstimate: number // days until recovery
  
  // Legal
  disclaimer: string // Not a substitute for professional diagnosis
}

export interface AIProvider {
  /**
   * Analyze crop image for disease
   */
  analyzeCropImage(imageUrl: string): Promise<DiagnosisResult>
  
  /**
   * Get provider name
   */
  getName(): string
  
  /**
   * Check if provider is properly configured
   */
  isConfigured(): boolean
}

export interface AIServiceConfig {
  provider: AIProviderType
  apiKey?: string
  apiEndpoint?: string
  model?: string
}

export interface CropAnalysisRequest {
  imageUrl: string
  farmContext?: {
    cropType?: string
    farmLocation?: string
    soilType?: string
    season?: string
  }
}

export interface CropAnalysisResponse {
  success: boolean
  data?: DiagnosisResult
  error?: string
  metadata?: {
    provider: string
    analysisTime: number // milliseconds
    tokensUsed?: number
  }
}
