import { Metadata } from "next";
import { SportMatchesView } from "@/components/sports/sport-matches-view";

export const metadata: Metadata = {
  title: "Basketball Live Scores | SportSphere",
  description:
    "Live basketball scores from NBA, WNBA, NCAA, EuroLeague, and basketball leagues worldwide",
};

export default function BasketballPage() {
  return (
    <SportMatchesView
      sportSlug="basketball"
      sportName="Basketball"
      sportIcon="🏀"
      espnSport="basketball"
      sportDescription="Live NBA, WNBA, and international basketball scores"
    />
  );
}
