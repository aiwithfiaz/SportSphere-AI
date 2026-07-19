-- CreateSchema
CREATE SCHEMA IF NOT EXISTS "public";

-- CreateEnum
CREATE TYPE "UserRole" AS ENUM ('USER', 'ADMIN', 'MODERATOR', 'EDITOR', 'JOURNALIST');

-- CreateEnum
CREATE TYPE "AuthProvider" AS ENUM ('EMAIL', 'GOOGLE', 'FACEBOOK', 'APPLE');

-- CreateEnum
CREATE TYPE "MatchStatus" AS ENUM ('SCHEDULED', 'LIVE', 'IN_PROGRESS', 'INNINGS_BREAK', 'COMPLETED', 'ABANDONED', 'CANCELLED', 'POSTPONED');

-- CreateEnum
CREATE TYPE "MatchFormat" AS ENUM ('TEST', 'ODI', 'T20', 'T10', 'FOOTBALL_90', 'BASKETBALL', 'TENNIS', 'F1', 'UFC', 'OTHER');

-- CreateEnum
CREATE TYPE "ArticleStatus" AS ENUM ('DRAFT', 'REVIEW', 'PUBLISHED', 'ARCHIVED');

-- CreateEnum
CREATE TYPE "NotificationType" AS ENUM ('GOAL', 'WICKET', 'MATCH_START', 'MATCH_END', 'BREAKING_NEWS', 'TRANSFER', 'CUSTOM');

-- CreateTable
CREATE TABLE "users" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "username" TEXT NOT NULL,
    "passwordHash" TEXT,
    "firstName" TEXT NOT NULL,
    "lastName" TEXT NOT NULL,
    "displayName" TEXT,
    "avatar" TEXT,
    "bio" TEXT,
    "role" "UserRole" NOT NULL DEFAULT 'USER',
    "isEmailVerified" BOOLEAN NOT NULL DEFAULT false,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "lastLoginAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "accounts" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "provider" TEXT NOT NULL,
    "providerAccountId" TEXT NOT NULL,
    "refresh_token" TEXT,
    "access_token" TEXT,
    "expires_at" INTEGER,
    "token_type" TEXT,
    "scope" TEXT,
    "id_token" TEXT,
    "session_state" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "accounts_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "sessions" (
    "id" TEXT NOT NULL,
    "sessionToken" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "expires" TIMESTAMP(3) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "sessions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "verification_tokens" (
    "identifier" TEXT NOT NULL,
    "token" TEXT NOT NULL,
    "expires" TIMESTAMP(3) NOT NULL
);

-- CreateTable
CREATE TABLE "sports" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "icon" TEXT,
    "logo" TEXT,
    "description" TEXT,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "sports_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "tournaments" (
    "id" TEXT NOT NULL,
    "sportId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "logo" TEXT,
    "description" TEXT,
    "startDate" TIMESTAMP(3) NOT NULL,
    "endDate" TIMESTAMP(3) NOT NULL,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "isCurrent" BOOLEAN NOT NULL DEFAULT false,
    "metadata" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "tournaments_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "teams" (
    "id" TEXT NOT NULL,
    "sportId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "shortName" TEXT,
    "slug" TEXT NOT NULL,
    "logo" TEXT,
    "primaryColor" TEXT,
    "secondaryColor" TEXT,
    "country" TEXT,
    "city" TEXT,
    "founded" INTEGER,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "metadata" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "teams_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "players" (
    "id" TEXT NOT NULL,
    "sportId" TEXT NOT NULL,
    "teamId" TEXT,
    "firstName" TEXT NOT NULL,
    "lastName" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "avatar" TEXT,
    "dateOfBirth" TIMESTAMP(3),
    "nationality" TEXT,
    "role" TEXT,
    "battingStyle" TEXT,
    "bowlingStyle" TEXT,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "metadata" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "players_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "venues" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "city" TEXT,
    "country" TEXT,
    "capacity" INTEGER,
    "imageUrl" TEXT,
    "pitchType" TEXT,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "venues_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "matches" (
    "id" TEXT NOT NULL,
    "sportId" TEXT NOT NULL,
    "tournamentId" TEXT,
    "homeTeamId" TEXT,
    "awayTeamId" TEXT,
    "venueId" TEXT,
    "status" "MatchStatus" NOT NULL DEFAULT 'SCHEDULED',
    "format" "MatchFormat" NOT NULL DEFAULT 'OTHER',
    "scheduledAt" TIMESTAMP(3) NOT NULL,
    "startedAt" TIMESTAMP(3),
    "completedAt" TIMESTAMP(3),
    "homeScore" INTEGER,
    "awayScore" INTEGER,
    "homeOvers" DOUBLE PRECISION,
    "awayOvers" DOUBLE PRECISION,
    "result" TEXT,
    "tossWinner" TEXT,
    "tossDecision" TEXT,
    "weather" JSONB,
    "pitchReport" JSONB,
    "metadata" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "manOfTheMatchId" TEXT,

    CONSTRAINT "matches_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "match_players" (
    "id" TEXT NOT NULL,
    "matchId" TEXT NOT NULL,
    "playerId" TEXT NOT NULL,
    "teamId" TEXT NOT NULL,
    "isPlaying" BOOLEAN NOT NULL DEFAULT true,
    "isCaptain" BOOLEAN NOT NULL DEFAULT false,
    "isKeeper" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "match_players_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "match_innings" (
    "id" TEXT NOT NULL,
    "matchId" TEXT NOT NULL,
    "inningNumber" INTEGER NOT NULL,
    "teamId" TEXT,
    "runs" INTEGER NOT NULL DEFAULT 0,
    "wickets" INTEGER NOT NULL DEFAULT 0,
    "overs" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "extras" INTEGER NOT NULL DEFAULT 0,
    "declared" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "match_innings_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "match_scores" (
    "id" TEXT NOT NULL,
    "inningId" TEXT NOT NULL,
    "teamId" TEXT NOT NULL,
    "runs" INTEGER NOT NULL DEFAULT 0,
    "wickets" INTEGER NOT NULL DEFAULT 0,
    "overs" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "runRate" DOUBLE PRECISION,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "match_scores_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "live_scores" (
    "id" TEXT NOT NULL,
    "matchId" TEXT NOT NULL,
    "currentInning" INTEGER,
    "battingTeam" TEXT,
    "bowlingTeam" TEXT,
    "currentScore" JSONB,
    "lastUpdated" TIMESTAMP(3) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "live_scores_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "commentary" (
    "id" TEXT NOT NULL,
    "matchId" TEXT NOT NULL,
    "inningId" TEXT,
    "over" DOUBLE PRECISION,
    "ball" INTEGER,
    "content" TEXT NOT NULL,
    "eventType" TEXT,
    "runs" INTEGER,
    "wicket" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "commentary_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ball_by_ball" (
    "id" TEXT NOT NULL,
    "matchId" TEXT NOT NULL,
    "inningId" TEXT,
    "over" DOUBLE PRECISION NOT NULL,
    "ball" INTEGER NOT NULL,
    "batsmanId" TEXT,
    "bowlerId" TEXT,
    "nonStrikerId" TEXT,
    "runs" INTEGER NOT NULL DEFAULT 0,
    "extras" INTEGER NOT NULL DEFAULT 0,
    "wicket" BOOLEAN NOT NULL DEFAULT false,
    "wicketType" TEXT,
    "description" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ball_by_ball_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "win_probability" (
    "id" TEXT NOT NULL,
    "matchId" TEXT NOT NULL,
    "teamId" TEXT NOT NULL,
    "probability" DOUBLE PRECISION NOT NULL,
    "over" DOUBLE PRECISION,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "win_probability_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "run_rate" (
    "id" TEXT NOT NULL,
    "matchId" TEXT NOT NULL,
    "teamId" TEXT NOT NULL,
    "runRate" DOUBLE PRECISION NOT NULL,
    "requiredRate" DOUBLE PRECISION,
    "over" DOUBLE PRECISION NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "run_rate_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "articles" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "excerpt" TEXT,
    "content" TEXT NOT NULL,
    "coverImage" TEXT,
    "authorId" TEXT,
    "sportId" TEXT,
    "tournamentId" TEXT,
    "matchId" TEXT,
    "status" "ArticleStatus" NOT NULL DEFAULT 'DRAFT',
    "publishedAt" TIMESTAMP(3),
    "viewCount" INTEGER NOT NULL DEFAULT 0,
    "likeCount" INTEGER NOT NULL DEFAULT 0,
    "commentCount" INTEGER NOT NULL DEFAULT 0,
    "isFeatured" BOOLEAN NOT NULL DEFAULT false,
    "isBreaking" BOOLEAN NOT NULL DEFAULT false,
    "seoTitle" TEXT,
    "seoDescription" TEXT,
    "tags" TEXT[],
    "metadata" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "articles_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "article_categories" (
    "id" TEXT NOT NULL,
    "articleId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "slug" TEXT NOT NULL,

    CONSTRAINT "article_categories_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "article_tags" (
    "id" TEXT NOT NULL,
    "articleId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "slug" TEXT NOT NULL,

    CONSTRAINT "article_tags_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "comments" (
    "id" TEXT NOT NULL,
    "articleId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "parentId" TEXT,
    "likeCount" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "comments_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "bookmarks" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "articleId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "bookmarks_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "favorites" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "entityType" TEXT NOT NULL,
    "entityId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "favorites_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "team_follows" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "teamId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "team_follows_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "player_follows" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "playerId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "player_follows_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "notifications" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "type" "NotificationType" NOT NULL,
    "title" TEXT NOT NULL,
    "message" TEXT NOT NULL,
    "link" TEXT,
    "isRead" BOOLEAN NOT NULL DEFAULT false,
    "metadata" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "notifications_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "notification_preferences" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "type" "NotificationType" NOT NULL,
    "isEnabled" BOOLEAN NOT NULL DEFAULT true,
    "emailEnabled" BOOLEAN NOT NULL DEFAULT false,
    "pushEnabled" BOOLEAN NOT NULL DEFAULT true,

    CONSTRAINT "notification_preferences_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "subscriptions" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "plan" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'active',
    "startDate" TIMESTAMP(3) NOT NULL,
    "endDate" TIMESTAMP(3),
    "metadata" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "subscriptions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "standings" (
    "id" TEXT NOT NULL,
    "tournamentId" TEXT NOT NULL,
    "teamId" TEXT NOT NULL,
    "position" INTEGER NOT NULL,
    "played" INTEGER NOT NULL DEFAULT 0,
    "won" INTEGER NOT NULL DEFAULT 0,
    "lost" INTEGER NOT NULL DEFAULT 0,
    "drawn" INTEGER NOT NULL DEFAULT 0,
    "points" INTEGER NOT NULL DEFAULT 0,
    "netRunRate" DOUBLE PRECISION,
    "form" TEXT,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "standings_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "head_to_head" (
    "id" TEXT NOT NULL,
    "sportId" TEXT NOT NULL,
    "homeTeamId" TEXT NOT NULL,
    "awayTeamId" TEXT NOT NULL,
    "totalMatches" INTEGER NOT NULL DEFAULT 0,
    "homeWins" INTEGER NOT NULL DEFAULT 0,
    "awayWins" INTEGER NOT NULL DEFAULT 0,
    "draws" INTEGER NOT NULL DEFAULT 0,
    "lastMeeting" TIMESTAMP(3),
    "metadata" JSONB,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "head_to_head_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "predictions" (
    "id" TEXT NOT NULL,
    "sportId" TEXT,
    "matchId" TEXT,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "prediction" TEXT NOT NULL,
    "confidence" DOUBLE PRECISION,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "predictions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "user_predictions" (
    "id" TEXT NOT NULL,
    "predictionId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "choice" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "user_predictions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "newsletter_subscribers" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "userId" TEXT,
    "name" TEXT,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "token" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "newsletter_subscribers_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "users_email_key" ON "users"("email");

-- CreateIndex
CREATE UNIQUE INDEX "users_username_key" ON "users"("username");

-- CreateIndex
CREATE INDEX "users_email_idx" ON "users"("email");

-- CreateIndex
CREATE INDEX "users_username_idx" ON "users"("username");

-- CreateIndex
CREATE INDEX "accounts_userId_idx" ON "accounts"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "accounts_provider_providerAccountId_key" ON "accounts"("provider", "providerAccountId");

-- CreateIndex
CREATE UNIQUE INDEX "sessions_sessionToken_key" ON "sessions"("sessionToken");

-- CreateIndex
CREATE INDEX "sessions_userId_idx" ON "sessions"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "verification_tokens_token_key" ON "verification_tokens"("token");

-- CreateIndex
CREATE UNIQUE INDEX "verification_tokens_identifier_token_key" ON "verification_tokens"("identifier", "token");

-- CreateIndex
CREATE UNIQUE INDEX "sports_name_key" ON "sports"("name");

-- CreateIndex
CREATE UNIQUE INDEX "sports_slug_key" ON "sports"("slug");

-- CreateIndex
CREATE INDEX "tournaments_sportId_idx" ON "tournaments"("sportId");

-- CreateIndex
CREATE UNIQUE INDEX "tournaments_sportId_slug_key" ON "tournaments"("sportId", "slug");

-- CreateIndex
CREATE INDEX "teams_sportId_idx" ON "teams"("sportId");

-- CreateIndex
CREATE UNIQUE INDEX "teams_sportId_slug_key" ON "teams"("sportId", "slug");

-- CreateIndex
CREATE INDEX "players_sportId_idx" ON "players"("sportId");

-- CreateIndex
CREATE INDEX "players_teamId_idx" ON "players"("teamId");

-- CreateIndex
CREATE UNIQUE INDEX "players_sportId_slug_key" ON "players"("sportId", "slug");

-- CreateIndex
CREATE UNIQUE INDEX "venues_slug_key" ON "venues"("slug");

-- CreateIndex
CREATE INDEX "matches_sportId_idx" ON "matches"("sportId");

-- CreateIndex
CREATE INDEX "matches_tournamentId_idx" ON "matches"("tournamentId");

-- CreateIndex
CREATE INDEX "matches_status_idx" ON "matches"("status");

-- CreateIndex
CREATE INDEX "matches_scheduledAt_idx" ON "matches"("scheduledAt");

-- CreateIndex
CREATE INDEX "matches_homeTeamId_idx" ON "matches"("homeTeamId");

-- CreateIndex
CREATE INDEX "matches_awayTeamId_idx" ON "matches"("awayTeamId");

-- CreateIndex
CREATE INDEX "match_players_matchId_idx" ON "match_players"("matchId");

-- CreateIndex
CREATE INDEX "match_players_playerId_idx" ON "match_players"("playerId");

-- CreateIndex
CREATE INDEX "match_players_teamId_idx" ON "match_players"("teamId");

-- CreateIndex
CREATE UNIQUE INDEX "match_players_matchId_playerId_key" ON "match_players"("matchId", "playerId");

-- CreateIndex
CREATE INDEX "match_innings_matchId_idx" ON "match_innings"("matchId");

-- CreateIndex
CREATE UNIQUE INDEX "match_innings_matchId_inningNumber_key" ON "match_innings"("matchId", "inningNumber");

-- CreateIndex
CREATE INDEX "match_scores_inningId_idx" ON "match_scores"("inningId");

-- CreateIndex
CREATE UNIQUE INDEX "live_scores_matchId_key" ON "live_scores"("matchId");

-- CreateIndex
CREATE INDEX "commentary_matchId_idx" ON "commentary"("matchId");

-- CreateIndex
CREATE INDEX "commentary_inningId_idx" ON "commentary"("inningId");

-- CreateIndex
CREATE INDEX "commentary_createdAt_idx" ON "commentary"("createdAt");

-- CreateIndex
CREATE INDEX "ball_by_ball_matchId_idx" ON "ball_by_ball"("matchId");

-- CreateIndex
CREATE INDEX "ball_by_ball_inningId_idx" ON "ball_by_ball"("inningId");

-- CreateIndex
CREATE INDEX "win_probability_matchId_idx" ON "win_probability"("matchId");

-- CreateIndex
CREATE INDEX "run_rate_matchId_idx" ON "run_rate"("matchId");

-- CreateIndex
CREATE UNIQUE INDEX "articles_slug_key" ON "articles"("slug");

-- CreateIndex
CREATE INDEX "articles_slug_idx" ON "articles"("slug");

-- CreateIndex
CREATE INDEX "articles_authorId_idx" ON "articles"("authorId");

-- CreateIndex
CREATE INDEX "articles_sportId_idx" ON "articles"("sportId");

-- CreateIndex
CREATE INDEX "articles_tournamentId_idx" ON "articles"("tournamentId");

-- CreateIndex
CREATE INDEX "articles_matchId_idx" ON "articles"("matchId");

-- CreateIndex
CREATE INDEX "articles_status_idx" ON "articles"("status");

-- CreateIndex
CREATE INDEX "articles_publishedAt_idx" ON "articles"("publishedAt");

-- CreateIndex
CREATE INDEX "articles_isFeatured_idx" ON "articles"("isFeatured");

-- CreateIndex
CREATE INDEX "articles_isBreaking_idx" ON "articles"("isBreaking");

-- CreateIndex
CREATE INDEX "article_categories_articleId_idx" ON "article_categories"("articleId");

-- CreateIndex
CREATE INDEX "article_categories_slug_idx" ON "article_categories"("slug");

-- CreateIndex
CREATE INDEX "article_tags_articleId_idx" ON "article_tags"("articleId");

-- CreateIndex
CREATE INDEX "article_tags_slug_idx" ON "article_tags"("slug");

-- CreateIndex
CREATE INDEX "comments_articleId_idx" ON "comments"("articleId");

-- CreateIndex
CREATE INDEX "comments_userId_idx" ON "comments"("userId");

-- CreateIndex
CREATE INDEX "comments_parentId_idx" ON "comments"("parentId");

-- CreateIndex
CREATE INDEX "bookmarks_userId_idx" ON "bookmarks"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "bookmarks_userId_articleId_key" ON "bookmarks"("userId", "articleId");

-- CreateIndex
CREATE INDEX "favorites_userId_idx" ON "favorites"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "favorites_userId_entityType_entityId_key" ON "favorites"("userId", "entityType", "entityId");

-- CreateIndex
CREATE INDEX "team_follows_userId_idx" ON "team_follows"("userId");

-- CreateIndex
CREATE INDEX "team_follows_teamId_idx" ON "team_follows"("teamId");

-- CreateIndex
CREATE UNIQUE INDEX "team_follows_userId_teamId_key" ON "team_follows"("userId", "teamId");

-- CreateIndex
CREATE INDEX "player_follows_userId_idx" ON "player_follows"("userId");

-- CreateIndex
CREATE INDEX "player_follows_playerId_idx" ON "player_follows"("playerId");

-- CreateIndex
CREATE UNIQUE INDEX "player_follows_userId_playerId_key" ON "player_follows"("userId", "playerId");

-- CreateIndex
CREATE INDEX "notifications_userId_idx" ON "notifications"("userId");

-- CreateIndex
CREATE INDEX "notifications_isRead_idx" ON "notifications"("isRead");

-- CreateIndex
CREATE INDEX "notifications_createdAt_idx" ON "notifications"("createdAt");

-- CreateIndex
CREATE INDEX "notification_preferences_userId_idx" ON "notification_preferences"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "notification_preferences_userId_type_key" ON "notification_preferences"("userId", "type");

-- CreateIndex
CREATE INDEX "subscriptions_userId_idx" ON "subscriptions"("userId");

-- CreateIndex
CREATE INDEX "standings_tournamentId_idx" ON "standings"("tournamentId");

-- CreateIndex
CREATE INDEX "standings_teamId_idx" ON "standings"("teamId");

-- CreateIndex
CREATE UNIQUE INDEX "standings_tournamentId_teamId_key" ON "standings"("tournamentId", "teamId");

-- CreateIndex
CREATE INDEX "head_to_head_sportId_idx" ON "head_to_head"("sportId");

-- CreateIndex
CREATE INDEX "head_to_head_homeTeamId_idx" ON "head_to_head"("homeTeamId");

-- CreateIndex
CREATE INDEX "head_to_head_awayTeamId_idx" ON "head_to_head"("awayTeamId");

-- CreateIndex
CREATE UNIQUE INDEX "head_to_head_sportId_homeTeamId_awayTeamId_key" ON "head_to_head"("sportId", "homeTeamId", "awayTeamId");

-- CreateIndex
CREATE INDEX "predictions_sportId_idx" ON "predictions"("sportId");

-- CreateIndex
CREATE INDEX "predictions_matchId_idx" ON "predictions"("matchId");

-- CreateIndex
CREATE INDEX "user_predictions_predictionId_idx" ON "user_predictions"("predictionId");

-- CreateIndex
CREATE INDEX "user_predictions_userId_idx" ON "user_predictions"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "user_predictions_predictionId_userId_key" ON "user_predictions"("predictionId", "userId");

-- CreateIndex
CREATE UNIQUE INDEX "newsletter_subscribers_email_key" ON "newsletter_subscribers"("email");

-- CreateIndex
CREATE UNIQUE INDEX "newsletter_subscribers_userId_key" ON "newsletter_subscribers"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "newsletter_subscribers_token_key" ON "newsletter_subscribers"("token");

-- AddForeignKey
ALTER TABLE "accounts" ADD CONSTRAINT "accounts_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "sessions" ADD CONSTRAINT "sessions_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "tournaments" ADD CONSTRAINT "tournaments_sportId_fkey" FOREIGN KEY ("sportId") REFERENCES "sports"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "teams" ADD CONSTRAINT "teams_sportId_fkey" FOREIGN KEY ("sportId") REFERENCES "sports"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "players" ADD CONSTRAINT "players_sportId_fkey" FOREIGN KEY ("sportId") REFERENCES "sports"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "players" ADD CONSTRAINT "players_teamId_fkey" FOREIGN KEY ("teamId") REFERENCES "teams"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "matches" ADD CONSTRAINT "matches_sportId_fkey" FOREIGN KEY ("sportId") REFERENCES "sports"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "matches" ADD CONSTRAINT "matches_tournamentId_fkey" FOREIGN KEY ("tournamentId") REFERENCES "tournaments"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "matches" ADD CONSTRAINT "matches_homeTeamId_fkey" FOREIGN KEY ("homeTeamId") REFERENCES "teams"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "matches" ADD CONSTRAINT "matches_awayTeamId_fkey" FOREIGN KEY ("awayTeamId") REFERENCES "teams"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "matches" ADD CONSTRAINT "matches_venueId_fkey" FOREIGN KEY ("venueId") REFERENCES "venues"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "matches" ADD CONSTRAINT "matches_manOfTheMatchId_fkey" FOREIGN KEY ("manOfTheMatchId") REFERENCES "players"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "match_players" ADD CONSTRAINT "match_players_matchId_fkey" FOREIGN KEY ("matchId") REFERENCES "matches"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "match_players" ADD CONSTRAINT "match_players_playerId_fkey" FOREIGN KEY ("playerId") REFERENCES "players"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "match_players" ADD CONSTRAINT "match_players_teamId_fkey" FOREIGN KEY ("teamId") REFERENCES "teams"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "match_innings" ADD CONSTRAINT "match_innings_matchId_fkey" FOREIGN KEY ("matchId") REFERENCES "matches"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "match_scores" ADD CONSTRAINT "match_scores_inningId_fkey" FOREIGN KEY ("inningId") REFERENCES "match_innings"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "live_scores" ADD CONSTRAINT "live_scores_matchId_fkey" FOREIGN KEY ("matchId") REFERENCES "matches"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "commentary" ADD CONSTRAINT "commentary_matchId_fkey" FOREIGN KEY ("matchId") REFERENCES "matches"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "commentary" ADD CONSTRAINT "commentary_inningId_fkey" FOREIGN KEY ("inningId") REFERENCES "match_innings"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ball_by_ball" ADD CONSTRAINT "ball_by_ball_matchId_fkey" FOREIGN KEY ("matchId") REFERENCES "matches"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ball_by_ball" ADD CONSTRAINT "ball_by_ball_inningId_fkey" FOREIGN KEY ("inningId") REFERENCES "match_innings"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "win_probability" ADD CONSTRAINT "win_probability_matchId_fkey" FOREIGN KEY ("matchId") REFERENCES "matches"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "run_rate" ADD CONSTRAINT "run_rate_matchId_fkey" FOREIGN KEY ("matchId") REFERENCES "matches"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "articles" ADD CONSTRAINT "articles_authorId_fkey" FOREIGN KEY ("authorId") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "articles" ADD CONSTRAINT "articles_sportId_fkey" FOREIGN KEY ("sportId") REFERENCES "sports"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "articles" ADD CONSTRAINT "articles_tournamentId_fkey" FOREIGN KEY ("tournamentId") REFERENCES "tournaments"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "articles" ADD CONSTRAINT "articles_matchId_fkey" FOREIGN KEY ("matchId") REFERENCES "matches"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "article_categories" ADD CONSTRAINT "article_categories_articleId_fkey" FOREIGN KEY ("articleId") REFERENCES "articles"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "article_tags" ADD CONSTRAINT "article_tags_articleId_fkey" FOREIGN KEY ("articleId") REFERENCES "articles"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "comments" ADD CONSTRAINT "comments_articleId_fkey" FOREIGN KEY ("articleId") REFERENCES "articles"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "comments" ADD CONSTRAINT "comments_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "comments" ADD CONSTRAINT "comments_parentId_fkey" FOREIGN KEY ("parentId") REFERENCES "comments"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "bookmarks" ADD CONSTRAINT "bookmarks_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "bookmarks" ADD CONSTRAINT "bookmarks_articleId_fkey" FOREIGN KEY ("articleId") REFERENCES "articles"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "favorites" ADD CONSTRAINT "favorites_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "team_follows" ADD CONSTRAINT "team_follows_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "team_follows" ADD CONSTRAINT "team_follows_teamId_fkey" FOREIGN KEY ("teamId") REFERENCES "teams"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "player_follows" ADD CONSTRAINT "player_follows_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "player_follows" ADD CONSTRAINT "player_follows_playerId_fkey" FOREIGN KEY ("playerId") REFERENCES "players"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "notifications" ADD CONSTRAINT "notifications_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "notification_preferences" ADD CONSTRAINT "notification_preferences_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "subscriptions" ADD CONSTRAINT "subscriptions_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "standings" ADD CONSTRAINT "standings_tournamentId_fkey" FOREIGN KEY ("tournamentId") REFERENCES "tournaments"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "standings" ADD CONSTRAINT "standings_teamId_fkey" FOREIGN KEY ("teamId") REFERENCES "teams"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "head_to_head" ADD CONSTRAINT "head_to_head_sportId_fkey" FOREIGN KEY ("sportId") REFERENCES "sports"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "head_to_head" ADD CONSTRAINT "head_to_head_homeTeamId_fkey" FOREIGN KEY ("homeTeamId") REFERENCES "teams"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "head_to_head" ADD CONSTRAINT "head_to_head_awayTeamId_fkey" FOREIGN KEY ("awayTeamId") REFERENCES "teams"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "predictions" ADD CONSTRAINT "predictions_sportId_fkey" FOREIGN KEY ("sportId") REFERENCES "sports"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "predictions" ADD CONSTRAINT "predictions_matchId_fkey" FOREIGN KEY ("matchId") REFERENCES "matches"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "user_predictions" ADD CONSTRAINT "user_predictions_predictionId_fkey" FOREIGN KEY ("predictionId") REFERENCES "predictions"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "newsletter_subscribers" ADD CONSTRAINT "newsletter_subscribers_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

