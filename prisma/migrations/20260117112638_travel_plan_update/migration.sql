/*
  Warnings:

  - You are about to drop the column `budgetRange` on the `TravelPlan` table. All the data in the column will be lost.
  - You are about to drop the column `travelPlanImage` on the `TravelPlan` table. All the data in the column will be lost.
  - Added the required column `budgetFrom` to the `TravelPlan` table without a default value. This is not possible if the table is not empty.
  - Added the required column `budgetTo` to the `TravelPlan` table without a default value. This is not possible if the table is not empty.
  - Added the required column `maxMates` to the `TravelPlan` table without a default value. This is not possible if the table is not empty.
  - Added the required column `minMates` to the `TravelPlan` table without a default value. This is not possible if the table is not empty.
  - Added the required column `title` to the `TravelPlan` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "TravelPlan" DROP COLUMN "budgetRange",
DROP COLUMN "travelPlanImage",
ADD COLUMN     "budgetFrom" INTEGER NOT NULL,
ADD COLUMN     "budgetTo" INTEGER NOT NULL,
ADD COLUMN     "highlightsVideo" TEXT,
ADD COLUMN     "included" TEXT[],
ADD COLUMN     "maxMates" INTEGER NOT NULL,
ADD COLUMN     "minMates" INTEGER NOT NULL,
ADD COLUMN     "planImages" TEXT[],
ADD COLUMN     "title" TEXT NOT NULL;
