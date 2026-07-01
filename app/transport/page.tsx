'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { BottomNav } from '@/components/layout/bottom-nav'
import { mockTrucks } from '@/lib/mock-data'
import { ArrowLeft, MapPin, Box, DollarSign, Navigation, Star, Clock, CheckCircle } from 'lucide-react'

export default function TransportPage() {
  const router = useRouter()
  const [step, setStep] = useState<'booking' | 'select'>('booking')
  const [bookingData, setBookingData] = useState({
    pickup: '',
    destination: '',
    weight: '',
    cargoType: '',
  })
  const [selectedTruck, setSelectedTruck] = useState<string | null>(null)
  const [showMap, setShowMap] = useState(false)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setBookingData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    setStep('select')
  }

  const estimatedCost = bookingData.weight ? parseInt(bookingData.weight) * 80 * 2.5 : 0

  return (
    <div className="bg-background min-h-screen pb-32">
      {/* Header */}
      <div className="sticky top-0 z-30 bg-card border-b border-border">
        <div className="max-w-lg mx-auto px-6 py-4 flex items-center gap-4">
          <button
            onClick={() => (step === 'select' ? setStep('booking') : router.back())}
            className="p-2 hover:bg-muted rounded-lg transition-colors"
          >
            <ArrowLeft className="w-6 h-6 text-foreground" />
          </button>
          <div>
            <h1 className="text-xl font-bold text-foreground">TerraMove</h1>
            <p className="text-xs text-muted-foreground">Book a truck instantly</p>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-lg mx-auto px-4 py-6">
        {step === 'booking' ? (
          // Booking Form
          <form onSubmit={handleSearch} className="space-y-6">
            {/* Pickup Location */}
            <section className="animate-in fade-in slide-in-from-top duration-500">
              <label className="block text-sm font-semibold text-foreground mb-3">
                <MapPin className="w-4 h-4 inline mr-2 text-accent" />
                Pickup Location
              </label>
              <input
                type="text"
                name="pickup"
                value={bookingData.pickup}
                onChange={handleChange}
                placeholder="e.g., Oyo Farm, Ibadan"
                className="w-full px-4 py-3 border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary bg-white transition-all"
              />
            </section>

            {/* Destination */}
            <section className="animate-in fade-in slide-in-from-top duration-500 delay-75">
              <label className="block text-sm font-semibold text-foreground mb-3">
                <Navigation className="w-4 h-4 inline mr-2 text-accent" />
                Destination
              </label>
              <input
                type="text"
                name="destination"
                value={bookingData.destination}
                onChange={handleChange}
                placeholder="e.g., Lagos Market, Lagos"
                className="w-full px-4 py-3 border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary bg-white transition-all"
              />
            </section>

            {/* Cargo Weight */}
            <section className="animate-in fade-in slide-in-from-top duration-500 delay-150">
              <label className="block text-sm font-semibold text-foreground mb-3">
                <Box className="w-4 h-4 inline mr-2 text-accent" />
                Cargo Weight (tons)
              </label>
              <input
                type="number"
                name="weight"
                value={bookingData.weight}
                onChange={handleChange}
                placeholder="e.g., 5"
                min="0.5"
                max="10"
                step="0.5"
                className="w-full px-4 py-3 border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary bg-white transition-all"
              />
            </section>

            {/* Cargo Type */}
            <section className="animate-in fade-in slide-in-from-top duration-500 delay-225">
              <label className="block text-sm font-semibold text-foreground mb-3">Cargo Type</label>
              <select
                name="cargoType"
                value={bookingData.cargoType}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary bg-white transition-all"
              >
                <option value="">Select cargo type</option>
                <option value="grain">Grain / Seeds</option>
                <option value="vegetables">Vegetables</option>
                <option value="fruits">Fruits</option>
                <option value="livestock">Livestock</option>
                <option value="equipment">Farm Equipment</option>
              </select>
            </section>

            {/* Estimated Cost */}
            {estimatedCost > 0 && (
              <section className="animate-in fade-in slide-in-from-top duration-500 delay-300">
                <div className="premium-card p-4 bg-accent/5 border-l-4 border-accent">
                  <p className="text-sm text-muted-foreground mb-1">Estimated Cost</p>
                  <div className="flex items-baseline gap-2">
                    <span className="text-3xl font-bold text-primary">₦{estimatedCost.toLocaleString()}</span>
                    <span className="text-xs text-muted-foreground">to {bookingData.destination}</span>
                  </div>
                  <p className="text-xs text-muted-foreground mt-2">✓ Price includes insurance and taxes</p>
                </div>
              </section>
            )}

            {/* Search Button */}
            <div className="animate-in fade-in slide-in-from-top duration-500 delay-375 pt-6">
              <button
                type="submit"
                disabled={!bookingData.pickup || !bookingData.destination || !bookingData.weight || !bookingData.cargoType}
                className="w-full btn-primary py-4 font-bold text-lg"
              >
                Find Available Trucks
              </button>
            </div>
          </form>
        ) : (
          // Truck Selection
          <div className="space-y-6">
            {/* Booking Summary */}
            <section className="animate-in fade-in slide-in-from-top duration-500">
              <div className="premium-card p-4">
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <p className="text-xs text-muted-foreground mb-1">From</p>
                    <p className="font-semibold text-foreground">{bookingData.pickup}</p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground mb-1">To</p>
                    <p className="font-semibold text-foreground">{bookingData.destination}</p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground mb-1">Weight</p>
                    <p className="font-semibold text-foreground">{bookingData.weight} tons</p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground mb-1">Type</p>
                    <p className="font-semibold text-foreground">{bookingData.cargoType}</p>
                  </div>
                </div>
              </div>
            </section>

            {/* Available Trucks */}
            <section>
              <h3 className="text-sm font-semibold text-muted-foreground uppercase mb-4">
                {mockTrucks.length} Available Trucks
              </h3>
              <div className="space-y-3">
                {mockTrucks.map((truck, index) => (
                  <div
                    key={truck.id}
                    onClick={() => setSelectedTruck(truck.id)}
                    className={`premium-card overflow-hidden cursor-pointer transition-all duration-300 animate-in fade-in slide-in-from-top ${
                      selectedTruck === truck.id ? 'ring-2 ring-primary shadow-lg' : ''
                    }`}
                    style={{ animationDelay: `${index * 75}ms` }}
                  >
                    <div className="flex gap-3 p-4">
                      {/* Image */}
                      <div className="w-20 h-20 rounded-lg flex-shrink-0 overflow-hidden">
                        <img
                          src={truck.image}
                          alt={truck.vehicleType}
                          className="w-full h-full object-cover"
                        />
                      </div>

                      {/* Info */}
                      <div className="flex-1">
                        <p className="font-semibold text-foreground">{truck.driverName}</p>
                        <p className="text-xs text-muted-foreground mb-2">{truck.vehicleType}</p>

                        <div className="flex items-center gap-1 mb-2">
                          <Star className="w-3 h-3 fill-accent text-accent" />
                          <span className="text-xs font-semibold">{truck.rating}</span>
                        </div>

                        <div className="flex gap-3 text-xs">
                          <span className="text-muted-foreground">Cap: {truck.capacity}</span>
                          <span className="text-primary font-bold">{truck.availability}</span>
                        </div>
                      </div>

                      {/* Price */}
                      <div className="text-right flex flex-col justify-between">
                        <div>
                          <p className="text-xs text-muted-foreground mb-1">Est. Cost</p>
                          <p className="text-lg font-bold text-primary">₦{estimatedCost.toLocaleString()}</p>
                        </div>
                        {selectedTruck === truck.id && (
                          <CheckCircle className="w-5 h-5 text-primary" />
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </section>

            {/* Map Preview */}
            <section className="animate-in fade-in duration-500 delay-300">
              <button
                onClick={() => setShowMap(!showMap)}
                className="w-full premium-card p-4 flex items-center justify-center gap-2 hover:shadow-md transition-all"
              >
                <Navigation className="w-5 h-5 text-primary" />
                <span className="font-semibold text-foreground">View Route on Map</span>
              </button>
            </section>

            {/* Booking Button */}
            <section className="animate-in fade-in duration-500 delay-375 space-y-3">
              <button
                disabled={!selectedTruck}
                className="w-full btn-primary py-4 font-bold text-lg"
              >
                Confirm & Book
              </button>
              <button
                onClick={() => setStep('booking')}
                className="w-full btn-outline py-4 font-bold"
              >
                Change Details
              </button>
            </section>
          </div>
        )}
      </div>

      <BottomNav />
    </div>
  )
}
