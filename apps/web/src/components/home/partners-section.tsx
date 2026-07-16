'use client';

import { Badge } from '@/components/ui/badge';

const partners = [
  { name: 'ESPN', logo: 'ESPN' },
  { name: 'Premier League', logo: 'EPL' },
  { name: 'NBA', logo: 'NBA' },
  { name: 'IPL', logo: 'IPL' },
  { name: 'UFC', logo: 'UFC' },
  { name: 'Formula 1', logo: 'F1' },
  { name: 'Champions League', logo: 'UCL' },
  { name: 'MLB', logo: 'MLB' },
];

export function PartnersSection() {
  return (
    <section className="py-12 border-y bg-muted/30">
      <div className="container">
        <div className="text-center mb-8">
          <p className="text-sm text-muted-foreground uppercase tracking-wider font-medium">
            Data powered by industry leaders
          </p>
        </div>
        <div className="flex flex-wrap items-center justify-center gap-8 md:gap-12">
          {partners.map((partner) => (
            <div
              key={partner.name}
              className="flex items-center justify-center h-12 px-6 rounded-lg bg-background border hover:shadow-md transition-shadow cursor-pointer"
            >
              <span className="text-lg font-bold text-muted-foreground hover:text-foreground transition-colors">
                {partner.logo}
              </span>
            </div>
          ))}
        </div>
        <div className="text-center mt-8">
          <Badge variant="outline" className="text-xs">
            + 20 more data providers worldwide
          </Badge>
        </div>
      </div>
    </section>
  );
}
