import { CheckCircle2 } from 'lucide-react'
import { UserProfile } from '@/lib/types/database'

interface VerifiedBadgeProps {
  userProfile: UserProfile
  showTooltip?: boolean
  size?: 'sm' | 'md' | 'lg'
}

/**
 * Verified Badge Component
 * Displays verification status with visual indicator
 */
export function VerifiedBadge({
  userProfile,
  showTooltip = true,
  size = 'md',
}: VerifiedBadgeProps) {
  if (!userProfile.isVerified) {
    return null
  }

  const sizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-5 h-5',
    lg: 'w-6 h-6',
  }

  const textSizeClasses = {
    sm: 'text-xs',
    md: 'text-sm',
    lg: 'text-base',
  }

  const roleBadgeText =
    userProfile.role === 'farmer'
      ? 'Verified Farmer'
      : userProfile.role === 'driver'
        ? 'Verified Driver'
        : 'Verified'

  return (
    <div className="flex items-center gap-1">
      <CheckCircle2
        className={`${sizeClasses[size]} text-green-600 flex-shrink-0`}
        fill="currentColor"
      />
      {showTooltip && (
        <span className={`${textSizeClasses[size]} text-green-600 font-semibold`}>
          {roleBadgeText}
        </span>
      )}
    </div>
  )
}

/**
 * Inline Verification Status
 * Shows as small indicator next to name
 */
export function VerificationIndicator({ userProfile }: { userProfile: UserProfile }) {
  if (!userProfile.isVerified) {
    return null
  }

  return (
    <span
      className="inline-flex items-center gap-1 ml-2 px-2 py-1 rounded-full bg-green-100 text-green-700 text-xs font-semibold"
      title={`Verified on ${new Date(userProfile.verificationDate || 0).toLocaleDateString()}`}
    >
      <CheckCircle2 className="w-3 h-3" />
      ✓
    </span>
  )
}

/**
 * Verification Status Card
 * Shows detailed verification information
 */
export function VerificationStatusCard({ userProfile }: { userProfile: UserProfile }) {
  const pendingDocuments = userProfile.verificationDocuments?.filter(
    (doc) => doc.status === 'pending'
  )
  const rejectedDocuments = userProfile.verificationDocuments?.filter(
    (doc) => doc.status === 'rejected'
  )

  if (userProfile.isVerified) {
    return (
      <div className="premium-card p-4 border-l-4 border-green-600 bg-green-50">
        <div className="flex items-start gap-3">
          <CheckCircle2 className="w-5 h-5 text-green-600 flex-shrink-0 mt-1" />
          <div>
            <p className="font-semibold text-green-900">Verification Complete</p>
            <p className="text-sm text-green-700 mt-1">
              Your account has been verified on{' '}
              {new Date(userProfile.verificationDate || 0).toLocaleDateString()}
            </p>
          </div>
        </div>
      </div>
    )
  }

  if (pendingDocuments && pendingDocuments.length > 0) {
    return (
      <div className="premium-card p-4 border-l-4 border-yellow-500 bg-yellow-50">
        <div className="flex items-start gap-3">
          <div className="w-5 h-5 rounded-full border-2 border-yellow-500 mt-1" />
          <div>
            <p className="font-semibold text-yellow-900">Pending Verification</p>
            <p className="text-sm text-yellow-700 mt-1">
              We&apos;re reviewing {pendingDocuments.length} document(s). This usually takes 24-48 hours.
            </p>
          </div>
        </div>
      </div>
    )
  }

  if (rejectedDocuments && rejectedDocuments.length > 0) {
    return (
      <div className="premium-card p-4 border-l-4 border-red-500 bg-red-50">
        <div className="flex items-start gap-3">
          <div className="w-5 h-5 rounded-full border-2 border-red-500 mt-1" />
          <div>
            <p className="font-semibold text-red-900">Verification Issue</p>
            <p className="text-sm text-red-700 mt-1">
              {rejectedDocuments[0]?.rejectionReason ||
                'Some documents were rejected. Please resubmit with corrections.'}
            </p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="premium-card p-4 border-l-4 border-blue-500 bg-blue-50">
      <div className="flex items-start gap-3">
        <div className="w-5 h-5 rounded-full border-2 border-blue-500 mt-1" />
        <div>
          <p className="font-semibold text-blue-900">Ready to Verify</p>
          <p className="text-sm text-blue-700 mt-1">
            Submit your documents to get verified and build trust with other users.
          </p>
        </div>
      </div>
    </div>
  )
}
