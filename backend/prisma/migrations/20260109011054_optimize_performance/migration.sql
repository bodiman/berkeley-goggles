/*
  Warnings:

  - You are about to drop the column `height` on the `users` table. All the data in the column will be lost.
  - You are about to drop the column `weight` on the `users` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "users" DROP COLUMN "height",
DROP COLUMN "weight";

-- CreateIndex
CREATE INDEX "comparisons_rater_id_idx" ON "comparisons"("rater_id");

-- CreateIndex
CREATE INDEX "comparisons_winner_photo_id_idx" ON "comparisons"("winner_photo_id");

-- CreateIndex
CREATE INDEX "comparisons_loser_photo_id_idx" ON "comparisons"("loser_photo_id");

-- CreateIndex
CREATE INDEX "comparisons_winner_sample_image_id_idx" ON "comparisons"("winner_sample_image_id");

-- CreateIndex
CREATE INDEX "comparisons_loser_sample_image_id_idx" ON "comparisons"("loser_sample_image_id");

-- CreateIndex
CREATE INDEX "photo_rankings_trophy_score_idx" ON "photo_rankings"("trophy_score");

-- CreateIndex
CREATE INDEX "photos_user_id_idx" ON "photos"("user_id");

-- CreateIndex
CREATE INDEX "photos_url_idx" ON "photos"("url");

-- CreateIndex
CREATE INDEX "photos_status_idx" ON "photos"("status");
