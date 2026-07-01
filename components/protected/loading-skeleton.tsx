'use client'

export function LoadingSkeleton() {
  return (
    <div className="space-y-4 animate-pulse">
      {/* Header skeleton */}
      <div className="h-20 bg-muted rounded-lg" />

      {/* Content skeleton */}
      <div className="space-y-4">
        <div className="h-40 bg-muted rounded-lg" />
        <div className="h-40 bg-muted rounded-lg" />
        <div className="h-40 bg-muted rounded-lg" />
      </div>
    </div>
  )
}

export function CardSkeleton() {
  return (
    <div className="premium-card p-6 animate-pulse">
      <div className="h-4 bg-muted rounded w-3/4 mb-4" />
      <div className="h-4 bg-muted rounded w-1/2" />
    </div>
  )
}

export function TableRowSkeleton() {
  return (
    <tr>
      <td className="px-4 py-3">
        <div className="h-4 bg-muted rounded" />
      </td>
      <td className="px-4 py-3">
        <div className="h-4 bg-muted rounded" />
      </td>
      <td className="px-4 py-3">
        <div className="h-4 bg-muted rounded w-2/3" />
      </td>
    </tr>
  )
}

export function FormSkeleton() {
  return (
    <div className="space-y-4">
      {[1, 2, 3].map((i) => (
        <div key={i} className="space-y-2">
          <div className="h-4 bg-muted rounded w-1/4" />
          <div className="h-10 bg-muted rounded" />
        </div>
      ))}
    </div>
  )
}
