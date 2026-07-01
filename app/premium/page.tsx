'use client'

import React, { useState } from 'react'
import { useRouter } from 'next/navigation'
import { BottomNav } from '@/components/layout/bottom-nav'
import { premiumBenefits } from '@/lib/mock-data'
import { ArrowLeft, Check, Star, Zap } from 'lucide-react'

export default function PremiumPage() {
  const router = useRouter()
  const [billingPeriod, setBillingPeriod] = useState<'monthly' | 'yearly'>('monthly')

  const monthlyPrice = 4990
  const yearlyPrice = 49900
  const displayPrice = billingPeriod === 'monthly' ? monthlyPrice : yearlyPrice
  const savings = billingPeriod === 'yearly' ? Math.round((monthlyPrice * 12 - yearlyPrice) / (monthlyPrice * 12) * 100) : 0

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
            <h1 className="text-xl font-bold text-foreground">TerraIQ Premium</h1>
            <p className="text-xs text-muted-foreground">Unlock full potential</p>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-lg mx-auto px-4 py-6 space-y-6">
        {/* Hero Banner */}
        <section className="animate-in fade-in slide-in-from-top duration-500">
          <div className="premium-card-lg p-8 bg-gradient-to-br from-primary to-primary/80 text-white text-center">
            <Star className="w-12 h-12 mx-auto mb-4" />
            <h2 className="text-3xl font-bold mb-2">Join Premium</h2>
            <p className="text-white/90 mb-6">Get unlimited access to all premium features and unlock your farm&apos;s full potential</p>

            {/* Pricing Toggle */}
            <div className="bg-white/20 rounded-full p-1 inline-flex gap-2 backdrop-blur">
              <button
                onClick={() => setBillingPeriod('monthly')}
                className={`px-4 py-2 rounded-full font-semibold transition-all ${
                  billingPeriod === 'monthly'
                    ? 'bg-white text-primary'
                    : 'text-white/80 hover:text-white'
                }`}
              >
                Monthly
              </button>
              <button
                onClick={() => setBillingPeriod('yearly')}
                className={`px-4 py-2 rounded-full font-semibold transition-all ${
                  billingPeriod === 'yearly'
                    ? 'bg-white text-primary'
                    : 'text-white/80 hover:text-white'
                }`}
              >
                Yearly
              </button>
            </div>
          </div>
        </section>

        {/* Price Card */}
        <section className="animate-in fade-in slide-in-from-top duration-500 delay-100">
          <div className="premium-card p-8 border-2 border-primary text-center">
            <div className="flex items-baseline justify-center gap-1 mb-2">
              <span className="text-5xl font-bold text-primary">₦{displayPrice.toLocaleString()}</span>
              <span className="text-muted-foreground">
                /{billingPeriod === 'monthly' ? 'month' : 'year'}
              </span>
            </div>
            {savings > 0 && (
              <p className="text-sm text-green-600 font-semibold mb-4">Save {savings}% with yearly plan</p>
            )}
            <button className="w-full btn-primary py-4 font-bold text-lg mb-4">
              <Zap className="w-5 h-5 inline mr-2" />
              Upgrade to Premium
            </button>
            <p className="text-xs text-muted-foreground">7-day free trial • Cancel anytime</p>
          </div>
        </section>

        {/* Benefits Grid */}
        <section className="animate-in fade-in slide-in-from-top duration-500 delay-150">
          <h3 className="text-sm font-semibold text-muted-foreground uppercase mb-4">What&apos;s Included</h3>
          <div className="space-y-3">
            {premiumBenefits.map((benefit, index) => (
              <div
                key={benefit.title}
                className="premium-card p-4 flex gap-3 animate-in fade-in slide-in-from-top duration-500"
                style={{ animationDelay: `${200 + index * 50}ms` }}
              >
                <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                  <Check className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <p className="font-semibold text-foreground">{benefit.title}</p>
                  <p className="text-sm text-muted-foreground mt-1">{benefit.description}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Comparison */}
        <section className="animate-in fade-in slide-in-from-top duration-500 delay-300">
          <h3 className="text-sm font-semibold text-muted-foreground uppercase mb-4">Free vs Premium</h3>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border">
                  <th className="text-left font-semibold text-foreground py-3 px-3">Feature</th>
                  <th className="text-center font-semibold text-foreground py-3 px-3">Free</th>
                  <th className="text-center font-semibold text-primary py-3 px-3">Premium</th>
                </tr>
              </thead>
              <tbody>
                {[
                  { feature: 'AI Crop Scans', free: '10/month', premium: 'Unlimited' },
                  { feature: 'Disease Detection', free: 'Basic', premium: 'Advanced' },
                  { feature: 'Yield Prediction', free: 'No', premium: 'Yes' },
                  { feature: 'Market Forecasts', free: 'No', premium: 'Yes' },
                  { feature: 'Priority Support', free: 'No', premium: '24/7' },
                  { feature: 'Analytics', free: 'Basic', premium: 'Detailed' },
                ].map((row) => (
                  <tr key={row.feature} className="border-b border-border/50 hover:bg-muted/30 transition-colors">
                    <td className="py-3 px-3 text-foreground">{row.feature}</td>
                    <td className="text-center py-3 px-3 text-muted-foreground">{row.free}</td>
                    <td className="text-center py-3 px-3 text-primary font-semibold">{row.premium}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        {/* FAQ */}
        <section className="animate-in fade-in slide-in-from-top duration-500 delay-375">
          <h3 className="text-sm font-semibold text-muted-foreground uppercase mb-4">FAQ</h3>
          <div className="space-y-3">
            {[
              {
                q: 'Can I cancel anytime?',
                a: 'Yes, cancel your subscription anytime with no questions asked.',
              },
              {
                q: 'Is there a free trial?',
                a: 'Yes, enjoy 7 days free to explore all premium features.',
              },
              {
                q: 'What payment methods are accepted?',
                a: 'We accept card payments and local transfer options.',
              },
            ].map((item) => (
              <details
                key={item.q}
                className="premium-card p-4 group cursor-pointer"
              >
                <summary className="font-semibold text-foreground flex items-center justify-between">
                  {item.q}
                  <span className="text-muted-foreground group-open:rotate-180 transition-transform">▼</span>
                </summary>
                <p className="text-sm text-muted-foreground mt-3">{item.a}</p>
              </details>
            ))}
          </div>
        </section>

        {/* CTA Button */}
        <section className="animate-in fade-in duration-500 delay-450 pt-6 pb-6">
          <button className="w-full btn-primary py-4 font-bold text-lg">Start Free Trial</button>
        </section>
      </div>

      <BottomNav />
    </div>
  )
}
