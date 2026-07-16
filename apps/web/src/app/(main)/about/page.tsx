import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Target, Users, Globe, Zap, Shield, Heart, Trophy, BarChart3, Smartphone } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';

export const metadata = {
  title: 'About Us | SportSphere AI',
  description: 'Learn about SportSphere AI - the future of sports live streaming and live scores',
};

const stats = [
  { value: '10M+', label: 'Active Users', icon: Users },
  { value: '50+', label: 'Sports Covered', icon: Globe },
  { value: '1B+', label: 'Live Updates Served', icon: Zap },
  { value: '99.9%', label: 'Uptime', icon: Shield },
];

const values = [
  {
    icon: Target,
    title: 'Mission',
    description: 'To provide the most accurate, real-time sports data and insights to fans worldwide, powered by cutting-edge AI technology.',
  },
  {
    icon: Heart,
    title: 'Passion',
    description: 'We are sports fans building for sports fans. Every feature is designed with the fan experience in mind.',
  },
  {
    icon: Shield,
    title: 'Trust',
    description: 'We prioritize data accuracy and reliability, ensuring our users get the most trustworthy sports information.',
  },
];

const features = [
  { icon: Zap, title: 'Real-Time Scores', description: 'Live updates within milliseconds of every play' },
  { icon: BarChart3, title: 'AI Analytics', description: 'Advanced predictions and performance analytics' },
  { icon: Smartphone, title: 'Multi-Platform', description: 'Available on web, iOS, Android, and smart TVs' },
  { icon: Trophy, title: 'Fantasy Sports', description: 'Build teams and compete in fantasy leagues' },
];

export default function AboutPage() {
  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      {/* Hero */}
      <div className="text-center mb-12">
        <Badge className="mb-4">About SportSphere AI</Badge>
        <h1 className="text-4xl md:text-5xl font-bold mb-4">
          The Future of <span className="text-blue-600">Sports Technology</span>
        </h1>
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
          SportSphere AI combines real-time sports data with artificial intelligence to deliver
          the most comprehensive sports platform ever built.
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-12">
        {stats.map((stat) => (
          <Card key={stat.label}>
            <CardContent className="p-6 text-center">
              <stat.icon className="h-8 w-8 text-blue-600 mx-auto mb-2" />
              <p className="text-3xl font-bold">{stat.value}</p>
              <p className="text-sm text-muted-foreground">{stat.label}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Story */}
      <Card className="mb-12">
        <CardContent className="p-8">
          <h2 className="text-2xl font-bold mb-4">Our Story</h2>
          <div className="prose prose-lg max-w-none text-muted-foreground space-y-4">
            <p>
              SportSphere AI was born from a simple frustration: sports fans deserved better than fragmented,
              slow, and inaccurate live score updates. We set out to build a platform that would combine
              the best of real-time technology with the power of artificial intelligence.
            </p>
            <p>
              Founded in 2024, our team of sports enthusiasts, engineers, and AI researchers came together
              with a shared vision: to create the most comprehensive, accurate, and engaging sports
              platform in the world.
            </p>
            <p>
              Today, SportSphere AI serves millions of sports fans across 195+ countries, delivering
              real-time scores, expert analysis, AI-powered predictions, and interactive fantasy sports
              experiences across 50+ sports.
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Values */}
      <div className="mb-12">
        <h2 className="text-2xl font-bold text-center mb-6">Our Values</h2>
        <div className="grid gap-6 md:grid-cols-3">
          {values.map((value) => (
            <Card key={value.title}>
              <CardContent className="p-6">
                <value.icon className="h-10 w-10 text-blue-600 mb-4" />
                <h3 className="text-lg font-bold mb-2">{value.title}</h3>
                <p className="text-muted-foreground">{value.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Features */}
      <div className="mb-12">
        <h2 className="text-2xl font-bold text-center mb-6">What Makes Us Different</h2>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {features.map((feature) => (
            <Card key={feature.title} className="hover:shadow-md transition-shadow">
              <CardContent className="p-5">
                <feature.icon className="h-8 w-8 text-blue-600 mb-3" />
                <h3 className="font-semibold mb-1">{feature.title}</h3>
                <p className="text-sm text-muted-foreground">{feature.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* CTA */}
      <Card className="bg-gradient-to-r from-blue-600 to-purple-600 text-white text-center">
        <CardContent className="p-8">
          <h2 className="text-2xl font-bold mb-2">Ready to Experience the Future?</h2>
          <p className="text-white/80 mb-4">Join millions of sports fans who trust SportSphere AI</p>
          <div className="flex gap-3 justify-center">
            <Link href="/register">
              <Button className="bg-white text-blue-600 hover:bg-white/90">Get Started Free</Button>
            </Link>
            <Link href="/contact">
              <Button variant="outline" className="border-white/30 text-white hover:bg-white/10">Contact Us</Button>
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
