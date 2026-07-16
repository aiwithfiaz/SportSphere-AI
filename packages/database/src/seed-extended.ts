import { PrismaClient } from "@prisma/client";
import { hash } from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  console.log("Seeding database with extended data...\n");

  // Get existing sport IDs
  const cricket = await prisma.sport.findUnique({ where: { slug: "cricket" } });
  const football = await prisma.sport.findUnique({ where: { slug: "football" } });
  const basketball = await prisma.sport.findUnique({ where: { slug: "basketball" } });
  const tennis = await prisma.sport.findUnique({ where: { slug: "tennis" } });

  if (!cricket || !football || !basketball || !tennis) {
    console.log("Run the base seed first!");
    return;
  }

  // Get existing tournaments
  const ipl = await prisma.tournament.findFirst({ where: { slug: "ipl" } });
  const premierLeague = await prisma.tournament.findFirst({ where: { slug: "premier-league" } });
  const nba = await prisma.tournament.findFirst({ where: { slug: "nba" } });

  // Create more teams
  const teams = await Promise.all([
    prisma.team.upsert({
      where: { sportId_slug: { sportId: cricket.id, slug: "royal-challengers-bangalore" } },
      update: {},
      create: { sportId: cricket.id, name: "Royal Challengers Bangalore", shortName: "RCB", slug: "royal-challengers-bangalore", country: "India", city: "Bangalore" },
    }),
    prisma.team.upsert({
      where: { sportId_slug: { sportId: cricket.id, slug: "kolkata-knight-riders" } },
      update: {},
      create: { sportId: cricket.id, name: "Kolkata Knight Riders", shortName: "KKR", slug: "kolkata-knight-riders", country: "India", city: "Kolkata" },
    }),
    prisma.team.upsert({
      where: { sportId_slug: { sportId: cricket.id, slug: "delhi-capitals" } },
      update: {},
      create: { sportId: cricket.id, name: "Delhi Capitals", shortName: "DC", slug: "delhi-capitals", country: "India", city: "Delhi" },
    }),
    prisma.team.upsert({
      where: { sportId_slug: { sportId: football.id, slug: "chelsea" } },
      update: {},
      create: { sportId: football.id, name: "Chelsea", shortName: "CHE", slug: "chelsea", country: "England", city: "London" },
    }),
    prisma.team.upsert({
      where: { sportId_slug: { sportId: football.id, slug: "arsenal" } },
      update: {},
      create: { sportId: football.id, name: "Arsenal", shortName: "ARS", slug: "arsenal", country: "England", city: "London" },
    }),
    prisma.team.upsert({
      where: { sportId_slug: { sportId: football.id, slug: "barcelona" } },
      update: {},
      create: { sportId: football.id, name: "FC Barcelona", shortName: "BAR", slug: "barcelona", country: "Spain", city: "Barcelona" },
    }),
    prisma.team.upsert({
      where: { sportId_slug: { sportId: basketball.id, slug: "boston-celtics" } },
      update: {},
      create: { sportId: basketball.id, name: "Boston Celtics", shortName: "BOS", slug: "boston-celtics", country: "USA", city: "Boston" },
    }),
    prisma.team.upsert({
      where: { sportId_slug: { sportId: basketball.id, slug: "golden-state-warriors" } },
      update: {},
      create: { sportId: basketball.id, name: "Golden State Warriors", shortName: "GSW", slug: "golden-state-warriors", country: "USA", city: "San Francisco" },
    }),
    prisma.team.upsert({
      where: { sportId_slug: { sportId: tennis.id, slug: "atp-top-seed" } },
      update: {},
      create: { sportId: tennis.id, name: "ATP Tour", shortName: "ATP", slug: "atp-top-seed", country: "International" },
    }),
  ]);

  // Create more players
  const players = await Promise.all([
    prisma.player.upsert({
      where: { sportId_slug: { sportId: cricket.id, slug: "jasprit-bumrah" } },
      update: {},
      create: { sportId: cricket.id, teamId: teams[0].id, firstName: "Jasprit", lastName: "Bumrah", slug: "jasprit-bumrah", nationality: "India", role: "Bowler", bowlingStyle: "Right-arm fast" },
    }),
    prisma.player.upsert({
      where: { sportId_slug: { sportId: football.id, slug: "lionel-messi" } },
      update: {},
      create: { sportId: football.id, firstName: "Lionel", lastName: "Messi", slug: "lionel-messi", nationality: "Argentina", role: "Forward" },
    }),
    prisma.player.upsert({
      where: { sportId_slug: { sportId: basketball.id, slug: "stephen-curry" } },
      update: {},
      create: { sportId: basketball.id, teamId: teams[8].id, firstName: "Stephen", lastName: "Curry", slug: "stephen-curry", nationality: "USA", role: "Point Guard" },
    }),
  ]);

  // Create more matches
  const now = new Date();
  const matches = await Promise.all([
    prisma.match.create({
      data: {
        sportId: cricket.id,
        tournamentId: ipl?.id,
        homeTeamId: teams[0].id,
        awayTeamId: teams[1].id,
        status: "LIVE",
        format: "T20",
        scheduledAt: new Date(now.getTime() - 3600000),
        startedAt: new Date(now.getTime() - 3600000),
        homeScore: 187,
        awayScore: 156,
        homeOvers: 20,
        tossWinner: "Royal Challengers Bangalore",
        tossDecision: "bat",
      },
    }),
    prisma.match.create({
      data: {
        sportId: cricket.id,
        tournamentId: ipl?.id,
        homeTeamId: teams[2].id,
        awayTeamId: teams[1].id,
        status: "SCHEDULED",
        format: "T20",
        scheduledAt: new Date(now.getTime() + 86400000),
      },
    }),
    prisma.match.create({
      data: {
        sportId: football.id,
        tournamentId: premierLeague?.id,
        homeTeamId: teams[4].id,
        awayTeamId: teams[3].id,
        status: "LIVE",
        format: "FOOTBALL_90",
        scheduledAt: new Date(now.getTime() - 2700000),
        startedAt: new Date(now.getTime() - 2700000),
        homeScore: 2,
        awayScore: 1,
      },
    }),
    prisma.match.create({
      data: {
        sportId: football.id,
        tournamentId: premierLeague?.id,
        homeTeamId: teams[5].id,
        awayTeamId: teams[6].id,
        status: "SCHEDULED",
        format: "FOOTBALL_90",
        scheduledAt: new Date(now.getTime() + 172800000),
      },
    }),
    prisma.match.create({
      data: {
        sportId: basketball.id,
        tournamentId: nba?.id,
        homeTeamId: teams[7].id,
        awayTeamId: teams[8].id,
        status: "LIVE",
        format: "BASKETBALL",
        scheduledAt: new Date(now.getTime() - 1800000),
        startedAt: new Date(now.getTime() - 1800000),
        homeScore: 108,
        awayScore: 102,
      },
    }),
  ]);

  // Create live scores for live matches
  await Promise.all([
    prisma.liveScore.create({
      data: {
        matchId: matches[0].id,
        currentScore: { home: "187/4", away: "156/7", overs: "20.0", currentOver: "18.3", battingTeam: "KKR" },
      },
    }),
    prisma.liveScore.create({
      data: {
        matchId: matches[2].id,
        currentScore: { home: "2", away: "1", minute: "67", half: "2nd" },
      },
    }),
    prisma.liveScore.create({
      data: {
        matchId: matches[4].id,
        currentScore: { home: "108", away: "102", quarter: "3rd", timeLeft: "4:32" },
      },
    }),
  ]);

  // Create more articles
  const adminUser = await prisma.user.findUnique({ where: { email: "admin@sportsphere.ai" } });
  if (adminUser) {
    const articles = [
      {
        title: "IPL 2026: Season Preview and Predictions",
        slug: "ipl-2026-season-preview",
        excerpt: "Our AI models have analyzed all teams. Here are the top predictions for IPL 2026.",
        content: "<h2>IPL 2026 Season Preview</h2><p>The Indian Premier League returns with more excitement than ever. Our AI models have crunched the numbers...</p>",
        authorId: adminUser.id,
        sportId: cricket.id,
        status: "PUBLISHED" as const,
        publishedAt: new Date(),
        isFeatured: true,
        isBreaking: true,
        tags: ["ipl", "cricket", "predictions"],
      },
      {
        title: "Premier League Title Race Heats Up",
        slug: "premier-league-title-race-2026",
        excerpt: "With just 10 matches remaining, the title race is closer than ever.",
        content: "<h2>Title Race Analysis</h2><p>Arsenal and Liverpool are separated by just 2 points at the top of the table...</p>",
        authorId: adminUser.id,
        sportId: football.id,
        status: "PUBLISHED" as const,
        publishedAt: new Date(Date.now() - 86400000),
        isFeatured: true,
        tags: ["premier-league", "football"],
      },
      {
        title: "NBA Trade Deadline: Biggest Deals",
        slug: "nba-trade-deadline-2026",
        excerpt: "The most impactful trades from this year's NBA trade deadline.",
        content: "<h2>Trade Deadline Recap</h2><p>Several blockbuster deals shook up the NBA landscape...</p>",
        authorId: adminUser.id,
        sportId: basketball.id,
        status: "PUBLISHED" as const,
        publishedAt: new Date(Date.now() - 172800000),
        tags: ["nba", "basketball", "trades"],
      },
      {
        title: "AI in Sports: How Machine Learning is Changing the Game",
        slug: "ai-in-sports-machine-learning",
        excerpt: "A deep dive into how AI and ML are revolutionizing sports analytics.",
        content: "<h2>The AI Revolution in Sports</h2><p>From predictive analytics to real-time performance tracking...</p>",
        authorId: adminUser.id,
        sportId: cricket.id,
        status: "PUBLISHED" as const,
        publishedAt: new Date(Date.now() - 259200000),
        isFeatured: true,
        tags: ["ai", "technology", "analytics"],
      },
    ];

    for (const article of articles) {
      const existing = await prisma.article.findUnique({ where: { slug: article.slug } });
      if (!existing) {
        await prisma.article.create({ data: article });
      }
    }
  }

  // Create newsletter subscribers
  const { randomBytes } = await import("crypto");
  const subscribers = ["fan1@example.com", "fan2@example.com", "fan3@example.com"];
  for (const email of subscribers) {
    const existing = await prisma.newsletterSubscriber.findUnique({ where: { email } });
    if (!existing) {
      await prisma.newsletterSubscriber.create({
        data: { email, isActive: true, token: randomBytes(32).toString("hex") },
      });
    }
  }

  console.log("Extended seed completed!");
  console.log(`Created: ${teams.length} additional teams, ${players.length} additional players`);
  console.log(`Created: ${matches.length} additional matches, 4 articles, ${subscribers.length} subscribers`);
}

main()
  .catch((e) => {
    console.error("Error in extended seed:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
