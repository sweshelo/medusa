'use client'

import { useState } from 'react'

interface PlanCardProps {
  title: string
  price: string
  description?: string | null
  features?: string[]
  priceId: string
}

export const PlanCard = ({
  title,
  price,
  description,
  features,
  priceId,
}: PlanCardProps) => {
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleCheckout = async () => {
    setIsLoading(true)
    setError(null)

    try {
      const response = await fetch('/api/checkout/session', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ priceId }),
      })

      const data = await response.json()

      if (!response.ok) {
        if (response.status === 401) {
          // 未ログインの場合はログインページへ
          window.location.href = '/login'
          return
        }
        throw new Error(data.error || '決済セッションの作成に失敗しました')
      }

      // Stripe Checkoutページへリダイレクト
      if (data.url) {
        window.location.href = data.url
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'エラーが発生しました')
      setIsLoading(false)
    }
  }
  return (
    <div className="w-full p-6 bg-white rounded-lg shadow-lg border-2 border-gray-200">
      {/* プランタイトル */}
      <div className="mb-4 text-center">
        <h3 className="text-2xl font-bold text-gray-800">{title}</h3>
      </div>

      {/* 価格 */}
      <div className="mb-6 text-center">
        <p className="text-4xl font-extrabold text-blue-600">{price}</p>
      </div>

      {/* 説明 */}
      {description && (
        <div className="mb-6 text-center">
          <p className="text-gray-600">{description}</p>
        </div>
      )}

      {/* 特徴リスト */}
      {features && features.length > 0 && (
        <div className="mb-6">
          <ul className="space-y-3">
            {features.map((feature) => (
              <li key={feature} className="flex items-start">
                <span className="text-green-500 mr-2 mt-1">✓</span>
                <span className="text-gray-700">{feature}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* エラーメッセージ */}
      {error && (
        <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
          <p className="text-sm text-red-600">{error}</p>
        </div>
      )}

      {/* 決済ボタン */}
      <div className="mt-6">
        <button
          type="button"
          onClick={handleCheckout}
          disabled={isLoading}
          className="block w-full py-3 px-6 text-center text-white font-bold bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isLoading ? '処理中...' : '納入する'}
        </button>
      </div>
    </div>
  )
}
