import type { Metadata } from 'next'

import { Headline } from '@/components/common/headline'
import { PlanCard } from '@/components/subscription/purchase/plan-card'
import { getActiveSubscriptionPlans } from '@/service/stripe/products'
import { getUserSubscription } from '@/service/supabase/subscription'

export const metadata: Metadata = {
  title: 'サブスクリプション',
}

export const revalidate = 3600 // 1時間ごとに再検証

export default async function Page() {
  const plans = await getActiveSubscriptionPlans()
  const subscription = await getUserSubscription()

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
          <div>
            <p className="text-sm text-gray-600">
              閻魔帳の有料サブスクリプションに加入して、運営を支援することができます。
            </p>
            <p className="text-sm text-gray-600 m-1">
              決済は外部ページで行われ、閻魔帳には決済情報は保存されません。
            </p>
          </div>

          {/* 現在のサブスクリプション状態 */}
          {subscription && (
            <div className="p-6 bg-green-50 border-2 border-green-200 rounded-lg">
              <h3 className="text-lg font-bold text-green-800 mb-2">
                アクティブなサブスクリプション
              </h3>
              <div className="space-y-2 text-sm text-green-700">
                <p>
                  ステータス:{' '}
                  <span className="font-semibold">
                    {subscription.status === 'active'
                      ? 'アクティブ'
                      : 'トライアル中'}
                  </span>
                </p>
                <p>
                  次回更新日:{' '}
                  <span className="font-semibold">
                    {new Date(subscription.currentPeriodEnd).toLocaleDateString(
                      'ja-JP',
                    )}
                  </span>
                </p>
                {subscription.cancelAtPeriodEnd && (
                  <p className="text-orange-600 font-semibold">
                    このサブスクリプションは次回更新日にキャンセルされます
                  </p>
                )}
              </div>
            </div>
          )}
          {/* アクティブなプラン */}
          {plans
            .sort((a, b) => a.price - b.price)
            .map((plan) => (
              <PlanCard
                key={plan.id}
                title={plan.name}
                price={formatPrice(plan.price, plan.currency, plan.interval)}
                description={plan.description}
                features={plan.features}
                priceId={plan.priceId}
              />
            ))}
        </div>
      </div>
    </div>
  )
}
