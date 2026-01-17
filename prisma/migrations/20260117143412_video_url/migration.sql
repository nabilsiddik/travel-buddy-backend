/*
  Warnings:

  - You are about to drop the column `highlightsVideo` on the `TravelPlan` table. All the data in the column will be lost.
  - You are about to drop the column `included` on the `TravelPlan` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "TravelPlan" DROP COLUMN "highlightsVideo",
DROP COLUMN "included",
ADD COLUMN     "includes" TEXT[],
ADD COLUMN     "videoUrl" TEXT;
