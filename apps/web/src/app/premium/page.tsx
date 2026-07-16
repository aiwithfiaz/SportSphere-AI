'use client';

import { useState } from "react";
import { Check, Zap, Crown, Star, Shield, Globe, BarChart3 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

const plans = [
  {
    id: "free",
    name: "Free",
    description: "Basic access to sports content",
    price: 0,
    period: "forever",
    popular: false,
    stripePriceId: null,
    features: [
      "Live scores for all sports",
      "Basic match statistics",
      "News articles",
      "Community forums",
      "5 predictions per day",
    ],
    limitations: [
      "Limited match statistics",
      "No AI analysis",
      "No ad-free experience",
      "No exclusive content",
    ],
  },
  {
    id: "pro",
    name: "Pro",
    description: "Enhanced features for serious fans",
    price: 9.99,
    period: "month",
    popular: true,
    stripePriceId: "price_pro_monthly",
    features: [
      "Everything in Free",
      "Advanced match statistics",
      "AI-powered match analysis",
      "Unlimited predictions",
      "Ad-free experience",
      "Exclusive interviews",
      "Priority customer support",
    ],
    limitations: ["No API access", "Limited historical data"],
  },
  {
    id: "premium",
    name: "Premium",
    description: "Complete access for the ultimate sports fan",
    price: 19.99,
    period: "month",
    popular: false,
    stripePriceId: "price_premium_monthly",
    features: [
      "Everything in Pro",
      "Full API access",
      "Complete historical data",
      "Advanced AI insights",
      "Custom notifications",
      "Multi-device sync",
      "Early access to new features",
      "Dedicated support",
    ],
    limitations: [],
  },
];

const testimonials = [
  { name: "Rahul Sharma", role: "Cricket Enthusiast", content: "The AI analysis has completely changed how I understand cricket matches. Worth every penny!", rating: 5 },
  { name: "Sarah Johnson", role: "Football Fan", content: "Best sports app I've ever used. The real-time stats and predictions are incredibly accurate.", rating: 5 },
  { name: "Mike Chen", role: "Fantasy Sports Player", content: "The premium features give me an edge in my fantasy leagues. Highly recommend!", rating: 4 },
];

export default function PremiumPage() {
  const [loading, setLoading] = useState<string | null>(null);

  const handleCheckout = async (planId: string, stripePriceId: string | null) => {
    if (planId === 'free') return;
    setLoading(planId);
    try {
      const res = await fetch('/api/v1/stripe/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ priceId: stripePriceId, email: 'user@example.com' }),
      });
      const data = await res.json();
      if (data.success && data.data.url) {
        window.location.href = data.data.url;
      } else {
        alert('Stripe is not configured yet. Add STRIPE_SECRET_KEY to your .env.local to enable payments.');
      }
    } catch {
      alert('Checkout is not available yet. Stripe integration coming soon!');
    } finally {
      setLoading(null);
    }
  };

  return (
    <div className="container mx-auto py-8">
      <div className="text-center mb-12">
        <Badge className="mb-4">
          <Crown className="h-4 w-4 mr-2" />
          Premium Plans
        </Badge>
        <h1 className="text-4xl font-bold mb-4">Unlock the Full Power of SportSphere</h1>
        <p className="text-xl text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
          Get access to premium features, AI-powered insights, and an ad-free experience.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16 max-w-5xl mx-auto">
        {plans.map((plan) => (
          <Card key={plan.id} className={`relative ${plan.popular ? 'border-blue-500 shadow-lg scale-105' : ''}`}>
            {plan.popular && (
              <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                <Badge className="bg-blue-600"><Star className="h-3 w-3 mr-1" />Most Popular</Badge>
              </div>
            )}
            <CardHeader className="text-center">
              <CardTitle className="text-xl">{plan.name}</CardTitle>
              <div className="mt-4">
                {plan.price === 0 ? (
                  <span className="text-4xl font-bold">Free</span>
                ) : (
                  <>
                    <span className="text-4xl font-bold">${plan.price}</span>
                    <span className="text-gray-600">/{plan.period}</span>
                  </>
                )}
              </div>
              <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">{plan.description}</p>
            </CardHeader>
            <CardContent>
              <ul className="space-y-3 mb-6">
                {plan.features.map((feature, index) => (
                  <li key={index} className="flex items-start gap-2">
                    <Check className="h-5 w-5 text-green-500 shrink-0" />
                    <span className="text-sm">{feature}</span>
                  </li>
                ))}
              </ul>
              <Button
                className="w-full"
                variant={plan.popular ? "default" : "outline"}
                onClick={() => handleCheckout(plan.id, plan.stripePriceId)}
                disabled={loading === plan.id}
              >
                {loading === plan.id ? 'Processing...' : plan.price === 0 ? 'Get Started' : 'Choose Plan'}
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="mb-16">
        <h2 className="text-3xl font-bold text-center mb-8">What Our Users Say</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
          {testimonials.map((testimonial, i) => (
            <Card key={i}>
              <CardContent className="p-6">
                <div className="flex mb-2">
                  {[...Array(5)].map((_, j) => (
                    <Star key={j} className={`h-5 w-5 ${j < testimonial.rating ? 'text-yellow-500 fill-yellow-500' : 'text-gray-300'}`} />
                  ))}
                </div>
                <p className="text-gray-600 dark:text-gray-400 mb-4">&ldquo;{testimonial.content}&rdquo;</p>
                <div>
                  <p className="font-medium">{testimonial.name}</p>
                  <p className="text-sm text-gray-500">{testimonial.role}</p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      <div className="max-w-3xl mx-auto">
        <h2 className="text-3xl font-bold text-center mb-8">Frequently Asked Questions</h2>
        <div className="space-y-4">
          {[
            { q: "Can I cancel my subscription anytime?", a: "Yes, cancel anytime. Access continues until the end of your billing period." },
            { q: "Is there a free trial?", a: "Yes, 7-day free trial for Pro and Premium plans. No credit card required." },
            { q: "Can I switch plans?", a: "Upgrade or downgrade anytime. Changes reflect in your next billing cycle." },
            { q: "What payment methods do you accept?", a: "All major credit cards, debit cards, PayPal, and Apple Pay." },
          ].map((faq, i) => (
            <Card key={i}>
              <CardContent className="p-6">
                <h3 className="font-medium mb-2">{faq.q}</h3>
                <p className="text-gray-600 dark:text-gray-400">{faq.a}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}
