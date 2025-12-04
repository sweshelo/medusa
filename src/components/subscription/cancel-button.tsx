'use client'

import { useState } from 'react'

export const CancelSubscriptionButton = () => {
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [showConfirm, setShowConfirm] = useState(false)

  const handleCancel = async () => {
    setIsLoading(true)
    setError(null)

    try {
      const response = await fetch('/api/subscription/cancel', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || '御布施の納入取りやめに失敗しました')
      }

      // 成功した場合はページをリロードして最新の状態を表示
      window.location.reload()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'エラーが発生しました')
      setIsLoading(false)
      setShowConfirm(false)
    }
  }

  if (!showConfirm) {
    return (
      <div className="mt-4">
        <button
          type="button"
          onClick={() => setShowConfirm(true)}
          className="w-full py-2 px-4 text-sm text-red-600 border border-red-600 rounded-lg bg-red-100 hover:bg-red-200 transition-colors duration-200"
        >
          御布施の納入をやめる
        </button>
        {error && (
          <div className="mt-2 p-3 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-sm text-red-600">{error}</p>
          </div>
        )}
      </div>
    )
  }

  return (
    <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-lg">
      <h4 className="text-sm font-bold text-red-800 mb-2">
        本当に納入を取りやめますか？
      </h4>
      <p className="text-xs text-red-700 mb-4">
        御布施の納入を取りやめると、次回更新日まで御礼を利用できますが、それ以降は自動的に終了します。
      </p>
      <div className="flex gap-2">
        <button
          type="button"
          onClick={handleCancel}
          disabled={isLoading}
          className="flex-1 py-2 px-4 text-sm text-white bg-red-600 hover:bg-red-700 rounded-lg transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isLoading ? '処理中...' : '御布施の納入をやめる'}
        </button>
        <button
          type="button"
          onClick={() => {
            setShowConfirm(false)
            setError(null)
          }}
          disabled={isLoading}
          className="flex-1 py-2 px-4 text-sm text-gray-700 bg-white border border-gray-300 hover:bg-gray-50 rounded-lg transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          キャンセル
        </button>
      </div>
      {error && (
        <div className="mt-2 p-3 bg-red-50 border border-red-200 rounded-lg">
          <p className="text-sm text-red-600">{error}</p>
        </div>
      )}
    </div>
  )
}
