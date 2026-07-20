import { Metadata } from "next";
import { SportMatchesView } from "@/components/sports/sport-matches-view";

export const metadata: Metadata = {
  title: "Hockey Live Scores | SportSphere",
  description:
    "Live ice hockey scores from NHL, KHL, SHL, and hockey leagues worldwide",
};

export default function HockeyPage() {
  return (
    <SportMatchesView
      sportSlug="hockey"
      sportName="Hockey"
      sportIcon="🏒"
      espnSport="hockey"
      sportDescription="Live NHL and international ice hockey scores"
    />
  );
}
