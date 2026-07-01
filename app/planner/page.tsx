'use client'

import React, { useState } from 'react'
import { useRouter } from 'next/navigation'
import { BottomNav } from '@/components/layout/bottom-nav'
import { mockRecommendedCrops } from '@/lib/mock-data'
import { ArrowLeft, Leaf, Droplets, Thermometer, MapPin } from 'lucide-react'

interface FormData {
  location: string
  farmSize: string
  soilType: string
  season: string
  rainfallPreference: string
}

export default function PlannerPage() {
  const router = useRouter()
  const [step, setStep] = useState<'form' | 'results'>('form')
  const [formData, setFormData] = useState<FormData>({
    location: '',
    farmSize: '',
    soilType: '',
    season: '',
    rainfallPreference: '',
  })
  const [isLoading, setIsLoading] = useState(false)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    // Simulate AI processing
    await new Promise((resolve) => setTimeout(resolve, 1500))

    setStep('results')
    setIsLoading(false)
  }

  const isFormValid = Object.values(formData).every((value) => value !== '')

  return (
    <div className="bg-background min-h-screen pb-32">
      {/* Header */}
      <div className="sticky top-0 z-30 bg-card border-b border-border">
        <div className="max-w-lg mx-auto px-6 py-4 flex items-center gap-4">
          <button
            onClick={() => (step === 'results' ? setStep('form') : router.back())}
            className="p-2 hover:bg-muted rounded-lg transition-colors"
          >
            <ArrowLeft className="w-6 h-6 text-foreground" />
          </button>
          <div>
            <h1 className="text-xl font-bold text-foreground">What Should I Plant?</h1>
            <p className="text-xs text-muted-foreground">AI-powered crop recommendations</p>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-lg mx-auto px-4 py-6">
        {step === 'form' ? (
          // Form Step
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Location */}
            <section className="animate-in fade-in slide-in-from-top duration-500">
              <label className="block text-sm font-semibold text-foreground mb-3">
                <MapPin className="w-4 h-4 inline mr-2 text-accent" />
                Farm Location
              </label>
              <select
                name="location"
                value={formData.location}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary bg-white transition-all"
              >
                <option value="">Select location</option>
                <option value="northern">Northern Region</option>
                <option value="central">Central Region</option>
                <option value="southern">Southern Region</option>
                <option value="coastal">Coastal Region</option>
              </select>
            </section>

            {/* Farm Size */}
            <section className="animate-in fade-in slide-in-from-top duration-500 delay-75">
              <label className="block text-sm font-semibold text-foreground mb-3">
                <Leaf className="w-4 h-4 inline mr-2 text-accent" />
                Farm Size (hectares)
              </label>
              <select
                name="farmSize"
                value={formData.farmSize}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary bg-white transition-all"
              >
                <option value="">Select farm size</option>
                <option value="small">0.5 - 2 hectares</option>
                <option value="medium">2 - 5 hectares</option>
                <option value="large">5 - 10 hectares</option>
                <option value="xlarge">10+ hectares</option>
              </select>
            </section>

            {/* Soil Type */}
            <section className="animate-in fade-in slide-in-from-top duration-500 delay-150">
              <label className="block text-sm font-semibold text-foreground mb-3">
                <Droplets className="w-4 h-4 inline mr-2 text-accent" />
                Soil Type
              </label>
              <select
                name="soilType"
                value={formData.soilType}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary bg-white transition-all"
              >
                <option value="">Select soil type</option>
                <option value="clay">Clay soil</option>
                <option value="sandy">Sandy soil</option>
                <option value="loamy">Loamy soil</option>
                <option value="volcanic">Volcanic soil</option>
              </select>
            </section>

            {/* Season */}
            <section className="animate-in fade-in slide-in-from-top duration-500 delay-225">
              <label className="block text-sm font-semibold text-foreground mb-3">
                <Thermometer className="w-4 h-4 inline mr-2 text-accent" />
                Planting Season
              </label>
              <select
                name="season"
                value={formData.season}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary bg-white transition-all"
              >
                <option value="">Select season</option>
                <option value="rainy">Rainy Season</option>
                <option value="dry">Dry Season</option>
                <option value="transitional">Transitional Period</option>
              </select>
            </section>

            {/* Rainfall Preference */}
            <section className="animate-in fade-in slide-in-from-top duration-500 delay-300">
              <label className="block text-sm font-semibold text-foreground mb-3">
                <Droplets className="w-4 h-4 inline mr-2 text-accent" />
                Rainfall Preference
              </label>
              <select
                name="rainfallPreference"
                value={formData.rainfallPreference}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary bg-white transition-all"
              >
                <option value="">Select preference</option>
                <option value="high">High rainfall tolerant</option>
                <option value="moderate">Moderate rainfall</option>
                <option value="low">Drought tolerant</option>
              </select>
            </section>

            {/* Submit Button */}
            <div className="animate-in fade-in slide-in-from-top duration-500 delay-375 pt-6">
              <button
                type="submit"
                disabled={!isFormValid || isLoading}
                className="w-full btn-primary py-4 font-bold text-lg"
              >
                {isLoading ? (
                  <span className="flex items-center justify-center gap-2">
                    <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
                    Analyzing your farm...
                  </span>
                ) : (
                  'Get Recommendations'
                )}
              </button>
            </div>
          </form>
        ) : (
          // Results Step
          <div className="space-y-6">
            {/* Success Message */}
            <section className="animate-in fade-in slide-in-from-top duration-500">
              <div className="premium-card p-6 text-center border-l-4 border-accent">
                <Leaf className="w-12 h-12 text-primary mx-auto mb-3" />
                <h2 className="text-2xl font-bold text-foreground mb-2">Perfect Match Found!</h2>
                <p className="text-muted-foreground">Based on your farm conditions, here are the best crops to plant.</p>
              </div>
            </section>

            {/* Recommended Crops */}
            <section>
              <h3 className="text-sm font-semibold text-muted-foreground uppercase mb-4">Top Recommendations</h3>
              <div className="space-y-4">
                {mockRecommendedCrops.map((crop, index) => (
                  <div
                    key={crop.id}
                    className="premium-card p-6 border-l-4 border-accent animate-in fade-in slide-in-from-top duration-500"
                    style={{ animationDelay: `${index * 75}ms` }}
                  >
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex-1">
                        <h4 className="text-xl font-bold text-foreground">{crop.name}</h4>
                        <p className="text-sm text-muted-foreground">{crop.season}</p>
                      </div>
                      <div className="text-right">
                        <div className="text-3xl font-bold text-primary">{crop.suitability}%</div>
                        <p className="text-xs text-muted-foreground">suitable</p>
                      </div>
                    </div>

                    {/* Suitability Bar */}
                    <div className="mb-4">
                      <div className="bg-muted rounded-full h-2 overflow-hidden">
                        <div
                          className="bg-gradient-to-r from-accent to-accent/70 h-full transition-all duration-500"
                          style={{ width: `${crop.suitability}%` }}
                        ></div>
                      </div>
                    </div>

                    {/* Details */}
                    <div className="grid grid-cols-2 gap-3 mb-4 py-3 border-t border-b border-border/50">
                      <div>
                        <p className="text-xs text-muted-foreground mb-1">Expected Yield</p>
                        <p className="font-semibold text-foreground text-sm">{crop.expectedYield}</p>
                      </div>
                      <div>
                        <p className="text-xs text-muted-foreground mb-1">Best Season</p>
                        <p className="font-semibold text-foreground text-sm">{crop.season}</p>
                      </div>
                    </div>

                    {/* Reasoning */}
                    <div className="bg-primary/5 rounded-lg p-3">
                      <p className="text-xs font-semibold text-primary mb-1">Why this crop?</p>
                      <p className="text-sm text-foreground">{crop.reasoning}</p>
                    </div>
                  </div>
                ))}
              </div>
            </section>

            {/* Action Buttons */}
            <section className="animate-in fade-in duration-500 delay-500 pt-6 space-y-3">
              <button className="w-full btn-primary py-4 font-bold">View Detailed Guide</button>
              <button
                onClick={() => setStep('form')}
                className="w-full btn-outline py-4 font-bold"
              >
                Adjust Preferences
              </button>
            </section>
          </div>
        )}
      </div>

      <BottomNav />
    </div>
  )
}
