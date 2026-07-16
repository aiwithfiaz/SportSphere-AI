import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('Seeding comprehensive H2H records...\n');

  const sports = await prisma.sport.findMany();
  const teams = await prisma.team.findMany();

  const cricket = sports.find(s => s.slug === 'cricket');
  const football = sports.find(s => s.slug === 'football');
  const basketball = sports.find(s => s.slug === 'basketball');
  const tennis = sports.find(s => s.slug === 'tennis');
  const baseball = sports.find(s => s.slug === 'baseball');
  const hockey = sports.find(s => s.slug === 'hockey');

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

  if (!cricket || !football || !basketball) {
    console.log('Missing sports. Run base seed first.');
    return;
  }

  // Comprehensive H2H data
  const h2hRecords = [
    // Cricket - IPL rivalries
    { sportId: cricket.id, homeTeamId: mi!.id, awayTeamId: csk!.id, totalMatches: 38, homeWins: 21, awayWins: 17, draws: 0 },
    { sportId: cricket.id, homeTeamId: mi!.id, awayTeamId: rcb!.id, totalMatches: 34, homeWins: 19, awayWins: 15, draws: 0 },
    { sportId: cricket.id, homeTeamId: mi!.id, awayTeamId: kkr!.id, totalMatches: 32, homeWins: 18, awayWins: 14, draws: 0 },
    { sportId: cricket.id, homeTeamId: mi!.id, awayTeamId: dc!.id, totalMatches: 30, homeWins: 17, awayWins: 13, draws: 0 },
    { sportId: cricket.id, homeTeamId: csk!.id, awayTeamId: rcb!.id, totalMatches: 33, homeWins: 18, awayWins: 15, draws: 0 },
    { sportId: cricket.id, homeTeamId: csk!.id, awayTeamId: kkr!.id, totalMatches: 29, homeWins: 16, awayWins: 13, draws: 0 },
    { sportId: cricket.id, homeTeamId: csk!.id, awayTeamId: dc!.id, totalMatches: 28, homeWins: 15, awayWins: 13, draws: 0 },
    { sportId: cricket.id, homeTeamId: rcb!.id, awayTeamId: kkr!.id, totalMatches: 31, homeWins: 14, awayWins: 17, draws: 0 },
    { sportId: cricket.id, homeTeamId: rcb!.id, awayTeamId: dc!.id, totalMatches: 27, homeWins: 13, awayWins: 14, draws: 0 },
    { sportId: cricket.id, homeTeamId: kkr!.id, awayTeamId: dc!.id, totalMatches: 26, homeWins: 14, awayWins: 12, draws: 0 },

    // Football - Premier League rivalries
    { sportId: football.id, homeTeamId: mu!.id, awayTeamId: liverpool!.id, totalMatches: 62, homeWins: 23, awayWins: 21, draws: 18 },
    { sportId: football.id, homeTeamId: mu!.id, awayTeamId: arsenal!.id, totalMatches: 58, homeWins: 25, awayWins: 18, draws: 15 },
    { sportId: football.id, homeTeamId: mu!.id, awayTeamId: chelsea!.id, totalMatches: 60, homeWins: 24, awayWins: 20, draws: 16 },
    { sportId: football.id, homeTeamId: arsenal!.id, awayTeamId: liverpool!.id, totalMatches: 56, homeWins: 20, awayWins: 22, draws: 14 },
    { sportId: football.id, homeTeamId: arsenal!.id, awayTeamId: chelsea!.id, totalMatches: 54, homeWins: 21, awayWins: 19, draws: 14 },
    { sportId: football.id, homeTeamId: liverpool!.id, awayTeamId: chelsea!.id, totalMatches: 55, homeWins: 22, awayWins: 18, draws: 15 },
    { sportId: football.id, homeTeamId: mu!.id, awayTeamId: barca!.id, totalMatches: 14, homeWins: 5, awayWins: 6, draws: 3 },
    { sportId: football.id, homeTeamId: arsenal!.id, awayTeamId: barca!.id, totalMatches: 12, homeWins: 3, awayWins: 6, draws: 3 },
    { sportId: football.id, homeTeamId: liverpool!.id, awayTeamId: barca!.id, totalMatches: 10, homeWins: 4, awayWins: 3, draws: 3 },

    // Basketball
    { sportId: basketball.id, homeTeamId: lakers!.id, awayTeamId: celtics!.id, totalMatches: 58, homeWins: 29, awayWins: 29, draws: 0 },
    { sportId: basketball.id, homeTeamId: lakers!.id, awayTeamId: warriors!.id, totalMatches: 48, homeWins: 26, awayWins: 22, draws: 0 },
    { sportId: basketball.id, homeTeamId: celtics!.id, awayTeamId: warriors!.id, totalMatches: 44, homeWins: 24, awayWins: 20, draws: 0 },
  ];

  let created = 0;
  let updated = 0;

  for (const h of h2hRecords) {
    const existing = await prisma.headToHead.findFirst({
      where: { sportId: h.sportId, homeTeamId: h.homeTeamId, awayTeamId: h.awayTeamId },
    });

    if (existing) {
      await prisma.headToHead.update({
        where: { id: existing.id },
        data: {
          totalMatches: h.totalMatches,
          homeWins: h.homeWins,
          awayWins: h.awayWins,
          draws: h.draws,
        },
      });
      updated++;
    } else {
      await prisma.headToHead.create({ data: h });
      created++;
    }
  }

  console.log(`Created ${created} new H2H records, updated ${updated} existing`);

  // Also add more matches for richer data
  console.log('\nAdding more match history...');
  const tournaments = await prisma.tournament.findMany();
  const ipl = tournaments.find(t => t.slug === 'ipl');
  const pl = tournaments.find(t => t.slug === 'premier-league');
  const nba = tournaments.find(t => t.slug === 'nba');

  const cricketTeams = [mi, csk, rcb, kkr, dc].filter(Boolean);
  const footballTeams = [mu, arsenal, liverpool, chelsea].filter(Boolean);
  const basketballTeams = [lakers, celtics, warriors].filter(Boolean);

  let matchesCreated = 0;

  // More cricket matches
  if (ipl && cricketTeams.length >= 4) {
    for (let i = 0; i < cricketTeams.length; i++) {
      for (let j = i + 1; j < cricketTeams.length; j++) {
        const existing = await prisma.match.findFirst({
          where: {
            homeTeamId: cricketTeams[i]!.id,
            awayTeamId: cricketTeams[j]!.id,
            status: 'COMPLETED',
          },
        });
        if (!existing) {
          await prisma.match.create({
            data: {
              sportId: cricket.id,
              tournamentId: ipl.id,
              homeTeamId: cricketTeams[i]!.id,
              awayTeamId: cricketTeams[j]!.id,
              scheduledAt: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000),
              status: 'COMPLETED',
              format: 'T20',
              homeScore: 140 + Math.floor(Math.random() * 60),
              awayScore: 120 + Math.floor(Math.random() * 70),
              result: Math.random() > 0.5 ? `${cricketTeams[i]!.name} won` : `${cricketTeams[j]!.name} won`,
            },
          });
          matchesCreated++;
        }
      }
    }
  }

  // More football matches
  if (pl && footballTeams.length >= 3) {
    for (let i = 0; i < footballTeams.length; i++) {
      for (let j = i + 1; j < footballTeams.length; j++) {
        const existing = await prisma.match.findFirst({
          where: {
            homeTeamId: footballTeams[i]!.id,
            awayTeamId: footballTeams[j]!.id,
            status: 'COMPLETED',
          },
        });
        if (!existing) {
          await prisma.match.create({
            data: {
              sportId: football.id,
              tournamentId: pl.id,
              homeTeamId: footballTeams[i]!.id,
              awayTeamId: footballTeams[j]!.id,
              scheduledAt: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000),
              status: 'COMPLETED',
              format: 'FOOTBALL_90',
              homeScore: Math.floor(Math.random() * 4),
              awayScore: Math.floor(Math.random() * 3),
            },
          });
          matchesCreated++;
        }
      }
    }
  }

  // More basketball matches
  if (nba && basketballTeams.length >= 3) {
    for (let i = 0; i < basketballTeams.length; i++) {
      for (let j = i + 1; j < basketballTeams.length; j++) {
        const existing = await prisma.match.findFirst({
          where: {
            homeTeamId: basketballTeams[i]!.id,
            awayTeamId: basketballTeams[j]!.id,
            status: 'COMPLETED',
          },
        });
        if (!existing) {
          await prisma.match.create({
            data: {
              sportId: basketball.id,
              tournamentId: nba.id,
              homeTeamId: basketballTeams[i]!.id,
              awayTeamId: basketballTeams[j]!.id,
              scheduledAt: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000),
              status: 'COMPLETED',
              format: 'BASKETBALL',
              homeScore: 90 + Math.floor(Math.random() * 40),
              awayScore: 85 + Math.floor(Math.random() * 45),
            },
          });
          matchesCreated++;
        }
      }
    }
  }

  console.log(`Created ${matchesCreated} additional match history records`);

  // Final counts
  console.log('\nFinal counts:');
  console.log(`  H2H Records: ${await prisma.headToHead.count()}`);
  console.log(`  Total Matches: ${await prisma.match.count()}`);
  console.log(`  Completed Matches: ${await prisma.match.count({ where: { status: 'COMPLETED' } })}`);
  console.log(`  Live Matches: ${await prisma.match.count({ where: { status: { in: ['LIVE', 'IN_PROGRESS'] } } })}`);

  console.log('\nH2H seed completed!');
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
