-- AlterTable
ALTER TABLE "Card" ADD COLUMN     "box_step_id" INTEGER;

-- AddForeignKey
ALTER TABLE "Card" ADD CONSTRAINT "Card_box_step_id_fkey" FOREIGN KEY ("box_step_id") REFERENCES "BoxStep"("id") ON DELETE CASCADE ON UPDATE CASCADE;
