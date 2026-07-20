import { Metadata } from "next";
import { SportMatchesView } from "@/components/sports/sport-matches-view";

export const metadata: Metadata = {
  title: "Cricket Live Scores | SportSphere",
  description:
    "Live cricket scores, ball-by-ball commentary, and match updates from international and domestic cricket around the world",
};

export default function CricketPage() {
  return (
    <SportMatchesView
      sportSlug="cricket"
      sportName="Cricket"
      sportIcon="🏏"
      showCricbuzz={true}
      sportDescription="Live cricket scores from IPL, ICC, BBL, CPL, and leagues worldwide"
    />
  );
}
