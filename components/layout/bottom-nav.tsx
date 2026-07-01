'use client'

import React from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Home, ShoppingCart, Zap, Truck, User } from 'lucide-react'

const navItems = [
  {
    href: '/dashboard',
    icon: Home,
    label: 'Home',
    activePrefix: '/dashboard',
  },
  {
    href: '/marketplace',
    icon: ShoppingCart,
    label: 'Market',
    activePrefix: '/marketplace',
  },
  {
    href: '/scanner',
    icon: Zap,
    label: 'Scan',
    activePrefix: '/scanner',
  },
  {
    href: '/transport',
    icon: Truck,
    label: 'Transport',
    activePrefix: '/transport',
  },
  {
    href: '/profile',
    icon: User,
    label: 'Profile',
    activePrefix: '/profile',
  },
]

export function BottomNav() {
  const pathname = usePathname()

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-card border-t border-border z-40 safe-area-inset-bottom">
      <div className="max-w-lg mx-auto flex justify-around">
        {navItems.map((item) => {
          const Icon = item.icon
          const isActive = pathname.startsWith(item.activePrefix)

          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex-1 flex flex-col items-center justify-center py-3 transition-all duration-200 ${
                isActive ? 'text-primary' : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              <Icon
                className={`w-6 h-6 mb-1 transition-all duration-200 ${
                  isActive ? 'scale-110' : ''
                }`}
              />
              <span className="text-xs font-semibold">{item.label}</span>
              {isActive && (
                <div className="absolute bottom-0 h-1 w-12 bg-primary rounded-t-lg"></div>
              )}
            </Link>
          )
        })}
      </div>
    </nav>
  )
}
