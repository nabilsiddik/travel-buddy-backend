import { prisma } from "@/app/config/prisma.config";
import AppError from "@/app/errorHelpers/appError";
import { ParticipantStatus } from "@/generated/prisma/enums";
import { StatusCodes } from "http-status-codes";

// Create a review (after travel ends)
export const createReview = async (reviewerId: string, targetUserId: string, planId: string, rating: number, comment?: string) => {

  const existingReview = await prisma.review.findFirst({
    where: {
      reviewerId,
      targetUserId
    }
  })

  if(existingReview){
    throw new AppError(StatusCodes.CONFLICT, 'Review already given.')
  }

  const plan = await prisma.travelPlan.findUnique({ where: { id: planId } });

  if (!plan) throw new AppError(404, "Plan not found");

  if (new Date() < plan.endDate) throw new AppError(400, "Travel not completed yet");

  return prisma.review.create({
    data: { reviewerId, targetUserId, planId, rating, comment }
  });
};

// reviewable plans for participiant and host
export const getReviewablePlans = async (userId: string) => {
  const participantTrips = await prisma.travelPlanParticipant.findMany({
    where: { userId, status: ParticipantStatus.COMPLETED },
    include: {
      plan: {
        include: { user: true }
      }
    }
  });

  const hostTrips = await prisma.travelPlan.findMany({
    where: { userId },
    include: {
      participants: {
        where: { status: ParticipantStatus.COMPLETED },
        include: { user: true }
      }
    }
  });

  return { participantTrips, hostTrips };
};


export const ReviewServices = {
  createReview,
  getReviewablePlans
}