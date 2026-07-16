import { Metadata } from 'next';
import Link from 'next/link';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Key, ArrowLeft, Calendar, Mail, ExternalLink } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Licensing | SportSphere AI',
  description: 'SportSphere AI Licensing - API licensing, data licensing, and content usage rights.',
};

export default function LicensingPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      <Link href="/" className="inline-flex items-center text-sm text-muted-foreground hover:text-foreground mb-8">
        <ArrowLeft className="h-4 w-4 mr-1" /> Back to Home
      </Link>

      <div className="mb-8">
        <Badge variant="outline" className="mb-4 gap-1">
          <Key className="h-3 w-3" />
          Legal
        </Badge>
        <h1 className="text-4xl font-bold mb-4">Licensing</h1>
        <div className="flex items-center gap-4 text-sm text-muted-foreground">
          <span className="flex items-center gap-1"><Calendar className="h-4 w-4" /> Last updated: January 15, 2026</span>
        </div>
      </div>

      <Card className="mb-6">
        <CardContent className="p-6 prose prose-sm max-w-none">
          <h2 className="text-2xl font-bold mt-6 mb-4">1. Platform License</h2>
          <p className="text-muted-foreground leading-relaxed">
            SportSphere AI grants you a limited, non-exclusive, non-transferable, revocable license to access and use the Service for personal, non-commercial purposes, subject to these Terms.
          </p>

          <h2 className="text-2xl font-bold mt-6 mb-4">2. API License</h2>
          <p className="text-muted-foreground leading-relaxed">
            Enterprise subscribers receive a limited license to use the SportSphere AI API for internal business purposes. API access is subject to rate limits, usage terms, and the Enterprise Agreement.
          </p>
          <ul className="list-disc pl-6 text-muted-foreground space-y-1">
            <li>REST API: 1,000 requests/minute</li>
            <li>WebSocket: 100 concurrent connections</li>
            <li>Data retention: 90 days historical data</li>
          </ul>

          <h2 className="text-2xl font-bold mt-6 mb-4">3. Content License</h2>
          <p className="text-muted-foreground leading-relaxed">
            All content on SportSphere AI (articles, analysis, predictions, UI design) is owned by SportSphere AI or its licensors and protected by copyright law. You may not reproduce, distribute, or create derivative works without written permission.
          </p>

          <h2 className="text-2xl font-bold mt-6 mb-4">4. Data Licensing</h2>
          <p className="text-muted-foreground leading-relaxed">
            Sports data displayed on SportSphere AI is provided by third-party data providers including ESPN, CricAPI, and Football-Data.org. Data usage is subject to each provider's terms. Contact us for bulk data licensing.
          </p>

          <h2 className="text-2xl font-bold mt-6 mb-4">5. Open Source</h2>
          <p className="text-muted-foreground leading-relaxed">
            Some components of SportSphere AI may use open-source software. A list of open-source dependencies is available in our project repository. These components are licensed under their respective open-source licenses.
          </p>

          <h2 className="text-2xl font-bold mt-6 mb-4">6. Trademarks</h2>
          <p className="text-muted-foreground leading-relaxed">
            "SportSphere AI," the SportSphere logo, and all related marks are trademarks of SportSphere AI, Inc. You may not use our trademarks without prior written consent.
          </p>

          <h2 className="text-2xl font-bold mt-6 mb-4">7. Contact</h2>
          <p className="text-muted-foreground leading-relaxed">For licensing inquiries:</p>
          <p className="text-muted-foreground flex items-center gap-2">
            <Mail className="h-4 w-4" /> licensing@sportsphere.ai
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
