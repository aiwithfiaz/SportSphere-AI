'use client';

import { useEffect, useState } from 'react';
import { Users, Globe, Trophy, TrendingUp, Zap, Target } from 'lucide-react';

const stats = [
  { icon: Users, value: 2000000, label: 'Active Users', suffix: '+', prefix: '' },
  { icon: Globe, value: 195, label: 'Countries', suffix: '+', prefix: '' },
  { icon: Trophy, value: 50, label: 'Sports Covered', suffix: '+', prefix: '' },
  { icon: TrendingUp, value: 85, label: 'AI Accuracy', suffix: '%', prefix: '' },
  { icon: Zap, value: 3, label: 'Second Updates', suffix: 's', prefix: '<' },
  { icon: Target, value: 10000000, label: 'Predictions Made', suffix: '+', prefix: '' },
];

function formatNumber(num: number): string {
  if (num >= 1000000) return (num / 1000000).toFixed(0) + 'M';
  if (num >= 1000) return (num / 1000).toFixed(0) + 'K';
  return num.toString();
}

function AnimatedCounter({ value, suffix, prefix }: { value: number; suffix: string; prefix: string }) {
  const [count, setCount] = useState(0);

  useEffect(() => {
    let start = 0;
    const end = value;
    const duration = 2000;
    const increment = end / (duration / 16);

    const timer = setInterval(() => {
      start += increment;
      if (start >= end) {
        setCount(end);
        clearInterval(timer);
      } else {
        setCount(Math.floor(start));
      }
    }, 16);

    return () => clearInterval(timer);
  }, [value]);

  return (
    <span>
      {prefix}{formatNumber(count)}{suffix}
    </span>
  );
}

export function StatsSection() {
  return (
    <section className="py-16 bg-gradient-to-r from-blue-600 via-blue-700 to-purple-700 text-white">
      <div className="container">
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-8">
          {stats.map((stat) => (
            <div key={stat.label} className="text-center">
              <stat.icon className="h-8 w-8 mx-auto mb-3 text-blue-200" />
              <p className="text-3xl md:text-4xl font-bold">
                <AnimatedCounter value={stat.value} suffix={stat.suffix} prefix={stat.prefix} />
              </p>
              <p className="text-sm text-blue-200 mt-1">{stat.label}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
