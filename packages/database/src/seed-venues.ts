import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const venues = [
  { name: 'Melbourne Cricket Ground', slug: 'melbourne-cricket-ground', city: 'Melbourne', country: 'Australia', capacity: 100024, pitchType: 'grass' },
  { name: 'Lord\'s Cricket Ground', slug: 'lords-cricket-ground', city: 'London', country: 'England', capacity: 31100, pitchType: 'grass' },
  { name: 'Eden Gardens', slug: 'eden-gardens', city: 'Kolkata', country: 'India', capacity: 66000, pitchType: 'grass' },
  { name: 'Wankhede Stadium', slug: 'wankhede-stadium', city: 'Mumbai', country: 'India', capacity: 33108, pitchType: 'grass' },
  { name: 'Old Trafford', slug: 'old-trafford-manchester', city: 'Manchester', country: 'England', capacity: 74310, pitchType: 'grass' },
  { name: 'Camp Nou', slug: 'camp-nou', city: 'Barcelona', country: 'Spain', capacity: 99354, pitchType: 'grass' },
  { name: 'Santiago Bernabeu', slug: 'santiago-bernabeu', city: 'Madrid', country: 'Spain', capacity: 81044, pitchType: 'grass' },
  { name: 'Wembley Stadium', slug: 'wembley-stadium', city: 'London', country: 'England', capacity: 90000, pitchType: 'grass' },
  { name: 'Madison Square Garden', slug: 'madison-square-garden', city: 'New York', country: 'USA', capacity: 19812, pitchType: 'hard' },
  { name: 'Staples Center', slug: 'staples-center', city: 'Los Angeles', country: 'USA', capacity: 20000, pitchType: 'hard' },
  { name: 'Rod Laver Arena', slug: 'rod-laver-arena', city: 'Melbourne', country: 'Australia', capacity: 14820, pitchType: 'hard' },
  { name: 'All England Club', slug: 'all-england-club', city: 'London', country: 'England', capacity: 14979, pitchType: 'grass' },
  { name: 'Federation Internationale de Football Association', slug: 'fifa-stadium', city: 'Zurich', country: 'Switzerland', capacity: 80000, pitchType: 'grass' },
  { name: 'MCG - Great Southern Stand', slug: 'mcg-great-southern', city: 'Melbourne', country: 'Australia', capacity: 100024, pitchType: 'grass' },
  { name: 'Narendra Modi Stadium', slug: 'narendra-modi-stadium', city: 'Ahmedabad', country: 'India', capacity: 132000, pitchType: 'grass' },
  { name: 'The Oval', slug: 'the-oval-london', city: 'London', country: 'England', capacity: 25500, pitchType: 'grass' },
  { name: 'Sydney Cricket Ground', slug: 'sydney-cricket-ground', city: 'Sydney', country: 'Australia', capacity: 48000, pitchType: 'grass' },
  { name: 'Perth Stadium', slug: 'perth-stadium', city: 'Perth', country: 'Australia', capacity: 60000, pitchType: 'grass' },
  { name: 'Adelaide Oval', slug: 'adelaide-oval', city: 'Adelaide', country: 'Australia', capacity: 53500, pitchType: 'grass' },
  { name: 'Brisbane Cricket Ground', slug: 'brisbane-cricket-ground', city: 'Brisbane', country: 'Australia', capacity: 42000, pitchType: 'grass' },
];

async function main() {
  console.log('Seeding venues...');

  for (const venue of venues) {
    await prisma.venue.upsert({
      where: { slug: venue.slug },
      update: {},
      create: venue,
    });
    console.log(`  ✓ ${venue.name}`);
  }

  console.log(`\nSeeded ${venues.length} venues successfully!`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
