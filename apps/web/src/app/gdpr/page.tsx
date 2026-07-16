import { Metadata } from 'next';
import Link from 'next/link';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Shield, ArrowLeft, Calendar, Mail } from 'lucide-react';

export const metadata: Metadata = {
  title: 'GDPR Compliance | SportSphere AI',
  description: 'SportSphere AI GDPR Compliance - Your data rights under the General Data Protection Regulation.',
};

export default function GDPRPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      <Link href="/" className="inline-flex items-center text-sm text-muted-foreground hover:text-foreground mb-8">
        <ArrowLeft className="h-4 w-4 mr-1" /> Back to Home
      </Link>

      <div className="mb-8">
        <Badge variant="outline" className="mb-4 gap-1">
          <Shield className="h-3 w-3" />
          Legal
        </Badge>
        <h1 className="text-4xl font-bold mb-4">GDPR Compliance</h1>
        <div className="flex items-center gap-4 text-sm text-muted-foreground">
          <span className="flex items-center gap-1"><Calendar className="h-4 w-4" /> Last updated: January 15, 2026</span>
        </div>
      </div>

      <Card className="mb-8">
        <CardContent className="p-6 prose prose-sm max-w-none">
          <h2 className="text-2xl font-bold mt-6 mb-4">1. Overview</h2>
          <p className="text-muted-foreground leading-relaxed">
            SportSphere AI is committed to complying with the General Data Protection Regulation (GDPR) and protecting the data rights of users in the European Economic Area (EEA), United Kingdom, and other jurisdictions with applicable data protection laws.
          </p>

          <h2 className="text-2xl font-bold mt-6 mb-4">2. Data Controller</h2>
          <p className="text-muted-foreground leading-relaxed">
            SportSphere AI, Inc. is the data controller responsible for your personal data. If you have any questions about how we handle your data, please contact our Data Protection Officer at dpo@sportsphere.ai.
          </p>

          <h2 className="text-2xl font-bold mt-6 mb-4">3. Legal Basis for Processing</h2>
          <p className="text-muted-foreground leading-relaxed">We process your data under the following legal bases:</p>
          <ul className="list-disc pl-6 text-muted-foreground space-y-1">
            <li><strong>Contract Performance:</strong> Processing necessary to provide the Service you've requested</li>
            <li><strong>Legitimate Interest:</strong> Processing for analytics, fraud prevention, and service improvement</li>
            <li><strong>Consent:</strong> Marketing communications and non-essential cookies (opt-in only)</li>
            <li><strong>Legal Obligation:</strong> Retaining data as required by applicable law</li>
          </ul>

          <h2 className="text-2xl font-bold mt-6 mb-4">4. Your Data Rights</h2>
          <p className="text-muted-foreground leading-relaxed">Under GDPR, you have the following rights:</p>

          <h3 className="text-lg font-semibold mt-4 mb-2">Right of Access (Article 15)</h3>
          <p className="text-muted-foreground leading-relaxed">
            You have the right to request a copy of all personal data we hold about you. We will provide this within 30 days of your request in a structured, commonly used, machine-readable format (JSON or CSV).
          </p>

          <h3 className="text-lg font-semibold mt-4 mb-2">Right to Rectification (Article 16)</h3>
          <p className="text-muted-foreground leading-relaxed">
            You can request correction of any inaccurate personal data. You can update most information directly from your Dashboard and Settings page.
          </p>

          <h3 className="text-lg font-semibold mt-4 mb-2">Right to Erasure (Article 17)</h3>
          <p className="text-muted-foreground leading-relaxed">
            You have the right to request deletion of all personal data. Upon receiving your request, we will permanently delete all data within 30 days, except where retention is required by law.
          </p>

          <h3 className="text-lg font-semibold mt-4 mb-2">Right to Data Portability (Article 20)</h3>
          <p className="text-muted-foreground leading-relaxed">
            You can request your data in a machine-readable format (JSON) to transfer to another service. Use the "Export Data" feature in your Dashboard Settings.
          </p>

          <h3 className="text-lg font-semibold mt-4 mb-2">Right to Object (Article 21)</h3>
          <p className="text-muted-foreground leading-relaxed">
            You can object to processing based on legitimate interests, including profiling for marketing purposes. Contact dpo@sportsphere.ai to exercise this right.
          </p>

          <h3 className="text-lg font-semibold mt-4 mb-2">Right to Restrict Processing (Article 18)</h3>
          <p className="text-muted-foreground leading-relaxed">
            You can request restriction of processing in certain circumstances, such as when you contest the accuracy of your data.
          </p>

          <h2 className="text-2xl font-bold mt-6 mb-4">5. Data Transfers</h2>
          <p className="text-muted-foreground leading-relaxed">
            Your data is primarily processed in the United States and European Union. For transfers outside the EEA, we rely on Standard Contractual Clauses (SCCs) approved by the European Commission and ensure appropriate safeguards are in place.
          </p>

          <h2 className="text-2xl font-bold mt-6 mb-4">6. Data Protection Officer</h2>
          <p className="text-muted-foreground leading-relaxed">Our Data Protection Officer can be contacted at:</p>
          <p className="text-muted-foreground flex items-center gap-2">
            <Mail className="h-4 w-4" /> dpo@sportsphere.ai
          </p>

          <h2 className="text-2xl font-bold mt-6 mb-4">7. Supervisory Authority</h2>
          <p className="text-muted-foreground leading-relaxed">
            If you believe we have not handled your data properly, you have the right to lodge a complaint with your local data protection supervisory authority. For EU users, a list of authorities is available at <a href="https://edpb.europa.eu/about-edpb/about-edpb/members_en" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">edpb.europa.eu</a>.
          </p>

          <h2 className="text-2xl font-bold mt-6 mb-4">8. How to Exercise Your Rights</h2>
          <p className="text-muted-foreground leading-relaxed">To exercise any of your rights:</p>
          <ul className="list-disc pl-6 text-muted-foreground space-y-1">
            <li>Email: dpo@sportsphere.ai</li>
            <li>Dashboard: Settings, Privacy, Data Requests</li>
            <li>Mail: SportSphere AI, Inc., Attn: DPO</li>
          </ul>
          <p className="text-muted-foreground leading-relaxed">
            We will respond to all requests within 30 days. We may ask you to verify your identity before processing your request.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
