"use client";

import * as React from "react";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { Separator } from "@/components/ui/separator";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Trophy, Mail, MapPin, Phone, Star, Shield, Globe, Zap, Twitter, Github, Youtube, Instagram, Linkedin, ArrowRight } from "lucide-react";

const Footer = React.forwardRef<HTMLElement, any>(
  ({ className, ...props }, ref) => {
    const [email, setEmail] = React.useState("");
    const [subscribed, setSubscribed] = React.useState(false);

    const handleSubscribe = (e: React.FormEvent) => {
      e.preventDefault();
      if (email) {
        setSubscribed(true);
        setEmail("");
        setTimeout(() => setSubscribed(false), 3000);
      }
    };

    return (
      <footer
        ref={ref}
        className={cn("border-t bg-background", className)}
        {...props}
      >
        {/* Newsletter Bar */}
        <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white">
          <div className="container py-8">
            <div className="flex flex-col md:flex-row items-center justify-between gap-6">
              <div>
                <h3 className="text-xl font-bold">Stay Ahead of the Game</h3>
                <p className="text-blue-100 text-sm mt-1">Get live scores, AI predictions, and breaking sports news delivered to your inbox.</p>
              </div>
              <form onSubmit={handleSubscribe} className="flex gap-2 w-full md:w-auto">
                <Input
                  type="email"
                  placeholder="Enter your email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="bg-white/10 border-white/20 text-white placeholder:text-white/60 w-full md:w-72"
                />
                <Button type="submit" className="bg-white text-blue-600 hover:bg-white/90 whitespace-nowrap">
                  {subscribed ? "Subscribed!" : "Subscribe"}
                  {!subscribed && <ArrowRight className="h-4 w-4 ml-1" />}
                </Button>
              </form>
            </div>
          </div>
        </div>

        {/* Main Footer */}
        <div className="container py-12 md:py-16">
          <div className="grid grid-cols-2 md:grid-cols-6 gap-8">
            {/* Brand */}
            <div className="col-span-2">
              <Link href="/" className="flex items-center space-x-2 mb-4">
                <Trophy className="h-8 w-8 text-blue-600" />
                <div>
                  <span className="font-bold text-lg bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                    SportSphere
                  </span>
                  <span className="text-[10px] block text-muted-foreground">AI-Powered Sports Platform</span>
                </div>
              </Link>
              <p className="text-sm text-muted-foreground mb-4 max-w-xs">
                The world's most advanced AI-powered sports platform. Real-time scores, intelligent predictions, fantasy sports, and comprehensive coverage of every major sport.
              </p>
              <div className="flex items-center gap-4 mb-4">
                <Badge variant="secondary" className="gap-1">
                  <Star className="h-3 w-3 text-yellow-500" /> 4.9/5 Rating
                </Badge>
                <Badge variant="secondary" className="gap-1">
                  <Globe className="h-3 w-3" /> 2M+ Users
                </Badge>
              </div>
              <div className="flex items-center gap-3">
                <Link href="https://twitter.com/sportsphere" className="h-9 w-9 rounded-full bg-muted flex items-center justify-center hover:bg-blue-500 hover:text-white transition-colors" aria-label="Twitter">
                  <Twitter className="h-4 w-4" />
                </Link>
                <Link href="https://github.com/sportsphere" className="h-9 w-9 rounded-full bg-muted flex items-center justify-center hover:bg-gray-800 hover:text-white transition-colors" aria-label="GitHub">
                  <Github className="h-4 w-4" />
                </Link>
                <Link href="https://youtube.com/sportsphere" className="h-9 w-9 rounded-full bg-muted flex items-center justify-center hover:bg-red-500 hover:text-white transition-colors" aria-label="YouTube">
                  <Youtube className="h-4 w-4" />
                </Link>
                <Link href="https://instagram.com/sportsphere" className="h-9 w-9 rounded-full bg-muted flex items-center justify-center hover:bg-pink-500 hover:text-white transition-colors" aria-label="Instagram">
                  <Instagram className="h-4 w-4" />
                </Link>
                <Link href="https://linkedin.com/company/sportsphere" className="h-9 w-9 rounded-full bg-muted flex items-center justify-center hover:bg-blue-700 hover:text-white transition-colors" aria-label="LinkedIn">
                  <Linkedin className="h-4 w-4" />
                </Link>
              </div>
            </div>

            {/* Sports */}
            <div>
              <h3 className="mb-4 text-sm font-semibold uppercase tracking-wider">Sports</h3>
              <ul className="space-y-2.5 text-sm">
                <li><Link href="/matches?sport=cricket" className="text-muted-foreground hover:text-foreground transition-colors">Cricket</Link></li>
                <li><Link href="/matches?sport=football" className="text-muted-foreground hover:text-foreground transition-colors">Football</Link></li>
                <li><Link href="/matches?sport=basketball" className="text-muted-foreground hover:text-foreground transition-colors">Basketball</Link></li>
                <li><Link href="/matches?sport=baseball" className="text-muted-foreground hover:text-foreground transition-colors">Baseball</Link></li>
                <li><Link href="/matches?sport=hockey" className="text-muted-foreground hover:text-foreground transition-colors">Hockey</Link></li>
                <li><Link href="/matches?sport=tennis" className="text-muted-foreground hover:text-foreground transition-colors">Tennis</Link></li>
                <li><Link href="/espn" className="text-muted-foreground hover:text-foreground transition-colors flex items-center gap-1">
                  ESPN Scores <Badge variant="outline" className="text-[10px] h-4">LIVE</Badge>
                </Link></li>
              </ul>
            </div>

            {/* Platform */}
            <div>
              <h3 className="mb-4 text-sm font-semibold uppercase tracking-wider">Platform</h3>
              <ul className="space-y-2.5 text-sm">
                <li><Link href="/scores" className="text-muted-foreground hover:text-foreground transition-colors">Live Scores</Link></li>
                <li><Link href="/predictions" className="text-muted-foreground hover:text-foreground transition-colors">AI Predictions</Link></li>
                <li><Link href="/fantasy" className="text-muted-foreground hover:text-foreground transition-colors">Fantasy Sports</Link></li>
                <li><Link href="/rankings" className="text-muted-foreground hover:text-foreground transition-colors">Rankings</Link></li>
                <li><Link href="/leaderboard" className="text-muted-foreground hover:text-foreground transition-colors">Leaderboard</Link></li>
                <li><Link href="/premium" className="text-muted-foreground hover:text-foreground transition-colors flex items-center gap-1">
                  <Zap className="h-3 w-3 text-yellow-500" /> Premium
                </Link></li>
              </ul>
            </div>

            {/* Resources */}
            <div>
              <h3 className="mb-4 text-sm font-semibold uppercase tracking-wider">Resources</h3>
              <ul className="space-y-2.5 text-sm">
                <li><Link href="/news" className="text-muted-foreground hover:text-foreground transition-colors">Sports News</Link></li>
                <li><Link href="/teams" className="text-muted-foreground hover:text-foreground transition-colors">Teams</Link></li>
                <li><Link href="/players" className="text-muted-foreground hover:text-foreground transition-colors">Players</Link></li>
                <li><Link href="/leagues" className="text-muted-foreground hover:text-foreground transition-colors">Leagues</Link></li>
                <li><Link href="/about" className="text-muted-foreground hover:text-foreground transition-colors">About Us</Link></li>
                <li><Link href="/contact" className="text-muted-foreground hover:text-foreground transition-colors">Contact</Link></li>
              </ul>
            </div>

            {/* Legal */}
            <div>
              <h3 className="mb-4 text-sm font-semibold uppercase tracking-wider">Legal</h3>
              <ul className="space-y-2.5 text-sm">
                <li><Link href="/privacy" className="text-muted-foreground hover:text-foreground transition-colors">Privacy Policy</Link></li>
                <li><Link href="/terms" className="text-muted-foreground hover:text-foreground transition-colors">Terms of Service</Link></li>
                <li><Link href="/cookies" className="text-muted-foreground hover:text-foreground transition-colors">Cookie Policy</Link></li>
                <li><Link href="/gdpr" className="text-muted-foreground hover:text-foreground transition-colors">GDPR</Link></li>
                <li><Link href="/acceptable-use" className="text-muted-foreground hover:text-foreground transition-colors">Acceptable Use</Link></li>
                <li><Link href="/dmca" className="text-muted-foreground hover:text-foreground transition-colors">DMCA</Link></li>
                <li><Link href="/licensing" className="text-muted-foreground hover:text-foreground transition-colors">Licensing</Link></li>
              </ul>
            </div>
          </div>

          <Separator className="my-8" />

          {/* Bottom Bar */}
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex flex-col md:flex-row items-center gap-4 text-sm text-muted-foreground">
              <p>&copy; {new Date().getFullYear()} SportSphere AI. All rights reserved.</p>
              <div className="flex items-center gap-4">
                <Link href="/sitemap.xml" className="hover:text-foreground transition-colors">Sitemap</Link>
                <Link href="/robots.txt" className="hover:text-foreground transition-colors">Robots</Link>
                <a href="mailto:contact@sportsphere.ai" className="hover:text-foreground transition-colors flex items-center gap-1">
                  <Mail className="h-3 w-3" /> contact@sportsphere.ai
                </a>
              </div>
            </div>
            <div className="flex items-center gap-4 text-sm text-muted-foreground">
              <span className="flex items-center gap-1"><MapPin className="h-3 w-3" /> Global</span>
              <span className="flex items-center gap-1"><Phone className="h-3 w-3" /> +1 (555) 123-4567</span>
              <span className="flex items-center gap-1">
                <Shield className="h-3 w-3 text-green-500" /> SOC 2 Certified
              </span>
            </div>
          </div>
        </div>
      </footer>
    );
  }
);
Footer.displayName = "Footer";

export { Footer };
