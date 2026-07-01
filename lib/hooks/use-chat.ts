import { useState, useCallback } from 'react'
import { sendChatMessage, getConversationHistory, createConversation } from '@/lib/services/chat-service'
import { ChatMessage } from '@/lib/types/database'

/**
 * useChat Hook
 * Manages chat state and operations
 */

export function useChat(initialConversationId?: string) {
  const [conversationId, setConversationId] = useState<string | null>(
    initialConversationId || null
  )
  const [messages, setMessages] = useState<ChatMessage[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  /**
   * Send a message
   */
  const sendMessage = useCallback(
    async (userId: string, message: string, imageUrl?: string) => {
      if (!conversationId) {
        setError('No active conversation')
        return null
      }

      setIsLoading(true)
      setError(null)

      try {
        const response = await sendChatMessage(userId, conversationId, message, imageUrl)

        // Reload messages to get latest
        await loadMessages(userId)

        return response
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'Failed to send message'
        setError(errorMessage)
        console.error('[v0] Send message error:', err)
        return null
      } finally {
        setIsLoading(false)
      }
    },
    [conversationId]
  )

  /**
   * Load conversation messages
   */
  const loadMessages = useCallback(
    async (userId: string) => {
      if (!conversationId) return

      setIsLoading(true)
      setError(null)

      try {
        const history = await getConversationHistory(userId, conversationId)
        setMessages(history)
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'Failed to load messages'
        setError(errorMessage)
        console.error('[v0] Load messages error:', err)
      } finally {
        setIsLoading(false)
      }
    },
    [conversationId]
  )

  /**
   * Start new conversation
   */
  const startNewConversation = useCallback(async (title?: string) => {
    setIsLoading(true)
    setError(null)

    try {
      const newConvId = await createConversation('user-id', title)
      setConversationId(newConvId)
      setMessages([])
      return newConvId
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to create conversation'
      setError(errorMessage)
      console.error('[v0] Create conversation error:', err)
      return null
    } finally {
      setIsLoading(false)
    }
  }, [])

  /**
   * Clear messages
   */
  const clearMessages = useCallback(() => {
    setMessages([])
    setError(null)
  }, [])

  return {
    conversationId,
    messages,
    isLoading,
    error,
    sendMessage,
    loadMessages,
    startNewConversation,
    clearMessages,
  }
}
