import Stripe from 'stripe';

let _stripe: Stripe | null = null;

export function getStripe() {
  if (!_stripe) {
    _stripe = new Stripe(process.env.STRIPE_SECRET_KEY || '', {
      typescript: true,
    });
  }
  return _stripe;
}

export const stripe = new Proxy({} as Stripe, {
  get(_, prop) {
    return (getStripe() as any)[prop];
  },
});

export const plans = [
  {
    name: 'Free',
    description: 'Basic access to live scores and news',
    price: 0,
    interval: null,
    features: [
      'Live scores for all sports',
      'Basic news and articles',
      'Match schedules',
      'Team and player profiles',
    ],
  },
  {
    name: 'Pro',
    description: 'Advanced features for serious fans',
    price: 9.99,
    interval: 'month',
    stripePriceId: process.env.STRIPE_PRO_PRICE_ID,
    features: [
      'Everything in Free',
      'AI-powered match predictions',
      'Advanced analytics and stats',
      'Ad-free experience',
      'Push notifications',
      'Fantasy sports tools',
    ],
  },
  {
    name: 'Premium',
    description: 'Ultimate experience for power users',
    price: 19.99,
    interval: 'month',
    stripePriceId: process.env.STRIPE_PREMIUM_PRICE_ID,
    features: [
      'Everything in Pro',
      'Real-time ball-by-ball commentary',
      'Head-to-head analysis',
      'Custom alerts and notifications',
      'API access',
      'Priority support',
      'Early access to new features',
    ],
  },
] as const;

export type PlanName = typeof plans[number]['name'];
