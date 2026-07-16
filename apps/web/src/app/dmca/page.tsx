import { Metadata } from 'next';
import Link from 'next/link';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Copyright, ArrowLeft, Calendar, Mail } from 'lucide-react';

export const metadata: Metadata = {
  title: 'DMCA Policy | SportSphere AI',
  description: 'SportSphere AI DMCA Policy - Copyright infringement reporting procedures.',
};

export default function DMCAPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      <Link href="/" className="inline-flex items-center text-sm text-muted-foreground hover:text-foreground mb-8">
        <ArrowLeft className="h-4 w-4 mr-1" /> Back to Home
      </Link>

      <div className="mb-8">
        <Badge variant="outline" className="mb-4 gap-1">
          <Copyright className="h-3 w-3" />
          Legal
        </Badge>
        <h1 className="text-4xl font-bold mb-4">DMCA Policy</h1>
        <div className="flex items-center gap-4 text-sm text-muted-foreground">
          <span className="flex items-center gap-1"><Calendar className="h-4 w-4" /> Last updated: January 15, 2026</span>
        </div>
      </div>

      <Card>
        <CardContent className="p-6 prose prose-sm max-w-none">
          <h2 className="text-2xl font-bold mt-6 mb-4">1. Overview</h2>
          <p className="text-muted-foreground leading-relaxed">
            SportSphere AI respects the intellectual property rights of others and expects users to do the same. In accordance with the Digital Millennium Copyright Act (DMCA), we will respond to notices of alleged copyright infringement.
          </p>

          <h2 className="text-2xl font-bold mt-6 mb-4">2. Filing a DMCA Notice</h2>
          <p className="text-muted-foreground leading-relaxed">If you believe that content on our platform infringes your copyright, please send a written notice to our designated DMCA agent containing:</p>
          <ul className="list-disc pl-6 text-muted-foreground space-y-1">
            <li>Physical or electronic signature of the copyright owner or authorized agent</li>
            <li>Identification of the copyrighted work claimed to be infringed</li>
            <li>Identification of the material to be removed and its location on our platform</li>
            <li>Your contact information (name, address, phone, email)</li>
            <li>A statement that you have a good faith belief that the use is not authorized</li>
            <li>A statement, under penalty of perjury, that the information in the notice is accurate</li>
          </ul>

          <h2 className="text-2xl font-bold mt-6 mb-4">3. DMCA Agent Contact</h2>
          <p className="text-muted-foreground leading-relaxed">Send DMCA notices to our designated agent:</p>
          <p className="text-muted-foreground flex items-center gap-2">
            <Mail className="h-4 w-4" /> dmca@sportsphere.ai
          </p>
          <p className="text-muted-foreground leading-relaxed mt-2">
            SportSphere AI, Inc.<br />
            Attn: DMCA Agent<br />
            Email: dmca@sportsphere.ai
          </p>

          <h2 className="text-2xl font-bold mt-6 mb-4">4. Counter-Notification</h2>
          <p className="text-muted-foreground leading-relaxed">
            If you believe your content was removed by mistake, you may file a counter-notification containing your signature, identification of the removed material, a statement under penalty of perjury, and consent to jurisdiction.
          </p>

          <h2 className="text-2xl font-bold mt-6 mb-4">5. Repeat Infringers</h2>
          <p className="text-muted-foreground leading-relaxed">
            We will terminate the accounts of users who are determined to be repeat infringers in accordance with the DMCA.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
