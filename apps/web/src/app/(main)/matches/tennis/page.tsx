import { Metadata } from "next";
import { SportMatchesView } from "@/components/sports/sport-matches-view";

export const metadata: Metadata = {
  title: "Tennis Live Scores | SportSphere",
  description:
    "Live tennis scores from ATP, WTA, Grand Slams, and tennis tournaments worldwide",
};

export default function TennisPage() {
  return (
    <SportMatchesView
      sportSlug="tennis"
      sportName="Tennis"
      sportIcon="🎾"
      sportDescription="Live ATP, WTA, and Grand Slam tennis scores"
    />
  );
}
