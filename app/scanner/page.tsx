'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { BottomNav } from '@/components/layout/bottom-nav'
import { Camera, Upload, ArrowLeft } from 'lucide-react'

export default function ScannerPage() {
  const router = useRouter()
  const [isProcessing, setIsProcessing] = useState(false)

  const handleCapture = async () => {
    setIsProcessing(true)
    // Simulate scanning
    await new Promise((resolve) => setTimeout(resolve, 2000))
    router.push('/scanner/diagnosis')
  }

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setIsProcessing(true)
      // Simulate scanning
      await new Promise((resolve) => setTimeout(resolve, 2000))
      router.push('/scanner/diagnosis')
    }
  }

  return (
    <div className="bg-background min-h-screen pb-32">
      {/* Header */}
      <div className="sticky top-0 z-30 bg-card border-b border-border">
        <div className="max-w-lg mx-auto px-6 py-4 flex items-center gap-4">
          <button
            onClick={() => router.back()}
            className="p-2 hover:bg-muted rounded-lg transition-colors"
          >
            <ArrowLeft className="w-6 h-6 text-foreground" />
          </button>
          <div>
            <h1 className="text-xl font-bold text-foreground">AI Crop Scanner</h1>
            <p className="text-xs text-muted-foreground">Detect diseases instantly</p>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-lg mx-auto px-4 py-8 flex flex-col items-center">
        {/* Camera Preview */}
        <div className="w-full mb-8 animate-in fade-in slide-in-from-top duration-500">
          <div className="premium-card-lg overflow-hidden">
            <div className="aspect-square bg-gradient-to-br from-primary/10 to-accent/10 flex items-center justify-center relative">
              <div className="absolute inset-0 flex items-center justify-center">
                <Camera className="w-32 h-32 text-primary/30" />
              </div>

              {/* Scanning overlay */}
              <div className="absolute inset-0 border-2 border-dashed border-primary/50 rounded-3xl"></div>

              {/* Corner markers */}
              <div className="absolute top-4 left-4 w-6 h-6 border-t-2 border-l-2 border-primary"></div>
              <div className="absolute top-4 right-4 w-6 h-6 border-t-2 border-r-2 border-primary"></div>
              <div className="absolute bottom-4 left-4 w-6 h-6 border-b-2 border-l-2 border-primary"></div>
              <div className="absolute bottom-4 right-4 w-6 h-6 border-b-2 border-r-2 border-primary"></div>
            </div>
          </div>
          <p className="text-center text-sm text-muted-foreground mt-4">
            Position the leaf in the center for best results
          </p>
        </div>

        {/* Instructions */}
        <div className="w-full mb-8 space-y-3 animate-in fade-in slide-in-from-bottom duration-500 delay-100">
          <div className="premium-card p-4 flex gap-3">
            <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0 text-primary font-bold">
              1
            </div>
            <div>
              <p className="font-semibold text-foreground text-sm">Good Lighting</p>
              <p className="text-xs text-muted-foreground">Use natural daylight for best results</p>
            </div>
          </div>

          <div className="premium-card p-4 flex gap-3">
            <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0 text-primary font-bold">
              2
            </div>
            <div>
              <p className="font-semibold text-foreground text-sm">Clear Focus</p>
              <p className="text-xs text-muted-foreground">Ensure the leaf is sharp and in focus</p>
            </div>
          </div>

          <div className="premium-card p-4 flex gap-3">
            <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0 text-primary font-bold">
              3
            </div>
            <div>
              <p className="font-semibold text-foreground text-sm">Full Coverage</p>
              <p className="text-xs text-muted-foreground">Capture the affected area completely</p>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="w-full space-y-3 animate-in fade-in slide-in-from-bottom duration-500 delay-200">
          <button
            onClick={handleCapture}
            disabled={isProcessing}
            className="w-full btn-primary py-6 font-bold text-lg flex items-center justify-center gap-3"
          >
            {isProcessing ? (
              <>
                <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
                Scanning...
              </>
            ) : (
              <>
                <Camera className="w-6 h-6" />
                Take Photo
              </>
            )}
          </button>

          <label className="w-full">
            <input
              type="file"
              accept="image/*"
              onChange={handleUpload}
              disabled={isProcessing}
              className="hidden"
            />
            <span className="flex items-center justify-center gap-3 btn-outline py-6 font-bold text-lg cursor-pointer">
              <Upload className="w-6 h-6" />
              Upload Photo
            </span>
          </label>
        </div>

        {/* Previous Scans */}
        <div className="w-full mt-12 animate-in fade-in duration-500 delay-300">
          <h3 className="text-sm font-semibold text-muted-foreground uppercase mb-3">Recent Scans</h3>
          <div className="space-y-2">
            <Link
              href="/scanner/diagnosis"
              className="premium-card p-4 flex items-center justify-between hover:shadow-md transition-all"
            >
              <div>
                <p className="font-semibold text-foreground">Maize - Leaf spot</p>
                <p className="text-xs text-muted-foreground">2 days ago</p>
              </div>
              <span className="text-xs font-bold px-3 py-1 rounded-lg bg-red-100 text-red-700">High Risk</span>
            </Link>
            <Link
              href="/scanner/diagnosis"
              className="premium-card p-4 flex items-center justify-between hover:shadow-md transition-all"
            >
              <div>
                <p className="font-semibold text-foreground">Tomato - Healthy</p>
                <p className="text-xs text-muted-foreground">1 week ago</p>
              </div>
              <span className="text-xs font-bold px-3 py-1 rounded-lg bg-green-100 text-green-700">Healthy</span>
            </Link>
          </div>
        </div>
      </div>

      <BottomNav />
    </div>
  )
}
