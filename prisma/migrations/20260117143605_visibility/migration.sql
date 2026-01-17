/*
  Warnings:

  - The `visibility` column on the `TravelPlan` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- CreateEnum
CREATE TYPE "TravelPlanVisibility" AS ENUM ('PUBLIC', 'PRIVET');

-- AlterTable
ALTER TABLE "TravelPlan" DROP COLUMN "visibility",
ADD COLUMN     "visibility" "TravelPlanVisibility" NOT NULL DEFAULT 'PUBLIC';
