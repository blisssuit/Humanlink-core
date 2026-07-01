'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useApp } from '@/lib/context'
import { BottomNav } from '@/components/layout/bottom-nav'
import {
  Settings,
  Bell,
  HelpCircle,
  LogOut,
  Edit,
  Globe,
  Shield,
  User as UserIcon,
  ArrowRight,
  Crown,
  MapPin,
  Mail,
  Phone,
} from 'lucide-react'

export default function ProfilePage() {
  const router = useRouter()
  const { user, logout, updateUser } = useApp()
  const [isEditing, setIsEditing] = useState(false)
  const [editedName, setEditedName] = useState(user?.name || '')
  const [editedFarmName, setEditedFarmName] = useState(user?.farmName || '')

  const handleSaveProfile = () => {
    updateUser({
      name: editedName,
      farmName: editedFarmName,
    })
    setIsEditing(false)
  }

  const handleLogout = () => {
    logout()
    router.push('/auth/login')
  }

  return (
    <div className="bg-background min-h-screen pb-32">
      {/* Header */}
      <div className="bg-gradient-to-br from-primary to-primary/80 text-white pt-safe">
        <div className="max-w-lg mx-auto px-6 py-8">
          {/* Profile Info */}
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-3xl font-bold">My Profile</h1>
              <p className="text-white/80">Manage your farm account</p>
            </div>
            <button
              onClick={() => setIsEditing(!isEditing)}
              className="p-2 hover:bg-white/20 rounded-lg transition-colors"
            >
              <Edit className="w-6 h-6" />
            </button>
          </div>

          {/* Profile Card */}
          <div className="bg-white/10 backdrop-blur rounded-2xl p-4 flex items-center gap-4">
            <div className="w-16 h-16 rounded-full bg-white/20 flex items-center justify-center text-3xl font-bold text-white">
              {user?.name?.charAt(0).toUpperCase() || 'A'}
            </div>
            <div className="flex-1">
              <p className="text-lg font-bold text-white">{user?.name}</p>
              <p className="text-white/80 text-sm">{user?.farmName}</p>
              {user?.isPremium && (
                <div className="flex items-center gap-1 mt-2 bg-accent/30 w-fit px-2 py-1 rounded-lg">
                  <Crown className="w-3 h-3 text-accent" />
                  <span className="text-xs font-bold text-accent">Premium Member</span>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-lg mx-auto px-4 py-6 space-y-6">
        {/* Edit Profile Modal */}
        {isEditing && (
          <section className="animate-in fade-in slide-in-from-top duration-300">
            <div className="premium-card p-6 space-y-4">
              <h3 className="font-bold text-foreground mb-4">Edit Profile</h3>

              <div>
                <label className="block text-sm font-semibold text-foreground mb-2">Name</label>
                <input
                  type="text"
                  value={editedName}
                  onChange={(e) => setEditedName(e.target.value)}
                  className="w-full px-4 py-3 border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary bg-white transition-all"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-foreground mb-2">Farm Name</label>
                <input
                  type="text"
                  value={editedFarmName}
                  onChange={(e) => setEditedFarmName(e.target.value)}
                  className="w-full px-4 py-3 border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary bg-white transition-all"
                />
              </div>

              <div className="flex gap-3">
                <button
                  onClick={() => setIsEditing(false)}
                  className="flex-1 btn-outline py-3 font-bold"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSaveProfile}
                  className="flex-1 btn-primary py-3 font-bold"
                >
                  Save Changes
                </button>
              </div>
            </div>
          </section>
        )}

        {/* Account Info */}
        {!isEditing && (
          <>
            <section className="animate-in fade-in slide-in-from-top duration-500">
              <h2 className="text-sm font-semibold text-muted-foreground uppercase mb-3">Account Details</h2>
              <div className="space-y-2">
                {user?.email && (
                  <div className="premium-card p-4 flex items-center gap-3">
                    <Mail className="w-5 h-5 text-muted-foreground" />
                    <div className="flex-1">
                      <p className="text-xs text-muted-foreground">Email</p>
                      <p className="font-semibold text-foreground">{user.email}</p>
                    </div>
                  </div>
                )}
                {user?.phone && (
                  <div className="premium-card p-4 flex items-center gap-3">
                    <Phone className="w-5 h-5 text-muted-foreground" />
                    <div className="flex-1">
                      <p className="text-xs text-muted-foreground">Phone</p>
                      <p className="font-semibold text-foreground">{user.phone}</p>
                    </div>
                  </div>
                )}
                {user?.farmLocation && (
                  <div className="premium-card p-4 flex items-center gap-3">
                    <MapPin className="w-5 h-5 text-muted-foreground" />
                    <div className="flex-1">
                      <p className="text-xs text-muted-foreground">Location</p>
                      <p className="font-semibold text-foreground">{user.farmLocation}</p>
                    </div>
                  </div>
                )}
              </div>
            </section>

            {/* Quick Links */}
            <section className="animate-in fade-in slide-in-from-top duration-500 delay-75">
              <h2 className="text-sm font-semibold text-muted-foreground uppercase mb-3">Quick Access</h2>
              <div className="space-y-2">
                <Link
                  href="/premium"
                  className="premium-card p-4 flex items-center justify-between hover:shadow-md transition-all"
                >
                  <div className="flex items-center gap-3">
                    <Crown className="w-5 h-5 text-accent" />
                    <div>
                      <p className="font-semibold text-foreground">Upgrade to Premium</p>
                      <p className="text-xs text-muted-foreground">Unlock all features</p>
                    </div>
                  </div>
                  <ArrowRight className="w-5 h-5 text-muted-foreground" />
                </Link>

                <Link
                  href="/farm"
                  className="premium-card p-4 flex items-center justify-between hover:shadow-md transition-all"
                >
                  <div className="flex items-center gap-3">
                    <UserIcon className="w-5 h-5 text-primary" />
                    <div>
                      <p className="font-semibold text-foreground">My Farm Dashboard</p>
                      <p className="text-xs text-muted-foreground">View farm analytics</p>
                    </div>
                  </div>
                  <ArrowRight className="w-5 h-5 text-muted-foreground" />
                </Link>
              </div>
            </section>

            {/* Settings */}
            <section className="animate-in fade-in slide-in-from-top duration-500 delay-150">
              <h2 className="text-sm font-semibold text-muted-foreground uppercase mb-3">Settings</h2>
              <div className="space-y-2">
                <button className="w-full premium-card p-4 flex items-center justify-between hover:shadow-md transition-all">
                  <div className="flex items-center gap-3">
                    <Bell className="w-5 h-5 text-muted-foreground" />
                    <div className="text-left">
                      <p className="font-semibold text-foreground">Notifications</p>
                      <p className="text-xs text-muted-foreground">Manage alerts</p>
                    </div>
                  </div>
                  <ArrowRight className="w-5 h-5 text-muted-foreground" />
                </button>

                <button className="w-full premium-card p-4 flex items-center justify-between hover:shadow-md transition-all">
                  <div className="flex items-center gap-3">
                    <Globe className="w-5 h-5 text-muted-foreground" />
                    <div className="text-left">
                      <p className="font-semibold text-foreground">Language</p>
                      <p className="text-xs text-muted-foreground">English</p>
                    </div>
                  </div>
                  <ArrowRight className="w-5 h-5 text-muted-foreground" />
                </button>

                <button className="w-full premium-card p-4 flex items-center justify-between hover:shadow-md transition-all">
                  <div className="flex items-center gap-3">
                    <Shield className="w-5 h-5 text-muted-foreground" />
                    <div className="text-left">
                      <p className="font-semibold text-foreground">Privacy & Security</p>
                      <p className="text-xs text-muted-foreground">Manage permissions</p>
                    </div>
                  </div>
                  <ArrowRight className="w-5 h-5 text-muted-foreground" />
                </button>

                <button className="w-full premium-card p-4 flex items-center justify-between hover:shadow-md transition-all">
                  <div className="flex items-center gap-3">
                    <HelpCircle className="w-5 h-5 text-muted-foreground" />
                    <div className="text-left">
                      <p className="font-semibold text-foreground">Help Center</p>
                      <p className="text-xs text-muted-foreground">Get support</p>
                    </div>
                  </div>
                  <ArrowRight className="w-5 h-5 text-muted-foreground" />
                </button>
              </div>
            </section>

            {/* Logout */}
            <section className="animate-in fade-in slide-in-from-top duration-500 delay-300">
              <button
                onClick={handleLogout}
                className="w-full premium-card p-4 flex items-center justify-center gap-2 text-red-600 hover:bg-red-50 transition-colors font-bold"
              >
                <LogOut className="w-5 h-5" />
                Sign Out
              </button>
            </section>

            {/* Version Info */}
            <section className="text-center text-xs text-muted-foreground pb-6">
              <p>TerraIQ v1.0.0</p>
              <p>© 2024 TerraIQ. All rights reserved.</p>
            </section>
          </>
        )}
      </div>

      <BottomNav />
    </div>
  )
}
