-- CreateTable
CREATE TABLE "matches" (
    "id" TEXT NOT NULL,
    "initiator_id" TEXT NOT NULL,
    "matched_id" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'pending',
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "responded_at" TIMESTAMP(3),

    CONSTRAINT "matches_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "matches_initiator_id_idx" ON "matches"("initiator_id");

-- CreateIndex
CREATE INDEX "matches_matched_id_idx" ON "matches"("matched_id");

-- AddForeignKey
ALTER TABLE "matches" ADD CONSTRAINT "matches_initiator_id_fkey" FOREIGN KEY ("initiator_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "matches" ADD CONSTRAINT "matches_matched_id_fkey" FOREIGN KEY ("matched_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
