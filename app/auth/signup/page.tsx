'use client'

import React, { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { useApp } from '@/lib/context'

export default function SignupPage() {
  const router = useRouter()
  const { setUser } = useApp()
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
    farmName: '',
    farmLocation: '',
  })
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')
  const [step, setStep] = useState(1)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleNext = (e: React.FormEvent) => {
    e.preventDefault()
    setError('')

    if (step === 1) {
      if (!formData.name || (!formData.email && !formData.phone)) {
        setError('Please fill in all required fields')
        return
      }
      if (formData.email && !formData.email.includes('@')) {
        setError('Please enter a valid email')
        return
      }
      setStep(2)
    } else if (step === 2) {
      if (!formData.password || !formData.confirmPassword) {
        setError('Please enter a password')
        return
      }
      if (formData.password !== formData.confirmPassword) {
        setError('Passwords do not match')
        return
      }
      if (formData.password.length < 8) {
        setError('Password must be at least 8 characters')
        return
      }
      setStep(3)
    }
  }

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setIsLoading(true)

    if (!formData.farmName || !formData.farmLocation) {
      setError('Please enter farm details')
      setIsLoading(false)
      return
    }

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1500))

    setUser({
      id: '1',
      name: formData.name,
      email: formData.email || `${formData.phone}@terraiq.com`,
      phone: formData.phone,
      farmName: formData.farmName,
      farmLocation: formData.farmLocation,
      isPremium: false,
    })

    setIsLoading(false)
    router.push('/onboarding')
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/5 to-accent/5 flex items-center justify-center p-4 py-12">
      <div className="w-full max-w-md">
        {/* Header */}
        <div className="text-center mb-8 animate-in fade-in slide-in-from-top duration-500">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-primary rounded-3xl mb-4 shadow-lg">
            <div className="text-3xl font-bold text-white">T</div>
          </div>
          <h1 className="text-3xl font-bold text-foreground mb-2">Join TerraIQ</h1>
          <p className="text-muted-foreground">Create your farming account</p>
        </div>

        {/* Progress Indicator */}
        <div className="flex gap-2 mb-8">
          {[1, 2, 3].map((i) => (
            <div
              key={i}
              className={`h-2 flex-1 rounded-full transition-all duration-300 ${
                i <= step ? 'bg-primary' : 'bg-muted'
              }`}
            />
          ))}
        </div>

        {/* Error Message */}
        {error && (
          <div className="mb-6 p-4 bg-red-50 text-red-600 rounded-xl text-sm font-medium animate-in fade-in">
            {error}
          </div>
        )}

        {/* Form */}
        <form onSubmit={step === 3 ? handleSignup : handleNext} className="space-y-4 mb-6">
          {/* Step 1: Personal Info */}
          {step === 1 && (
            <div className="space-y-4 animate-in fade-in">
              <div>
                <label className="block text-sm font-semibold text-foreground mb-2">Full Name</label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="Your name"
                  className="w-full px-4 py-3 border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary bg-white transition-all"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-foreground mb-2">Email (Optional)</label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="you@example.com"
                  className="w-full px-4 py-3 border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary bg-white transition-all"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-foreground mb-2">Phone Number (Optional)</label>
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  placeholder="+234 801 234 5678"
                  className="w-full px-4 py-3 border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary bg-white transition-all"
                />
              </div>
            </div>
          )}

          {/* Step 2: Password */}
          {step === 2 && (
            <div className="space-y-4 animate-in fade-in">
              <div>
                <label className="block text-sm font-semibold text-foreground mb-2">Create Password</label>
                <input
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="At least 8 characters"
                  className="w-full px-4 py-3 border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary bg-white transition-all"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-foreground mb-2">Confirm Password</label>
                <input
                  type="password"
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  placeholder="Confirm password"
                  className="w-full px-4 py-3 border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary bg-white transition-all"
                />
              </div>
            </div>
          )}

          {/* Step 3: Farm Info */}
          {step === 3 && (
            <div className="space-y-4 animate-in fade-in">
              <div>
                <label className="block text-sm font-semibold text-foreground mb-2">Farm Name</label>
                <input
                  type="text"
                  name="farmName"
                  value={formData.farmName}
                  onChange={handleChange}
                  placeholder="e.g., Obi Family Farm"
                  className="w-full px-4 py-3 border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary bg-white transition-all"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-foreground mb-2">Farm Location</label>
                <select
                  name="farmLocation"
                  value={formData.farmLocation}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary bg-white transition-all"
                >
                  <option value="">Select state</option>
                  <option value="Oyo State, Nigeria">Oyo State</option>
                  <option value="Lagos State, Nigeria">Lagos State</option>
                  <option value="Kano State, Nigeria">Kano State</option>
                  <option value="Kaduna State, Nigeria">Kaduna State</option>
                  <option value="Rivers State, Nigeria">Rivers State</option>
                  <option value="Delta State, Nigeria">Delta State</option>
                </select>
              </div>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex gap-3 mt-8">
            {step > 1 && (
              <button
                type="button"
                onClick={() => {
                  setStep(step - 1)
                  setError('')
                }}
                className="flex-1 btn-outline py-4 font-bold"
              >
                Back
              </button>
            )}
            <button
              type="submit"
              disabled={isLoading}
              className={`flex-1 ${step === 3 ? 'btn-primary' : 'btn-primary'} py-4 font-bold justify-center`}
            >
              {isLoading ? (
                <span className="flex items-center gap-2">
                  <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
                  Creating account...
                </span>
              ) : step === 3 ? (
                'Create Account'
              ) : (
                'Next'
              )}
            </button>
          </div>
        </form>

        {/* Sign In Link */}
        <div className="text-center">
          <p className="text-muted-foreground">Already have an account?</p>
          <Link href="/auth/login" className="text-primary font-semibold hover:underline mt-2">
            Sign in here
          </Link>
        </div>
      </div>
    </div>
  )
}
