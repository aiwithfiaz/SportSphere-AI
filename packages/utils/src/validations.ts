import { z } from "zod";

export const emailSchema = z.string().email("Invalid email address");

export const passwordSchema = z
  .string()
  .min(8, "Password must be at least 8 characters")
  .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
  .regex(/[a-z]/, "Password must contain at least one lowercase letter")
  .regex(/[0-9]/, "Password must contain at least one number");

export const usernameSchema = z
  .string()
  .min(3, "Username must be at least 3 characters")
  .max(20, "Username must be at most 20 characters")
  .regex(/^[a-zA-Z0-9_]+$/, "Username can only contain letters, numbers, and underscores");

export const loginSchema = z.object({
  email: emailSchema,
  password: z.string().min(1, "Password is required"),
});

export const registerSchema = z.object({
  email: emailSchema,
  username: usernameSchema,
  password: passwordSchema,
  firstName: z.string().min(1, "First name is required"),
  lastName: z.string().min(1, "Last name is required"),
});

export const articleSchema = z.object({
  title: z.string().min(1, "Title is required").max(200),
  slug: z.string().min(1, "Slug is required").max(200),
  excerpt: z.string().max(500).optional(),
  content: z.string().min(1, "Content is required"),
  coverImage: z.string().url().optional(),
  sportId: z.string().optional(),
  tournamentId: z.string().optional(),
  matchId: z.string().optional(),
  tags: z.array(z.string()).optional(),
  seoTitle: z.string().max(60).optional(),
  seoDescription: z.string().max(160).optional(),
});

export const matchSchema = z.object({
  sportId: z.string().min(1, "Sport is required"),
  tournamentId: z.string().optional(),
  homeTeamId: z.string().optional(),
  awayTeamId: z.string().optional(),
  venueId: z.string().optional(),
  scheduledAt: z.string().datetime(),
  format: z.enum(["TEST", "ODI", "T20", "T10", "FOOTBALL_90", "BASKETBALL", "TENNIS", "F1", "UFC", "OTHER"]).default("OTHER"),
});

export const teamSchema = z.object({
  sportId: z.string().min(1, "Sport is required"),
  name: z.string().min(1, "Name is required"),
  shortName: z.string().max(10).optional(),
  slug: z.string().min(1, "Slug is required"),
  logo: z.string().url().optional(),
  country: z.string().optional(),
  city: z.string().optional(),
});

export const playerSchema = z.object({
  sportId: z.string().min(1, "Sport is required"),
  teamId: z.string().optional(),
  firstName: z.string().min(1, "First name is required"),
  lastName: z.string().min(1, "Last name is required"),
  slug: z.string().min(1, "Slug is required"),
  avatar: z.string().url().optional(),
  dateOfBirth: z.string().datetime().optional(),
  nationality: z.string().optional(),
  role: z.string().optional(),
});

export const paginationSchema = z.object({
  page: z.coerce.number().min(1).default(1),
  limit: z.coerce.number().min(1).max(100).default(10),
});

export const searchSchema = z.object({
  q: z.string().min(1, "Search query is required"),
  type: z.enum(["all", "matches", "teams", "players", "articles"]).default("all"),
  page: z.coerce.number().min(1).default(1),
  limit: z.coerce.number().min(1).max(100).default(10),
});

export type LoginInput = z.infer<typeof loginSchema>;
export type RegisterInput = z.infer<typeof registerSchema>;
export type ArticleInput = z.infer<typeof articleSchema>;
export type MatchInput = z.infer<typeof matchSchema>;
export type TeamInput = z.infer<typeof teamSchema>;
export type PlayerInput = z.infer<typeof playerSchema>;
export type PaginationInput = z.infer<typeof paginationSchema>;
export type SearchInput = z.infer<typeof searchSchema>;
