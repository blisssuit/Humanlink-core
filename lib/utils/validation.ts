import { z } from 'zod'

/**
 * Auth Validation Schemas
 */

export const loginSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
})

export type LoginInput = z.infer<typeof loginSchema>

export const signupSchema = z
  .object({
    email: z.string().email('Invalid email address'),
    name: z.string().min(2, 'Name must be at least 2 characters'),
    password: z.string().min(6, 'Password must be at least 6 characters'),
    confirmPassword: z.string(),
    role: z.enum(['farmer', 'buyer', 'driver']),
    agreeToTerms: z.boolean().refine((val) => val === true, {
      message: 'You must agree to terms',
    }),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'Passwords do not match',
    path: ['confirmPassword'],
  })

export type SignupInput = z.infer<typeof signupSchema>

export const resetPasswordSchema = z.object({
  email: z.string().email('Invalid email address'),
})

export type ResetPasswordInput = z.infer<typeof resetPasswordSchema>

/**
 * Marketplace Validation Schemas
 */

export const listingSchema = z.object({
  cropName: z.string().min(2, 'Crop name required'),
  quantity: z.number().positive('Quantity must be positive'),
  unit: z.enum(['ton', 'kg', 'bag']),
  price: z.number().positive('Price must be positive'),
  grade: z.enum(['A', 'B+', 'B', 'C']),
  location: z.string().min(2, 'Location required'),
  description: z.string().max(500, 'Description too long'),
})

export type ListingInput = z.infer<typeof listingSchema>

/**
 * Booking Validation Schemas
 */

export const bookingSchema = z.object({
  pickupLocation: z.string().min(2, 'Pickup location required'),
  destination: z.string().min(2, 'Destination required'),
  cargoWeight: z.number().positive('Weight must be positive'),
  cargoType: z.string().min(2, 'Cargo type required'),
})

export type BookingInput = z.infer<typeof bookingSchema>

/**
 * Profile Validation Schemas
 */

export const profileSchema = z.object({
  name: z.string().min(2, 'Name required'),
  phone: z.string().regex(/^\+?[0-9]{10,}$/, 'Valid phone number required'),
  farmName: z.string().optional(),
  farmLocation: z.string().optional(),
  farmSize: z.number().positive().optional(),
  soilType: z.string().optional(),
})

export type ProfileInput = z.infer<typeof profileSchema>

/**
 * Verification Document Schemas
 */

export const verificationSchema = z.object({
  type: z.enum(['id', 'farming_license', 'driver_license', 'farm_proof', 'insurance']),
  document: z
    .instanceof(File)
    .refine((file) => file.size <= 10 * 1024 * 1024, 'File size must be less than 10MB')
    .refine(
      (file) => ['image/jpeg', 'image/png', 'image/webp', 'application/pdf'].includes(file.type),
      'Only JPEG, PNG, WebP, and PDF files are allowed'
    ),
})

export type VerificationInput = z.infer<typeof verificationSchema>

/**
 * Image Upload Validation
 */

export const imageUploadSchema = z.object({
  image: z
    .instanceof(File)
    .refine((file) => file.size <= 10 * 1024 * 1024, 'File size must be less than 10MB')
    .refine(
      (file) => ['image/jpeg', 'image/png', 'image/webp'].includes(file.type),
      'Only JPEG, PNG, and WebP images are allowed'
    ),
})

export type ImageUploadInput = z.infer<typeof imageUploadSchema>

/**
 * Error Formatter
 */

export function formatValidationError(error: z.ZodError): Record<string, string> {
  const formatted: Record<string, string> = {}

  error.errors.forEach((err) => {
    const path = err.path.join('.')
    formatted[path] = err.message
  })

  return formatted
}
