interface PlanCardProps {
  title: string
  price: string
  description?: string | null
  features?: string[]
  stripeUrl: string
}

export const PlanCard = ({
  title,
  price,
  description,
  features,
  stripeUrl,
}: PlanCardProps) => {
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

      {/* 決済ボタン */}
      <div className="mt-6">
        <a
          href={stripeUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="block w-full py-3 px-6 text-center text-white font-bold bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors duration-200"
        >
          購入する
        </a>
      </div>
    </div>
  )
}
