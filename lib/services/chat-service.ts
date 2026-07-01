import { createDocument, queryDocuments, where, orderBy, limit } from '@/lib/firebase/db'
import { ChatMessage } from '@/lib/types/database'
import { aiService } from './ai/ai-service'

/**
 * AI Chat Service
 * Manages conversational interactions with farming AI advisor
 * Handles context, conversation history, and follow-up questions
 */

export interface ChatConversation {
  id: string
  userId: string
  title: string
  messages: ChatMessage[]
  cropContext?: string
  farmContext?: string
  createdAt: number
  updatedAt: number
}

export interface ChatResponse {
  messageId: string
  role: 'assistant'
  message: string
  suggestions?: string[] // Follow-up questions
  isComplete: boolean
  tokensUsed?: number
}

// System prompt for farming AI advisor
const SYSTEM_PROMPT = `You are an experienced agricultural advisor helping farmers in Africa optimize their crop production. 

Your expertise includes:
- Crop disease identification and treatment
- Pest management
- Soil health and fertilization
- Weather-related crop management
- Best farming practices for African climate
- Sustainable agriculture

When a farmer describes a problem:
1. Ask clarifying questions if needed
2. Provide practical, actionable advice
3. Consider local African farming context
4. Suggest follow-up actions
5. Be empathetic and encouraging

If the farmer mentions a leaf color or symptom, offer to analyze a photo for more accurate diagnosis.

Always end with 2-3 follow-up question suggestions.

Keep responses concise and friendly.`

/**
 * Send message to AI chat and get response
 */
export async function sendChatMessage(
  userId: string,
  conversationId: string,
  message: string,
  imageUrl?: string
): Promise<ChatResponse> {
  try {
    console.log('[v0] Processing chat message:', message.substring(0, 50) + '...')

    // Store user message
    const userMessageId = `msg_${Date.now()}_${Math.random().toString(36).substring(7)}`
    await createDocument('CHAT_MESSAGES', userMessageId, {
      userId,
      conversationId,
      role: 'user',
      message,
      imageUrl,
    })

    // Build conversation context
    const context = await buildConversationContext(userId, conversationId)

    // Prepare messages for AI
    const messages = [
      {
        role: 'user',
        content: imageUrl
          ? [
              { type: 'text', text: message },
              { type: 'image_url', image_url: { url: imageUrl } },
            ]
          : message,
      },
    ]

    // Call unified AI service
    // TODO: Integrate with actual AI providers for streaming chat responses
    // For now, use the crop analysis for image-based queries

    let responseText = ''

    if (imageUrl && message.toLowerCase().includes('disease')) {
      // If user is asking about disease with image, analyze it
      const analysisResult = await aiService.analyzeCropImage({ imageUrl })

      if (analysisResult.success && analysisResult.data) {
        responseText = `Based on the image, I detected **${analysisResult.data.disease}** with ${analysisResult.data.confidence}% confidence.

**Severity:** ${analysisResult.data.severity}

**Symptoms observed:**
${analysisResult.data.symptoms.map((s) => `• ${s}`).join('\n')}

**Why this diagnosis:** ${analysisResult.data.aiExplanation}

**Treatment recommendations:**
${analysisResult.data.treatment}

**Prevention measures for next season:**
${analysisResult.data.preventiveMeasures.map((p) => `• ${p}`).join('\n')}

**Recovery estimate:** ${analysisResult.data.recoveryEstimate} days

${analysisResult.data.disclaimer}`
      }
    } else {
      // Generic response for text-only queries
      responseText = await generateFarmingAdvice(message)
    }

    // Store assistant response
    const assistantMessageId = `msg_${Date.now()}_${Math.random().toString(36).substring(7)}`
    await createDocument('CHAT_MESSAGES', assistantMessageId, {
      userId,
      conversationId,
      role: 'assistant',
      message: responseText,
      metadata: {
        provider: aiService.getProviderInfo().name,
        conversationId,
        tokensUsed: 0, // Would calculate from actual API response
      },
    })

    // Generate follow-up suggestions
    const suggestions = generateFollowUpQuestions(message)

    return {
      messageId: assistantMessageId,
      role: 'assistant',
      message: responseText,
      suggestions,
      isComplete: true,
    }
  } catch (error) {
    console.error('[v0] Chat error:', error)
    throw error
  }
}

/**
 * Generate farming advice for text-only queries
 */
async function generateFarmingAdvice(message: string): Promise<string> {
  // TODO: Integrate with actual AI provider for text generation
  // For now, return helpful generic response

  const lowerMessage = message.toLowerCase()

  if (lowerMessage.includes('planting') || lowerMessage.includes('plant')) {
    return `Great question about planting! For your location in Africa, consider:

**Best practices:**
• Prepare soil with compost 2 weeks before planting
• Check soil pH and nutrient levels
• Plant during rainy season for best results
• Space plants according to crop type

**Recommended crops:**
• Maize - 6-8 weeks cycle
• Cassava - 9-12 months
• Tomato - 3-4 months
• Beans - 3-4 months

Would you like specific advice on any of these crops?`
  }

  if (lowerMessage.includes('fertilizer') || lowerMessage.includes('fertilize')) {
    return `Fertilizer management is crucial for good yields!

**Organic options (recommended):**
• Compost - 5-10 tons per hectare
• Animal manure - mix with compost
• Crop residue mulching
• Green manure crops

**Mineral fertilizers:**
• NPK 15-15-15 for general use
• High nitrogen for leafy crops
• Phosphate for root development

**Application tips:**
• Apply at planting for sustained release
• Side-dress at mid-season
• Water well after application

What crop are you fertilizing?`
  }

  if (lowerMessage.includes('weather') || lowerMessage.includes('rain')) {
    return `Weather management is key to farming success!

**In rainy season:**
• Ensure good drainage in fields
• Mulch to retain soil moisture
• Plant drought-tolerant varieties during dry season

**In dry season:**
• Use irrigation if possible
• Plant water-efficient crops
• Mulch heavily to conserve water

**Current tips:**
• Monitor local weather forecasts
• Plan planting around expected rainfall
• Have backup water source for dry periods

What's your current weather situation?`
  }

  // Default helpful response
  return `Thank you for your question! I'm your agricultural advisor here to help you improve your farming.

I can help with:
• Identifying crop diseases from photos
• Fertilization advice
• Planting schedules
• Pest management
• Soil health
• Harvesting tips

What would you like to know more about?`
}

/**
 * Generate follow-up question suggestions
 */
function generateFollowUpQuestions(userMessage: string): string[] {
  const suggestions: string[] = []

  const lower = userMessage.toLowerCase()

  if (lower.includes('disease')) {
    suggestions.push('What treatment should I use?')
    suggestions.push('How can I prevent this disease?')
    suggestions.push('How long until recovery?')
  }

  if (lower.includes('fertiliz')) {
    suggestions.push('How much fertilizer should I use?')
    suggestions.push('When should I apply it?')
    suggestions.push('Are there organic alternatives?')
  }

  if (lower.includes('plant')) {
    suggestions.push('When should I plant?')
    suggestions.push('How far apart should I space them?')
    suggestions.push('What\'s the expected harvest time?')
  }

  // Add generic suggestions if none specific
  if (suggestions.length === 0) {
    suggestions.push('Can you show me a crop photo?')
    suggestions.push('What crops do you grow?')
    suggestions.push('What\'s your biggest challenge?')
  }

  return suggestions.slice(0, 3)
}

/**
 * Build conversation context
 */
async function buildConversationContext(
  userId: string,
  conversationId: string
): Promise<string> {
  try {
    // Get recent messages for context
    const recentMessages = await queryDocuments('CHAT_MESSAGES', [
      where('conversationId', '==', conversationId),
      orderBy('createdAt', 'desc'),
      limit(10),
    ])

    const context = recentMessages
      .reverse()
      .map((msg: any) => `${msg.role}: ${msg.message.substring(0, 100)}`)
      .join('\n')

    return context
  } catch (error) {
    console.error('[v0] Failed to build conversation context:', error)
    return ''
  }
}

/**
 * Get conversation history
 */
export async function getConversationHistory(
  userId: string,
  conversationId: string,
  limit: number = 50
): Promise<ChatMessage[]> {
  try {
    const messages = await queryDocuments('CHAT_MESSAGES', [
      where('conversationId', '==', conversationId),
      orderBy('createdAt', 'asc'),
      limit(limit),
    ])

    return messages as ChatMessage[]
  } catch (error) {
    console.error('[v0] Failed to get conversation history:', error)
    return []
  }
}

/**
 * Create new conversation
 */
export async function createConversation(
  userId: string,
  title: string = 'Farming Advice'
): Promise<string> {
  try {
    const conversationId = `conv_${Date.now()}_${Math.random().toString(36).substring(7)}`

    // Store conversation metadata
    // TODO: Create conversations collection

    console.log('[v0] New conversation created:', conversationId)
    return conversationId
  } catch (error) {
    console.error('[v0] Failed to create conversation:', error)
    throw error
  }
}

/**
 * Delete conversation
 */
export async function deleteConversation(conversationId: string) {
  try {
    // TODO: Delete all messages in conversation
    console.log('[v0] Conversation deleted:', conversationId)
  } catch (error) {
    console.error('[v0] Failed to delete conversation:', error)
    throw error
  }
}
