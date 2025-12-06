import { type NextRequest, NextResponse } from 'next/server'
import Stripe from 'stripe'
import { createClient } from '@/service/supabase/server'

if (!process.env.STRIPE_SECRET_KEY) {
  throw new Error('STRIPE_SECRET_KEY is not set in environment variables')
}

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
  apiVersion: '2025-11-17.clover',
})

export async function POST(_request: NextRequest) {
  try {
    const supabase = await createClient()

    // ユーザー認証の確認
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser()

    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // アクティブな御布施を取得
    const { data: subscription, error: subError } = await supabase
      .from('subscriptions')
      .select('stripe_subscription_id, cancel_at_period_end')
      .eq('user_id', user.id)
      .in('status', ['active', 'trialing'])
      .single()

    if (subError || !subscription) {
      return NextResponse.json(
        { error: 'アクティブな御布施が見つかりません' },
        { status: 404 },
      )
    }

    // すでに解約予約済みの場合
    if (subscription.cancel_at_period_end) {
      return NextResponse.json(
        { error: 'この御布施は既に納入取りやめ予約されています' },
        { status: 400 },
      )
    }

    // Stripe APIで御布施を期間終了時に解約するよう設定
    await stripe.subscriptions.update(subscription.stripe_subscription_id, {
      cancel_at_period_end: true,
    })

    // Webhookで自動的にデータベースが更新されるため、ここでは更新しない

    return NextResponse.json({
      success: true,
      message: '御布施の納入を取りやめました',
    })
  } catch (error) {
    console.error('Subscription cancellation error:', error)
    return NextResponse.json(
      { error: '御布施の納入の取りやめに失敗しました' },
      { status: 500 },
    )
  }
}
