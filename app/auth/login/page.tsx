'use client'

import React, { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { useApp } from '@/lib/context'

export default function LoginPage() {
  const router = useRouter()
  const { setUser } = useApp()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [phoneNumber, setPhoneNumber] = useState('')
  const [authMethod, setAuthMethod] = useState<'email' | 'phone' | 'google'>('email')
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setIsLoading(true)

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000))

    if (authMethod === 'email' && email && password) {
      setUser({
        id: '1',
        name: 'Adekunle Obi',
        email,
        farmName: 'Obi Family Farm',
        farmLocation: 'Oyo State, Nigeria',
        isPremium: false,
      })
      router.push('/onboarding')
    } else if (authMethod === 'phone' && phoneNumber && password) {
      setUser({
        id: '1',
        name: 'Adekunle Obi',
        email: `${phoneNumber}@terraiq.com`,
        phone: phoneNumber,
        farmName: 'Obi Family Farm',
        farmLocation: 'Oyo State, Nigeria',
        isPremium: false,
      })
      router.push('/onboarding')
    } else if (authMethod === 'google') {
      setUser({
        id: '1',
        name: 'Adekunle Obi',
        email: 'adekunle@example.com',
        farmName: 'Obi Family Farm',
        farmLocation: 'Oyo State, Nigeria',
        isPremium: false,
      })
      router.push('/onboarding')
    } else {
      setError('Please fill in all fields')
    }

    setIsLoading(false)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/5 to-accent/5 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Header */}
        <div className="text-center mb-8 animate-in fade-in slide-in-from-top duration-500">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-primary rounded-3xl mb-4 shadow-lg">
            <div className="text-3xl font-bold text-white">T</div>
          </div>
          <h1 className="text-3xl font-bold text-foreground mb-2">Welcome to TerraIQ</h1>
          <p className="text-muted-foreground">Sign in to manage your farm with AI</p>
        </div>

        {/* Auth Method Tabs */}
        <div className="flex gap-2 mb-8 bg-muted p-1 rounded-xl">
          {[
            { method: 'email' as const, label: 'Email' },
            { method: 'phone' as const, label: 'Phone' },
            { method: 'google' as const, label: 'Google' },
          ].map((tab) => (
            <button
              key={tab.method}
              onClick={() => setAuthMethod(tab.method)}
              className={`flex-1 py-2 rounded-lg transition-all duration-200 font-medium text-sm ${
                authMethod === tab.method
                  ? 'bg-primary text-white shadow-md'
                  : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Error Message */}
        {error && (
          <div className="mb-6 p-4 bg-red-50 text-red-600 rounded-xl text-sm font-medium animate-in fade-in">
            {error}
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleLogin} className="space-y-4 mb-6 animate-in fade-in slide-in-from-bottom duration-500">
          {authMethod === 'email' && (
            <>
              <div>
                <label className="block text-sm font-semibold text-foreground mb-2">Email Address</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@example.com"
                  className="w-full px-4 py-3 border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary bg-white transition-all"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-foreground mb-2">Password</label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full px-4 py-3 border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary bg-white transition-all"
                />
              </div>
            </>
          )}

          {authMethod === 'phone' && (
            <>
              <div>
                <label className="block text-sm font-semibold text-foreground mb-2">Phone Number</label>
                <input
                  type="tel"
                  value={phoneNumber}
                  onChange={(e) => setPhoneNumber(e.target.value)}
                  placeholder="+234 801 234 5678"
                  className="w-full px-4 py-3 border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary bg-white transition-all"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-foreground mb-2">Password</label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full px-4 py-3 border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary bg-white transition-all"
                />
              </div>
            </>
          )}

          {authMethod === 'google' && (
            <div className="text-center py-4 text-muted-foreground">
              <p className="mb-4">Click the button below to continue with Google</p>
            </div>
          )}

          <button
            type="submit"
            disabled={isLoading}
            className="w-full btn-primary justify-center py-4 font-bold text-lg mt-8"
          >
            {isLoading ? (
              <span className="flex items-center gap-2">
                <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
                Signing in...
              </span>
            ) : authMethod === 'google' ? (
              'Continue with Google'
            ) : (
              'Sign In'
            )}
          </button>
        </form>

        {/* Divider */}
        <div className="relative mb-6">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-border"></div>
          </div>
          <div className="relative flex justify-center text-sm">
            <span className="px-2 bg-background text-muted-foreground">Or</span>
          </div>
        </div>

        {/* Sign Up Link */}
        <div className="text-center">
          <p className="text-muted-foreground">Don&apos;t have an account?</p>
          <Link href="/auth/signup" className="text-primary font-semibold hover:underline mt-2">
            Create one now
          </Link>
        </div>
      </div>
    </div>
  )
}
