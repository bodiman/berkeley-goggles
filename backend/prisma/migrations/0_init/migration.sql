-- CreateTable
CREATE TABLE "users" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "age" INTEGER,
    "gender" TEXT,
    "city" TEXT,
    "state" TEXT,
    "country" TEXT,
    "latitude" DOUBLE PRECISION,
    "longitude" DOUBLE PRECISION,
    "bio" TEXT,
    "profile_complete" BOOLEAN NOT NULL DEFAULT false,
    "profile_photo_url" TEXT,
    "is_active" BOOLEAN NOT NULL DEFAULT true,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "last_active" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "agreed_to_terms" BOOLEAN NOT NULL DEFAULT false,
    "agreed_to_privacy" BOOLEAN NOT NULL DEFAULT false,
    "blur_face_until_consent" BOOLEAN NOT NULL DEFAULT false,
    "restrict_by_location" BOOLEAN NOT NULL DEFAULT false,
    "opt_out_of_leaderboards" BOOLEAN NOT NULL DEFAULT false,
    "limit_demographic_data" BOOLEAN NOT NULL DEFAULT false,
    "email_notifications" BOOLEAN NOT NULL DEFAULT true,
    "push_notifications" BOOLEAN NOT NULL DEFAULT true,
    "ranking_updates" BOOLEAN NOT NULL DEFAULT true,
    "new_comparisons" BOOLEAN NOT NULL DEFAULT true,
    "achievement_notifications" BOOLEAN NOT NULL DEFAULT true,
    "daily_limit" INTEGER NOT NULL DEFAULT 20,
    "skip_penalty" BOOLEAN NOT NULL DEFAULT false,
    "quality_filter" BOOLEAN NOT NULL DEFAULT true,
    "matching_percentile" INTEGER NOT NULL DEFAULT 20,

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "photos" (
    "id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "url" TEXT NOT NULL,
    "thumbnail_url" TEXT,
    "status" TEXT NOT NULL DEFAULT 'pending',
    "original_filename" TEXT NOT NULL,
    "file_size" INTEGER NOT NULL,
    "width" INTEGER NOT NULL,
    "height" INTEGER NOT NULL,
    "format" TEXT NOT NULL,
    "uploaded_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "moderated_at" TIMESTAMP(3),
    "rejection_reason" TEXT,

    CONSTRAINT "photos_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "photo_rankings" (
    "id" TEXT NOT NULL,
    "photo_id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "current_percentile" DOUBLE PRECISION NOT NULL DEFAULT 50.0,
    "total_comparisons" INTEGER NOT NULL DEFAULT 0,
    "wins" INTEGER NOT NULL DEFAULT 0,
    "losses" INTEGER NOT NULL DEFAULT 0,
    "bradley_terry_score" DOUBLE PRECISION NOT NULL DEFAULT 0.5,
    "confidence" DOUBLE PRECISION NOT NULL DEFAULT 0.0,
    "last_updated" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "photo_rankings_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "percentile_history" (
    "id" TEXT NOT NULL,
    "ranking_id" TEXT NOT NULL,
    "percentile" DOUBLE PRECISION NOT NULL,
    "comparisons" INTEGER NOT NULL,
    "recorded_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "percentile_history_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "comparisons" (
    "id" TEXT NOT NULL,
    "rater_id" TEXT NOT NULL,
    "winner_photo_id" TEXT,
    "loser_photo_id" TEXT,
    "winner_sample_image_id" TEXT,
    "loser_sample_image_id" TEXT,
    "comparison_type" TEXT NOT NULL DEFAULT 'user_photos',
    "session_id" TEXT NOT NULL,
    "reliability_weight" DOUBLE PRECISION NOT NULL DEFAULT 1.0,
    "timestamp" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "source" TEXT NOT NULL DEFAULT 'mobile',
    "device_platform" TEXT,
    "device_version" TEXT,

    CONSTRAINT "comparisons_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "comparison_sessions" (
    "id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "started_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "ended_at" TIMESTAMP(3),
    "comparisons_completed" INTEGER NOT NULL DEFAULT 0,
    "comparisons_skipped" INTEGER NOT NULL DEFAULT 0,
    "average_response_time" DOUBLE PRECISION,
    "reliability" DOUBLE PRECISION DEFAULT 1.0,

    CONSTRAINT "comparison_sessions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "achievements" (
    "id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "icon" TEXT NOT NULL,
    "unlocked_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "achievements_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "moderation_flags" (
    "id" TEXT NOT NULL,
    "photo_id" TEXT NOT NULL,
    "flag_type" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "severity" TEXT NOT NULL,
    "confidence" DOUBLE PRECISION NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "reviewed_at" TIMESTAMP(3),
    "reviewed_by" TEXT,

    CONSTRAINT "moderation_flags_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "sample_images" (
    "id" TEXT NOT NULL,
    "url" TEXT NOT NULL,
    "thumbnail_url" TEXT,
    "gender" TEXT NOT NULL,
    "estimated_age" INTEGER NOT NULL,
    "source" TEXT NOT NULL,
    "description" TEXT,
    "is_active" BOOLEAN NOT NULL DEFAULT true,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "last_used" TIMESTAMP(3),

    CONSTRAINT "sample_images_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "sample_image_rankings" (
    "id" TEXT NOT NULL,
    "sample_image_id" TEXT NOT NULL,
    "current_percentile" DOUBLE PRECISION NOT NULL DEFAULT 50.0,
    "total_comparisons" INTEGER NOT NULL DEFAULT 0,
    "wins" INTEGER NOT NULL DEFAULT 0,
    "losses" INTEGER NOT NULL DEFAULT 0,
    "bradley_terry_score" DOUBLE PRECISION NOT NULL DEFAULT 0.5,
    "confidence" DOUBLE PRECISION NOT NULL DEFAULT 0.0,
    "last_updated" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "sample_image_rankings_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "combined_rankings" (
    "id" TEXT NOT NULL,
    "photo_id" TEXT,
    "sample_image_id" TEXT,
    "user_id" TEXT,
    "gender" TEXT NOT NULL,
    "current_percentile" DOUBLE PRECISION NOT NULL DEFAULT 50.0,
    "total_comparisons" INTEGER NOT NULL DEFAULT 0,
    "wins" INTEGER NOT NULL DEFAULT 0,
    "losses" INTEGER NOT NULL DEFAULT 0,
    "bradley_terry_score" DOUBLE PRECISION NOT NULL DEFAULT 0.5,
    "confidence" DOUBLE PRECISION NOT NULL DEFAULT 0.0,
    "last_updated" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "combined_rankings_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "combined_ranking_history" (
    "id" TEXT NOT NULL,
    "combined_ranking_id" TEXT NOT NULL,
    "percentile" DOUBLE PRECISION NOT NULL,
    "comparisons" INTEGER NOT NULL,
    "recorded_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "combined_ranking_history_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "users_email_key" ON "users"("email");

-- CreateIndex
CREATE UNIQUE INDEX "photo_rankings_photo_id_key" ON "photo_rankings"("photo_id");

-- CreateIndex
CREATE UNIQUE INDEX "sample_image_rankings_sample_image_id_key" ON "sample_image_rankings"("sample_image_id");

-- CreateIndex
CREATE UNIQUE INDEX "combined_rankings_photo_id_key" ON "combined_rankings"("photo_id");

-- CreateIndex
CREATE UNIQUE INDEX "combined_rankings_sample_image_id_key" ON "combined_rankings"("sample_image_id");

-- AddForeignKey
ALTER TABLE "photos" ADD CONSTRAINT "photos_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "photo_rankings" ADD CONSTRAINT "photo_rankings_photo_id_fkey" FOREIGN KEY ("photo_id") REFERENCES "photos"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "photo_rankings" ADD CONSTRAINT "photo_rankings_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "percentile_history" ADD CONSTRAINT "percentile_history_ranking_id_fkey" FOREIGN KEY ("ranking_id") REFERENCES "photo_rankings"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "comparisons" ADD CONSTRAINT "comparisons_rater_id_fkey" FOREIGN KEY ("rater_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "comparisons" ADD CONSTRAINT "comparisons_winner_photo_id_fkey" FOREIGN KEY ("winner_photo_id") REFERENCES "photos"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "comparisons" ADD CONSTRAINT "comparisons_loser_photo_id_fkey" FOREIGN KEY ("loser_photo_id") REFERENCES "photos"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "comparisons" ADD CONSTRAINT "comparisons_winner_sample_image_id_fkey" FOREIGN KEY ("winner_sample_image_id") REFERENCES "sample_images"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "comparisons" ADD CONSTRAINT "comparisons_loser_sample_image_id_fkey" FOREIGN KEY ("loser_sample_image_id") REFERENCES "sample_images"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "comparisons" ADD CONSTRAINT "comparisons_session_id_fkey" FOREIGN KEY ("session_id") REFERENCES "comparison_sessions"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "comparison_sessions" ADD CONSTRAINT "comparison_sessions_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "achievements" ADD CONSTRAINT "achievements_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "sample_image_rankings" ADD CONSTRAINT "sample_image_rankings_sample_image_id_fkey" FOREIGN KEY ("sample_image_id") REFERENCES "sample_images"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "combined_rankings" ADD CONSTRAINT "combined_rankings_photo_id_fkey" FOREIGN KEY ("photo_id") REFERENCES "photos"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "combined_rankings" ADD CONSTRAINT "combined_rankings_sample_image_id_fkey" FOREIGN KEY ("sample_image_id") REFERENCES "sample_images"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "combined_rankings" ADD CONSTRAINT "combined_rankings_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "combined_ranking_history" ADD CONSTRAINT "combined_ranking_history_combined_ranking_id_fkey" FOREIGN KEY ("combined_ranking_id") REFERENCES "combined_rankings"("id") ON DELETE CASCADE ON UPDATE CASCADE;

