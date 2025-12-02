import type { Metadata } from 'next'

import { Headline } from '@/components/common/headline'
import { ComingSoonCard } from '@/components/subscription/purchase/coming-soon-card'
import { PlanCard } from '@/components/subscription/purchase/plan-card'
import { getActiveSubscriptionPlans } from '@/service/stripe/products'

export const metadata: Metadata = {
  title: 'サブスクリプション',
}

export const revalidate = 3600 // 1時間ごとに再検証

export default async function Page() {
  const plans = await getActiveSubscriptionPlans()

  // 価格を日本円形式でフォーマット
  const formatPrice = (amount: number, currency: string, interval: string) => {
    const formattedAmount = new Intl.NumberFormat('ja-JP', {
      style: 'currency',
      currency: currency.toUpperCase(),
      minimumFractionDigits: 0,
    }).format(amount)

    const intervalText =
      {
        month: '/月',
        year: '/年',
        week: '/週',
        day: '/日',
      }[interval] || ''

    return `${formattedAmount}${intervalText}`
  }

  return (
    <div className="text-center py-2 mb-2">
      <Headline title="サブスクリプションプラン" />

      <div className="bg-white rounded-lg container mx-auto px-4 py-8">
        <div className="flex flex-col gap-6 max-w-2xl mx-auto">
          <p className="text-sm text-gray-600">
            閻魔帳の有料サブスクリプションに加入して、運営を支援することができます。
          </p>
          {/* アクティブなプラン */}
          {plans
            .sort((a, b) => a.price - b.price)
            .map((plan) => (
              <PlanCard
                key={plan.id}
                title={plan.name}
                price={formatPrice(plan.price, plan.currency, plan.interval)}
                description={plan.description}
                stripeUrl={plan.checkoutUrl}
              />
            ))}
        </div>
      </div>
    </div>
  )
}
