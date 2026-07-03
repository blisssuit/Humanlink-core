'use client'

import React, { Suspense } from 'react'
import dynamic from 'next/dynamic'

// Dynamically import SplashScreen to prevent blocking the initial page render
const SplashScreen = dynamic(
  () => import('@/components/features/splash-screen').then(mod => ({ default: mod.SplashScreen })),
  {
    loading: () => (
      <div className="fixed inset-0 bg-gradient-to-br from-[#1B7F4B] to-[#1B7F4B]/80 flex items-center justify-center">
        <div className="text-center">
          <div className="w-24 h-24 bg-white rounded-3xl flex items-center justify-center shadow-lg mb-6 mx-auto">
            <div className="text-4xl font-bold text-[#1B7F4B]">T</div>
          </div>
          <p className="text-white text-sm">Loading TerraIQ...</p>
        </div>
      </div>
    ),
    ssr: true,
  }
)

export default function Page() {
  return (
    <Suspense
      fallback={
        <div className="fixed inset-0 bg-gradient-to-br from-[#1B7F4B] to-[#1B7F4B]/80 flex items-center justify-center">
          <div className="text-center">
            <div className="w-24 h-24 bg-white rounded-3xl flex items-center justify-center shadow-lg mb-6 mx-auto">
              <div className="text-4xl font-bold text-[#1B7F4B]">T</div>
            </div>
            <p className="text-white text-sm">Loading TerraIQ...</p>
          </div>
        </div>
      }
    >
      <SplashScreen />
    </Suspense>
  )
}
