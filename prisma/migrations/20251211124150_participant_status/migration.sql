-- CreateEnum
CREATE TYPE "ParticipantStatus" AS ENUM ('PENDING', 'ONGOING', 'COMPLETED', 'CANCELLED');

-- AlterTable
ALTER TABLE "TravelPlanParticipant" ADD COLUMN     "status" "ParticipantStatus" NOT NULL DEFAULT 'PENDING';
