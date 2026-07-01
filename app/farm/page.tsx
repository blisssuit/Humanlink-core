'use client'

import React from 'react'
import { useRouter } from 'next/navigation'
import { BottomNav } from '@/components/layout/bottom-nav'
import { mockFarmData } from '@/lib/mock-data'
import { ArrowLeft, TrendingUp, TrendingDown, AlertCircle, Calendar, Leaf, Zap } from 'lucide-react'

export default function FarmPage() {
  const router = useRouter()

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
          <h1 className="text-xl font-bold text-foreground">My Farm</h1>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-lg mx-auto px-4 py-6 space-y-6">
        {/* Overview Cards */}
        <section className="grid grid-cols-2 gap-3 animate-in fade-in slide-in-from-top duration-500">
          {/* Total Harvest */}
          <div className="premium-card p-4 text-center">
            <Leaf className="w-6 h-6 text-primary mx-auto mb-2" />
            <p className="text-xs text-muted-foreground mb-1">Total Harvest</p>
            <p className="text-2xl font-bold text-foreground">{mockFarmData.totalHarvest}</p>
          </div>

          {/* Profit */}
          <div className="premium-card p-4 text-center">
            <TrendingUp className="w-6 h-6 text-green-500 mx-auto mb-2" />
            <p className="text-xs text-muted-foreground mb-1">Profit (YTD)</p>
            <p className="text-2xl font-bold text-primary">{mockFarmData.profit}</p>
          </div>

          {/* Expenses */}
          <div className="premium-card p-4 text-center">
            <TrendingDown className="w-6 h-6 text-red-500 mx-auto mb-2" />
            <p className="text-xs text-muted-foreground mb-1">Expenses (YTD)</p>
            <p className="text-2xl font-bold text-foreground">{mockFarmData.expenses}</p>
          </div>

          {/* Net Income */}
          <div className="premium-card p-4 text-center">
            <Zap className="w-6 h-6 text-accent mx-auto mb-2" />
            <p className="text-xs text-muted-foreground mb-1">Net Income</p>
            <p className="text-xl font-bold text-primary">
              ₦{(parseInt(mockFarmData.profit.replace(/[₦,]/g, '')) - parseInt(mockFarmData.expenses.replace(/[₦,]/g, ''))).toLocaleString()}
            </p>
          </div>
        </section>

        {/* Crop History */}
        <section className="animate-in fade-in slide-in-from-top duration-500 delay-100">
          <h2 className="text-sm font-semibold text-muted-foreground uppercase mb-3">Crop History</h2>
          <div className="space-y-2">
            {mockFarmData.cropHistory.map((entry) => (
              <div key={entry.crop} className="premium-card p-4 flex items-center justify-between">
                <div>
                  <p className="font-semibold text-foreground">{entry.crop}</p>
                  <div className="flex gap-3 text-xs text-muted-foreground mt-1">
                    <span>{entry.harvested}</span>
                    <span>•</span>
                    <span>{new Date(entry.date).toLocaleDateString()}</span>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-bold text-primary">{entry.profit}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Upcoming Tasks */}
        <section className="animate-in fade-in slide-in-from-top duration-500 delay-150">
          <h2 className="text-sm font-semibold text-muted-foreground uppercase mb-3">Upcoming Tasks</h2>
          <div className="space-y-2">
            {mockFarmData.upcomingTasks.map((task) => (
              <div
                key={task.task}
                className={`premium-card p-4 flex items-start gap-3 border-l-4 ${
                  task.priority === 'High'
                    ? 'border-red-500'
                    : task.priority === 'Medium'
                      ? 'border-yellow-500'
                      : 'border-green-500'
                }`}
              >
                <Calendar className={`w-5 h-5 mt-0.5 flex-shrink-0 ${
                  task.priority === 'High'
                    ? 'text-red-500'
                    : task.priority === 'Medium'
                      ? 'text-yellow-500'
                      : 'text-green-500'
                }`} />
                <div className="flex-1">
                  <p className="font-semibold text-foreground">{task.task}</p>
                  <p className="text-xs text-muted-foreground mt-1">{task.dueDate}</p>
                </div>
                <span className={`text-xs font-bold px-2 py-1 rounded-lg ${
                  task.priority === 'High'
                    ? 'bg-red-100 text-red-700'
                    : task.priority === 'Medium'
                      ? 'bg-yellow-100 text-yellow-700'
                      : 'bg-green-100 text-green-700'
                }`}>
                  {task.priority}
                </span>
              </div>
            ))}
          </div>
        </section>

        {/* Actions */}
        <section className="animate-in fade-in slide-in-from-top duration-500 delay-225 space-y-3">
          <button className="w-full btn-primary py-4 font-bold">Add New Task</button>
          <button className="w-full btn-outline py-4 font-bold">View Full Analytics</button>
        </section>
      </div>

      <BottomNav />
    </div>
  )
}
