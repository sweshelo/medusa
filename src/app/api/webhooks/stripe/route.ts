import { createClient } from '@supabase/supabase-js'
import { type NextRequest, NextResponse } from 'next/server'
import Stripe from 'stripe'
import type { Database } from '@/types/database.types'

if (!process.env.STRIPE_SECRET_KEY) {
  throw new Error('STRIPE_SECRET_KEY is not set in environment variables')
}

if (!process.env.STRIPE_WEBHOOK_SECRET) {
  throw new Error('STRIPE_WEBHOOK_SECRET is not set in environment variables')
}

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
  apiVersion: '2025-11-17.clover',
})

// Service roleクライアントを使用（RLSをバイパス）
const supabaseAdmin = createClient<Database>(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!,
)

export async function POST(request: NextRequest) {
  const body = await request.text()
  const signature = request.headers.get('stripe-signature')

  console.log('Webhook Handling')

  if (!signature) {
    return NextResponse.json(
      { error: 'Missing stripe-signature header' },
      { status: 400 },
    )
  }

  let event: Stripe.Event

  try {
    event = stripe.webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET!,
    )
  } catch (error) {
    console.error('Webhook signature verification failed:', error)
    return NextResponse.json({ error: 'Invalid signature' }, { status: 400 })
  }

  try {
    switch (event.type) {
      case 'checkout.session.completed': {
        const session = event.data.object as Stripe.Checkout.Session
        await handleCheckoutSessionCompleted(session)
        break
      }

      case 'customer.subscription.created':
      case 'customer.subscription.updated': {
        const subscription = event.data.object as Stripe.Subscription
        await handleSubscriptionUpdate(subscription)
        break
      }

      case 'customer.subscription.deleted': {
        const subscription = event.data.object as Stripe.Subscription
        await handleSubscriptionDeleted(subscription)
        break
      }

      default:
        console.log(`Unhandled event type: ${event.type}`)
    }

    return NextResponse.json({ received: true })
  } catch (error) {
    console.error('Error processing webhook:', error)
    return NextResponse.json(
      { error: 'Webhook processing failed' },
      { status: 500 },
    )
  }
}

async function handleCheckoutSessionCompleted(
  session: Stripe.Checkout.Session,
) {
  const userId =
    session.client_reference_id || session.metadata?.supabase_user_id

  if (!userId) {
    console.error('❌ No user ID found in checkout session')
    return
  }

  // DB更新はcustomer.subscription.createdイベントで行う
  console.log('✅ Checkout completed for user:', userId)
  console.log('⏳ Waiting for customer.subscription.created event to update DB')
  console.log('📋 Subscription ID:', session.subscription)
}

async function handleSubscriptionUpdate(subscription: Stripe.Subscription) {
  // SubscriptionのmetadataからユーザーIDを取得
  const userId = subscription.metadata?.supabase_user_id

  if (!userId) {
    // metadataにない場合は既存のレコードから取得を試みる
    const existingUserId = await getUserIdFromCustomer(
      subscription.customer as string,
    )
    if (!existingUserId) {
      console.error('❌ No user ID found for subscription:', subscription.id)
      console.error('   Customer:', subscription.customer)
      console.error('   Metadata:', subscription.metadata)
      return
    }
    console.log('✅ Found user ID from existing record:', existingUserId)
    await upsertSubscription(existingUserId, subscription)
    return
  }

  console.log('✅ Found user ID in subscription metadata:', userId)
  await upsertSubscription(userId, subscription)
}

async function handleSubscriptionDeleted(subscription: Stripe.Subscription) {
  // サブスクリプションをキャンセル状態に更新
  const { error } = await supabaseAdmin
    .from('subscriptions')
    .update({
      status: 'canceled',
      updated_at: new Date().toISOString(),
    })
    .eq('stripe_subscription_id', subscription.id)

  if (error) {
    console.error('Error updating subscription:', error)
    throw error
  }
}

async function upsertSubscription(
  userId: string,
  subscription: Stripe.Subscription,
) {
  const priceId = subscription.items.data[0]?.price.id

  if (!priceId) {
    console.error('No price ID found in subscription')
    return
  }

  try {
    // Stripeのサブスクリプションオブジェクトから日付を安全に取得
    const [purchasesItem] = subscription.items.data
    const currentPeriodStart = purchasesItem.current_period_start
    const currentPeriodEnd = purchasesItem.current_period_end

    const { error } = await supabaseAdmin.from('subscriptions').upsert(
      {
        user_id: userId,
        stripe_customer_id: subscription.customer as string,
        stripe_subscription_id: subscription.id,
        status: subscription.status,
        price_id: priceId,
        current_period_start: new Date(currentPeriodStart * 1000).toISOString(),
        current_period_end: new Date(currentPeriodEnd * 1000).toISOString(),
        cancel_at_period_end:
          (subscription as any).cancel_at_period_end ?? false,
        updated_at: new Date().toISOString(),
      },
      {
        onConflict: 'stripe_subscription_id',
      },
    )

    if (error) {
      console.error('Error upserting subscription:', error)
      throw error
    }
  } catch (e) {
    console.error(e)
  }
}

async function getUserIdFromCustomer(
  customerId: string,
): Promise<string | null> {
  // 既存のサブスクリプションからユーザーIDを取得
  const { data, error } = await supabaseAdmin
    .from('subscriptions')
    .select('user_id')
    .eq('stripe_customer_id', customerId)
    .single()

  if (error || !data) {
    return null
  }

  return data.user_id
}
