'use client'

import React, { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'

export function SplashScreen() {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(true)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
    const timer = setTimeout(() => {
      setIsLoading(false)
      router.push('/auth/login')
    }, 3000)

    return () => clearTimeout(timer)
  }, [router])

  // Always render splash screen - show loading state on server, interactive on client
  return (
    <div className={`fixed inset-0 bg-gradient-to-br from-primary to-primary/80 flex items-center justify-center z-50 transition-opacity duration-300 ${!mounted || !isLoading ? 'opacity-0 pointer-events-none' : 'opacity-100'}`}>
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-accent/20 rounded-full blur-3xl animate-pulse-grow"></div>
        <div className="absolute bottom-0 right-1/4 w-72 h-72 bg-accent/10 rounded-full blur-3xl animate-float"></div>
      </div>

      {/* Content */}
      <div className="relative z-10 text-center px-6">
        {/* Logo */}
        <div className="flex items-center justify-center mb-8 animate-in fade-in slide-in-from-top-4 duration-700">
          <div className="w-24 h-24 bg-white rounded-3xl flex items-center justify-center shadow-lg">
            <div className="text-4xl font-bold text-primary">T</div>
          </div>
        </div>

        {/* Title */}
        <h1 className="text-5xl font-bold text-white mb-3 animate-in fade-in slide-in-from-top-4 duration-700 delay-100">
          TerraIQ
        </h1>

        {/* Tagline */}
        <p className="text-xl text-white/90 mb-12 font-medium animate-in fade-in slide-in-from-bottom-4 duration-700 delay-200">
          Intelligence for Every Farm
        </p>

        {/* Loading animation */}
        <div className="flex justify-center gap-2 animate-in fade-in duration-700 delay-300">
          {[0, 1, 2].map((i) => (
            <div
              key={i}
              className="w-3 h-3 bg-white rounded-full animate-bounce"
              style={{
                animationDelay: `${i * 0.2}s`,
              }}
            />
          ))}
        </div>

        {/* Subtitle */}
        <p className="text-white/70 text-sm mt-8 animate-in fade-in duration-700 delay-500">
          Loading your farming platform...
        </p>
      </div>
    </div>
  )
}
