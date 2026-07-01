import { uploadVerificationDocument } from '@/lib/firebase/storage'
import { updateUserProfile, addVerificationDocument } from '@/lib/firebase/db'
import { VerificationDocument, UserProfile } from '@/lib/types/database'

/**
 * Verification Service
 * Handles farmer and driver verification with document uploads
 */

export type VerificationType = 'id' | 'farming_license' | 'driver_license' | 'farm_proof' | 'insurance'

export interface VerificationSubmission {
  type: VerificationType
  file: File
  userId: string
}

export interface VerificationStatus {
  type: VerificationType
  status: 'pending' | 'approved' | 'rejected'
  uploadedAt?: number
  approvedAt?: number
  rejectionReason?: string
}

/**
 * Submit verification document for approval
 */
export async function submitVerificationDocument(
  userId: string,
  verificationSubmission: VerificationSubmission
): Promise<VerificationDocument> {
  try {
    console.log('[v0] Submitting verification document:', verificationSubmission.type)

    // Upload document to Firebase Storage
    const { url, originalSize, compressedSize } = await uploadVerificationDocument(
      verificationSubmission.file,
      userId,
      verificationSubmission.type
    )

    // Create verification document record
    const verificationDoc: VerificationDocument = {
      type: verificationSubmission.type,
      url,
      uploadedAt: Date.now(),
      status: 'pending',
    }

    // Add to user's verification documents
    await addVerificationDocument(userId, verificationDoc)

    console.log('[v0] Verification document submitted:', verificationDoc)

    return verificationDoc
  } catch (error) {
    console.error('[v0] Failed to submit verification document:', error)
    throw error
  }
}

/**
 * Check if user can be verified (has all required docs)
 */
export function canBeVerified(
  role: string,
  verificationDocuments: VerificationDocument[] = []
): boolean {
  if (role === 'farmer') {
    // Farmers need ID and farm proof
    return (
      verificationDocuments.some((doc) => doc.type === 'id' && doc.status === 'approved') &&
      verificationDocuments.some((doc) => doc.type === 'farm_proof' && doc.status === 'approved')
    )
  }

  if (role === 'driver') {
    // Drivers need license and insurance
    return (
      verificationDocuments.some(
        (doc) => doc.type === 'driver_license' && doc.status === 'approved'
      ) && verificationDocuments.some((doc) => doc.type === 'insurance' && doc.status === 'approved')
    )
  }

  if (role === 'buyer') {
    // Buyers don't need verification for basic operations
    return true
  }

  return false
}

/**
 * Get required verification documents for a role
 */
export function getRequiredDocuments(role: string): VerificationType[] {
  switch (role) {
    case 'farmer':
      return ['id', 'farm_proof']
    case 'driver':
      return ['driver_license', 'insurance']
    case 'buyer':
      return []
    default:
      return []
  }
}

/**
 * Get verification status for user
 */
export function getVerificationStatus(
  userProfile: UserProfile
): {
  isVerified: boolean
  completedDocuments: VerificationType[]
  pendingDocuments: VerificationType[]
  rejectedDocuments: VerificationType[]
  requiredDocuments: VerificationType[]
  progress: number // 0-100
} {
  const requiredDocuments = getRequiredDocuments(userProfile.role)
  const verificationDocs = userProfile.verificationDocuments || []

  const completedDocuments = verificationDocs
    .filter((doc) => doc.status === 'approved')
    .map((doc) => doc.type)

  const pendingDocuments = verificationDocs
    .filter((doc) => doc.status === 'pending')
    .map((doc) => doc.type)

  const rejectedDocuments = verificationDocs
    .filter((doc) => doc.status === 'rejected')
    .map((doc) => doc.type)

  const progress =
    requiredDocuments.length > 0
      ? Math.round((completedDocuments.length / requiredDocuments.length) * 100)
      : 100

  return {
    isVerified: userProfile.isVerified,
    completedDocuments,
    pendingDocuments,
    rejectedDocuments,
    requiredDocuments,
    progress,
  }
}

/**
 * Get document status
 */
export function getDocumentStatus(
  userProfile: UserProfile,
  docType: VerificationType
): 'not_submitted' | 'pending' | 'approved' | 'rejected' {
  const doc = userProfile.verificationDocuments?.find((d) => d.type === docType)

  if (!doc) return 'not_submitted'
  return doc.status as 'pending' | 'approved' | 'rejected'
}

/**
 * Approve verification document (admin only)
 */
export async function approveVerificationDocument(userId: string, docType: VerificationType) {
  try {
    const userProfile = await (
      await import('@/lib/firebase/db').then((m) => m.getUserProfile(userId))
    )

    if (!userProfile) throw new Error('User not found')

    const updatedDocs = userProfile.verificationDocuments?.map((doc) =>
      doc.type === docType ? { ...doc, status: 'approved' } : doc
    )

    // Check if user can now be verified
    const isVerified = canBeVerified(userProfile.role, updatedDocs)

    await updateUserProfile(userId, {
      verificationDocuments: updatedDocs,
      isVerified,
      verificationDate: isVerified ? Date.now() : undefined,
    })

    console.log('[v0] Verification document approved:', docType)
  } catch (error) {
    console.error('[v0] Failed to approve verification document:', error)
    throw error
  }
}

/**
 * Reject verification document (admin only)
 */
export async function rejectVerificationDocument(userId: string, docType: VerificationType, reason: string) {
  try {
    const userProfile = await (
      await import('@/lib/firebase/db').then((m) => m.getUserProfile(userId))
    )

    if (!userProfile) throw new Error('User not found')

    const updatedDocs = userProfile.verificationDocuments?.map((doc) =>
      doc.type === docType
        ? { ...doc, status: 'rejected', rejectionReason: reason }
        : doc
    )

    await updateUserProfile(userId, {
      verificationDocuments: updatedDocs,
      isVerified: false,
    })

    console.log('[v0] Verification document rejected:', docType)
  } catch (error) {
    console.error('[v0] Failed to reject verification document:', error)
    throw error
  }
}

/**
 * Get verification badge text
 */
export function getVerificationBadgeText(userProfile: UserProfile): string {
  if (!userProfile.isVerified) return ''

  switch (userProfile.role) {
    case 'farmer':
      return 'Verified Farmer'
    case 'driver':
      return 'Verified Driver'
    case 'buyer':
      return 'Verified Buyer'
    case 'admin':
      return 'Admin'
    case 'expert':
      return 'Agricultural Expert'
    default:
      return 'Verified'
  }
}
