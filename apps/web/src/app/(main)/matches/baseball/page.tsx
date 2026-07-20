import { Metadata } from "next";
import { SportMatchesView } from "@/components/sports/sport-matches-view";

export const metadata: Metadata = {
  title: "Baseball Live Scores | SportSphere",
  description:
    "Live baseball scores from MLB, NPB, KBO, and baseball leagues worldwide",
};

export default function BaseballPage() {
  return (
    <SportMatchesView
      sportSlug="baseball"
      sportName="Baseball"
      sportIcon="⚾"
      espnSport="baseball"
      sportDescription="Live MLB and international baseball scores"
    />
  );
}
