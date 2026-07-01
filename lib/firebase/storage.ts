import { ref, uploadBytes, getDownloadURL, deleteObject } from 'firebase/storage'
import { storage } from './config'

// Constants
const MAX_FILE_SIZE = 10 * 1024 * 1024 // 10MB
const ALLOWED_MIME_TYPES = ['image/jpeg', 'image/png', 'image/webp']
const COMPRESSION_QUALITY = 0.8
const MAX_DIMENSION = 2000

/**
 * Compress image before upload
 * Returns blob with reduced size
 */
export async function compressImage(file: File): Promise<Blob> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    
    reader.onload = (e) => {
      const img = new Image()
      
      img.onload = () => {
        // Create canvas and resize if needed
        const canvas = document.createElement('canvas')
        let width = img.width
        let height = img.height
        
        if (width > MAX_DIMENSION || height > MAX_DIMENSION) {
          const ratio = Math.min(MAX_DIMENSION / width, MAX_DIMENSION / height)
          width = Math.round(width * ratio)
          height = Math.round(height * ratio)
        }
        
        canvas.width = width
        canvas.height = height
        
        const ctx = canvas.getContext('2d')
        if (!ctx) reject(new Error('Failed to get canvas context'))
        
        ctx!.drawImage(img, 0, 0, width, height)
        
        // Convert to blob with compression
        canvas.toBlob(
          (blob) => {
            if (!blob) reject(new Error('Failed to compress image'))
            resolve(blob)
          },
          'image/jpeg',
          COMPRESSION_QUALITY
        )
      }
      
      img.onerror = () => reject(new Error('Failed to load image'))
      img.src = e.target?.result as string
    }
    
    reader.onerror = () => reject(new Error('Failed to read file'))
    reader.readAsDataURL(file)
  })
}

/**
 * Validate image file
 */
export function validateImageFile(file: File): { valid: boolean; error?: string } {
  // Check mime type
  if (!ALLOWED_MIME_TYPES.includes(file.type)) {
    return { valid: false, error: 'Invalid file type. Only JPEG, PNG, and WebP are allowed.' }
  }
  
  // Check file size
  if (file.size > MAX_FILE_SIZE) {
    return { valid: false, error: 'File size exceeds 10MB limit.' }
  }
  
  return { valid: true }
}

/**
 * Upload image to Firebase Storage
 * Automatically compresses before upload
 */
export async function uploadImage(
  file: File,
  path: string
): Promise<{ url: string; originalSize: number; compressedSize: number }> {
  try {
    // Validate file
    const validation = validateImageFile(file)
    if (!validation.valid) {
      throw new Error(validation.error)
    }
    
    if (!storage) throw new Error('Firebase Storage not initialized')
    
    // Compress image
    console.log('[v0] Compressing image...', file.name)
    const compressedBlob = await compressImage(file)
    
    // Create unique filename
    const timestamp = Date.now()
    const randomStr = Math.random().toString(36).substring(2, 8)
    const filename = `${timestamp}-${randomStr}-${file.name.split('.')[0]}.jpg`
    const storagePath = `${path}/${filename}`
    
    // Upload to Firebase Storage
    console.log('[v0] Uploading to Firebase Storage...', storagePath)
    const storageRef = ref(storage, storagePath)
    const snapshot = await uploadBytes(storageRef, compressedBlob, {
      contentType: 'image/jpeg',
    })
    
    // Get download URL
    const url = await getDownloadURL(snapshot.ref)
    
    console.log('[v0] Image uploaded successfully')
    return {
      url,
      originalSize: file.size,
      compressedSize: compressedBlob.size,
    }
  } catch (error) {
    console.error('[v0] Failed to upload image:', error)
    throw error
  }
}

/**
 * Upload crop scan image
 */
export async function uploadCropScanImage(file: File, userId: string) {
  return uploadImage(file, `crop-scans/${userId}`)
}

/**
 * Upload verification document
 */
export async function uploadVerificationDocument(file: File, userId: string, type: string) {
  return uploadImage(file, `verification/${userId}/${type}`)
}

/**
 * Upload profile image
 */
export async function uploadProfileImage(file: File, userId: string) {
  return uploadImage(file, `profiles/${userId}`)
}

/**
 * Upload marketplace listing image
 */
export async function uploadListingImage(file: File, userId: string) {
  return uploadImage(file, `listings/${userId}`)
}

/**
 * Delete file from Firebase Storage
 */
export async function deleteStorageFile(fileUrl: string) {
  try {
    if (!storage) throw new Error('Firebase Storage not initialized')
    
    // Extract path from download URL
    const urlPattern = /\/o\/(.+?)\?/
    const match = fileUrl.match(urlPattern)
    
    if (!match || !match[1]) {
      throw new Error('Invalid file URL')
    }
    
    const filePath = decodeURIComponent(match[1])
    const fileRef = ref(storage, filePath)
    
    await deleteObject(fileRef)
    console.log('[v0] File deleted successfully')
  } catch (error) {
    console.error('[v0] Failed to delete file:', error)
    throw error
  }
}

/**
 * Get image dimensions
 */
export function getImageDimensions(file: File): Promise<{ width: number; height: number }> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    
    reader.onload = (e) => {
      const img = new Image()
      
      img.onload = () => {
        resolve({ width: img.width, height: img.height })
      }
      
      img.onerror = () => reject(new Error('Failed to load image'))
      img.src = e.target?.result as string
    }
    
    reader.onerror = () => reject(new Error('Failed to read file'))
    reader.readAsDataURL(file)
  })
}
