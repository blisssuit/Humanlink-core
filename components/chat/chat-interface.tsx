'use client'

import React, { useState, useEffect, useRef } from 'react'
import { Send, Loader2, ImagePlus, Paperclip } from 'lucide-react'
import { ChatMessage as ChatMessageType } from '@/lib/types/database'
import { ChatMessage } from './chat-message'
import { sendChatMessage, getConversationHistory } from '@/lib/services/chat-service'
import { useAuth } from '@/lib/context/auth-context'

interface ChatInterfaceProps {
  conversationId: string
}

/**
 * AI Chat Interface Component
 * Conversational farming advisor with image support
 */
export function ChatInterface({ conversationId }: ChatInterfaceProps) {
  const { user } = useAuth()
  const [messages, setMessages] = useState<ChatMessageType[]>([])
  const [input, setInput] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [selectedImage, setSelectedImage] = useState<File | null>(null)
  const [suggestions, setSuggestions] = useState<string[]>([])
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  // Load conversation history
  useEffect(() => {
    if (user && conversationId) {
      loadConversation()
    }
  }, [user, conversationId])

  // Auto-scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  async function loadConversation() {
    try {
      const history = await getConversationHistory(user!.uid, conversationId)
      setMessages(history)
    } catch (error) {
      console.error('[v0] Failed to load conversation:', error)
    }
  }

  async function handleSendMessage(e: React.FormEvent) {
    e.preventDefault()

    if (!input.trim() || !user) return

    setIsLoading(true)

    try {
      // Add user message to UI immediately
      const userMessage: ChatMessageType = {
        id: `temp_${Date.now()}`,
        userId: user.uid,
        role: 'user',
        message: input,
        imageUrl: selectedImage ? URL.createObjectURL(selectedImage) : undefined,
        createdAt: Date.now(),
      }

      setMessages((prev) => [...prev, userMessage])
      setInput('')
      setSelectedImage(null)

      // Get AI response
      const imageUrl = selectedImage ? URL.createObjectURL(selectedImage) : undefined
      const response = await sendChatMessage(user.uid, conversationId, input, imageUrl)

      // Add AI response to UI
      const aiMessage: ChatMessageType = {
        id: response.messageId,
        userId: user.uid,
        role: 'assistant',
        message: response.message,
        createdAt: Date.now(),
      }

      setMessages((prev) => [...prev, aiMessage])
      setSuggestions(response.suggestions || [])
    } catch (error) {
      console.error('[v0] Failed to send message:', error)
      // TODO: Show error toast
    } finally {
      setIsLoading(false)
    }
  }

  function handleImageSelect(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (file && file.type.startsWith('image/')) {
      setSelectedImage(file)
    }
  }

  function handleSuggestion(suggestion: string) {
    setInput(suggestion)
  }

  return (
    <div className="flex flex-col h-full bg-background rounded-lg border border-border overflow-hidden">
      {/* Messages area */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-center">
            <div className="mb-4 text-4xl">🌾</div>
            <h3 className="text-lg font-semibold mb-2">TerraIQ Farming Advisor</h3>
            <p className="text-muted-foreground max-w-sm">
              Ask me anything about your crops, diseases, fertilization, or farming practices. You
              can also upload photos for disease analysis.
            </p>
          </div>
        ) : (
          messages.map((message) => (
            <ChatMessage
              key={message.id}
              message={message}
              isUser={message.role === 'user'}
            />
          ))
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Suggestions */}
      {suggestions.length > 0 && !isLoading && (
        <div className="px-4 pb-2 flex gap-2 flex-wrap">
          {suggestions.map((suggestion, idx) => (
            <button
              key={idx}
              onClick={() => handleSuggestion(suggestion)}
              className="text-xs px-3 py-1 rounded-full bg-muted hover:bg-muted/80 text-foreground transition-colors"
            >
              {suggestion}
            </button>
          ))}
        </div>
      )}

      {/* Image preview */}
      {selectedImage && (
        <div className="px-4 pb-2 flex items-center gap-2">
          <div className="flex-1 text-sm text-muted-foreground">{selectedImage.name}</div>
          <button
            onClick={() => setSelectedImage(null)}
            className="text-xs px-2 py-1 rounded bg-destructive/20 text-destructive hover:bg-destructive/30"
          >
            Remove
          </button>
        </div>
      )}

      {/* Input area */}
      <div className="border-t border-border bg-muted/30 p-4">
        <form onSubmit={handleSendMessage} className="flex gap-2">
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            disabled={isLoading}
            className="p-2 hover:bg-muted rounded transition-colors disabled:opacity-50"
            title="Attach image"
          >
            <ImagePlus className="w-5 h-5 text-muted-foreground" />
          </button>

          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleImageSelect}
            className="hidden"
          />

          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask about your crops, diseases, or farming practices..."
            disabled={isLoading}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !e.shiftKey && !e.nativeEvent.isComposing) {
                handleSendMessage(e as any)
              }
            }}
            className="flex-1 px-3 py-2 rounded-lg bg-background border border-input focus:outline-none focus:ring-2 focus:ring-primary disabled:opacity-50"
          />

          <button
            type="submit"
            disabled={isLoading || !input.trim()}
            className="p-2 bg-primary text-primary-foreground hover:bg-primary/90 rounded transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Send className="w-5 h-5" />}
          </button>
        </form>

        <p className="text-xs text-muted-foreground mt-2">
          Press Enter to send, Shift+Enter for new line
        </p>
      </div>
    </div>
  )
}
