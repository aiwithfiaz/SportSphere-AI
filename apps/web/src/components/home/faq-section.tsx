'use client';

import { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ChevronDown, HelpCircle, MessageSquare, Zap, Shield, CreditCard, Users, Globe, Brain } from 'lucide-react';

const faqCategories = [
  {
    category: 'General',
    icon: HelpCircle,
    questions: [
      {
        q: 'What is SportSphere AI?',
        a: 'SportSphere AI is the world\'s most advanced AI-powered sports platform, providing real-time live scores, intelligent match predictions, fantasy sports, and comprehensive coverage of 50+ sports worldwide. Our platform combines cutting-edge GPT-4 AI technology with real-time data from ESPN, CricAPI, Football-Data.org, and 20+ other sports data providers to deliver the most accurate and timely sports information available.',
      },
      {
        q: 'How does SportSphere AI differ from other sports apps?',
        a: 'Unlike traditional sports apps, SportSphere AI leverages advanced artificial intelligence powered by OpenAI\'s GPT-4 to provide predictive analytics, match analysis, and personalized recommendations. We cover 50+ sports with real-time WebSocket-powered live scores, offer fantasy sports, and provide premium AI-powered insights that no other platform offers. Our AI accuracy rate is consistently above 85% for match predictions.',
      },
      {
        q: 'Is SportSphere AI free to use?',
        a: 'Yes! SportSphere AI offers a comprehensive free tier that includes live scores for all sports, basic match information, team and player profiles, and access to our sports news. For advanced features like AI predictions, fantasy sports, ad-free experience, and exclusive analytics, we offer Premium ($9.99/month) and Enterprise ($29.99/month) plans.',
      },
      {
        q: 'Which sports does SportSphere AI cover?',
        a: 'We cover 50+ sports including Cricket (IPL, ICC, BBL, PSL), Football (Premier League, La Liga, Serie A, Bundesliga, Ligue 1, MLS, Champions League), Basketball (NBA, WNBA), Baseball (MLB), Hockey (NHL), Tennis (Grand Slams, ATP, WTA), Formula 1, UFC, Boxing, and many more. We also provide ESPN integration for real-time scores across all major US and international leagues.',
      },
    ],
  },
  {
    category: 'AI & Predictions',
    icon: Brain,
    questions: [
      {
        q: 'How accurate are the AI predictions?',
        a: 'Our AI predictions powered by OpenAI GPT-4 consistently achieve an accuracy rate of 85%+ across major sports. The AI analyzes 200+ data points per match including team form, head-to-head records, player statistics, venue conditions, weather, and historical trends. While no prediction system can guarantee 100% accuracy, our AI models are continuously trained on millions of historical matches to improve accuracy over time.',
      },
      {
        q: 'How does the AI prediction system work?',
        a: 'Our AI prediction system uses a multi-layered approach: (1) Data Collection - We gather real-time data from 20+ sports data providers, (2) Feature Engineering - Our ML pipeline processes 200+ features per match, (3) GPT-4 Analysis - We use OpenAI\'s GPT-4 for deep contextual analysis, (4) Ensemble Models - Multiple ML models combine predictions, (5) Real-time Updates - Predictions update as match conditions change. The result is a comprehensive prediction with win probabilities, predicted scores, key factors, and detailed analysis.',
      },
      {
        q: 'Can I trust the AI predictions for betting decisions?',
        a: 'While our AI predictions are highly accurate (85%+ rate), they should be used as one of many information sources for any decision-making. Our predictions provide analysis, probabilities, and insights based on historical data and current conditions. We strongly recommend responsible decision-making and never betting more than you can afford to lose. SportSphere AI is not a gambling service and does not facilitate betting.',
      },
    ],
  },
  {
    category: 'Account & Billing',
    icon: CreditCard,
    questions: [
      {
        q: 'How do I upgrade to Premium?',
        a: 'Upgrading to Premium is easy! Visit our /premium page, choose between Premium ($9.99/month) or Enterprise ($29.99/month) plans, and complete the secure checkout powered by Stripe. You\'ll get instant access to all premium features including AI predictions, fantasy sports, ad-free experience, and exclusive content. Cancel anytime from your dashboard settings.',
      },
      {
        q: 'What payment methods do you accept?',
        a: 'We accept all major credit cards (Visa, Mastercard, American Express, Discover), PayPal, Apple Pay, and Google Pay through our secure payment partner Stripe. All payments are encrypted with PCI DSS Level 1 compliance, the highest security standard in the payments industry.',
      },
      {
        q: 'Can I cancel my subscription anytime?',
        a: 'Absolutely! You can cancel your subscription at any time from your Dashboard > Settings page. There are no cancellation fees or hidden charges. When you cancel, you\'ll continue to have access to premium features until the end of your current billing period. After that, your account will automatically revert to the free tier.',
      },
      {
        q: 'Do you offer refunds?',
        a: 'Yes, we offer a 30-day money-back guarantee for all new subscriptions. If you\'re not satisfied with our service within the first 30 days, contact our support team at support@sportsphere.ai for a full refund. For requests after 30 days, we evaluate on a case-by-case basis.',
      },
    ],
  },
  {
    category: 'Privacy & Security',
    icon: Shield,
    questions: [
      {
        q: 'How do you protect my data?',
        a: 'We take data security extremely seriously. SportSphere AI is SOC 2 Type II certified and uses AES-256 encryption for all data at rest and TLS 1.3 for data in transit. We implement role-based access control, regular security audits, automated threat detection, and comply with GDPR, CCPA, and other global privacy regulations. Your personal data is never sold to third parties.',
      },
      {
        q: 'What data do you collect?',
        a: 'We collect only the data necessary to provide our services: account information (email, name), usage data (pages visited, features used), device information (browser, OS), and preferences (favorite teams, notification settings). We do NOT collect or store payment information (handled by Stripe), and we never sell personal data to advertisers. See our Privacy Policy for complete details.',
      },
      {
        q: 'How can I delete my account and data?',
        a: 'You can request account deletion from your Dashboard > Settings > Privacy page, or by emailing privacy@sportsphere.ai. We will process your request within 30 days and permanently delete all your personal data from our systems, as required by GDPR Article 17 (Right to Erasure). Some anonymized analytics data may be retained for service improvement.',
      },
    ],
  },
  {
    category: 'Technical',
    icon: Zap,
    questions: [
      {
        q: 'How fast are the live score updates?',
        a: 'Our live scores are powered by WebSocket connections and update in real-time, typically within 1-3 seconds of the actual event. For cricket, we provide ball-by-ball updates. For football, we update on goals, cards, and key events. For basketball, we update on every score change. Our ESPN integration provides additional real-time data with 30-second auto-refresh.',
      },
      {
        q: 'Do you have a mobile app?',
        a: 'SportSphere AI is currently available as a progressive web app (PWA) that works seamlessly on all devices including iOS and Android. Simply visit sportsphere.ai in your browser and add it to your home screen for an app-like experience. Native iOS and Android apps are coming soon! Our PWA supports push notifications, offline mode, and all platform features.',
      },
      {
        q: 'Do you offer an API for developers?',
        a: 'Yes! We offer a comprehensive REST API and WebSocket API for developers. The API provides access to live scores, match data, team/player information, and AI predictions. API access is available on our Enterprise plan. Documentation is available at docs.sportsphere.ai. We also provide SDKs for JavaScript, Python, and Go.',
      },
    ],
  },
];

export function FAQSection() {
  const [openCategory, setOpenCategory] = useState(0);
  const [openQuestion, setOpenQuestion] = useState<string | null>(null);

  return (
    <section className="py-20 bg-gradient-to-b from-background to-muted/30">
      <div className="container">
        <div className="text-center mb-12">
          <Badge variant="outline" className="mb-4 gap-1">
            <HelpCircle className="h-3 w-3" />
            Help Center
          </Badge>
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Frequently Asked Questions
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Everything you need to know about SportSphere AI. Can't find what you're looking for? Contact our support team.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 max-w-7xl mx-auto">
          {/* Category Sidebar */}
          <div className="lg:col-span-1 space-y-2">
            {faqCategories.map((cat, i) => (
              <button
                key={cat.category}
                onClick={() => setOpenCategory(i)}
                className={`w-full flex items-center gap-3 p-3 rounded-lg text-left transition-all ${
                  openCategory === i
                    ? 'bg-blue-50 text-blue-700 dark:bg-blue-950/50 dark:text-blue-300 shadow-sm'
                    : 'hover:bg-accent text-muted-foreground'
                }`}
              >
                <cat.icon className="h-5 w-5 flex-shrink-0" />
                <div>
                  <p className="font-medium text-sm">{cat.category}</p>
                  <p className="text-xs opacity-60">{cat.questions.length} questions</p>
                </div>
              </button>
            ))}
          </div>

          {/* Questions */}
          <div className="lg:col-span-3 space-y-3">
            {faqCategories[openCategory].questions.map((faq) => {
              const isOpen = openQuestion === faq.q;
              return (
                <Card key={faq.q} className={`transition-all ${isOpen ? 'border-blue-200 shadow-md' : ''}`}>
                  <CardContent className="p-0">
                    <button
                      onClick={() => setOpenQuestion(isOpen ? null : faq.q)}
                      className="w-full flex items-center justify-between p-5 text-left"
                    >
                      <span className="font-medium pr-4">{faq.q}</span>
                      <ChevronDown
                        className={`h-5 w-5 text-muted-foreground flex-shrink-0 transition-transform ${
                          isOpen ? 'rotate-180' : ''
                        }`}
                      />
                    </button>
                    {isOpen && (
                      <div className="px-5 pb-5 text-sm text-muted-foreground leading-relaxed border-t pt-4">
                        {faq.a}
                      </div>
                    )}
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>

        {/* Contact CTA */}
        <div className="mt-12 text-center">
          <Card className="max-w-2xl mx-auto bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-950/20 dark:to-purple-950/20 border-blue-100 dark:border-blue-900">
            <CardContent className="p-8">
              <MessageSquare className="h-12 w-12 text-blue-600 mx-auto mb-4" />
              <h3 className="text-xl font-bold mb-2">Still have questions?</h3>
              <p className="text-muted-foreground mb-4">
                Our support team is available 24/7 to help you with anything you need.
              </p>
              <div className="flex items-center justify-center gap-4">
                <a href="mailto:support@sportsphere.ai" className="text-blue-600 hover:underline font-medium">
                  support@sportsphere.ai
                </a>
                <span className="text-muted-foreground">|</span>
                <a href="/contact" className="text-blue-600 hover:underline font-medium">
                  Contact Form
                </a>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
}
