import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('Seeding subscriptions, notifications, and additional data...\n');

  const users = await prisma.user.findMany();
  const teams = await prisma.team.findMany();
  const players = await prisma.player.findMany();
  const matches = await prisma.match.findMany({ take: 10 });
  const articles = await prisma.article.findMany({ take: 10 });

  // Create subscriptions
  for (let i = 0; i < Math.min(3, users.length); i++) {
    const existing = await prisma.subscription.findFirst({ where: { userId: users[i].id, plan: 'pro' } });
    if (!existing) {
      await prisma.subscription.create({
        data: {
          userId: users[i].id,
          plan: 'pro',
          status: 'active',
          startDate: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000),
          endDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
        },
      });
      console.log(`Created Pro subscription for ${users[i].email}`);
    }
  }

  for (let i = 3; i < Math.min(5, users.length); i++) {
    const existing = await prisma.subscription.findFirst({ where: { userId: users[i].id, plan: 'premium' } });
    if (!existing) {
      await prisma.subscription.create({
        data: {
          userId: users[i].id,
          plan: 'premium',
          status: 'active',
          startDate: new Date(Date.now() - 60 * 24 * 60 * 60 * 1000),
          endDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
        },
      });
      console.log(`Created Premium subscription for ${users[i].email}`);
    }
  }

  if (users[5]) {
    const existing = await prisma.subscription.findFirst({ where: { userId: users[5].id, status: 'cancelled' } });
    if (!existing) {
      await prisma.subscription.create({
        data: {
          userId: users[5].id,
          plan: 'pro',
          status: 'cancelled',
          startDate: new Date(Date.now() - 90 * 24 * 60 * 60 * 1000),
          endDate: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000),
        },
      });
      console.log(`Created cancelled subscription for ${users[5].email}`);
    }
  }
  console.log('Created subscriptions');

  // Create notifications
  const notifMessages = [
    { title: 'Match Starting Soon!', message: 'MI vs CSK starts in 30 minutes.', type: 'MATCH_START' as const },
    { title: 'Goal Scored!', message: 'Salah scored for Liverpool.', type: 'GOAL' as const },
    { title: 'Breaking News', message: 'Major transfer confirmed!', type: 'BREAKING_NEWS' as const },
    { title: 'Welcome!', message: 'Thank you for joining SportSphere AI.', type: 'CUSTOM' as const },
    { title: 'Weekly Digest', message: 'Your weekly summary is ready.', type: 'CUSTOM' as const },
    { title: 'New Feature', message: 'Try our AI prediction tool!', type: 'CUSTOM' as const },
  ];

  for (const user of users.slice(0, 10)) {
    for (const notif of notifMessages.slice(0, 3)) {
      const existing = await prisma.notification.findFirst({
        where: { userId: user.id, title: notif.title },
      });
      if (!existing) {
        await prisma.notification.create({
          data: {
            userId: user.id,
            title: notif.title,
            message: notif.message,
            type: notif.type,
            isRead: Math.random() > 0.5,
          },
        });
      }
    }
  }
  console.log('Created notifications');

  // Create bookmarks
  for (const user of users.slice(0, 5)) {
    for (const article of articles.slice(0, 3)) {
      const existing = await prisma.bookmark.findFirst({
        where: { userId: user.id, articleId: article.id },
      });
      if (!existing) {
        await prisma.bookmark.create({
          data: { userId: user.id, articleId: article.id },
        });
      }
    }
  }
  console.log('Created bookmarks');

  // Create favorites
  for (const user of users.slice(0, 5)) {
    for (const team of teams.slice(0, 2)) {
      const existing = await prisma.favorite.findFirst({
        where: { userId: user.id, entityType: 'team', entityId: team.id },
      });
      if (!existing) {
        await prisma.favorite.create({
          data: { userId: user.id, entityType: 'team', entityId: team.id },
        });
      }
    }
    for (const player of players.slice(0, 2)) {
      const existing = await prisma.favorite.findFirst({
        where: { userId: user.id, entityType: 'player', entityId: player.id },
      });
      if (!existing) {
        await prisma.favorite.create({
          data: { userId: user.id, entityType: 'player', entityId: player.id },
        });
      }
    }
  }
  console.log('Created favorites');

  // Create predictions
  for (const match of matches.slice(0, 5)) {
    const existing = await prisma.prediction.findFirst({ where: { matchId: match.id } });
    if (!existing) {
      const pred = await prisma.prediction.create({
        data: {
          matchId: match.id,
          sportId: match.sportId,
          title: `Prediction for match`,
          prediction: 'home_win',
          confidence: 0.65,
        },
      });

      for (const user of users.slice(0, 3)) {
        const existingUP = await prisma.userPrediction.findFirst({
          where: { predictionId: pred.id, userId: user.id },
        });
        if (!existingUP) {
          await prisma.userPrediction.create({
            data: {
              predictionId: pred.id,
              userId: user.id,
              choice: Math.random() > 0.5 ? 'home_win' : 'away_win',
            },
          });
        }
      }
    }
  }
  console.log('Created predictions');

  // Create win probability data
  for (const match of matches) {
    const homeTeamId = match.homeTeamId;
    const awayTeamId = match.awayTeamId;

    const existingHome = await prisma.winProbability.findFirst({
      where: { matchId: match.id, teamId: homeTeamId },
    });
    if (!existingHome) {
      await prisma.winProbability.create({
        data: { matchId: match.id, teamId: homeTeamId, probability: 55, over: 0.5 },
      });
    }

    const existingAway = await prisma.winProbability.findFirst({
      where: { matchId: match.id, teamId: awayTeamId },
    });
    if (!existingAway) {
      await prisma.winProbability.create({
        data: { matchId: match.id, teamId: awayTeamId, probability: 45, over: 0.5 },
      });
    }
  }
  console.log('Created win probability data');

  // Create match player stats
  for (const match of matches.slice(0, 5)) {
    for (const player of players.slice(0, 4)) {
      const existing = await prisma.matchPlayer.findFirst({
        where: { matchId: match.id, playerId: player.id },
      });
      if (!existing) {
        await prisma.matchPlayer.create({
          data: {
            matchId: match.id,
            playerId: player.id,
            teamId: player.teamId || teams[0].id,
            isPlaying: true,
            isCaptain: Math.random() > 0.8,
            isKeeper: Math.random() > 0.9,
          },
        });
      }
    }
  }
  console.log('Created match player stats');

  // Final counts
  console.log('\nFinal counts:');
  console.log(`  Subscriptions: ${await prisma.subscription.count()}`);
  console.log(`  Notifications: ${await prisma.notification.count()}`);
  console.log(`  Bookmarks: ${await prisma.bookmark.count()}`);
  console.log(`  Favorites: ${await prisma.favorite.count()}`);
  console.log(`  Predictions: ${await prisma.prediction.count()}`);
  console.log(`  UserPredictions: ${await prisma.userPrediction.count()}`);
  console.log(`  WinProbabilities: ${await prisma.winProbability.count()}`);
  console.log(`  MatchPlayers: ${await prisma.matchPlayer.count()}`);
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
