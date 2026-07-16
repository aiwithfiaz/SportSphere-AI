export const siteConfig = {
  name: "SportSphere AI",
  description: "The World's Fastest Live Sports Experience",
  url: "https://sportsphere.ai",
  ogImage: "https://sportsphere.ai/og-image.png",
  links: {
    twitter: "https://twitter.com/sportsphere_ai",
    github: "https://github.com/sportsphere-ai",
  },
  creator: "SportSphere AI Team",
  keywords: [
    "sports",
    "live scores",
    "cricket",
    "football",
    "basketball",
    "tennis",
    "formula 1",
    "ufc",
    "sports analytics",
    "AI sports",
  ],
};

export const navigationConfig = {
  main: [
    { name: "Matches", href: "/matches" },
    { name: "Fixtures", href: "/fixtures" },
    { name: "Results", href: "/results" },
    { name: "Leagues", href: "/leagues" },
    { name: "News", href: "/news" },
    { name: "Videos", href: "/videos" },
    { name: "Rankings", href: "/rankings" },
  ],
  sports: [
    { name: "Cricket", href: "/sport/cricket", icon: "cricket" },
    { name: "Football", href: "/sport/football", icon: "football" },
    { name: "Basketball", href: "/sport/basketball", icon: "basketball" },
    { name: "Tennis", href: "/sport/tennis", icon: "tennis" },
    { name: "Formula 1", href: "/sport/f1", icon: "f1" },
    { name: "UFC", href: "/sport/ufc", icon: "ufc" },
  ],
  footer: {
    product: [
      { name: "Live Scores", href: "/matches" },
      { name: "News", href: "/news" },
      { name: "Videos", href: "/videos" },
      { name: "Fantasy", href: "/fantasy" },
      { name: "Premium", href: "/premium" },
    ],
    company: [
      { name: "About Us", href: "/about" },
      { name: "Careers", href: "/careers" },
      { name: "Press", href: "/press" },
      { name: "Contact", href: "/contact" },
    ],
    support: [
      { name: "Help Center", href: "/help" },
      { name: "Terms of Service", href: "/terms" },
      { name: "Privacy Policy", href: "/privacy" },
      { name: "Cookie Policy", href: "/cookies" },
    ],
    social: [
      { name: "Twitter", href: "https://twitter.com/sportsphere_ai" },
      { name: "GitHub", href: "https://github.com/sportsphere-ai" },
    ],
  },
};

export const sportsConfig = [
  {
    id: "cricket",
    name: "Cricket",
    slug: "cricket",
    icon: "🏏",
    tournaments: ["IPL", "PSL", "BBL", "CPL", "SA20", "ILT20", "County Cricket"],
  },
  {
    id: "football",
    name: "Football",
    slug: "football",
    icon: "⚽",
    tournaments: [
      "Premier League",
      "UEFA Champions League",
      "La Liga",
      "Bundesliga",
      "Serie A",
      "Ligue 1",
      "FIFA World Cup",
    ],
  },
  {
    id: "basketball",
    name: "Basketball",
    slug: "basketball",
    icon: "🏀",
    tournaments: ["NBA", "EuroLeague", "NCAA"],
  },
  {
    id: "tennis",
    name: "Tennis",
    slug: "tennis",
    icon: "🎾",
    tournaments: ["ATP", "WTA", "Wimbledon", "Roland Garros", "US Open", "Australian Open"],
  },
  {
    id: "f1",
    name: "Formula 1",
    slug: "f1",
    icon: "🏎️",
    tournaments: ["Formula 1 World Championship"],
  },
  {
    id: "ufc",
    name: "UFC",
    slug: "ufc",
    icon: "🥊",
    tournaments: ["UFC Fight Night", "UFC PPV"],
  },
];

export const matchStatusConfig = {
  SCHEDULED: { label: "Scheduled", color: "blue" },
  LIVE: { label: "Live", color: "red" },
  IN_PROGRESS: { label: "In Progress", color: "red" },
  INNINGS_BREAK: { label: "Innings Break", color: "yellow" },
  COMPLETED: { label: "Completed", color: "green" },
  ABANDONED: { label: "Abandoned", color: "gray" },
  CANCELLED: { label: "Cancelled", color: "gray" },
  POSTPONED: { label: "Postponed", color: "orange" },
};

export const matchFormatConfig = {
  TEST: { label: "Test", overs: null },
  ODI: { label: "ODI", overs: 50 },
  T20: { label: "T20", overs: 20 },
  T10: { label: "T10", overs: 10 },
  FOOTBALL_90: { label: "Football", overs: 90 },
  BASKETBALL: { label: "Basketball", overs: null },
  TENNIS: { label: "Tennis", overs: null },
  F1: { label: "Formula 1", overs: null },
  UFC: { label: "UFC", overs: null },
  OTHER: { label: "Other", overs: null },
};
