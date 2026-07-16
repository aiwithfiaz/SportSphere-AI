'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Check, Zap, Star, Crown, ArrowRight, Shield } from 'lucide-react';
import Link from 'next/link';

const plans = [
  {
    name: 'Free',
    price: '$0',
    period: 'forever',
    description: 'Perfect for casual fans who want live scores and basic features.',
    badge: null,
    features: [
      'Live scores for all sports',
      'Match schedules & results',
      'Team & player profiles',
      'Sports news feed',
      'Basic search',
      '5 AI predictions per month',
      'Email notifications',
    ],
    limitations: [
      'Ad-supported experience',
      'Limited AI predictions',
      'No fantasy sports',
      'No advanced analytics',
    ],
    cta: 'Get Started Free',
    ctaLink: '/register',
    popular: false,
  },
  {
    name: 'Premium',
    price: '$9.99',
    period: '/month',
    description: 'For serious fans who want the full AI-powered sports experience.',
    badge: 'Most Popular',
    features: [
      'Everything in Free',
      'Unlimited AI predictions',
      'Advanced match analytics',
      'Head-to-head insights',
      'Fantasy sports',
      'Ad-free experience',
      'Priority notifications',
      'Custom alerts & widgets',
      'Export predictions',
      'Priority support',
    ],
    limitations: [],
    cta: 'Start Premium Trial',
    ctaLink: '/premium',
    popular: true,
  },
  {
    name: 'Enterprise',
    price: '$29.99',
    period: '/month',
    description: 'For professionals and businesses who need API access and advanced tools.',
    badge: 'Best Value',
    features: [
      'Everything in Premium',
      'Full API access (REST + WebSocket)',
      'Bulk data exports',
      'Custom AI model training',
      'White-label options',
      'Team collaboration',
      'Advanced analytics dashboard',
      'Dedicated account manager',
      'Custom integrations',
      'SLA guarantee (99.9%)',
      'Webhook support',
      'Early access to new features',
    ],
    limitations: [],
    cta: 'Contact Sales',
    ctaLink: '/contact',
    popular: false,
  },
];

export function SubscriptionSection() {
  const [annual, setAnnual] = useState(false);

  return (
    <section className="py-20 bg-gradient-to-b from-background to-muted/30">
      <div className="container">
        <div className="text-center mb-12">
          <Badge variant="outline" className="mb-4 gap-1">
            <Crown className="h-3 w-3 text-yellow-500" />
            Pricing
          </Badge>
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Choose Your Sports Experience
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            From casual fans to professional analysts, we have a plan that fits your needs. All plans include our core features.
          </p>
          <div className="flex items-center justify-center gap-3 mt-6">
            <span className={`text-sm ${!annual ? 'font-medium' : 'text-muted-foreground'}`}>Monthly</span>
            <button
              onClick={() => setAnnual(!annual)}
              className={`relative w-12 h-6 rounded-full transition-colors ${annual ? 'bg-blue-600' : 'bg-muted'}`}
            >
              <div
                className={`absolute top-1 h-4 w-4 rounded-full bg-white transition-transform ${
                  annual ? 'left-7' : 'left-1'
                }`}
              />
            </button>
            <span className={`text-sm ${annual ? 'font-medium' : 'text-muted-foreground'}`}>
              Annual
              <Badge className="ml-1 bg-green-500 text-white text-[10px]">Save 20%</Badge>
            </span>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-6xl mx-auto">
          {plans.map((plan) => (
            <Card
              key={plan.name}
              className={`relative overflow-hidden transition-all hover:shadow-xl ${
                plan.popular
                  ? 'border-blue-500 shadow-lg ring-2 ring-blue-200 dark:ring-blue-800 scale-[1.02]'
                  : 'hover:border-blue-200'
              }`}
            >
              {plan.popular && (
                <div className="absolute top-0 right-0 bg-blue-600 text-white text-xs font-bold px-3 py-1 rounded-bl-lg">
                  {plan.badge}
                </div>
              )}
              <CardHeader className="text-center pb-4">
                {plan.badge && !plan.popular && (
                  <Badge className="w-fit mx-auto mb-2 bg-gradient-to-r from-yellow-500 to-orange-500 text-white">
                    {plan.badge}
                  </Badge>
                )}
                <CardTitle className="text-xl">{plan.name}</CardTitle>
                <div className="mt-2">
                  <span className="text-4xl font-bold">
                    {annual && plan.price !== '$0'
                      ? `$${Math.round(parseInt(plan.price.replace('$', '')) * 0.8 * 100) / 100}`
                      : plan.price}
                  </span>
                  <span className="text-muted-foreground">{plan.period}</span>
                </div>
                <p className="text-sm text-muted-foreground mt-2">{plan.description}</p>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  {plan.features.map((feature) => (
                    <div key={feature} className="flex items-start gap-2 text-sm">
                      <Check className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                      <span>{feature}</span>
                    </div>
                  ))}
                </div>
                {plan.limitations.length > 0 && (
                  <div className="border-t pt-4 space-y-2">
                    {plan.limitations.map((limitation) => (
                      <div key={limitation} className="flex items-start gap-2 text-sm text-muted-foreground">
                        <span className="h-4 w-4 flex items-center justify-center text-gray-400">—</span>
                        <span>{limitation}</span>
                      </div>
                    ))}
                  </div>
                )}
                <Button
                  asChild
                  className={`w-full mt-6 ${
                    plan.popular ? 'bg-blue-600 hover:bg-blue-700' : ''
                  }`}
                  variant={plan.popular ? 'default' : 'outline'}
                >
                  <Link href={plan.ctaLink}>
                    {plan.cta}
                    <ArrowRight className="h-4 w-4 ml-2" />
                  </Link>
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Trust */}
        <div className="mt-12 text-center">
          <div className="flex items-center justify-center gap-6 text-sm text-muted-foreground">
            <span className="flex items-center gap-1">
              <Shield className="h-4 w-4 text-green-500" />
              30-day money-back guarantee
            </span>
            <span>|</span>
            <span className="flex items-center gap-1">
              <Zap className="h-4 w-4 text-yellow-500" />
              Cancel anytime
            </span>
            <span>|</span>
            <span>Secure payments by Stripe</span>
          </div>
        </div>
      </div>
    </section>
  );
}
