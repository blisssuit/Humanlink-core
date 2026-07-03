export default function TestPage() {
  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-[#1B7F4B] to-[#1B7F4B]/80">
      <div className="text-center text-white px-6">
        <h1 className="text-5xl font-bold mb-4">TerraIQ</h1>
        <p className="text-xl mb-6">The application is running successfully!</p>
        <div className="bg-white/10 rounded-lg p-6 mb-6 max-w-md">
          <p className="text-sm">If you see this page, the deployment is working correctly.</p>
          <p className="text-sm mt-3">The app is built with:</p>
          <ul className="text-sm mt-2 space-y-1">
            <li>✓ Next.js 16</li>
            <li>✓ Firebase Authentication</li>
            <li>✓ Provider-agnostic AI Service</li>
            <li>✓ Offline-first Architecture</li>
          </ul>
        </div>
        <p className="text-sm text-gray-200">Navigate to <code className="bg-black/30 px-2 py-1 rounded">/auth/login</code> to begin</p>
      </div>
    </div>
  )
}
