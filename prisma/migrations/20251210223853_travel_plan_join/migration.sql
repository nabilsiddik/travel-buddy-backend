/*
  Warnings:

  - You are about to drop the column `receiverId` on the `Review` table. All the data in the column will be lost.
  - You are about to drop the column `updatedAt` on the `Review` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[reviewerId,targetUserId,planId]` on the table `Review` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `planId` to the `Review` table without a default value. This is not possible if the table is not empty.
  - Added the required column `targetUserId` to the `Review` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "JoinStatus" AS ENUM ('PENDING', 'ACCEPTED', 'REJECTED', 'CANCELLED');

-- DropForeignKey
ALTER TABLE "Review" DROP CONSTRAINT "Review_receiverId_fkey";

-- AlterTable
ALTER TABLE "Review" DROP COLUMN "receiverId",
DROP COLUMN "updatedAt",
ADD COLUMN     "planId" TEXT NOT NULL,
ADD COLUMN     "targetUserId" TEXT NOT NULL;

-- CreateTable
CREATE TABLE "TravelPlanParticipant" (
    "id" TEXT NOT NULL,
    "planId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "joinedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "TravelPlanParticipant_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "TravelPlanJoinRequest" (
    "id" TEXT NOT NULL,
    "planId" TEXT NOT NULL,
    "requesterId" TEXT NOT NULL,
    "status" "JoinStatus" NOT NULL DEFAULT 'PENDING',

    CONSTRAINT "TravelPlanJoinRequest_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "TravelPlanParticipant_planId_userId_key" ON "TravelPlanParticipant"("planId", "userId");

-- CreateIndex
CREATE UNIQUE INDEX "Review_reviewerId_targetUserId_planId_key" ON "Review"("reviewerId", "targetUserId", "planId");

-- AddForeignKey
ALTER TABLE "TravelPlanParticipant" ADD CONSTRAINT "TravelPlanParticipant_planId_fkey" FOREIGN KEY ("planId") REFERENCES "TravelPlan"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TravelPlanParticipant" ADD CONSTRAINT "TravelPlanParticipant_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TravelPlanJoinRequest" ADD CONSTRAINT "TravelPlanJoinRequest_planId_fkey" FOREIGN KEY ("planId") REFERENCES "TravelPlan"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TravelPlanJoinRequest" ADD CONSTRAINT "TravelPlanJoinRequest_requesterId_fkey" FOREIGN KEY ("requesterId") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Review" ADD CONSTRAINT "Review_targetUserId_fkey" FOREIGN KEY ("targetUserId") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Review" ADD CONSTRAINT "Review_planId_fkey" FOREIGN KEY ("planId") REFERENCES "TravelPlan"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
