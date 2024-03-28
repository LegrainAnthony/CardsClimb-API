/*
  Warnings:

  - You are about to drop the column `userId` on the `Box` table. All the data in the column will be lost.
  - You are about to drop the column `boxId` on the `BoxStep` table. All the data in the column will be lost.
  - You are about to drop the column `boxId` on the `Card` table. All the data in the column will be lost.
  - You are about to drop the column `cardTypeId` on the `Card` table. All the data in the column will be lost.
  - You are about to drop the column `ref` on the `Card` table. All the data in the column will be lost.
  - You are about to drop the column `userId` on the `Card` table. All the data in the column will be lost.
  - You are about to drop the column `colorId` on the `Tag` table. All the data in the column will be lost.
  - You are about to drop the column `hashedPassword` on the `User` table. All the data in the column will be lost.
  - Added the required column `user_id` to the `Box` table without a default value. This is not possible if the table is not empty.
  - Added the required column `box_id` to the `BoxStep` table without a default value. This is not possible if the table is not empty.
  - Added the required column `card_type_id` to the `Card` table without a default value. This is not possible if the table is not empty.
  - Added the required column `reference` to the `Card` table without a default value. This is not possible if the table is not empty.
  - Added the required column `user_id` to the `Card` table without a default value. This is not possible if the table is not empty.
  - Added the required column `color_id` to the `Tag` table without a default value. This is not possible if the table is not empty.
  - Added the required column `hashed_password` to the `User` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Box" DROP CONSTRAINT "Box_userId_fkey";

-- DropForeignKey
ALTER TABLE "BoxStep" DROP CONSTRAINT "BoxStep_boxId_fkey";

-- DropForeignKey
ALTER TABLE "Card" DROP CONSTRAINT "Card_boxId_fkey";

-- DropForeignKey
ALTER TABLE "Card" DROP CONSTRAINT "Card_cardTypeId_fkey";

-- DropForeignKey
ALTER TABLE "Card" DROP CONSTRAINT "Card_userId_fkey";

-- DropForeignKey
ALTER TABLE "Tag" DROP CONSTRAINT "Tag_colorId_fkey";

-- AlterTable
ALTER TABLE "Box" DROP COLUMN "userId",
ADD COLUMN     "user_id" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "BoxStep" DROP COLUMN "boxId",
ADD COLUMN     "box_id" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "Card" DROP COLUMN "boxId",
DROP COLUMN "cardTypeId",
DROP COLUMN "ref",
DROP COLUMN "userId",
ADD COLUMN     "box_id" INTEGER,
ADD COLUMN     "card_type_id" INTEGER NOT NULL,
ADD COLUMN     "reference" TEXT NOT NULL,
ADD COLUMN     "user_id" INTEGER NOT NULL,
ALTER COLUMN "future_revision" DROP NOT NULL;

-- AlterTable
ALTER TABLE "Tag" DROP COLUMN "colorId",
ADD COLUMN     "color_id" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "User" DROP COLUMN "hashedPassword",
ADD COLUMN     "hashed_password" TEXT NOT NULL;

-- AddForeignKey
ALTER TABLE "Box" ADD CONSTRAINT "Box_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Card" ADD CONSTRAINT "Card_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Card" ADD CONSTRAINT "Card_box_id_fkey" FOREIGN KEY ("box_id") REFERENCES "Box"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Card" ADD CONSTRAINT "Card_card_type_id_fkey" FOREIGN KEY ("card_type_id") REFERENCES "CardType"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Tag" ADD CONSTRAINT "Tag_color_id_fkey" FOREIGN KEY ("color_id") REFERENCES "Color"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BoxStep" ADD CONSTRAINT "BoxStep_box_id_fkey" FOREIGN KEY ("box_id") REFERENCES "Box"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
