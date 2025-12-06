'use client'

import { useState } from 'react'

interface MagicLinkFormProps {
  onSubmit: (
    formData: FormData,
  ) => Promise<{ error?: string; success?: boolean }>
}

export function MagicLinkForm({ onSubmit }: MagicLinkFormProps) {
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setError(null)
    setLoading(true)

    const formData = new FormData(e.currentTarget)

    try {
      const result = await onSubmit(formData)
      if (result?.error) {
        setError(result.error)
      } else if (result?.success) {
        setSuccess(true)
      }
    } catch (_err) {
      setError('予期しないエラーが発生しました')
    } finally {
      setLoading(false)
    }
  }

  if (success) {
    return (
      <div className="rounded-md bg-blue-50 p-4">
        <div className="text-sm text-blue-800">
          マジックリンクを送信しました。
          <br />
          メールをご確認ください。
        </div>
      </div>
    )
  }

  return (
    <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
      {error && (
        <div className="rounded-md bg-red-50 p-4">
          <div className="text-sm text-red-800">{error}</div>
        </div>
      )}

      <div className="text-xs text-gray-700 text-center">
        メールに転送されたリンクをクリックするだけで ログインできます
      </div>

      <div>
        <label htmlFor="email" className="sr-only">
          メールアドレス
        </label>
        <input
          id="email"
          name="email"
          type="email"
          autoComplete="email"
          required
          className="appearance-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm"
          placeholder="メールアドレス"
        />
      </div>

      <div>
        <button
          type="submit"
          disabled={loading}
          className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? '送信中...' : 'マジックリンクを送信'}
        </button>
      </div>
    </form>
  )
}
