import { Metadata } from 'next';
import Link from 'next/link';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ShieldAlert, ArrowLeft, Calendar } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Acceptable Use Policy | SportSphere AI',
  description: 'SportSphere AI Acceptable Use Policy - Guidelines for using our platform responsibly.',
};

export default function AcceptableUsePage() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      <Link href="/" className="inline-flex items-center text-sm text-muted-foreground hover:text-foreground mb-8">
        <ArrowLeft className="h-4 w-4 mr-1" /> Back to Home
      </Link>

      <div className="mb-8">
        <Badge variant="outline" className="mb-4 gap-1">
          <ShieldAlert className="h-3 w-3" />
          Legal
        </Badge>
        <h1 className="text-4xl font-bold mb-4">Acceptable Use Policy</h1>
        <div className="flex items-center gap-4 text-sm text-muted-foreground">
          <span className="flex items-center gap-1"><Calendar className="h-4 w-4" /> Last updated: January 15, 2026</span>
        </div>
      </div>

      <Card>
        <CardContent className="p-6 prose prose-sm max-w-none">
          <h2 className="text-2xl font-bold mt-6 mb-4">1. Purpose</h2>
          <p className="text-muted-foreground leading-relaxed">
            This Acceptable Use Policy ("AUP") outlines the rules and guidelines for using SportSphere AI. By using our Service, you agree to comply with this policy.
          </p>

          <h2 className="text-2xl font-bold mt-6 mb-4">2. Prohibited Activities</h2>
          <p className="text-muted-foreground leading-relaxed">You must not:</p>
          <ul className="list-disc pl-6 text-muted-foreground space-y-1">
            <li>Use the Service for any illegal purpose or in violation of any local, state, national, or international law</li>
            <li>Attempt to gain unauthorized access to any part of the Service, other accounts, or connected systems</li>
            <li>Use automated systems (bots, crawlers, scrapers) to access the Service without written permission</li>
            <li>Interfere with, disrupt, or overload the Service or its infrastructure</li>
            <li>Transmit malware, viruses, or any malicious code</li>
            <li>Phish, pharm, or attempt to steal user credentials</li>
            <li>Impersonate another person or entity, or falsely claim affiliation</li>
            <li>Collect or harvest personal information of other users without consent</li>
            <li>Use the Service to send unsolicited communications (spam)</li>
            <li>Circumvent any security features or rate limits of the Service</li>
            <li>Reverse engineer, decompile, or disassemble any part of the Service</li>
            <li>Use the Service to develop a competing product or service</li>
          </ul>

          <h2 className="text-2xl font-bold mt-6 mb-4">3. Content Guidelines</h2>
          <p className="text-muted-foreground leading-relaxed">When using interactive features (comments, predictions, profiles), you must not post content that is:</p>
          <ul className="list-disc pl-6 text-muted-foreground space-y-1">
            <li>Hateful, discriminatory, or promotes violence</li>
            <li>Harassing, bullying, or threatening toward others</li>
            <li>Sexually explicit or exploitative</li>
            <li>Spam or promotional content without authorization</li>
            <li>False, misleading, or deceptive</li>
            <li>Infringing on intellectual property rights</li>
          </ul>

          <h2 className="text-2xl font-bold mt-6 mb-4">4. API Usage</h2>
          <p className="text-muted-foreground leading-relaxed">
            If you have API access (Enterprise plan), you must comply with rate limits, not share API credentials, and not use the API to build competing services without authorization.
          </p>

          <h2 className="text-2xl font-bold mt-6 mb-4">5. Enforcement</h2>
          <p className="text-muted-foreground leading-relaxed">
            Violations may result in warning, temporary suspension, permanent account termination, and/or legal action. We reserve the right to investigate and take appropriate action against violators.
          </p>

          <h2 className="text-2xl font-bold mt-6 mb-4">6. Reporting Violations</h2>
          <p className="text-muted-foreground leading-relaxed">
            To report a violation of this policy, email trust@sportsphere.ai with details of the violation.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
