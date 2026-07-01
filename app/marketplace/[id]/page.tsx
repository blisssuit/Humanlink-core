'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { BottomNav } from '@/components/layout/bottom-nav'
import { mockMarketplace } from '@/lib/mock-data'
import {
  ArrowLeft,
  Star,
  MapPin,
  ShoppingCart,
  MessageCircle,
  Heart,
  Share2,
  CheckCircle,
  TrendingUp,
  Zap,
} from 'lucide-react'

export default function ProductDetailPage({ params }: { params: { id: string } }) {
  const router = useRouter()
  const [quantity, setQuantity] = useState(1)
  const [isFavorite, setIsFavorite] = useState(false)

  // Find product from mock data
  const product = mockMarketplace.find((p) => p.id === params.id) || mockMarketplace[0]

  const estimatedTotal = parseInt(product.price.replace(/[₦,]/g, '')) * quantity

  return (
    <div className="bg-background min-h-screen pb-32">
      {/* Header */}
      <div className="sticky top-0 z-30 bg-card border-b border-border">
        <div className="max-w-lg mx-auto px-4 py-4 flex items-center justify-between">
          <button
            onClick={() => router.back()}
            className="p-2 hover:bg-muted rounded-lg transition-colors"
          >
            <ArrowLeft className="w-6 h-6 text-foreground" />
          </button>
          <h1 className="text-lg font-bold text-foreground flex-1 ml-3">Product Details</h1>
          <button className="p-2 hover:bg-muted rounded-lg transition-colors">
            <Share2 className="w-5 h-5 text-foreground" />
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-lg mx-auto px-4 py-6 space-y-6">
        {/* Image Gallery */}
        <section className="animate-in fade-in slide-in-from-top duration-500">
          <div className="premium-card-lg overflow-hidden">
            <div className="aspect-square bg-muted relative">
              <img
                src={product.image}
                alt={product.name}
                className="w-full h-full object-cover"
              />
              <button
                onClick={() => setIsFavorite(!isFavorite)}
                className="absolute top-4 right-4 w-10 h-10 bg-white rounded-full flex items-center justify-center shadow-lg hover:scale-110 transition-transform"
              >
                <Heart
                  className={`w-6 h-6 ${
                    isFavorite ? 'fill-red-500 text-red-500' : 'text-muted-foreground'
                  }`}
                />
              </button>
              <div className="absolute top-4 left-4 bg-primary text-white px-3 py-1 rounded-lg text-xs font-bold">
                {product.grade} Grade
              </div>
            </div>
          </div>
        </section>

        {/* Product Info */}
        <section className="animate-in fade-in slide-in-from-top duration-500 delay-75">
          <div className="premium-card p-6">
            <h2 className="text-3xl font-bold text-foreground mb-2">{product.name}</h2>
            <div className="flex items-center gap-2 mb-4">
              <div className="flex items-center">
                {[1, 2, 3, 4, 5].map((i) => (
                  <Star
                    key={i}
                    className={`w-4 h-4 ${
                      i <= Math.round(product.rating)
                        ? 'fill-accent text-accent'
                        : 'text-muted'
                    }`}
                  />
                ))}
              </div>
              <span className="font-semibold text-foreground">{product.rating}</span>
              <span className="text-muted-foreground">({product.reviews} reviews)</span>
            </div>

            <div className="flex items-baseline gap-2 mb-4">
              <span className="text-4xl font-bold text-primary">{product.price}</span>
              <span className="text-sm text-muted-foreground">per {product.quantity}</span>
            </div>

            {/* Location */}
            <div className="flex items-center gap-2 text-muted-foreground mb-6 pb-6 border-b border-border">
              <MapPin className="w-4 h-4" />
              <span>{product.location}</span>
            </div>

            {/* Key Info */}
            <div className="grid grid-cols-3 gap-4">
              <div className="text-center">
                <CheckCircle className="w-6 h-6 text-green-500 mx-auto mb-2" />
                <p className="text-xs text-muted-foreground">Verified</p>
              </div>
              <div className="text-center">
                <Zap className="w-6 h-6 text-yellow-500 mx-auto mb-2" />
                <p className="text-xs text-muted-foreground">Fast Delivery</p>
              </div>
              <div className="text-center">
                <TrendingUp className="w-6 h-6 text-primary mx-auto mb-2" />
                <p className="text-xs text-muted-foreground">Quality</p>
              </div>
            </div>
          </div>
        </section>

        {/* Farmer Profile */}
        <section className="animate-in fade-in slide-in-from-top duration-500 delay-150">
          <h3 className="text-sm font-semibold text-muted-foreground uppercase mb-3">Seller</h3>
          <div className="premium-card p-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center text-white font-bold">
                {product.farmer.charAt(0)}
              </div>
              <div>
                <p className="font-semibold text-foreground">{product.farmer}</p>
                <p className="text-xs text-muted-foreground">Verified Seller</p>
              </div>
            </div>
            <Star className="w-5 h-5 fill-accent text-accent" />
          </div>
        </section>

        {/* AI Valuation */}
        <section className="animate-in fade-in slide-in-from-top duration-500 delay-225">
          <h3 className="text-sm font-semibold text-muted-foreground uppercase mb-3">Market Analysis</h3>
          <div className="premium-card p-6 border-l-4 border-accent">
            <div className="flex items-start justify-between mb-4">
              <div>
                <p className="text-sm text-muted-foreground mb-1">AI Estimated Market Value</p>
                <p className="text-2xl font-bold text-primary">₦19,200</p>
              </div>
              <span className="text-xs font-bold px-3 py-1 rounded-lg bg-green-100 text-green-700">-5% Discount</span>
            </div>
            <p className="text-xs text-muted-foreground">
              This product is priced 5% below market average. Good opportunity to buy.
            </p>
          </div>
        </section>

        {/* Quantity Selection */}
        <section className="animate-in fade-in slide-in-from-top duration-500 delay-300">
          <h3 className="text-sm font-semibold text-muted-foreground uppercase mb-3">Quantity</h3>
          <div className="premium-card p-4 flex items-center justify-between">
            <span className="font-semibold text-foreground">Available: 50 bags</span>
            <div className="flex items-center gap-2 border border-border rounded-lg p-1">
              <button
                onClick={() => setQuantity(Math.max(1, quantity - 1))}
                className="px-3 py-2 hover:bg-muted transition-colors"
              >
                −
              </button>
              <span className="px-4 font-semibold">{quantity}</span>
              <button
                onClick={() => setQuantity(quantity + 1)}
                className="px-3 py-2 hover:bg-muted transition-colors"
              >
                +
              </button>
            </div>
          </div>
        </section>

        {/* Order Summary */}
        <section className="animate-in fade-in slide-in-from-top duration-500 delay-375">
          <div className="premium-card p-4 space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Unit Price</span>
              <span className="font-semibold text-foreground">{product.price}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Quantity</span>
              <span className="font-semibold text-foreground">{quantity}</span>
            </div>
            <div className="border-t border-border pt-2 flex justify-between">
              <span className="font-bold text-foreground">Total</span>
              <span className="text-2xl font-bold text-primary">₦{estimatedTotal.toLocaleString()}</span>
            </div>
          </div>
        </section>

        {/* Action Buttons */}
        <section className="animate-in fade-in slide-in-from-top duration-500 delay-450 space-y-3">
          <button className="w-full btn-primary py-4 font-bold text-lg flex items-center justify-center gap-2">
            <ShoppingCart className="w-6 h-6" />
            Buy Now
          </button>

          <button className="w-full btn-outline py-4 font-bold text-lg flex items-center justify-center gap-2">
            <MessageCircle className="w-6 h-6" />
            Message Farmer
          </button>
        </section>
      </div>

      <BottomNav />
    </div>
  )
}
