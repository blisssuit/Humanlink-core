'use client'

import Image from 'next/image'
import { ChatMessage as ChatMessageType } from '@/lib/types/database'
import { formatDistanceToNow } from 'date-fns'

interface ChatMessageProps {
  message: ChatMessageType
  isUser: boolean
}

/**
 * Individual Chat Message Component
 */
export function ChatMessage({ message, isUser }: ChatMessageProps) {
  const timestamp = new Date(message.createdAt)
  const timeAgo = formatDistanceToNow(timestamp, { addSuffix: true })

  return (
    <div className={`flex gap-3 mb-4 ${isUser ? 'justify-end' : 'justify-start'}`}>
      <div
        className={`max-w-xs lg:max-w-md ${
          isUser ? 'order-2 bg-primary text-white' : 'order-1 bg-muted text-foreground'
        } rounded-lg p-3 break-words`}
      >
        {/* Message text */}
        <p className="text-sm whitespace-pre-wrap">{message.message}</p>

        {/* Image attachment if any */}
        {message.imageUrl && (
          <div className="mt-2">
            <Image
              src={message.imageUrl}
              alt="Message attachment"
              width={200}
              height={200}
              className="rounded max-w-full h-auto"
            />
          </div>
        )}

        {/* Time */}
        <p className={`text-xs mt-1 ${isUser ? 'text-blue-100' : 'text-muted-foreground'}`}>
          {timeAgo}
        </p>
      </div>
    </div>
  )
}
