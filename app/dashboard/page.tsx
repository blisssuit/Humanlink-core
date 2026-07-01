'use client'

import React from 'react'
import Link from 'next/link'
import { useApp } from '@/lib/context'
import { BottomNav } from '@/components/layout/bottom-nav'
import {
  mockWeather,
  mockFarmHealth,
  mockRecommendedCrops,
  mockMarketPrices,
} from '@/lib/mock-data'
import {
  Cloud,
  Droplets,
  Wind,
  Zap,
  TrendingUp,
  AlertCircle,
  Leaf,
  ShoppingCart,
  Truck,
  MapPin,
  Heart,
} from 'lucide-react'

export default function DashboardPage() {
  const { user } = useApp()

  return (
    <div className="bg-background min-h-screen pb-32">
      {/* Header */}
      <div className="sticky top-0 z-30 bg-card border-b border-border">
        <div className="max-w-lg mx-auto px-6 py-6">
          <div className="flex items-center justify-between mb-2">
            <div>
              <h1 className="text-2xl font-bold text-foreground">Welcome back!</h1>
              <p className="text-muted-foreground">{user?.name}</p>
            </div>
            <Link
              href="/profile"
              className="w-12 h-12 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center text-white font-bold text-lg hover:shadow-lg transition-all"
            >
              {user?.name?.charAt(0).toUpperCase() || 'A'}
            </Link>
          </div>
          {user?.farmName && <p className="text-sm text-accent font-semibold">{user.farmName}</p>}
        </div>
      </div>

      {/* Content */}
      <div className="max-w-lg mx-auto px-4 py-6 space-y-6">
        {/* Current Weather */}
        <section className="animate-in fade-in slide-in-from-top duration-500">
          <h2 className="text-sm font-semibold text-muted-foreground uppercase mb-3">Current Weather</h2>
          <div className="premium-card p-6">
            <div className="flex items-start justify-between mb-4">
              <div>
                <div className="text-5xl font-bold text-primary mb-2">{mockWeather.temperature}°C</div>
                <p className="text-foreground font-semibold">{mockWeather.condition}</p>
                <p className="text-sm text-muted-foreground">Updated 2 hours ago</p>
              </div>
              <Cloud className="w-20 h-20 text-accent opacity-80" />
            </div>

            {/* Weather Grid */}
            <div className="grid grid-cols-3 gap-3">
              <div className="bg-muted/50 rounded-lg p-3 text-center">
                <Droplets className="w-5 h-5 mx-auto mb-2 text-blue-500" />
                <p className="text-xs text-muted-foreground mb-1">Humidity</p>
                <p className="font-semibold text-foreground">{mockWeather.humidity}%</p>
              </div>
              <div className="bg-muted/50 rounded-lg p-3 text-center">
                <Wind className="w-5 h-5 mx-auto mb-2 text-cyan-500" />
                <p className="text-xs text-muted-foreground mb-1">Wind</p>
                <p className="font-semibold text-foreground">{mockWeather.windSpeed} km/h</p>
              </div>
              <div className="bg-muted/50 rounded-lg p-3 text-center">
                <AlertCircle className="w-5 h-5 mx-auto mb-2 text-yellow-500" />
                <p className="text-xs text-muted-foreground mb-1">UV</p>
                <p className="font-semibold text-foreground">{mockWeather.uvIndex}</p>
              </div>
            </div>
          </div>
        </section>

        {/* Farm Health Score */}
        <section className="animate-in fade-in slide-in-from-top duration-500 delay-75">
          <h2 className="text-sm font-semibold text-muted-foreground uppercase mb-3">Farm Health</h2>
          <div className="premium-card p-6">
            <div className="flex items-center justify-between mb-4">
              <div>
                <p className="text-sm text-muted-foreground mb-1">Overall Score</p>
                <div className="text-4xl font-bold text-primary">{mockFarmHealth.score}</div>
                <p className="text-sm text-green-600 font-semibold mt-1">📈 {mockFarmHealth.status}</p>
              </div>
              <div className="relative w-32 h-32">
                <svg className="transform -rotate-90" viewBox="0 0 120 120">
                  <circle
                    cx="60"
                    cy="60"
                    r="54"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="8"
                    className="text-muted"
                  />
                  <circle
                    cx="60"
                    cy="60"
                    r="54"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="8"
                    strokeDasharray={`${(mockFarmHealth.score / 100) * 339} 339`}
                    className="text-primary transition-all duration-500"
                  />
                </svg>
                <div className="absolute inset-0 flex items-center justify-center text-center">
                  <span className="text-sm font-semibold text-foreground">{mockFarmHealth.score}%</span>
                </div>
              </div>
            </div>
            {mockFarmHealth.alerts > 0 && (
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3 flex items-start gap-3">
                <AlertCircle className="w-5 h-5 text-yellow-600 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="text-sm font-semibold text-yellow-800">1 alert needs attention</p>
                  <p className="text-xs text-yellow-700">Check your notifications</p>
                </div>
              </div>
            )}
          </div>
        </section>

        {/* Quick Actions */}
        <section className="animate-in fade-in slide-in-from-top duration-500 delay-150">
          <h2 className="text-sm font-semibold text-muted-foreground uppercase mb-3">Quick Actions</h2>
          <div className="grid grid-cols-2 gap-3">
            <Link
              href="/scanner"
              className="premium-card p-4 flex flex-col items-center justify-center text-center hover:shadow-md transition-all"
            >
              <Zap className="w-8 h-8 text-accent mb-2" />
              <p className="font-semibold text-foreground text-sm">Scan Crop</p>
            </Link>
            <Link
              href="/planner"
              className="premium-card p-4 flex flex-col items-center justify-center text-center hover:shadow-md transition-all"
            >
              <Leaf className="w-8 h-8 text-green-500 mb-2" />
              <p className="font-semibold text-foreground text-sm">What to Plant</p>
            </Link>
            <Link
              href="/marketplace"
              className="premium-card p-4 flex flex-col items-center justify-center text-center hover:shadow-md transition-all"
            >
              <ShoppingCart className="w-8 h-8 text-primary mb-2" />
              <p className="font-semibold text-foreground text-sm">Marketplace</p>
            </Link>
            <Link
              href="/transport"
              className="premium-card p-4 flex flex-col items-center justify-center text-center hover:shadow-md transition-all"
            >
              <Truck className="w-8 h-8 text-blue-500 mb-2" />
              <p className="font-semibold text-foreground text-sm">Book Truck</p>
            </Link>
          </div>
        </section>

        {/* Recommended Crops */}
        <section className="animate-in fade-in slide-in-from-top duration-500 delay-225">
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-sm font-semibold text-muted-foreground uppercase">Recommended Crops</h2>
            <Link href="/planner" className="text-primary text-xs font-semibold hover:underline">
              See all
            </Link>
          </div>
          <div className="space-y-2">
            {mockRecommendedCrops.map((crop) => (
              <Link
                key={crop.id}
                href="/planner"
                className="premium-card p-4 flex items-start justify-between hover:shadow-md transition-all"
              >
                <div className="flex-1">
                  <p className="font-semibold text-foreground">{crop.name}</p>
                  <p className="text-xs text-muted-foreground">{crop.reasoning}</p>
                </div>
                <div className="text-right ml-4">
                  <div className="text-lg font-bold text-primary">{crop.suitability}%</div>
                  <p className="text-xs text-muted-foreground">suitable</p>
                </div>
              </Link>
            ))}
          </div>
        </section>

        {/* Market Prices */}
        <section className="animate-in fade-in slide-in-from-top duration-500 delay-300">
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-sm font-semibold text-muted-foreground uppercase">Market Prices</h2>
            <Link href="/marketplace" className="text-primary text-xs font-semibold hover:underline">
              View market
            </Link>
          </div>
          <div className="space-y-2">
            {mockMarketPrices.map((item) => (
              <div key={item.crop} className="premium-card p-4 flex items-center justify-between">
                <div>
                  <p className="font-semibold text-foreground">{item.crop}</p>
                  <p className="text-sm text-accent font-bold">{item.price}</p>
                </div>
                <div
                  className={`flex items-center gap-1 text-sm font-semibold ${
                    item.trend === 'up'
                      ? 'text-green-600'
                      : item.trend === 'down'
                        ? 'text-red-600'
                        : 'text-muted-foreground'
                  }`}
                >
                  {item.trend === 'up' && <TrendingUp className="w-4 h-4" />}
                  {item.change}
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Recent AI Insights */}
        <section className="animate-in fade-in slide-in-from-top duration-500 delay-375">
          <h2 className="text-sm font-semibold text-muted-foreground uppercase mb-3">Recent Insights</h2>
          <div className="premium-card p-6 border-l-4 border-accent">
            <div className="flex gap-3">
              <Zap className="w-6 h-6 text-accent flex-shrink-0" />
              <div>
                <p className="font-semibold text-foreground">Optimal Planting Window</p>
                <p className="text-sm text-muted-foreground mt-1">
                  Based on current weather patterns, next week is ideal for planting maize. Your farm has 89% suitability.
                </p>
                <button className="text-primary text-xs font-semibold mt-3 hover:underline">Learn more →</button>
              </div>
            </div>
          </div>
        </section>
      </div>

      {/* Bottom Navigation */}
      <BottomNav />
    </div>
  )
}
