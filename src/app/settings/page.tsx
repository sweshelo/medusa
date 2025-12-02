'use client'

import { useState } from 'react'
import { signout } from '@/app/login/actions'

export default function SettingsPage() {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleSignout = async () => {
    setError(null)
    setLoading(true)

    try {
      const result = await signout()
      if (result?.error) {
        setError(result.error)
        setLoading(false)
      }
    } catch (err) {
      // Server action redirect throws, which is expected behavior
      if (err instanceof Error && err.message.includes('NEXT_REDIRECT')) {
        // This is a successful redirect, do nothing
        return
      }
      setError('ログアウト中にエラーが発生しました')
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md mx-auto">
        <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
          <h2 className="text-center text-3xl font-extrabold text-gray-900 mb-8">
            設定
          </h2>

          {error && (
            <div className="mb-4 rounded-md bg-red-50 p-4">
              <div className="text-sm text-red-800">{error}</div>
            </div>
          )}

          <div className="space-y-6">
            <div>
              <button
                type="button"
                onClick={handleSignout}
                disabled={loading}
                className="w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? 'ログアウト中...' : 'ログアウト'}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
