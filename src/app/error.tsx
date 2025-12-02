'use client'

import { useEffect } from 'react'

import { Revalidater } from '@/components/revalidater'

export default function ErrorPage({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    // エラーをコンソールに記録
    console.error('エラーが発生しました:', error)
  }, [error])

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="max-w-md w-full space-y-8 p-8">
        <div className="text-center">
          <h1 className="text-6xl font-bold text-gray-900 mb-4">😵</h1>
          <h2 className="text-3xl font-bold text-gray-900 mb-2">
            エラーが発生しました
          </h2>
          <p className="text-gray-600 mb-4">
            ページの読み込み中に問題が発生しました。
          </p>
          {error.message && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-4">
              <p className="text-sm text-red-800 font-mono">{error.message}</p>
            </div>
          )}
        </div>

        <div className="space-y-4">
          <button
            onClick={reset}
            className="w-full bg-blue-500 hover:bg-blue-600 text-white font-bold py-3 px-4 rounded-lg transition-colors"
            type="button"
          >
            もう一度試す
          </button>

          <div className="text-center text-sm text-gray-500">または</div>

          <Revalidater />

          <div className="text-center">
            <a
              href="/"
              className="text-blue-500 hover:text-blue-600 text-sm underline"
            >
              トップページに戻る
            </a>
          </div>
        </div>

        {error.digest && (
          <div className="text-center text-xs text-gray-400 mt-4">
            エラーID: {error.digest}
          </div>
        )}
      </div>
    </div>
  )
}
