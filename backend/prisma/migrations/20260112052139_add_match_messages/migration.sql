-- CreateTable
CREATE TABLE "match_messages" (
    "id" TEXT NOT NULL,
    "match_id" TEXT NOT NULL,
    "sender_id" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "is_read" BOOLEAN NOT NULL DEFAULT false,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "match_messages_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "match_messages_match_id_idx" ON "match_messages"("match_id");

-- CreateIndex
CREATE INDEX "match_messages_sender_id_idx" ON "match_messages"("sender_id");

-- AddForeignKey
ALTER TABLE "match_messages" ADD CONSTRAINT "match_messages_match_id_fkey" FOREIGN KEY ("match_id") REFERENCES "matches"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "match_messages" ADD CONSTRAINT "match_messages_sender_id_fkey" FOREIGN KEY ("sender_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
