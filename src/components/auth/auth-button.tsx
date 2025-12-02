'use client'

import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useState } from 'react'

import { signout } from '@/app/login/actions'

interface AuthButtonProps {
  user: {
    email?: string
  } | null
}

export function AuthButton({ user }: AuthButtonProps) {
  const _router = useRouter()
  const [loading, setLoading] = useState(false)

  const handleSignout = async () => {
    setLoading(true)
    try {
      await signout()
    } catch (error) {
      console.error('Sign out error:', error)
      setLoading(false)
    }
  }

  if (!user) {
    return (
      <Link
        href="/login"
        className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 transition-colors"
      >
        ログイン
      </Link>
    )
  }

  return (
    <div className="flex items-center gap-3">
      <span className="text-white text-sm hidden sm:inline">{user.email}</span>
      <button
        type="button"
        onClick={handleSignout}
        disabled={loading}
        className="px-4 py-2 text-sm font-medium text-white bg-red-600 rounded-md hover:bg-red-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {loading ? 'ログアウト中...' : 'ログアウト'}
      </button>
    </div>
  )
}
