'use client'

import { useState } from 'react'
import { toast } from 'react-toastify'
import { signout } from '@/app/login/actions'

export const SignOut = () => {
  const [loading, setLoading] = useState(false)

  const handleSignout = async () => {
    setLoading(true)

    try {
      const result = await signout()
      if (result?.error) {
        setLoading(false)
      }
    } catch (err) {
      // Server action redirect throws, which is expected behavior
      if (err instanceof Error && err.message.includes('NEXT_REDIRECT')) {
        // This is a successful redirect, do nothing
        return
      }
      toast('ログアウト中にエラーが発生しました', { type: 'error' })
      setLoading(false)
    }
  }

  return (
    <button
      type="button"
      onClick={handleSignout}
      disabled={loading}
      className="w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-red-800 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 disabled:opacity-50 disabled:cursor-not-allowed"
    >
      {loading ? 'ログアウト中...' : 'ログアウト'}
    </button>
  )
}
