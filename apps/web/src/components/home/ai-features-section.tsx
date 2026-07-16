'use client';

import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Brain, BarChart3, Zap, Target, TrendingUp, Activity, LineChart, Sparkles } from 'lucide-react';

const features = [
  {
    icon: Brain,
    title: 'GPT-4 AI Analysis',
    description: 'Advanced AI powered by OpenAI GPT-4 analyzes 200+ data points per match for incredibly accurate predictions.',
    badge: 'AI Core',
    color: 'from-purple-500 to-indigo-600',
    iconColor: 'text-purple-600',
  },
  {
    icon: Zap,
    title: 'Real-Time Scores',
    description: 'WebSocket-powered live scores update in under 3 seconds. Ball-by-ball cricket, play-by-play football.',
    badge: 'Live',
    color: 'from-yellow-500 to-orange-600',
    iconColor: 'text-yellow-600',
  },
  {
    icon: BarChart3,
    title: 'Predictive Analytics',
    description: 'Machine learning models trained on millions of historical matches deliver 85%+ prediction accuracy.',
    badge: 'ML',
    color: 'from-blue-500 to-cyan-600',
    iconColor: 'text-blue-600',
  },
  {
    icon: Target,
    title: 'Head-to-Head Insights',
    description: 'Deep dive into team rivalries with historical head-to-head records, trends, and pattern analysis.',
    badge: 'Data',
    color: 'from-green-500 to-emerald-600',
    iconColor: 'text-green-600',
  },
  {
    icon: TrendingUp,
    title: 'Fantasy Sports',
    description: 'Build winning fantasy teams with AI-powered player recommendations and performance projections.',
    badge: 'Fantasy',
    color: 'from-pink-500 to-rose-600',
    iconColor: 'text-pink-600',
  },
  {
    icon: Activity,
    title: 'Win Probability',
    description: 'Live win probability graphs that update in real-time as the match progresses.',
    badge: 'Live',
    color: 'from-red-500 to-orange-600',
    iconColor: 'text-red-600',
  },
];

export function AIFeaturesSection() {
  return (
    <section className="py-20 bg-gradient-to-b from-muted/30 to-background">
      <div className="container">
        <div className="text-center mb-12">
          <Badge variant="outline" className="mb-4 gap-1">
            <Sparkles className="h-3 w-3 text-purple-500" />
            AI-Powered
          </Badge>
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            The Future of Sports Analytics
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Powered by GPT-4 and custom ML models, SportSphere AI delivers insights no other platform can match.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature) => (
            <Card key={feature.title} className="group hover:shadow-xl transition-all duration-300 hover:-translate-y-1 border-0 bg-gradient-to-br from-background to-muted/50">
              <CardContent className="p-6">
                <div className={`h-12 w-12 rounded-xl bg-gradient-to-br ${feature.color} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                  <feature.icon className="h-6 w-6 text-white" />
                </div>
                <Badge variant="secondary" className="text-[10px] mb-2">{feature.badge}</Badge>
                <h3 className="text-lg font-bold mb-2">{feature.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{feature.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
