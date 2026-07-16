import { Metadata } from "next";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export const metadata: Metadata = {
  title: "Help Center | SportSphere AI",
  description: "Get help with using SportSphere AI",
};

const faqs = [
  {
    category: "Getting Started",
    items: [
      { q: "How do I create an account?", a: "Click Sign up on the top right. Register with email, Google, or GitHub." },
      { q: "Is SportSphere AI free?", a: "Yes! Free tier includes live scores, basic predictions, and news. Premium adds advanced analytics." },
      { q: "Which sports are supported?", a: "Cricket, Football, Basketball, and Tennis. More coming soon!" },
    ],
  },
  {
    category: "Predictions and AI",
    items: [
      { q: "How accurate are predictions?", a: "75-85% depending on sport. Cricket ~82%, Football ~78%, Basketball ~85%, Tennis ~80%." },
      { q: "How does the model work?", a: "Ensemble ML models analyzing historical data, player form, head-to-head, weather, venue, and 50+ features." },
      { q: "Can I use predictions for betting?", a: "Predictions are for informational and entertainment purposes only. We do not endorse gambling." },
    ],
  },
  {
    category: "Account and Billing",
    items: [
      { q: "How do I upgrade to Premium?", a: "Go to Dashboard then Premium. Choose monthly or yearly plan." },
      { q: "How do I cancel my subscription?", a: "Go to Dashboard then Settings then Subscription. Click Cancel." },
      { q: "Do you offer refunds?", a: "Yes, within 14 days of purchase. Contact support@sportsphere.ai." },
    ],
  },
  {
    category: "Technical",
    items: [
      { q: "Why are live scores not updating?", a: "Check your internet connection. Live scores update every 5-30 seconds depending on the sport." },
      { q: "How do I enable notifications?", a: "Go to Dashboard then Settings then Notifications. Toggle your preferences." },
      { q: "Which browsers are supported?", a: "Chrome, Firefox, Safari, and Edge (latest two versions)." },
    ],
  },
];

export default function HelpPage() {
  return (
    <div className="container mx-auto py-12 max-w-3xl">
      <h1 className="text-4xl font-bold mb-2">Help Center</h1>
      <p className="text-gray-500 mb-8">Find answers to common questions and get support</p>

      <div className="space-y-8">
        {faqs.map((category) => (
          <div key={category.category}>
            <h2 className="text-xl font-bold mb-4">{category.category}</h2>
            <div className="space-y-3">
              {category.items.map((faq) => (
                <Card key={faq.q}>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-base">{faq.q}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-gray-600 dark:text-gray-400">{faq.a}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        ))}

        <Card className="bg-primary/5 border-primary/20">
          <CardContent className="p-6 text-center">
            <p className="text-lg font-semibold mb-2">Still need help?</p>
            <p className="text-gray-600 dark:text-gray-400 mb-4">
              Contact our support team and we will get back to you within 24 hours.
            </p>
            <a
              href="mailto:support@sportsphere.ai"
              className="inline-flex h-10 items-center justify-center rounded-lg bg-primary px-6 text-sm font-medium text-primary-foreground hover:bg-primary/90"
            >
              Contact Support
            </a>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
