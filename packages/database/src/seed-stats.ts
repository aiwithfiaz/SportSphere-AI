import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('Seeding player stats and match innings data...\n');

  const matches = await prisma.match.findMany({ where: { status: 'COMPLETED' }, take: 15 });
  const players = await prisma.player.findMany({ take: 20 });

  if (matches.length === 0 || players.length === 0) {
    console.log('No matches or players found. Run base seeds first.');
    return;
  }

  // Create match innings for completed matches
  console.log('Creating match innings...');
  let inningsCreated = 0;

  for (const match of matches) {
    const existingInnings = await prisma.matchInning.findFirst({ where: { matchId: match.id } });
    if (existingInnings) continue;

    if (match.format === 'T20' || match.format === 'ODI' || match.format === 'TEST' || match.format === 'T10') {
      // Cricket: 2 innings
      await prisma.matchInning.createMany({
        data: [
          { matchId: match.id, inningNumber: 1, runs: match.homeScore || 160, wickets: Math.floor(Math.random() * 8) + 2, overs: 20, extras: Math.floor(Math.random() * 15) + 5 },
          { matchId: match.id, inningNumber: 2, runs: match.awayScore || 145, wickets: Math.floor(Math.random() * 9) + 1, overs: 19.3, extras: Math.floor(Math.random() * 12) + 3 },
        ],
      });
      inningsCreated += 2;
    } else if (match.format === 'FOOTBALL_90') {
      // Football: 2 halves
      await prisma.matchInning.createMany({
        data: [
          { matchId: match.id, inningNumber: 1, runs: match.homeScore || 1, extras: 0 },
          { matchId: match.id, inningNumber: 2, runs: match.awayScore || 0, extras: 0 },
        ],
      });
      inningsCreated += 2;
    } else if (match.format === 'BASKETBALL') {
      // Basketball: 4 quarters
      const homeQ = Math.floor((match.homeScore || 110) / 4);
      const awayQ = Math.floor((match.awayScore || 105) / 4);
      await prisma.matchInning.createMany({
        data: [
          { matchId: match.id, inningNumber: 1, runs: homeQ + Math.floor(Math.random() * 5), extras: 0 },
          { matchId: match.id, inningNumber: 2, runs: homeQ + Math.floor(Math.random() * 5), extras: 0 },
          { matchId: match.id, inningNumber: 3, runs: homeQ + Math.floor(Math.random() * 5), extras: 0 },
          { matchId: match.id, inningNumber: 4, runs: homeQ + Math.floor(Math.random() * 5), extras: 0 },
        ],
      });
      inningsCreated += 4;
    }
  }
  console.log(`  Created ${inningsCreated} innings records`);

  // Create commentary for completed matches
  console.log('Creating match commentary...');
  let commentaryCreated = 0;

  const commentaryTemplates = [
    { over: 0.1, content: 'And the match begins! What a start!', eventType: 'NORMAL', runs: 0 },
    { over: 0.3, content: 'That\'s a brilliant shot! Four runs!', eventType: 'FOUR', runs: 4 },
    { over: 1.0, content: 'End of the first over. Decent start.', eventType: 'NORMAL', runs: 1 },
    { over: 2.4, content: 'WICKET! What a delivery! The batsman is gone!', eventType: 'WICKET', runs: 0 },
    { over: 3.2, content: 'SIX! That\'s gone all the way! Massive hit!', eventType: 'SIX', runs: 6 },
    { over: 5.0, content: '5 overs done. Run rate looking good.', eventType: 'NORMAL', runs: 2 },
    { over: 8.3, content: 'DROPPED CATCH! That could be costly!', eventType: 'MISSED_CATCH', runs: 1 },
    { over: 10.0, content: 'Halfway through. This is getting exciting!', eventType: 'NORMAL', runs: 0 },
    { over: 14.2, content: 'What a catch! Sensational fielding!', eventType: 'WICKET', runs: 0 },
    { over: 18.5, content: 'The tension is building! Last few overs!', eventType: 'NORMAL', runs: 6 },
  ];

  for (const match of matches.slice(0, 5)) {
    for (const template of commentaryTemplates) {
      const existing = await prisma.commentary.findFirst({
        where: { matchId: match.id, over: template.over },
      });
      if (!existing) {
        await prisma.commentary.create({
          data: {
            matchId: match.id,
            over: template.over,
            ball: Math.floor(template.over * 10) % 10 || 1,
            content: template.content,
            eventType: template.eventType,
            runs: template.runs,
            wicket: template.eventType === 'WICKET',
          },
        });
        commentaryCreated++;
      }
    }
  }
  console.log(`  Created ${commentaryCreated} commentary records`);

  // Final counts
  console.log('\nFinal counts:');
  console.log(`  Match Innings: ${await prisma.matchInning.count()}`);
  console.log(`  Commentary: ${await prisma.commentary.count()}`);
  console.log(`  Match Players: ${await prisma.matchPlayer.count()}`);

  console.log('\nPlayer stats seed completed!');
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
