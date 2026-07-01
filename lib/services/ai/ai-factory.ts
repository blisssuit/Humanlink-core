import { AIProvider, AIProviderType } from './types'
import mockProvider from './providers/mock-provider'
// Import other providers when implemented
// import openaiProvider from './providers/openai-provider'
// import claudeProvider from './providers/claude-provider'
// import geminiProvider from './providers/gemini-provider'
// import huggingfaceProvider from './providers/huggingface-provider'

class AIFactory {
  private activeProvider: AIProvider | null = null
  private providerType: AIProviderType = 'mock'

  constructor() {
    this.initializeProvider()
  }

  /**
   * Initialize provider based on environment variable
   */
  private initializeProvider() {
    const providerEnv = process.env.NEXT_PUBLIC_AI_PROVIDER || 'mock'
    this.providerType = providerEnv as AIProviderType

    console.log(`[v0] Initializing AI provider: ${this.providerType}`)

    try {
      this.activeProvider = this.getProvider(this.providerType)

      if (!this.activeProvider?.isConfigured()) {
        console.warn(`[v0] ${this.providerType} provider not properly configured, falling back to mock`)
        this.activeProvider = mockProvider
        this.providerType = 'mock'
      }
    } catch (error) {
      console.error('[v0] Failed to initialize AI provider:', error)
      this.activeProvider = mockProvider
      this.providerType = 'mock'
    }
  }

  /**
   * Get provider instance
   */
  private getProvider(type: AIProviderType): AIProvider {
    switch (type) {
      case 'openai':
        // return openaiProvider
        throw new Error('OpenAI provider not yet implemented')

      case 'claude':
        // return claudeProvider
        throw new Error('Claude provider not yet implemented')

      case 'gemini':
        // return geminiProvider
        throw new Error('Gemini provider not yet implemented')

      case 'huggingface':
        // return huggingfaceProvider
        throw new Error('Hugging Face provider not yet implemented')

      case 'mock':
      default:
        return mockProvider
    }
  }

  /**
   * Get active provider
   */
  getActiveProvider(): AIProvider {
    if (!this.activeProvider) {
      this.activeProvider = mockProvider
    }
    return this.activeProvider
  }

  /**
   * Get current provider type
   */
  getCurrentProviderType(): AIProviderType {
    return this.providerType
  }

  /**
   * Switch to different provider at runtime
   */
  switchProvider(type: AIProviderType) {
    console.log(`[v0] Switching AI provider to: ${type}`)

    try {
      const provider = this.getProvider(type)

      if (!provider.isConfigured()) {
        console.warn(`[v0] ${type} provider not configured, staying with ${this.providerType}`)
        return
      }

      this.activeProvider = provider
      this.providerType = type
    } catch (error) {
      console.error('[v0] Failed to switch provider:', error)
    }
  }

  /**
   * Get list of available providers
   */
  getAvailableProviders(): AIProviderType[] {
    return ['mock', 'openai', 'claude', 'gemini', 'huggingface']
  }

  /**
   * Get list of configured providers
   */
  getConfiguredProviders(): AIProviderType[] {
    return this.getAvailableProviders().filter((type) => {
      try {
        const provider = this.getProvider(type)
        return provider.isConfigured()
      } catch {
        return false
      }
    })
  }
}

// Singleton instance
export const aiFactory = new AIFactory()

export default aiFactory
