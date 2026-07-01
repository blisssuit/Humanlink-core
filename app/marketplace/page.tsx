'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { BottomNav } from '@/components/layout/bottom-nav'
import { mockMarketplace } from '@/lib/mock-data'
import { Search, ArrowLeft, Filter, Star, MapPin, ShoppingCart } from 'lucide-react'

const categories = ['All', 'Grains', 'Vegetables', 'Fruits', 'Livestock']

export default function MarketplacePage() {
  const router = useRouter()
  const [selectedCategory, setSelectedCategory] = useState('All')
  const [searchQuery, setSearchQuery] = useState('')
  const [showFilters, setShowFilters] = useState(false)

  const filteredProducts = mockMarketplace.filter((product) => {
    const matchesSearch = product.name.toLowerCase().includes(searchQuery.toLowerCase())
    return matchesSearch
  })

  return (
    <div className="bg-background min-h-screen pb-32">
      {/* Header */}
      <div className="sticky top-0 z-30 bg-card border-b border-border">
        <div className="max-w-lg mx-auto px-4 py-4 space-y-4">
          <div className="flex items-center gap-3">
            <button
              onClick={() => router.back()}
              className="p-2 hover:bg-muted rounded-lg transition-colors flex-shrink-0"
            >
              <ArrowLeft className="w-6 h-6 text-foreground" />
            </button>
            <h1 className="text-xl font-bold text-foreground">Marketplace</h1>
          </div>

          {/* Search Bar */}
          <div className="flex gap-3">
            <div className="flex-1 relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search crops..."
                className="w-full pl-12 pr-4 py-3 border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary bg-background transition-all"
              />
            </div>
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="p-3 border border-border rounded-xl hover:bg-muted transition-colors flex-shrink-0"
            >
              <Filter className="w-5 h-5 text-foreground" />
            </button>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-lg mx-auto px-4 py-6">
        {/* Categories */}
        <div className="mb-6 flex gap-2 overflow-x-auto pb-2 -mx-4 px-4 animate-in fade-in slide-in-from-top duration-500">
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => setSelectedCategory(category)}
              className={`px-4 py-2 rounded-full font-semibold whitespace-nowrap transition-all duration-200 ${
                selectedCategory === category
                  ? 'bg-primary text-white shadow-md'
                  : 'bg-muted text-muted-foreground hover:bg-muted/80'
              }`}
            >
              {category}
            </button>
          ))}
        </div>

        {/* Filters Panel */}
        {showFilters && (
          <div className="premium-card p-6 mb-6 animate-in fade-in slide-in-from-top duration-300">
            <h3 className="font-bold text-foreground mb-4">Filters</h3>
            <div className="space-y-4">
              <div>
                <label className="text-sm font-semibold text-foreground mb-2 block">Grade</label>
                <div className="flex gap-2">
                  {['A+', 'A', 'B+', 'B'].map((grade) => (
                    <button
                      key={grade}
                      className="px-3 py-2 border border-border rounded-lg hover:border-primary transition-colors"
                    >
                      {grade}
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <label className="text-sm font-semibold text-foreground mb-2 block">Rating</label>
                <div className="flex gap-2">
                  {[5, 4, 3].map((rating) => (
                    <button key={rating} className="px-3 py-2 border border-border rounded-lg hover:border-primary transition-colors">
                      {rating}⭐+
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Products Grid */}
        <div className="grid grid-cols-2 gap-3 animate-in fade-in duration-500 delay-100">
          {filteredProducts.map((product) => (
            <Link
              key={product.id}
              href={`/marketplace/${product.id}`}
              className="premium-card overflow-hidden hover:shadow-lg transition-all group"
            >
              {/* Image */}
              <div className="relative overflow-hidden aspect-square bg-muted">
                <img
                  src={product.image}
                  alt={product.name}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                />
                <div className="absolute top-2 right-2 bg-primary/90 text-white px-2 py-1 rounded-lg text-xs font-bold">
                  {product.grade}
                </div>
              </div>

              {/* Info */}
              <div className="p-3">
                <h3 className="font-semibold text-foreground text-sm line-clamp-2 mb-2">{product.name}</h3>

                {/* Rating */}
                <div className="flex items-center gap-1 mb-2">
                  <Star className="w-3 h-3 fill-accent text-accent" />
                  <span className="text-xs font-semibold text-foreground">{product.rating}</span>
                  <span className="text-xs text-muted-foreground">({product.reviews})</span>
                </div>

                {/* Location */}
                <div className="flex items-center gap-1 mb-3 text-xs text-muted-foreground">
                  <MapPin className="w-3 h-3" />
                  <span className="line-clamp-1">{product.location}</span>
                </div>

                {/* Price & Quantity */}
                <div className="border-t border-border pt-3">
                  <p className="font-bold text-primary mb-1">{product.price}</p>
                  <p className="text-xs text-muted-foreground mb-3">{product.quantity}</p>
                  <button className="w-full bg-primary/10 text-primary font-semibold py-2 rounded-lg hover:bg-primary/20 transition-colors flex items-center justify-center gap-2 text-xs">
                    <ShoppingCart className="w-3 h-3" />
                    View
                  </button>
                </div>
              </div>
            </Link>
          ))}
        </div>

        {/* Empty State */}
        {filteredProducts.length === 0 && (
          <div className="text-center py-12 animate-in fade-in">
            <ShoppingCart className="w-16 h-16 text-muted/50 mx-auto mb-4" />
            <p className="text-foreground font-semibold mb-2">No products found</p>
            <p className="text-muted-foreground text-sm">Try adjusting your search filters</p>
          </div>
        )}
      </div>

      <BottomNav />
    </div>
  )
}
