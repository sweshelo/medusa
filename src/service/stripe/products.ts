import Stripe from 'stripe'

if (!process.env.STRIPE_SECRET_KEY) {
  throw new Error('STRIPE_SECRET_KEY is not set in environment variables')
}

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
  apiVersion: '2025-11-17.clover',
})

export interface SubscriptionPlan {
  id: string
  name: string
  description: string | null
  price: number
  currency: string
  interval: 'month' | 'year' | 'week' | 'day'
  checkoutUrl: string
}

export async function getActiveSubscriptionPlans(): Promise<
  SubscriptionPlan[]
> {
  try {
    // Fetch active products
    const products = await stripe.products.list({
      active: true,
      expand: ['data.default_price'],
    })

    const plans: SubscriptionPlan[] = []

    for (const product of products.data) {
      // Get the default price
      const price = product.default_price

      if (price && typeof price !== 'string') {
        // Create a payment link for this price
        const paymentLink = await stripe.paymentLinks.create({
          line_items: [
            {
              price: price.id,
              quantity: 1,
            },
          ],
        })

        plans.push({
          id: product.id,
          name: product.name,
          description: product.description,
          price: price.unit_amount || 0,
          currency: price.currency,
          interval: price.recurring?.interval || 'month',
          checkoutUrl: paymentLink.url,
        })
      }
    }

    return plans
  } catch (error) {
    console.error('Failed to fetch Stripe products:', error)
    return []
  }
}
