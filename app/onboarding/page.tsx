'use client'

import React, { useState } from 'react'
import { useRouter } from 'next/navigation'

const onboardingSteps = [
  {
    id: 1,
    title: 'AI-Powered Farming',
    description: 'Our artificial intelligence helps you make smarter farming decisions. Detect diseases, predict yields, and optimize your crops with real-time insights.',
    icon: '🤖',
    image: 'https://images.unsplash.com/photo-1625246333195-78d9c38ad576?w=400&h=300&fit=crop',
  },
  {
    id: 2,
    title: 'Direct Marketplace',
    description: 'Connect directly with buyers and sell your produce at fair prices. No middlemen. No delays. Increase your profits and reach new customers.',
    icon: '🛒',
    image: 'https://images.unsplash.com/photo-1552821206-2c2f89bfc9de?w=400&h=300&fit=crop',
  },
  {
    id: 3,
    title: 'Easy Transportation',
    description: 'Book trucks and arrange deliveries in seconds. Get competitive rates, track your shipments, and deliver fresh produce to buyers faster.',
    icon: '🚚',
    image: 'https://images.unsplash.com/photo-1493773671923-90ac2bae2149?w=400&h=300&fit=crop',
  },
]

export default function OnboardingPage() {
  const router = useRouter()
  const [currentStep, setCurrentStep] = useState(0)

  const handleNext = () => {
    if (currentStep < onboardingSteps.length - 1) {
      setCurrentStep(currentStep + 1)
    } else {
      router.push('/dashboard')
    }
  }

  const handleSkip = () => {
    router.push('/dashboard')
  }

  const step = onboardingSteps[currentStep]

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Skip Button */}
      <div className="flex justify-between items-center p-6">
        <div className="w-12 h-12 bg-primary rounded-full flex items-center justify-center text-white font-bold">T</div>
        <button
          onClick={handleSkip}
          className="text-primary font-semibold hover:text-primary/80 transition-colors"
        >
          Skip
        </button>
      </div>

      {/* Content */}
      <div className="flex-1 flex flex-col items-center justify-center px-6 pb-20">
        {/* Image */}
        <div className="mb-8 w-full max-w-sm animate-in fade-in slide-in-from-top duration-500">
          <div className="relative w-full aspect-square rounded-3xl overflow-hidden shadow-lg">
            <img
              src={step.image}
              alt={step.title}
              className="w-full h-full object-cover"
            />
            {/* Overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-primary/20 to-transparent"></div>
            {/* Icon */}
            <div className="absolute top-4 right-4 text-5xl">{step.icon}</div>
          </div>
        </div>

        {/* Title */}
        <h2 className="text-4xl font-bold text-center mb-4 text-foreground animate-in fade-in slide-in-from-bottom duration-500 delay-100">
          {step.title}
        </h2>

        {/* Description */}
        <p className="text-center text-lg text-muted-foreground mb-12 max-w-md animate-in fade-in slide-in-from-bottom duration-500 delay-200">
          {step.description}
        </p>

        {/* Progress Dots */}
        <div className="flex gap-2 mb-12 animate-in fade-in duration-500 delay-300">
          {onboardingSteps.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentStep(index)}
              className={`h-2 rounded-full transition-all duration-300 ${
                index === currentStep ? 'bg-primary w-8' : 'bg-muted w-2 hover:bg-muted/80'
              }`}
            />
          ))}
        </div>

        {/* Buttons */}
        <div className="w-full max-w-sm space-y-3 animate-in fade-in slide-in-from-bottom duration-500 delay-400">
          <button onClick={handleNext} className="w-full btn-primary py-4 font-bold text-lg">
            {currentStep === onboardingSteps.length - 1 ? 'Get Started' : 'Next'}
          </button>
        </div>
      </div>
    </div>
  )
}
