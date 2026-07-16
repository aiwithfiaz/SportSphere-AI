import { Metadata } from 'next';
import Link from 'next/link';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { FileText, ArrowLeft, Calendar, Mail } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Terms of Service | SportSphere AI',
  description: 'SportSphere AI Terms of Service - Rules and guidelines for using our platform.',
};

export default function TermsOfServicePage() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      <Link href="/" className="inline-flex items-center text-sm text-muted-foreground hover:text-foreground mb-8">
        <ArrowLeft className="h-4 w-4 mr-1" /> Back to Home
      </Link>

      <div className="mb-8">
        <Badge variant="outline" className="mb-4 gap-1">
          <FileText className="h-3 w-3" />
          Legal
        </Badge>
        <h1 className="text-4xl font-bold mb-4">Terms of Service</h1>
        <div className="flex items-center gap-4 text-sm text-muted-foreground">
          <span className="flex items-center gap-1"><Calendar className="h-4 w-4" /> Last updated: January 15, 2026</span>
          <span>Version 2.1</span>
        </div>
      </div>

      <Card className="mb-8">
        <CardContent className="p-6 prose prose-sm max-w-none">
          <h2 className="text-2xl font-bold mt-6 mb-4">1. Acceptance of Terms</h2>
          <p className="text-muted-foreground leading-relaxed">
            By accessing or using SportSphere AI ("the Service"), you agree to be bound by these Terms of Service ("Terms"). If you do not agree to these Terms, do not use the Service. These Terms constitute a legally binding agreement between you and SportSphere AI, Inc.
          </p>

          <h2 className="text-2xl font-bold mt-6 mb-4">2. Description of Service</h2>
          <p className="text-muted-foreground leading-relaxed">
            SportSphere AI is an AI-powered sports platform providing live scores, match predictions, fantasy sports, sports news, and related services. The Service includes our website, mobile web application, APIs, and any related tools or features.
          </p>

          <h2 className="text-2xl font-bold mt-6 mb-4">3. User Accounts</h2>
          <h3 className="text-lg font-semibold mt-4 mb-2">3.1 Registration</h3>
          <p className="text-muted-foreground leading-relaxed">
            You must be at least 13 years old to create an account. You agree to provide accurate, current, and complete information during registration and to keep your account information up to date.
          </p>
          <h3 className="text-lg font-semibold mt-4 mb-2">3.2 Account Security</h3>
          <p className="text-muted-foreground leading-relaxed">
            You are responsible for maintaining the confidentiality of your password and for all activities under your account. You must notify us immediately of any unauthorized use.
          </p>

          <h2 className="text-2xl font-bold mt-6 mb-4">4. Acceptable Use</h2>
          <p className="text-muted-foreground leading-relaxed">You agree not to:</p>
          <ul className="list-disc pl-6 text-muted-foreground space-y-1">
            <li>Use the Service for any unlawful purpose or in violation of any applicable law</li>
            <li>Attempt to gain unauthorized access to any part of the Service</li>
            <li>Interfere with or disrupt the Service or servers</li>
            <li>Use automated systems (bots, scrapers) to access the Service without written permission</li>
            <li>Reproduce, distribute, or create derivative works from our content</li>
            <li>Impersonate another person or entity</li>
            <li>Transmit spam, chain letters, or other unsolicited communications</li>
            <li>Attempt to reverse engineer or decompile any part of the Service</li>
          </ul>
          <p className="text-muted-foreground leading-relaxed">
            For complete details, see our <Link href="/acceptable-use" className="text-blue-600 hover:underline">Acceptable Use Policy</Link>.
          </p>

          <h2 className="text-2xl font-bold mt-6 mb-4">5. Subscriptions and Payments</h2>
          <h3 className="text-lg font-semibold mt-4 mb-2">5.1 Free Tier</h3>
          <p className="text-muted-foreground leading-relaxed">
            The Service includes a free tier with limited features. We reserve the right to modify free tier features at any time with reasonable notice.
          </p>
          <h3 className="text-lg font-semibold mt-4 mb-2">5.2 Premium Subscriptions</h3>
          <p className="text-muted-foreground leading-relaxed">
            Premium features require a paid subscription. Payments are processed securely through Stripe. By subscribing, you authorize us to charge your payment method on a recurring basis until you cancel.
          </p>
          <h3 className="text-lg font-semibold mt-4 mb-2">5.3 Cancellation and Refunds</h3>
          <p className="text-muted-foreground leading-relaxed">
            You may cancel your subscription at any time from your dashboard settings. We offer a 30-day money-back guarantee for new subscriptions. After 30 days, refunds are evaluated on a case-by-case basis.
          </p>

          <h2 className="text-2xl font-bold mt-6 mb-4">6. AI Predictions Disclaimer</h2>
          <p className="text-muted-foreground leading-relaxed">
            SportSphere AI provides AI-powered predictions and analysis for informational purposes only. Our predictions are based on historical data and machine learning models and should not be considered financial, gambling, or professional advice. Past prediction accuracy does not guarantee future results. You are solely responsible for any decisions made based on our predictions.
          </p>

          <h2 className="text-2xl font-bold mt-6 mb-4">7. Intellectual Property</h2>
          <p className="text-muted-foreground leading-relaxed">
            All content, features, and functionality of the Service (including text, graphics, logos, icons, images, data, software, and AI models) are the exclusive property of SportSphere AI or its licensors and are protected by copyright, trademark, and other intellectual property laws.
          </p>

          <h2 className="text-2xl font-bold mt-6 mb-4">8. Limitation of Liability</h2>
          <p className="text-muted-foreground leading-relaxed">
            To the maximum extent permitted by law, SportSphere AI shall not be liable for any indirect, incidental, special, consequential, or punitive damages, or any loss of profits or revenues, whether incurred directly or indirectly, or any loss of data, use, goodwill, or other intangible losses resulting from your use of the Service.
          </p>

          <h2 className="text-2xl font-bold mt-6 mb-4">9. Indemnification</h2>
          <p className="text-muted-foreground leading-relaxed">
            You agree to indemnify, defend, and hold harmless SportSphere AI and its officers, directors, employees, and agents from any claims, liabilities, damages, or expenses arising from your use of the Service or violation of these Terms.
          </p>

          <h2 className="text-2xl font-bold mt-6 mb-4">10. Termination</h2>
          <p className="text-muted-foreground leading-relaxed">
            We may suspend or terminate your access to the Service at any time, with or without cause, and with or without notice. Upon termination, your right to use the Service ceases immediately.
          </p>

          <h2 className="text-2xl font-bold mt-6 mb-4">11. Governing Law</h2>
          <p className="text-muted-foreground leading-relaxed">
            These Terms shall be governed by and construed in accordance with the laws of the State of Delaware, United States, without regard to its conflict of law provisions. Any disputes shall be resolved in the courts of Delaware.
          </p>

          <h2 className="text-2xl font-bold mt-6 mb-4">12. Changes to Terms</h2>
          <p className="text-muted-foreground leading-relaxed">
            We reserve the right to modify these Terms at any time. We will notify you of material changes by posting the updated Terms on this page and updating the "Last updated" date. Your continued use constitutes acceptance of the updated Terms.
          </p>

          <h2 className="text-2xl font-bold mt-6 mb-4">13. Contact</h2>
          <p className="text-muted-foreground leading-relaxed">Questions about these Terms? Contact us:</p>
          <p className="text-muted-foreground flex items-center gap-2">
            <Mail className="h-4 w-4" /> legal@sportsphere.ai
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
