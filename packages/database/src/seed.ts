import { PrismaClient } from "@prisma/client";
import { hash } from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Seeding database...\n");

  // ─────────────────────────────────────────────
  // 1. Create Sports
  // ─────────────────────────────────────────────
  console.log("🏏 Creating sports...");

  const cricket = await prisma.sport.upsert({
    where: { slug: "cricket" },
    update: {},
    create: {
      name: "Cricket",
      slug: "cricket",
      icon: "🏏",
      description: "International and domestic cricket matches",
    },
  });

  const football = await prisma.sport.upsert({
    where: { slug: "football" },
    update: {},
    create: {
      name: "Football",
      slug: "football",
      icon: "⚽",
      description: "Football/soccer leagues and tournaments",
    },
  });

  const basketball = await prisma.sport.upsert({
    where: { slug: "basketball" },
    update: {},
    create: {
      name: "Basketball",
      slug: "basketball",
      icon: "🏀",
      description: "Basketball leagues and tournaments",
    },
  });

  const tennis = await prisma.sport.upsert({
    where: { slug: "tennis" },
    update: {},
    create: {
      name: "Tennis",
      slug: "tennis",
      icon: "🎾",
      description: "Tennis tournaments and matches",
    },
  });

  const f1 = await prisma.sport.upsert({
    where: { slug: "f1" },
    update: {},
    create: {
      name: "Formula 1",
      slug: "f1",
      icon: "🏎️",
      description: "Formula 1 racing",
    },
  });

  const ufc = await prisma.sport.upsert({
    where: { slug: "ufc" },
    update: {},
    create: {
      name: "UFC",
      slug: "ufc",
      icon: "🥊",
      description: "UFC fights and events",
    },
  });

  console.log("✅ Sports created\n");

  // ─────────────────────────────────────────────
  // 2. Create Tournaments
  // ─────────────────────────────────────────────
  console.log("🏆 Creating tournaments...");

  const ipl = await prisma.tournament.upsert({
    where: { sportId_slug: { sportId: cricket.id, slug: "ipl" } },
    update: {},
    create: {
      sportId: cricket.id,
      name: "Indian Premier League",
      slug: "ipl",
      startDate: new Date("2024-03-22"),
      endDate: new Date("2024-05-26"),
      isActive: true,
      isCurrent: true,
    },
  });

  const psl = await prisma.tournament.upsert({
    where: { sportId_slug: { sportId: cricket.id, slug: "psl" } },
    update: {},
    create: {
      sportId: cricket.id,
      name: "Pakistan Super League",
      slug: "psl",
      startDate: new Date("2024-02-17"),
      endDate: new Date("2024-03-18"),
      isActive: true,
      isCurrent: true,
    },
  });

  const premierLeague = await prisma.tournament.upsert({
    where: { sportId_slug: { sportId: football.id, slug: "premier-league" } },
    update: {},
    create: {
      sportId: football.id,
      name: "Premier League",
      slug: "premier-league",
      startDate: new Date("2024-08-17"),
      endDate: new Date("2025-05-19"),
      isActive: true,
      isCurrent: true,
    },
  });

  const championsLeague = await prisma.tournament.upsert({
    where: { sportId_slug: { sportId: football.id, slug: "champions-league" } },
    update: {},
    create: {
      sportId: football.id,
      name: "UEFA Champions League",
      slug: "champions-league",
      startDate: new Date("2024-09-19"),
      endDate: new Date("2025-06-01"),
      isActive: true,
      isCurrent: true,
    },
  });

  const nba = await prisma.tournament.upsert({
    where: { sportId_slug: { sportId: basketball.id, slug: "nba" } },
    update: {},
    create: {
      sportId: basketball.id,
      name: "NBA",
      slug: "nba",
      startDate: new Date("2024-10-22"),
      endDate: new Date("2025-06-15"),
      isActive: true,
      isCurrent: true,
    },
  });

  console.log("✅ Tournaments created\n");

  // ─────────────────────────────────────────────
  // 3. Create Teams
  // ─────────────────────────────────────────────
  console.log("👕 Creating teams...");

  const mumbaiIndians = await prisma.team.upsert({
    where: { sportId_slug: { sportId: cricket.id, slug: "mumbai-indians" } },
    update: {},
    create: {
      sportId: cricket.id,
      name: "Mumbai Indians",
      shortName: "MI",
      slug: "mumbai-indians",
      country: "India",
      city: "Mumbai",
      primaryColor: "#004BA0",
      secondaryColor: "#D1AB3E",
    },
  });

  const chennaiSuperKings = await prisma.team.upsert({
    where: { sportId_slug: { sportId: cricket.id, slug: "chennai-super-kings" } },
    update: {},
    create: {
      sportId: cricket.id,
      name: "Chennai Super Kings",
      shortName: "CSK",
      slug: "chennai-super-kings",
      country: "India",
      city: "Chennai",
      primaryColor: "#FCCA06",
      secondaryColor: "#0081E9",
    },
  });

  const manchesterUnited = await prisma.team.upsert({
    where: { sportId_slug: { sportId: football.id, slug: "manchester-united" } },
    update: {},
    create: {
      sportId: football.id,
      name: "Manchester United",
      shortName: "MAN UTD",
      slug: "manchester-united",
      country: "England",
      city: "Manchester",
      primaryColor: "#DA291C",
      secondaryColor: "#FBE122",
    },
  });

  const liverpool = await prisma.team.upsert({
    where: { sportId_slug: { sportId: football.id, slug: "liverpool" } },
    update: {},
    create: {
      sportId: football.id,
      name: "Liverpool",
      shortName: "LIV",
      slug: "liverpool",
      country: "England",
      city: "Liverpool",
      primaryColor: "#C8102E",
      secondaryColor: "#00B2A9",
    },
  });

  const losAngelesLakers = await prisma.team.upsert({
    where: { sportId_slug: { sportId: basketball.id, slug: "los-angeles-lakers" } },
    update: {},
    create: {
      sportId: basketball.id,
      name: "Los Angeles Lakers",
      shortName: "LAL",
      slug: "los-angeles-lakers",
      country: "USA",
      city: "Los Angeles",
      primaryColor: "#552583",
      secondaryColor: "#FDB927",
    },
  });

  console.log("✅ Teams created\n");

  // ─────────────────────────────────────────────
  // 4. Create Players
  // ─────────────────────────────────────────────
  console.log("🧑‍ sport Creating players...");

  const viratKohli = await prisma.player.upsert({
    where: { sportId_slug: { sportId: cricket.id, slug: "virat-kohli" } },
    update: {},
    create: {
      sportId: cricket.id,
      teamId: mumbaiIndians.id,
      firstName: "Virat",
      lastName: "Kohli",
      slug: "virat-kohli",
      nationality: "India",
      role: "Batsman",
      battingStyle: "Right-handed",
    },
  });

  const rohitSharma = await prisma.player.upsert({
    where: { sportId_slug: { sportId: cricket.id, slug: "rohit-sharma" } },
    update: {},
    create: {
      sportId: cricket.id,
      teamId: mumbaiIndians.id,
      firstName: "Rohit",
      lastName: "Sharma",
      slug: "rohit-sharma",
      nationality: "India",
      role: "Batsman",
      battingStyle: "Right-handed",
    },
  });

  const mSDhoni = await prisma.player.upsert({
    where: { sportId_slug: { sportId: cricket.id, slug: "ms-dhoni" } },
    update: {},
    create: {
      sportId: cricket.id,
      teamId: chennaiSuperKings.id,
      firstName: "MS",
      lastName: "Dhoni",
      slug: "ms-dhoni",
      nationality: "India",
      role: "Wicketkeeper-Batsman",
      battingStyle: "Right-handed",
    },
  });

  const cristianoRonaldo = await prisma.player.upsert({
    where: { sportId_slug: { sportId: football.id, slug: "cristiano-ronaldo" } },
    update: {},
    create: {
      sportId: football.id,
      firstName: "Cristiano",
      lastName: "Ronaldo",
      slug: "cristiano-ronaldo",
      nationality: "Portugal",
      role: "Forward",
    },
  });

  const lebronJames = await prisma.player.upsert({
    where: { sportId_slug: { sportId: basketball.id, slug: "lebron-james" } },
    update: {},
    create: {
      sportId: basketball.id,
      teamId: losAngelesLakers.id,
      firstName: "LeBron",
      lastName: "James",
      slug: "lebron-james",
      nationality: "USA",
      role: "Small Forward",
    },
  });

  console.log("✅ Players created\n");

  // ─────────────────────────────────────────────
  // 5. Create Sample Matches
  // ─────────────────────────────────────────────
  console.log("🏟️ Creating sample matches...");

  const match1 = await prisma.match.create({
    data: {
      sportId: cricket.id,
      tournamentId: ipl.id,
      homeTeamId: mumbaiIndians.id,
      awayTeamId: chennaiSuperKings.id,
      status: "LIVE",
      format: "T20",
      scheduledAt: new Date(),
      startedAt: new Date(),
      homeScore: 145,
      awayScore: 132,
      homeOvers: 18.3,
      tossWinner: "Mumbai Indians",
      tossDecision: "bat",
    },
  });

  const match2 = await prisma.match.create({
    data: {
      sportId: football.id,
      tournamentId: premierLeague.id,
      homeTeamId: manchesterUnited.id,
      awayTeamId: liverpool.id,
      status: "SCHEDULED",
      format: "FOOTBALL_90",
      scheduledAt: new Date(Date.now() + 86400000), // Tomorrow
    },
  });

  console.log("✅ Sample matches created\n");

  // ─────────────────────────────────────────────
  // 6. Create Admin User
  // ─────────────────────────────────────────────
  console.log("👤 Creating admin user...");

  const adminPasswordHash = await hash("Admin123!", 12);

  const adminUser = await prisma.user.upsert({
    where: { email: "admin@sportsphere.ai" },
    update: {},
    create: {
      email: "admin@sportsphere.ai",
      username: "admin",
      firstName: "Admin",
      lastName: "User",
      displayName: "Admin User",
      passwordHash: adminPasswordHash,
      role: "ADMIN",
      isEmailVerified: true,
    },
  });

  console.log("✅ Admin user created\n");

  // ─────────────────────────────────────────────
  // 7. Create Sample Article
  // ─────────────────────────────────────────────
  console.log("📰 Creating sample article...");

  const article = await prisma.article.create({
    data: {
      title: "Welcome to SportSphere AI",
      slug: "welcome-to-sportsphere-ai",
      excerpt: "The world's fastest live sports experience is here.",
      content: `
        <h2>Welcome to SportSphere AI</h2>
        <p>We are excited to launch SportSphere AI, the world's fastest live sports experience.</p>
        <p>Our platform provides:</p>
        <ul>
          <li>Real-time live scores</li>
          <li>Ball-by-ball commentary</li>
          <li>AI-powered match predictions</li>
          <li>Comprehensive statistics</li>
          <li>Breaking sports news</li>
        </ul>
        <p>Stay tuned for more exciting features!</p>
      `,
      authorId: adminUser.id,
      sportId: cricket.id,
      status: "PUBLISHED",
      publishedAt: new Date(),
      isFeatured: true,
      tags: ["welcome", "launch", "sports"],
    },
  });

  console.log("✅ Sample article created\n");

  console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
  console.log("🎉 Database seeding completed!");
  console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
  console.log("\n📊 Summary:");
  console.log(`   • 6 Sports`);
  console.log(`   • 5 Tournaments`);
  console.log(`   • 5 Teams`);
  console.log(`   • 5 Players`);
  console.log(`   • 2 Matches`);
  console.log(`   • 1 Admin User (admin@sportsphere.ai / Admin123!)`);
  console.log(`   • 1 Article`);
  console.log("");
}

main()
  .catch((e) => {
    console.error("❌ Error seeding database:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
