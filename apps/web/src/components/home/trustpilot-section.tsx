'use client';

import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Star, Quote, Shield, Award, Users, TrendingUp, CheckCircle } from 'lucide-react';

const reviews = [
  {
    name: 'Sarah Mitchell',
    role: 'Sports Analyst at ESPN',
    avatar: 'SM',
    rating: 5,
    text: 'SportSphere AI has completely transformed how I analyze matches. The AI predictions are incredibly accurate, and the real-time data is unmatched. I use it daily for my pre-match analysis.',
    verified: true,
  },
  {
    name: 'James Rodriguez',
    role: 'Fantasy Sports Champion',
    avatar: 'JR',
    rating: 5,
    text: 'Won my fantasy league 3 seasons in a row thanks to SportSphere AI\'s player insights and match predictions. The AI-powered recommendations gave me the edge over thousands of competitors.',
    verified: true,
  },
  {
    name: 'Priya Sharma',
    role: 'Cricket Enthusiast',
    avatar: 'PS',
    rating: 5,
    text: 'Best cricket app I\'ve ever used! Ball-by-ball updates, IPL coverage, and the AI predictions for Test matches are spot on. The interface is clean and the notifications are perfectly timed.',
    verified: true,
  },
  {
    name: 'Michael Chen',
    role: 'Tech Reviewer at The Verge',
    avatar: 'MC',
    rating: 5,
    text: 'SportSphere AI sets the gold standard for sports technology platforms. The integration of GPT-4 for match analysis is brilliant, and the WebSocket-powered live scores are lightning fast.',
    verified: true,
  },
  {
    name: 'Emma Wilson',
    role: 'Premier League Fan',
    avatar: 'EW',
    rating: 5,
    text: 'The Premier League coverage is incredible. Live scores, detailed stats, head-to-head records, and AI predictions for every match. I\'ve tried every sports app out there - SportSphere AI is the best.',
    verified: true,
  },
  {
    name: 'David Kim',
    role: 'NBA Fantasy Player',
    avatar: 'DK',
    rating: 5,
    text: 'The NBA integration is phenomenal. Real-time scores, player stats, and the fantasy sports feature is so well designed. The AI predictions for NBA games have been incredibly accurate.',
    verified: true,
  },
];

const trustStats = [
  { icon: Users, value: '2M+', label: 'Active Users', color: 'text-blue-600' },
  { icon: Star, value: '4.9/5', label: 'Average Rating', color: 'text-yellow-500' },
  { icon: TrendingUp, value: '85%', label: 'AI Accuracy', color: 'text-green-600' },
  { icon: Award, value: '#1', label: 'Sports Platform', color: 'text-purple-600' },
];

const trustBadges = [
  { name: 'SOC 2 Certified', icon: Shield },
  { name: 'GDPR Compliant', icon: CheckCircle },
  { name: 'PCI DSS Level 1', icon: Shield },
  { name: '99.9% Uptime', icon: TrendingUp },
];

export function TrustpilotSection() {
  return (
    <section className="py-20 bg-gradient-to-b from-muted/30 to-background">
      <div className="container">
        {/* Header */}
        <div className="text-center mb-12">
          <Badge variant="outline" className="mb-4 gap-1">
            <Star className="h-3 w-3 text-yellow-500" />
            Trusted Worldwide
          </Badge>
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Loved by 2 Million+ Sports Fans
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            See what sports enthusiasts, analysts, and fantasy players say about SportSphere AI.
          </p>
        </div>

        {/* Trust Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-12">
          {trustStats.map((stat) => (
            <Card key={stat.label} className="text-center">
              <CardContent className="p-6">
                <stat.icon className={`h-8 w-8 mx-auto mb-2 ${stat.color}`} />
                <p className="text-3xl font-bold">{stat.value}</p>
                <p className="text-sm text-muted-foreground">{stat.label}</p>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Trust Badges */}
        <div className="flex flex-wrap items-center justify-center gap-4 mb-12">
          {trustBadges.map((badge) => (
            <Badge key={badge.name} variant="secondary" className="px-4 py-2 text-sm gap-2">
              <badge.icon className="h-4 w-4 text-green-600" />
              {badge.name}
            </Badge>
          ))}
        </div>

        {/* Reviews Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {reviews.map((review) => (
            <Card key={review.name} className="relative overflow-hidden hover:shadow-lg transition-shadow">
              <CardContent className="p-6">
                <Quote className="absolute top-4 right-4 h-8 w-8 text-muted/20" />
                <div className="flex items-center gap-1 mb-3">
                  {Array.from({ length: review.rating }).map((_, i) => (
                    <Star key={i} className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                  ))}
                </div>
                <p className="text-sm text-muted-foreground mb-4 leading-relaxed">
                  "{review.text}"
                </p>
                <div className="flex items-center gap-3">
                  <Avatar className="h-10 w-10">
                    <AvatarFallback className="bg-blue-100 text-blue-700 text-sm font-medium">
                      {review.avatar}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <div className="flex items-center gap-2">
                      <p className="font-medium text-sm">{review.name}</p>
                      {review.verified && (
                        <Badge variant="outline" className="text-[10px] h-4 text-green-600 border-green-200">
                          <CheckCircle className="h-2.5 w-2.5 mr-0.5" /> Verified
                        </Badge>
                      )}
                    </div>
                    <p className="text-xs text-muted-foreground">{review.role}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Platform Ratings */}
        <div className="mt-12 grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { platform: 'App Store', rating: '4.9', reviews: '12.5K reviews' },
            { platform: 'Google Play', rating: '4.8', reviews: '8.3K reviews' },
            { platform: 'Trustpilot', rating: '4.9', reviews: '5.2K reviews' },
            { platform: 'G2', rating: '4.8', reviews: '2.1K reviews' },
          ].map((p) => (
            <Card key={p.platform}>
              <CardContent className="p-4 text-center">
                <p className="text-sm font-medium text-muted-foreground">{p.platform}</p>
                <div className="flex items-center justify-center gap-1 my-1">
                  <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                  <span className="font-bold">{p.rating}</span>
                </div>
                <p className="text-xs text-muted-foreground">{p.reviews}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
