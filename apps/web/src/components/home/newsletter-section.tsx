'use client';

import { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Mail, ArrowRight, CheckCircle, Newspaper, Zap, Bell, Globe } from 'lucide-react';

const features = [
  {
    icon: Newspaper,
    title: 'Breaking News',
    description: 'Be the first to know about transfers, injuries, and major sports events.',
  },
  {
    icon: Zap,
    title: 'AI Insights',
    description: 'Weekly AI-generated match previews and analysis delivered to your inbox.',
  },
  {
    icon: Bell,
    title: 'Match Alerts',
    description: 'Customizable alerts for your favorite teams and players.',
  },
  {
    icon: Globe,
    title: 'Global Coverage',
    description: 'News from 50+ sports leagues across the world.',
  },
];

export function NewsletterSection() {
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    
    setLoading(true);
    try {
      await fetch('/api/v1/newsletter', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });
      setSubscribed(true);
      setEmail('');
    } catch {
      setSubscribed(true);
      setEmail('');
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="py-20 relative overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-600 via-blue-700 to-purple-700" />
      <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmYiIGZpbGwtb3BhY2l0eT0iMC4wNSI+PHBhdGggZD0iTTM2IDM0djItSDI0di0yaDEyem0wLTRWMjhIMjR2Mmgxem0tMi0ydi0ySDE4djJoNnptNC0ydjJIMjR2LTJoMTJ6Ii8+PC9nPjwvZz48L3N2Zz4=')] opacity-30" />
      
      <div className="container relative z-10">
        <div className="max-w-4xl mx-auto">
          <Card className="bg-white/10 backdrop-blur-xl border-white/20">
            <CardContent className="p-8 md:p-12">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
                {/* Left - Content */}
                <div className="text-white">
                  <Badge className="bg-white/20 text-white mb-4 gap-1 border-white/30">
                    <Mail className="h-3 w-3" />
                    Newsletter
                  </Badge>
                  <h2 className="text-3xl md:text-4xl font-bold mb-4">
                    Never Miss a Moment
                  </h2>
                  <p className="text-blue-100 mb-6">
                    Subscribe to our newsletter and get breaking sports news, AI-powered insights, and exclusive content delivered weekly to your inbox.
                  </p>
                  
                  <div className="space-y-3">
                    {features.map((feature) => (
                      <div key={feature.title} className="flex items-start gap-3">
                        <feature.icon className="h-5 w-5 text-blue-200 mt-0.5 flex-shrink-0" />
                        <div>
                          <p className="font-medium text-sm">{feature.title}</p>
                          <p className="text-xs text-blue-200">{feature.description}</p>
                        </div>
                      </div>
                    ))}
                  </div>

                  <p className="text-xs text-blue-200 mt-6">
                    Join 500,000+ subscribers. Unsubscribe anytime. We respect your privacy.
                  </p>
                </div>

                {/* Right - Form */}
                <div>
                  {subscribed ? (
                    <div className="text-center py-8">
                      <CheckCircle className="h-16 w-16 text-green-400 mx-auto mb-4" />
                      <h3 className="text-2xl font-bold text-white mb-2">You're In!</h3>
                      <p className="text-blue-100">
                        Welcome to the SportSphere newsletter. Check your inbox for a confirmation email.
                      </p>
                    </div>
                  ) : (
                    <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20">
                      <h3 className="text-lg font-bold text-white mb-4">Subscribe to Our Newsletter</h3>
                      <form onSubmit={handleSubmit} className="space-y-3">
                        <Input
                          type="email"
                          placeholder="Enter your email address"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          className="bg-white/10 border-white/20 text-white placeholder:text-white/50 h-12"
                          required
                        />
                        <Button
                          type="submit"
                          className="w-full h-12 bg-white text-blue-600 hover:bg-white/90 font-medium"
                          disabled={loading}
                        >
                          {loading ? (
                            'Subscribing...'
                          ) : (
                            <>
                              Subscribe Now
                              <ArrowRight className="h-4 w-4 ml-2" />
                            </>
                          )}
                        </Button>
                      </form>
                      <p className="text-xs text-blue-200 mt-3 text-center">
                        Free forever. No spam. Unsubscribe anytime.
                      </p>
                      
                      {/* Social Proof */}
                      <div className="mt-6 pt-4 border-t border-white/10">
                        <div className="flex items-center justify-center gap-2">
                          <div className="flex -space-x-2">
                            {['SM', 'JR', 'PS', 'MC', 'EW'].map((initials, i) => (
                              <div
                                key={i}
                                className="h-8 w-8 rounded-full bg-white/20 flex items-center justify-center text-xs font-medium text-white border-2 border-blue-600"
                              >
                                {initials}
                              </div>
                            ))}
                          </div>
                          <p className="text-xs text-blue-200">
                            +500,000 subscribers
                          </p>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
}
