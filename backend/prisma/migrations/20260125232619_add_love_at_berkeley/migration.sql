-- AlterTable
ALTER TABLE "users" ADD COLUMN     "love_comparisons_completed" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "love_onboarding_complete" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "love_source" TEXT;

-- CreateTable
CREATE TABLE "love_questionnaire_responses" (
    "id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "answers" JSONB NOT NULL,
    "version" INTEGER NOT NULL DEFAULT 1,
    "completed_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "love_questionnaire_responses_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "love_questionnaire_responses_user_id_key" ON "love_questionnaire_responses"("user_id");

-- AddForeignKey
ALTER TABLE "love_questionnaire_responses" ADD CONSTRAINT "love_questionnaire_responses_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
