import { Metadata } from 'next';
import Link from 'next/link';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Shield, ArrowLeft, Calendar, Mail, MapPin } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Privacy Policy | SportSphere AI',
  description: 'SportSphere AI Privacy Policy - How we collect, use, and protect your personal data.',
};

export default function PrivacyPolicyPage() {
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
        <h1 className="text-4xl font-bold mb-4">Privacy Policy</h1>
        <div className="flex items-center gap-4 text-sm text-muted-foreground">
          <span className="flex items-center gap-1"><Calendar className="h-4 w-4" /> Last updated: January 15, 2026</span>
          <span>Version 2.1</span>
        </div>
      </div>

      <Card className="mb-8">
        <CardContent className="p-6 prose prose-sm max-w-none">
          <h2 className="text-2xl font-bold mt-6 mb-4">1. Introduction</h2>
          <p className="text-muted-foreground leading-relaxed">
            Welcome to SportSphere AI ("we," "our," or "us"). We are committed to protecting your personal information and your right to privacy. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you use our website, mobile application, and services (collectively, the "Service").
          </p>
          <p className="text-muted-foreground leading-relaxed">
            By using SportSphere AI, you agree to the collection and use of information in accordance with this policy. If you do not agree with the terms of this privacy policy, please do not access the Service.
          </p>

          <h2 className="text-2xl font-bold mt-6 mb-4">2. Information We Collect</h2>
          <h3 className="text-lg font-semibold mt-4 mb-2">2.1 Personal Information</h3>
          <p className="text-muted-foreground leading-relaxed">We may collect the following personal information when you register an account:</p>
          <ul className="list-disc pl-6 text-muted-foreground space-y-1">
            <li>Name and email address</li>
            <li>Password (stored securely using bcrypt hashing)</li>
            <li>Profile picture (optional)</li>
            <li>Favorite teams and sports preferences</li>
            <li>Subscription and payment information (processed securely via Stripe)</li>
          </ul>

          <h3 className="text-lg font-semibold mt-4 mb-2">2.2 Usage Data</h3>
          <p className="text-muted-foreground leading-relaxed">We automatically collect certain information when you use the Service:</p>
          <ul className="list-disc pl-6 text-muted-foreground space-y-1">
            <li>Device information (browser type, operating system, device type)</li>
            <li>IP address and location data (country/region level only)</li>
            <li>Pages visited, features used, and time spent on the Service</li>
            <li>Referring website or source</li>
            <li>Search queries and interaction data</li>
          </ul>

          <h3 className="text-lg font-semibold mt-4 mb-2">2.3 Cookies and Tracking</h3>
          <p className="text-muted-foreground leading-relaxed">
            We use cookies and similar tracking technologies to maintain your session, remember your preferences, and analyze usage patterns. For more details, see our <Link href="/cookies" className="text-blue-600 hover:underline">Cookie Policy</Link>.
          </p>

          <h2 className="text-2xl font-bold mt-6 mb-4">3. How We Use Your Information</h2>
          <p className="text-muted-foreground leading-relaxed">We use the collected information for the following purposes:</p>
          <ul className="list-disc pl-6 text-muted-foreground space-y-1">
            <li>To provide, maintain, and improve the Service</li>
            <li>To personalize your experience and deliver customized content</li>
            <li>To process transactions and send related information</li>
            <li>To send administrative notifications (service updates, security alerts)</li>
            <li>To send marketing communications (with your consent)</li>
            <li>To analyze usage patterns and improve our AI models</li>
            <li>To detect, prevent, and address technical issues and fraud</li>
            <li>To comply with legal obligations</li>
          </ul>

          <h2 className="text-2xl font-bold mt-6 mb-4">4. AI and Data Processing</h2>
          <p className="text-muted-foreground leading-relaxed">
            SportSphere AI uses artificial intelligence (including OpenAI's GPT-4) to provide predictions, analysis, and personalized recommendations. Your usage data may be processed by our AI systems to improve prediction accuracy and user experience. We do not send personally identifiable information to third-party AI providers.
          </p>

          <h2 className="text-2xl font-bold mt-6 mb-4">5. Data Sharing</h2>
          <p className="text-muted-foreground leading-relaxed">We do not sell your personal information. We may share data with:</p>
          <ul className="list-disc pl-6 text-muted-foreground space-y-1">
            <li><strong>Service Providers:</strong> Vercel (hosting), Supabase (database), Stripe (payments), Vercel Analytics</li>
            <li><strong>Sports Data Providers:</strong> ESPN, CricAPI, Football-Data.org (anonymized usage data only)</li>
            <li><strong>Legal Requirements:</strong> When required by law, court order, or governmental regulation</li>
            <li><strong>Business Transfers:</strong> In connection with a merger, acquisition, or sale of assets (with notice to you)</li>
          </ul>

          <h2 className="text-2xl font-bold mt-6 mb-4">6. Data Security</h2>
          <p className="text-muted-foreground leading-relaxed">
            We implement industry-standard security measures including AES-256 encryption for data at rest, TLS 1.3 for data in transit, role-based access control, regular security audits, and automated threat detection. SportSphere AI is SOC 2 Type II certified.
          </p>

          <h2 className="text-2xl font-bold mt-6 mb-4">7. Your Rights (GDPR)</h2>
          <p className="text-muted-foreground leading-relaxed">If you are in the European Economic Area (EEA), you have the following rights:</p>
          <ul className="list-disc pl-6 text-muted-foreground space-y-1">
            <li><strong>Right to Access:</strong> Request a copy of your personal data</li>
            <li><strong>Right to Rectification:</strong> Request correction of inaccurate data</li>
            <li><strong>Right to Erasure:</strong> Request deletion of your personal data</li>
            <li><strong>Right to Portability:</strong> Receive your data in a structured, machine-readable format</li>
            <li><strong>Right to Object:</strong> Object to processing of your personal data</li>
            <li><strong>Right to Restrict:</strong> Request restriction of processing</li>
          </ul>
          <p className="text-muted-foreground leading-relaxed">
            For more details, see our <Link href="/gdpr" className="text-blue-600 hover:underline">GDPR page</Link>.
          </p>

          <h2 className="text-2xl font-bold mt-6 mb-4">8. Data Retention</h2>
          <p className="text-muted-foreground leading-relaxed">
            We retain your personal information only for as long as necessary to provide the Service and fulfill the purposes described in this policy. When you delete your account, we permanently delete all personal data within 30 days, except where required by law.
          </p>

          <h2 className="text-2xl font-bold mt-6 mb-4">9. Children's Privacy</h2>
          <p className="text-muted-foreground leading-relaxed">
            SportSphere AI is not intended for children under 13 years of age. We do not knowingly collect personal information from children. If we become aware that we have collected personal information from a child, we will take steps to delete it promptly.
          </p>

          <h2 className="text-2xl font-bold mt-6 mb-4">10. Changes to This Policy</h2>
          <p className="text-muted-foreground leading-relaxed">
            We may update this Privacy Policy from time to time. We will notify you of any changes by posting the new policy on this page and updating the "Last updated" date. Your continued use of the Service after changes constitutes acceptance of the updated policy.
          </p>

          <h2 className="text-2xl font-bold mt-6 mb-4">11. Contact Us</h2>
          <p className="text-muted-foreground leading-relaxed">If you have any questions about this Privacy Policy, please contact us:</p>
          <ul className="list-none text-muted-foreground space-y-2">
            <li className="flex items-center gap-2"><Mail className="h-4 w-4" /> privacy@sportsphere.ai</li>
            <li className="flex items-center gap-2"><MapPin className="h-4 w-4" /> SportSphere AI, Inc.</li>
          </ul>
        </CardContent>
      </Card>
    </div>
  );
}
