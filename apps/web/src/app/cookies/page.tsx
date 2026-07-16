import { Metadata } from 'next';
import Link from 'next/link';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Cookie, ArrowLeft, Calendar } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Cookie Policy | SportSphere AI',
  description: 'SportSphere AI Cookie Policy - How we use cookies and tracking technologies.',
};

export default function CookiePolicyPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      <Link href="/" className="inline-flex items-center text-sm text-muted-foreground hover:text-foreground mb-8">
        <ArrowLeft className="h-4 w-4 mr-1" /> Back to Home
      </Link>

      <div className="mb-8">
        <Badge variant="outline" className="mb-4 gap-1">
          <Cookie className="h-3 w-3" />
          Legal
        </Badge>
        <h1 className="text-4xl font-bold mb-4">Cookie Policy</h1>
        <div className="flex items-center gap-4 text-sm text-muted-foreground">
          <span className="flex items-center gap-1"><Calendar className="h-4 w-4" /> Last updated: January 15, 2026</span>
        </div>
      </div>

      <Card className="mb-8">
        <CardContent className="p-6 prose prose-sm max-w-none">
          <h2 className="text-2xl font-bold mt-6 mb-4">1. What Are Cookies?</h2>
          <p className="text-muted-foreground leading-relaxed">
            Cookies are small text files that are stored on your device when you visit our website. They help us provide you with a better experience by remembering your preferences and understanding how you use our Service.
          </p>

          <h2 className="text-2xl font-bold mt-6 mb-4">2. How We Use Cookies</h2>
          <p className="text-muted-foreground leading-relaxed">We use cookies for the following purposes:</p>
          <ul className="list-disc pl-6 text-muted-foreground space-y-1">
            <li><strong>Essential Cookies:</strong> Required for the Service to function (authentication, session management, security)</li>
            <li><strong>Preference Cookies:</strong> Remember your settings and preferences (theme, language, favorite teams)</li>
            <li><strong>Analytics Cookies:</strong> Help us understand how visitors interact with our Service (page views, features used)</li>
            <li><strong>Marketing Cookies:</strong> Used to deliver relevant advertisements and track campaign performance</li>
          </ul>

          <h2 className="text-2xl font-bold mt-6 mb-4">3. Specific Cookies We Use</h2>
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead className="border-b">
                <tr>
                  <th className="py-2 font-medium">Cookie</th>
                  <th className="py-2 font-medium">Purpose</th>
                  <th className="py-2 font-medium">Duration</th>
                  <th className="py-2 font-medium">Type</th>
                </tr>
              </thead>
              <tbody className="text-muted-foreground">
                <tr className="border-b"><td className="py-2">session_token</td><td>Authentication</td><td>30 days</td><td>Essential</td></tr>
                <tr className="border-b"><td className="py-2">csrf_token</td><td>Security</td><td>Session</td><td>Essential</td></tr>
                <tr className="border-b"><td className="py-2">theme</td><td>UI preference</td><td>1 year</td><td>Preference</td></tr>
                <tr className="border-b"><td className="py-2">language</td><td>Language setting</td><td>1 year</td><td>Preference</td></tr>
                <tr className="border-b"><td className="py-2">favorite_sports</td><td>Sport preferences</td><td>1 year</td><td>Preference</td></tr>
                <tr className="border-b"><td className="py-2">_vercel_analytics</td><td>Usage analytics</td><td>Session</td><td>Analytics</td></tr>
                <tr className="border-b"><td className="py-2">_ga</td><td>Google Analytics</td><td>2 years</td><td>Analytics</td></tr>
              </tbody>
            </table>
          </div>

          <h2 className="text-2xl font-bold mt-6 mb-4">4. Third-Party Cookies</h2>
          <p className="text-muted-foreground leading-relaxed">Some cookies are placed by third-party services:</p>
          <ul className="list-disc pl-6 text-muted-foreground space-y-1">
            <li><strong>Stripe:</strong> Payment processing cookies for secure transactions</li>
            <li><strong>Vercel Analytics:</strong> Privacy-focused analytics (no cookies, uses telemetry)</li>
            <li><strong>Google Analytics:</strong> Website usage analytics (can be opted out)</li>
          </ul>

          <h2 className="text-2xl font-bold mt-6 mb-4">5. Managing Cookies</h2>
          <p className="text-muted-foreground leading-relaxed">
            You can control and manage cookies through your browser settings. Most browsers allow you to block or delete cookies. However, blocking essential cookies may affect the functionality of the Service.
          </p>
          <p className="text-muted-foreground leading-relaxed">Browser-specific instructions:</p>
          <ul className="list-disc pl-6 text-muted-foreground space-y-1">
            <li><a href="https://support.google.com/chrome/answer/95647" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">Google Chrome</a></li>
            <li><a href="https://support.mozilla.org/en-US/kb/cookies-information-websites-store-on-your-computer" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">Mozilla Firefox</a></li>
            <li><a href="https://support.apple.com/guide/safari/manage-cookies-sfri11471/mac" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">Apple Safari</a></li>
            <li><a href="https://support.microsoft.com/en-us/microsoft-edge/delete-cookies-in-microsoft-edge-63947406-40ac-c3b8-57b9-2a946a29ae09" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">Microsoft Edge</a></li>
          </ul>

          <h2 className="text-2xl font-bold mt-6 mb-4">6. Your Choices</h2>
          <p className="text-muted-foreground leading-relaxed">
            You can opt out of analytics cookies by clicking the "Do Not Sell My Personal Information" link in our footer or by adjusting your browser settings. Essential cookies cannot be disabled as they are necessary for the Service to function.
          </p>

          <h2 className="text-2xl font-bold mt-6 mb-4">7. Updates to This Policy</h2>
          <p className="text-muted-foreground leading-relaxed">
            We may update this Cookie Policy from time to time. Any changes will be posted on this page with an updated revision date.
          </p>

          <h2 className="text-2xl font-bold mt-6 mb-4">8. Contact</h2>
          <p className="text-muted-foreground leading-relaxed">
            For questions about our Cookie Policy, contact us at privacy@sportsphere.ai.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
