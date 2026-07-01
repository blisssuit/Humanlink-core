'use client'

import React from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { BottomNav } from '@/components/layout/bottom-nav'
import { mockDiseases } from '@/lib/mock-data'
import { ArrowLeft, Download, Share2, Phone, AlertCircle, CheckCircle } from 'lucide-react'

export default function DiagnosisPage() {
  const router = useRouter()
  const disease = mockDiseases[0]

  const getRiskColor = (level: string) => {
    switch (level) {
      case 'High':
        return 'bg-red-100 text-red-700 border-red-200'
      case 'Medium':
        return 'bg-yellow-100 text-yellow-700 border-yellow-200'
      case 'Low':
        return 'bg-green-100 text-green-700 border-green-200'
      default:
        return 'bg-muted text-muted-foreground'
    }
  }

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
          <h1 className="text-xl font-bold text-foreground">Diagnosis Result</h1>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-lg mx-auto px-4 py-6 space-y-6">
        {/* Image Preview */}
        <div className="premium-card-lg overflow-hidden animate-in fade-in slide-in-from-top duration-500">
          <div className="aspect-square bg-gradient-to-br from-primary/5 to-accent/5 flex items-center justify-center">
            <img
              src="https://images.unsplash.com/photo-1574943320219-553eb20e72f3?w=400&h=400&fit=crop"
              alt="Scanned leaf"
              className="w-full h-full object-cover"
            />
          </div>
        </div>

        {/* Disease Name & Confidence */}
        <section className="animate-in fade-in slide-in-from-top duration-500 delay-100">
          <div className="premium-card p-6">
            <div className="flex items-start justify-between mb-4">
              <div className="flex-1">
                <h2 className="text-3xl font-bold text-foreground mb-2">{disease.name}</h2>
                <p className="text-muted-foreground">Detected on Maize crop</p>
              </div>
              <div className="text-right">
                <div className="text-4xl font-bold text-accent mb-1">{disease.confidence}%</div>
                <p className="text-xs text-muted-foreground">Confidence</p>
              </div>
            </div>

            {/* Confidence Bar */}
            <div className="bg-muted rounded-full h-3 overflow-hidden">
              <div
                className="bg-gradient-to-r from-accent to-accent/70 h-full transition-all duration-500"
                style={{ width: `${disease.confidence}%` }}
              ></div>
            </div>
          </div>
        </section>

        {/* Risk Level */}
        <section className="animate-in fade-in slide-in-from-top duration-500 delay-150">
          <div className={`premium-card p-6 border-l-4 ${getRiskColor(disease.riskLevel)}`}>
            <div className="flex items-start gap-3">
              {disease.riskLevel === 'High' && (
                <AlertCircle className="w-6 h-6 flex-shrink-0 mt-0.5" />
              )}
              {disease.riskLevel === 'Low' && (
                <CheckCircle className="w-6 h-6 flex-shrink-0 mt-0.5" />
              )}
              <div>
                <p className="font-bold text-lg">{disease.riskLevel} Risk</p>
                <p className="text-sm mt-1">
                  {disease.riskLevel === 'High'
                    ? 'Immediate action required to prevent spread'
                    : disease.riskLevel === 'Medium'
                      ? 'Monitor closely and plan treatment'
                      : 'Continue regular monitoring'}
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Symptoms Found */}
        <section className="animate-in fade-in slide-in-from-top duration-500 delay-200">
          <h3 className="text-sm font-semibold text-muted-foreground uppercase mb-3">Symptoms Found</h3>
          <div className="space-y-2">
            {disease.symptoms.map((symptom) => (
              <div key={symptom} className="premium-card p-4 flex items-center gap-3">
                <div className="w-2 h-2 rounded-full bg-primary flex-shrink-0"></div>
                <p className="text-foreground">{symptom}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Treatment Recommendation */}
        <section className="animate-in fade-in slide-in-from-top duration-500 delay-250">
          <h3 className="text-sm font-semibold text-muted-foreground uppercase mb-3">Treatment Plan</h3>
          <div className="premium-card p-6 border-l-4 border-accent">
            <p className="text-foreground font-semibold mb-3">Recommended Treatment:</p>
            <p className="text-foreground mb-4 leading-relaxed">{disease.treatment}</p>

            <div className="bg-accent/10 rounded-lg p-4 mt-4">
              <p className="text-sm font-semibold text-foreground mb-2">Expected Recovery:</p>
              <p className="text-sm text-muted-foreground">{disease.recovery}</p>
            </div>
          </div>
        </section>

        {/* Action Buttons */}
        <section className="animate-in fade-in slide-in-from-top duration-500 delay-300">
          <div className="space-y-3">
            <button className="w-full btn-primary py-4 font-bold flex items-center justify-center gap-2">
              <Download className="w-5 h-5" />
              Save Report
            </button>

            <button className="w-full btn-outline py-4 font-bold flex items-center justify-center gap-2">
              <Share2 className="w-5 h-5" />
              Share Report
            </button>

            <button className="w-full premium-card p-4 flex items-center justify-center gap-2 hover:shadow-md transition-all font-bold text-primary">
              <Phone className="w-5 h-5" />
              Contact Agricultural Expert
            </button>
          </div>
        </section>

        {/* Similar Cases */}
        <section className="animate-in fade-in duration-500 delay-375">
          <h3 className="text-sm font-semibold text-muted-foreground uppercase mb-3">Similar Cases</h3>
          <Link
            href="#"
            className="premium-card p-4 hover:shadow-md transition-all"
          >
            <div className="flex items-start gap-3">
              <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-primary/20 to-accent/20 flex-shrink-0"></div>
              <div className="flex-1">
                <p className="font-semibold text-foreground">Early Blight Treatment Success</p>
                <p className="text-xs text-muted-foreground mt-1">
                  92% success rate with copper fungicide within 7 days
                </p>
              </div>
            </div>
          </Link>
        </section>
      </div>

      <BottomNav />
    </div>
  )
}
