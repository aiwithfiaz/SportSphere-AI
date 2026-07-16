import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('Seeding standings, head-to-head, and more players...\n');

  const tournaments = await prisma.tournament.findMany();
  const teams = await prisma.team.findMany();
  const sports = await prisma.sport.findMany();

  const cricket = sports.find(s => s.slug === 'cricket');
  const football = sports.find(s => s.slug === 'football');
  const basketball = sports.find(s => s.slug === 'basketball');
  const ipl = tournaments.find(t => t.slug === 'ipl');
  const premierLeague = tournaments.find(t => t.slug === 'premier-league');
  const nba = tournaments.find(t => t.slug === 'nba');

  const mi = teams.find(t => t.slug === 'mumbai-indians');
  const csk = teams.find(t => t.slug === 'chennai-super-kings');
  const rcb = teams.find(t => t.slug === 'royal-challengers-bangalore');
  const kkr = teams.find(t => t.slug === 'kolkata-knight-riders');
  const dc = teams.find(t => t.slug === 'delhi-capitals');
  const chelsea = teams.find(t => t.slug === 'chelsea');
  const arsenal = teams.find(t => t.slug === 'arsenal');
  const liverpool = teams.find(t => t.slug === 'liverpool');
  const mu = teams.find(t => t.slug === 'manchester-united');
  const barca = teams.find(t => t.slug === 'barcelona');
  const lakers = teams.find(t => t.slug === 'los-angeles-lakers');
  const celtics = teams.find(t => t.slug === 'boston-celtics');
  const warriors = teams.find(t => t.slug === 'golden-state-warriors');

  // ── Standings ──
  console.log('Creating tournament standings...');
  const standingsData = [
    { tournamentId: ipl!.id, teamId: mi!.id, position: 1, played: 14, won: 10, lost: 3, drawn: 1, points: 21, netRunRate: 1.45, form: 'W,W,L,W,W' },
    { tournamentId: ipl!.id, teamId: csk!.id, position: 2, played: 14, won: 9, lost: 4, drawn: 1, points: 19, netRunRate: 1.12, form: 'W,L,W,W,L' },
    { tournamentId: ipl!.id, teamId: rcb!.id, position: 3, played: 14, won: 8, lost: 5, drawn: 1, points: 17, netRunRate: 0.85, form: 'L,W,W,L,W' },
    { tournamentId: ipl!.id, teamId: kkr!.id, position: 4, played: 14, won: 7, lost: 6, drawn: 1, points: 15, netRunRate: 0.32, form: 'W,L,L,W,W' },
    { tournamentId: ipl!.id, teamId: dc!.id, position: 5, played: 14, won: 6, lost: 7, drawn: 1, points: 13, netRunRate: -0.15, form: 'L,W,L,L,W' },

    { tournamentId: premierLeague!.id, teamId: mu!.id, position: 1, played: 38, won: 28, lost: 5, drawn: 5, points: 89, form: 'W,W,D,W,W' },
    { tournamentId: premierLeague!.id, teamId: arsenal!.id, position: 2, played: 38, won: 26, lost: 6, drawn: 6, points: 84, form: 'W,L,W,W,D' },
    { tournamentId: premierLeague!.id, teamId: liverpool!.id, position: 3, played: 38, won: 24, lost: 8, drawn: 6, points: 78, form: 'W,W,L,W,L' },
    { tournamentId: premierLeague!.id, teamId: chelsea!.id, position: 4, played: 38, won: 20, lost: 12, drawn: 6, points: 66, form: 'L,W,D,L,W' },

    { tournamentId: nba!.id, teamId: lakers!.id, position: 1, played: 82, won: 58, lost: 24, drawn: 0, points: 116, form: 'W,W,L,W,W' },
    { tournamentId: nba!.id, teamId: celtics!.id, position: 2, played: 82, won: 55, lost: 27, drawn: 0, points: 110, form: 'W,L,W,W,L' },
    { tournamentId: nba!.id, teamId: warriors!.id, position: 3, played: 82, won: 52, lost: 30, drawn: 0, points: 104, form: 'L,W,L,W,W' },
  ];

  for (const s of standingsData) {
    await prisma.standing.upsert({
      where: { tournamentId_teamId: { tournamentId: s.tournamentId, teamId: s.teamId } },
      update: s,
      create: s,
    });
  }
  console.log(`  ✓ Created ${standingsData.length} standings entries`);

  // ── Head to Head ──
  console.log('Creating head-to-head records...');
  const h2hData = [
    { sportId: cricket!.id, homeTeamId: mi!.id, awayTeamId: csk!.id, totalMatches: 36, homeWins: 20, awayWins: 16, draws: 0 },
    { sportId: cricket!.id, homeTeamId: mi!.id, awayTeamId: rcb!.id, totalMatches: 32, homeWins: 18, awayWins: 14, draws: 0 },
    { sportId: football!.id, homeTeamId: mu!.id, awayTeamId: liverpool!.id, totalMatches: 58, homeWins: 22, awayWins: 20, draws: 16 },
    { sportId: football!.id, homeTeamId: arsenal!.id, awayTeamId: chelsea!.id, totalMatches: 54, homeWins: 20, awayWins: 18, draws: 16 },
    { sportId: basketball!.id, homeTeamId: lakers!.id, awayTeamId: celtics!.id, totalMatches: 54, homeWins: 28, awayWins: 26, draws: 0 },
  ];

  for (const h of h2hData) {
    await prisma.headToHead.upsert({
      where: { sportId_homeTeamId_awayTeamId: { sportId: h.sportId, homeTeamId: h.homeTeamId, awayTeamId: h.awayTeamId } },
      update: h,
      create: h,
    });
  }
  console.log(`  ✓ Created ${h2hData.length} head-to-head records`);

  // ── Win Probability for live matches ──
  console.log('Creating win probability data...');
  const liveMatches = await prisma.match.findMany({ where: { status: 'LIVE' } });
  for (const match of liveMatches) {
    if (match.homeTeamId && match.awayTeamId) {
      await prisma.winProbability.createMany({
        data: [
          { matchId: match.id, teamId: match.homeTeamId, probability: 55.0, over: 10 },
          { matchId: match.id, teamId: match.awayTeamId, probability: 45.0, over: 10 },
          { matchId: match.id, teamId: match.homeTeamId, probability: 52.0, over: 20 },
          { matchId: match.id, teamId: match.awayTeamId, probability: 48.0, over: 20 },
          { matchId: match.id, teamId: match.homeTeamId, probability: 58.0, over: 30 },
          { matchId: match.id, teamId: match.awayTeamId, probability: 42.0, over: 30 },
        ],
        skipDuplicates: true,
      });
    }
  }
  console.log(`  ✓ Created win probability data for ${liveMatches.length} live matches`);

  // ── More players ──
  console.log('Adding more players...');
  const morePlayers = [
    { sportId: cricket!.id, teamId: mi!.id, firstName: 'Jasprit', lastName: 'Bumrah', slug: 'jasprit-bumrah', nationality: 'India', role: 'Bowler', battingStyle: 'Right-handed', bowlingStyle: 'Right-arm fast' },
    { sportId: cricket!.id, teamId: mi!.id, firstName: 'Ishan', lastName: 'Kishan', slug: 'ishan-kishan', nationality: 'India', role: 'Wicketkeeper', battingStyle: 'Left-handed' },
    { sportId: cricket!.id, teamId: csk!.id, firstName: 'Ravindra', lastName: 'Jadeja', slug: 'ravindra-jadeja', nationality: 'India', role: 'All-rounder', battingStyle: 'Left-handed', bowlingStyle: 'Left-arm orthodox' },
    { sportId: cricket!.id, teamId: csk!.id, firstName: 'Devon', lastName: 'Conway', slug: 'devon-conway', nationality: 'New Zealand', role: 'Batsman', battingStyle: 'Left-handed' },
    { sportId: cricket!.id, teamId: rcb!.id, firstName: 'Glenn', lastName: 'Maxwell', slug: 'glenn-maxwell', nationality: 'Australia', role: 'All-rounder', battingStyle: 'Right-handed', bowlingStyle: 'Right-arm off-break' },
    { sportId: cricket!.id, teamId: rcb!.id, firstName: 'Mohammed', lastName: 'Siraj', slug: 'mohammed-siraj', nationality: 'India', role: 'Bowler', battingStyle: 'Right-handed', bowlingStyle: 'Right-arm fast' },
    { sportId: football!.id, teamId: mu!.id, firstName: 'Erling', lastName: 'Haaland', slug: 'erling-haaland', nationality: 'Norway', role: 'Forward' },
    { sportId: football!.id, teamId: mu!.id, firstName: 'Kevin', lastName: 'De Bruyne', slug: 'kevin-de-bruyne', nationality: 'Belgium', role: 'Midfielder' },
    { sportId: football!.id, teamId: liverpool!.id, firstName: 'Mohamed', lastName: 'Salah', slug: 'mohamed-salah', nationality: 'Egypt', role: 'Forward' },
    { sportId: football!.id, teamId: liverpool!.id, firstName: 'Virgil', lastName: 'van Dijk', slug: 'virgil-van-dijk', nationality: 'Netherlands', role: 'Defender' },
    { sportId: football!.id, teamId: arsenal!.id, firstName: 'Bukayo', lastName: 'Saka', slug: 'bukayo-saka', nationality: 'England', role: 'Forward' },
    { sportId: football!.id, teamId: arsenal!.id, firstName: 'Martin', lastName: 'Odegaard', slug: 'martin-odegaard', nationality: 'Norway', role: 'Midfielder' },
    { sportId: basketball!.id, teamId: lakers!.id, firstName: 'Anthony', lastName: 'Davis', slug: 'anthony-davis', nationality: 'USA', role: 'Power Forward' },
    { sportId: basketball!.id, teamId: celtics!.id, firstName: 'Jayson', lastName: 'Tatum', slug: 'jayson-tatum', nationality: 'USA', role: 'Small Forward' },
    { sportId: basketball!.id, teamId: warriors!.id, firstName: 'Draymond', lastName: 'Green', slug: 'draymond-green', nationality: 'USA', role: 'Power Forward' },
  ];

  let added = 0;
  for (const p of morePlayers) {
    const existing = await prisma.player.findFirst({ where: { sportId: p.sportId, slug: p.slug } });
    if (!existing) {
      await prisma.player.create({ data: p });
      added++;
    }
  }
  console.log(`  ✓ Added ${added} new players (${morePlayers.length - added} already existed)`);

  console.log('\nComprehensive seed completed!');
}

main()
  .catch((e) => { console.error(e); process.exit(1); })
  .finally(async () => { await prisma.$disconnect(); });
