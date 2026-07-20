import { Metadata } from "next";
import { SportMatchesView } from "@/components/sports/sport-matches-view";

export const metadata: Metadata = {
  title: "Football Live Scores | SportSphere",
  description:
    "Live football (soccer) scores from Premier League, La Liga, Serie A, Bundesliga, Champions League, MLS, and more",
};

export default function FootballPage() {
  return (
    <SportMatchesView
      sportSlug="football"
      sportName="Football"
      sportIcon="⚽"
      espnSport="soccer"
      showFootball={true}
      sportDescription="Live football scores from Premier League, La Liga, Serie A, Champions League and more"
    />
  );
}
