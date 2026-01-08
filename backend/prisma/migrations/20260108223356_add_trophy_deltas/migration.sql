-- AlterTable
ALTER TABLE "combined_rankings" ADD COLUMN     "hidden_bradley_terry_score" DOUBLE PRECISION NOT NULL DEFAULT 0,
ADD COLUMN     "target_trophy_score" DOUBLE PRECISION,
ADD COLUMN     "trophy_score" DOUBLE PRECISION NOT NULL DEFAULT 0;

-- AlterTable
ALTER TABLE "comparisons" ADD COLUMN     "loser_trophy_delta" DOUBLE PRECISION,
ADD COLUMN     "winner_trophy_delta" DOUBLE PRECISION;

-- AlterTable
ALTER TABLE "photo_rankings" ADD COLUMN     "hidden_bradley_terry_score" DOUBLE PRECISION NOT NULL DEFAULT 0,
ADD COLUMN     "target_trophy_score" DOUBLE PRECISION,
ADD COLUMN     "trophy_score" DOUBLE PRECISION NOT NULL DEFAULT 0;

-- AlterTable
ALTER TABLE "sample_image_rankings" ADD COLUMN     "hidden_bradley_terry_score" DOUBLE PRECISION NOT NULL DEFAULT 0,
ADD COLUMN     "target_trophy_score" DOUBLE PRECISION,
ADD COLUMN     "trophy_score" DOUBLE PRECISION NOT NULL DEFAULT 0;

-- AlterTable
ALTER TABLE "users" ADD COLUMN     "height" INTEGER,
ADD COLUMN     "weight" INTEGER;

-- CreateTable
CREATE TABLE "trophy_config" (
    "id" TEXT NOT NULL,
    "configName" TEXT NOT NULL,
    "win_gain" DOUBLE PRECISION NOT NULL DEFAULT 35,
    "loss_penalty" DOUBLE PRECISION NOT NULL DEFAULT 25,
    "target_mean" DOUBLE PRECISION NOT NULL DEFAULT 1500,
    "target_std" DOUBLE PRECISION NOT NULL DEFAULT 430,
    "fade_width" DOUBLE PRECISION NOT NULL DEFAULT 300,
    "learning_rate" DOUBLE PRECISION NOT NULL DEFAULT 0.05,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "trophy_config_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "trophy_config_configName_key" ON "trophy_config"("configName");

-- CreateIndex
CREATE INDEX "comparison_sessions_user_id_started_at_idx" ON "comparison_sessions"("user_id", "started_at");
