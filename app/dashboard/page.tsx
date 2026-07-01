'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import { useApp } from '@/lib/context'
import { BottomNav } from '@/components/layout/bottom-nav'
import {
  mockWeather,
  mockFarmHealth,
  mockRecommendedCrops,
  mockMarketPrices,
  mockFarmData,
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
  MessageCircle,
  Clock,
  CheckCircle2,
  AlertTriangle,
  TrendingDown,
} from 'lucide-react'

export default function DashboardPage() {
  const { user } = useApp()
  const [showAIAssistant, setShowAIAssistant] = useState(false)

  return (
    <div className="bg-background min-h-screen pb-32 relative">
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

        {/* Today's AI Insights */}
        <section className="animate-in fade-in slide-in-from-top duration-500 delay-375">
          <h2 className="text-sm font-semibold text-muted-foreground uppercase mb-3">Today's AI Insights</h2>
          <div className="space-y-3">
            <div className="premium-card p-4 border-l-4 border-accent">
              <div className="flex gap-3">
                <Zap className="w-5 h-5 text-accent flex-shrink-0 mt-0.5" />
                <div className="flex-1">
                  <p className="font-semibold text-foreground text-sm">Optimal Planting Window</p>
                  <p className="text-xs text-muted-foreground mt-1">
                    Next week is ideal for planting maize. Your farm has 89% suitability.
                  </p>
                </div>
              </div>
            </div>
            <div className="premium-card p-4 border-l-4 border-green-500">
              <div className="flex gap-3">
                <AlertTriangle className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                <div className="flex-1">
                  <p className="font-semibold text-foreground text-sm">Irrigation Alert</p>
                  <p className="text-xs text-muted-foreground mt-1">
                    Soil moisture is optimal. Reduce watering by 20% this week.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Recommended Crops This Month */}
        <section className="animate-in fade-in slide-in-from-top duration-500 delay-[450ms]">
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-sm font-semibold text-muted-foreground uppercase">Crops for This Month</h2>
            <Link href="/planner" className="text-primary text-xs font-semibold hover:underline">
              View planner
            </Link>
          </div>
          <div className="grid grid-cols-2 gap-3">
            {mockRecommendedCrops.map((crop) => (
              <Link
                key={crop.id}
                href="/planner"
                className="premium-card p-4 hover:shadow-md transition-all"
              >
                <div className="mb-3">
                  <p className="font-semibold text-foreground text-sm">{crop.name}</p>
                  <p className="text-xs text-muted-foreground mt-1">{crop.season}</p>
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-xs text-muted-foreground">Suitability</span>
                    <span className="text-sm font-bold text-primary">{crop.suitability}%</span>
                  </div>
                  <div className="w-full bg-muted rounded-full h-2">
                    <div
                      className="bg-primary h-2 rounded-full transition-all"
                      style={{ width: `${crop.suitability}%` }}
                    />
                  </div>
                  <p className="text-xs text-muted-foreground">{crop.expectedYield}</p>
                </div>
              </Link>
            ))}
          </div>
        </section>

        {/* Market Prices Today */}
        <section className="animate-in fade-in slide-in-from-top duration-500 delay-[525ms]">
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-sm font-semibold text-muted-foreground uppercase">Market Prices Today</h2>
            <Link href="/marketplace" className="text-primary text-xs font-semibold hover:underline">
              Full market
            </Link>
          </div>
          <div className="space-y-2">
            {mockMarketPrices.map((item) => (
              <div key={item.crop} className="premium-card p-4 flex items-center justify-between">
                <div className="flex-1">
                  <p className="font-semibold text-foreground text-sm">{item.crop}</p>
                  <p className="text-sm text-accent font-bold">{item.price}</p>
                </div>
                <div
                  className={`flex items-center gap-1 text-xs font-semibold px-2 py-1 rounded-lg ${
                    item.trend === 'up'
                      ? 'bg-green-100 text-green-700'
                      : item.trend === 'down'
                        ? 'bg-red-100 text-red-700'
                        : 'bg-gray-100 text-gray-700'
                  }`}
                >
                  {item.trend === 'up' && <TrendingUp className="w-3 h-3" />}
                  {item.trend === 'down' && <TrendingDown className="w-3 h-3" />}
                  {item.change}
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Recent Activities Timeline */}
        <section className="animate-in fade-in slide-in-from-top duration-500 delay-[600ms]">
          <h2 className="text-sm font-semibold text-muted-foreground uppercase mb-3">Recent Activities</h2>
          <div className="premium-card p-6">
            <div className="space-y-4">
              {[
                {
                  type: 'harvest',
                  title: 'Harvested 45 tons of Maize',
                  time: 'Today at 2:30 PM',
                  icon: CheckCircle2,
                  color: 'text-green-600',
                },
                {
                  type: 'scan',
                  title: 'Crop scan completed - No diseases detected',
                  time: 'Yesterday at 10:15 AM',
                  icon: Zap,
                  color: 'text-primary',
                },
                {
                  type: 'transaction',
                  title: 'Sold 20 tons of Rice - ₦385,000',
                  time: '2 days ago',
                  icon: CheckCircle2,
                  color: 'text-blue-600',
                },
                {
                  type: 'booking',
                  title: 'Truck booking completed for delivery',
                  time: '3 days ago',
                  icon: Truck,
                  color: 'text-orange-600',
                },
              ].map((activity, idx) => {
                const Icon = activity.icon
                return (
                  <div key={idx} className="flex gap-4">
                    <div className="flex flex-col items-center">
                      <Icon className={`w-5 h-5 ${activity.color}`} />
                      {idx < 3 && <div className="w-0.5 h-12 bg-border mt-2" />}
                    </div>
                    <div className="pb-2">
                      <p className="text-sm font-semibold text-foreground">{activity.title}</p>
                      <p className="text-xs text-muted-foreground mt-1">{activity.time}</p>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        </section>
      </div>

      {/* Floating AI Assistant Button */}
      <button
        onClick={() => setShowAIAssistant(!showAIAssistant)}
        className="fixed bottom-32 right-4 w-14 h-14 rounded-full bg-gradient-to-br from-primary to-accent shadow-lg flex items-center justify-center text-white hover:shadow-xl transition-all active:scale-95 z-40"
        aria-label="AI Assistant"
      >
        <MessageCircle className="w-6 h-6" />
      </button>

      {/* AI Assistant Modal */}
      {showAIAssistant && (
        <div className="fixed bottom-32 right-4 w-80 max-w-[calc(100vw-2rem)] bg-card rounded-2xl shadow-2xl border border-border p-6 z-40 animate-in slide-in-from-bottom">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-bold text-foreground">TerraIQ AI Assistant</h3>
            <button
              onClick={() => setShowAIAssistant(false)}
              className="text-muted-foreground hover:text-foreground transition-colors"
            >
              ✕
            </button>
          </div>
          <div className="bg-muted/50 rounded-lg p-4 mb-4">
            <p className="text-sm text-foreground mb-3">
              Hello! I'm your AI farming advisor. How can I help you today?
            </p>
            <div className="space-y-2">
              <button className="w-full text-left text-xs font-semibold text-primary hover:underline p-2 rounded hover:bg-muted transition-colors">
                → Recommend crops for my farm
              </button>
              <button className="w-full text-left text-xs font-semibold text-primary hover:underline p-2 rounded hover:bg-muted transition-colors">
                → Check today's weather forecast
              </button>
              <button className="w-full text-left text-xs font-semibold text-primary hover:underline p-2 rounded hover:bg-muted transition-colors">
                → Get pest management tips
              </button>
            </div>
          </div>
          <input
            type="text"
            placeholder="Ask me anything..."
            className="w-full px-3 py-2 rounded-lg border border-border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary"
          />
        </div>
      )}

      {/* Bottom Navigation */}
      <BottomNav />
    </div>
  )
}
