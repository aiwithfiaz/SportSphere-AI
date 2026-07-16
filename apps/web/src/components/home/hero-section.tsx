'use client';

import { useEffect, useState, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ChevronLeft, ChevronRight, Play, Brain, Zap, Radio, Trophy, Star } from 'lucide-react';
import Link from 'next/link';

const heroSlides = [
  {
    id: 1,
    image: 'https://images.unsplash.com/photo-1551958219-acbc608c6377?w=1920&q=90&auto=format',
    title: 'Live Cricket Scores',
    subtitle: 'Real-time ball-by-ball updates for every match worldwide',
    badge: 'Cricket',
    badgeColor: 'bg-green-500',
    cta: 'Watch Live',
    ctaLink: '/scores',
  },
  {
    id: 2,
    image: 'https://images.unsplash.com/photo-1579952363873-27f3bade9f55?w=1920&q=90&auto=format',
    title: 'Football Action',
    subtitle: 'Premier League, La Liga, Champions League and more',
    badge: 'Football',
    badgeColor: 'bg-blue-500',
    cta: 'Explore Leagues',
    ctaLink: '/leagues',
  },
  {
    id: 3,
    image: 'https://images.unsplash.com/photo-1546519638-68e109498ffc?w=1920&q=90&auto=format',
    title: 'NBA Basketball',
    subtitle: 'Live NBA scores, stats, and AI-powered predictions',
    badge: 'Basketball',
    badgeColor: 'bg-orange-500',
    cta: 'View Scores',
    ctaLink: '/espn',
  },
  {
    id: 4,
    image: 'https://images.unsplash.com/photo-1508098682722-e99c43a406b2?w=1920&q=90&auto=format',
    title: 'AI Match Predictions',
    subtitle: 'GPT-4 powered predictions with 85% accuracy rate',
    badge: 'AI Powered',
    badgeColor: 'bg-purple-500',
    cta: 'Try AI Predict',
    ctaLink: '/predictions',
  },
  {
    id: 5,
    image: 'https://images.unsplash.com/photo-1461896836934-bd45ba8a0e95?w=1920&q=90&auto=format',
    title: 'Tennis Grand Slams',
    subtitle: 'Australian Open, French Open, Wimbledon, US Open',
    badge: 'Tennis',
    badgeColor: 'bg-yellow-500',
    cta: 'Follow Players',
    ctaLink: '/players',
  },
  {
    id: 6,
    image: 'https://images.unsplash.com/photo-1566577739112-5180d4bf9390?w=1920&q=90&auto=format',
    title: 'Baseball Season',
    subtitle: 'MLB live scores, standings, and player stats',
    badge: 'Baseball',
    badgeColor: 'bg-red-500',
    cta: 'View MLB',
    ctaLink: '/espn',
  },
  {
    id: 7,
    image: 'https://images.unsplash.com/photo-1580692475446-c2fabbbbf835?w=1920&q=90&auto=format',
    title: 'Fantasy Sports',
    subtitle: 'Build your dream team and compete with millions',
    badge: 'Fantasy',
    badgeColor: 'bg-teal-500',
    cta: 'Play Fantasy',
    ctaLink: '/fantasy',
  },
  {
    id: 8,
    image: 'https://images.unsplash.com/photo-1574629810360-7efbbe195018?w=1920&q=90&auto=format',
    title: 'Hockey Night',
    subtitle: 'NHL live updates and ice hockey coverage worldwide',
    badge: 'Hockey',
    badgeColor: 'bg-cyan-500',
    cta: 'Watch NHL',
    ctaLink: '/espn',
  },
  {
    id: 9,
    image: 'https://images.unsplash.com/photo-1530549387789-4c1017266635?w=1920&q=90&auto=format',
    title: 'Swimming & Olympics',
    subtitle: 'Olympic sports coverage with real-time results',
    badge: 'Olympics',
    badgeColor: 'bg-indigo-500',
    cta: 'Explore Sports',
    ctaLink: '/leagues',
  },
  {
    id: 10,
    image: 'https://images.unsplash.com/photo-1517649763962-0c623066013b?w=1920&q=90&auto=format',
    title: 'Premium Experience',
    subtitle: 'Ad-free, exclusive content, and advanced analytics',
    badge: 'Premium',
    badgeColor: 'bg-gradient-to-r from-yellow-500 to-orange-500',
    cta: 'Go Premium',
    ctaLink: '/premium',
  },
];

export function HeroSection() {
  const [current, setCurrent] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  const next = useCallback(() => {
    setCurrent((prev) => (prev + 1) % heroSlides.length);
  }, []);

  const prev = useCallback(() => {
    setCurrent((prev) => (prev - 1 + heroSlides.length) % heroSlides.length);
  }, []);

  useEffect(() => {
    if (isPaused) return;
    const interval = setInterval(next, 5000);
    return () => clearInterval(interval);
  }, [isPaused, next]);

  const slide = heroSlides[current];

  return (
    <section
      className="relative w-full h-[600px] md:h-[700px] lg:h-[800px] overflow-hidden"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      {/* Background Images */}
      {heroSlides.map((s, i) => (
        <div
          key={s.id}
          className="absolute inset-0 transition-opacity duration-1000 ease-in-out"
          style={{ opacity: i === current ? 1 : 0 }}
        >
          <div
            className="absolute inset-0 bg-cover bg-center bg-no-repeat transform scale-105"
            style={{
              backgroundImage: `url(${s.image})`,
              animation: i === current ? 'kenBurns 8s ease-in-out infinite alternate' : 'none',
            }}
          />
          <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/50 to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
        </div>
      ))}

      {/* Content */}
      <div className="relative container h-full flex items-center">
        <div className="max-w-2xl text-white z-10">
          <Badge className={`${slide.badgeColor} text-white mb-4 px-3 py-1 text-sm`}>
            {slide.badge}
          </Badge>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-4 leading-tight animate-fadeIn">
            {slide.title}
          </h1>
          <p className="text-lg md:text-xl text-gray-200 mb-8 animate-fadeIn">
            {slide.subtitle}
          </p>
          <div className="flex flex-wrap gap-4">
            <Button size="lg" asChild className="bg-blue-600 hover:bg-blue-700 text-white px-8">
              <Link href={slide.ctaLink}>
                <Play className="h-5 w-5 mr-2" />
                {slide.cta}
              </Link>
            </Button>
            <Button size="lg" variant="outline" asChild className="border-white/30 text-white hover:bg-white/10 px-8">
              <Link href="/premium">
                <Brain className="h-5 w-5 mr-2" />
                Try AI Free
              </Link>
            </Button>
          </div>

          {/* Stats */}
          <div className="flex items-center gap-8 mt-12">
            <div>
              <p className="text-3xl font-bold">2M+</p>
              <p className="text-sm text-gray-300">Active Users</p>
            </div>
            <div className="h-12 w-px bg-white/20" />
            <div>
              <p className="text-3xl font-bold">85%</p>
              <p className="text-sm text-gray-300">AI Accuracy</p>
            </div>
            <div className="h-12 w-px bg-white/20" />
            <div>
              <p className="text-3xl font-bold">50+</p>
              <p className="text-sm text-gray-300">Sports Covered</p>
            </div>
          </div>
        </div>

        {/* Navigation Arrows */}
        <button
          onClick={prev}
          className="absolute left-4 top-1/2 -translate-y-1/2 h-12 w-12 rounded-full bg-white/10 backdrop-blur-sm flex items-center justify-center text-white hover:bg-white/20 transition-colors z-20"
        >
          <ChevronLeft className="h-6 w-6" />
        </button>
        <button
          onClick={next}
          className="absolute right-4 top-1/2 -translate-y-1/2 h-12 w-12 rounded-full bg-white/10 backdrop-blur-sm flex items-center justify-center text-white hover:bg-white/20 transition-colors z-20"
        >
          <ChevronRight className="h-6 w-6" />
        </button>

        {/* Dots */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex items-center gap-2 z-20">
          {heroSlides.map((_, i) => (
            <button
              key={i}
              onClick={() => setCurrent(i)}
              className={`h-2 rounded-full transition-all duration-300 ${
                i === current ? 'w-8 bg-blue-500' : 'w-2 bg-white/40 hover:bg-white/60'
              }`}
            />
          ))}
        </div>
      </div>

      <style jsx>{`
        @keyframes kenBurns {
          from { transform: scale(1.05); }
          to { transform: scale(1.15); }
        }
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fadeIn {
          animation: fadeIn 0.8s ease-out forwards;
        }
      `}</style>
    </section>
  );
}
