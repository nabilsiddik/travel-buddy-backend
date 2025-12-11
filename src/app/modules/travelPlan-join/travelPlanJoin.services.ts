import { prisma } from "@/app/config/prisma.config";
import AppError from "@/app/errorHelpers/appError";
import { JoinStatus } from "@/generated/prisma/enums";

// Send a join request
export const sendJoinRequest = async (planId: string, requesterId: string) => {
    const plan = await prisma.travelPlan.findUnique({ where: { id: planId } });

    if (!plan) throw new AppError(404, "Travel plan not found");

    if (plan.userId === requesterId) throw new AppError(400, "Cannot join your own plan");

    const existingRequest = await prisma.travelPlanJoinRequest.findFirst({
        where: { planId, requesterId }
    });

    if (existingRequest) throw new AppError(400, "Request already exists");

    return prisma.travelPlanJoinRequest.create({
        data: { planId, requesterId }
    });
};

// Accept a join request
export const acceptJoinRequest = async (requestId: string) => {
    const request = await prisma.travelPlanJoinRequest.findUnique({
        where: { id: requestId }
    });

    if (!request) throw new AppError(404, "Join request not found");

    const participant = await prisma.travelPlanParticipant.create({
        data: { planId: request.planId, userId: request.requesterId }
    });

    await prisma.travelPlanJoinRequest.update({
        where: { id: requestId },
        data: { status: JoinStatus.ACCEPTED }
    });

    return participant;
};

// Reject a join request
export const rejectJoinRequest = async (requestId: string) => {
    const request = await prisma.travelPlanJoinRequest.findUnique({ where: { id: requestId } });

    if (!request) throw new AppError(404, "Join request not found");

    return prisma.travelPlanJoinRequest.update({
        where: { id: requestId },
        data: { status: JoinStatus.REJECTED }
    });
};

// Cancel your own join request
export const cancelJoinRequest = async (requestId: string, userId: string) => {
    const request = await prisma.travelPlanJoinRequest.findUnique({ where: { id: requestId } });

    if (!request) throw new AppError(404, "Join request not found");

    if (request.requesterId !== userId) throw new AppError(403, "Not allowed");

    return prisma.travelPlanJoinRequest.delete({ where: { id: requestId } });
};

// List requests for a plan
export const getPlanJoinRequests = async (planId: string) => {
    return prisma.travelPlanJoinRequest.findMany({
        where: { planId },
        include: { requester: true }
    });
};

// List participants of a plan
export const getPlanParticipants = async (planId: string) => {
    return prisma.travelPlanParticipant.findMany({
        where: { planId },
        include: { user: true }
    });
};

// get my plan requests
export const getJoinRequestsForMyPlans = async (userId: string) => {
  const requests = await prisma.travelPlanJoinRequest.findMany({
    where: {
      plan: {
        userId: userId,
      }
    },
    include: {
      requester: {
        select: {
          id: true,
          name: true,
          email: true,
          profileImage: true,
        },
      },
      plan: {
        select: {
          id: true,
          destination: true,
          startDate: true,
          endDate: true,
        },
      },
    },
    // orderBy: {
    //   createdAt: "desc",
    // },
  });

  return requests || [];
}

// Create a review (after travel ends)
export const createReview = async (reviewerId: string, targetUserId: string, planId: string, rating: number, comment?: string) => {

    const plan = await prisma.travelPlan.findUnique({ where: { id: planId } });

    if (!plan) throw new AppError(404, "Plan not found");

    if (new Date() < plan.endDate) throw new AppError(400, "Travel not completed yet");

    // Check participant relation
    const isParticipant = await prisma.travelPlanParticipant.findFirst({
        where: { planId, userId: reviewerId }
    });

    if (!isParticipant) throw new AppError(400, "You did not participate in this travel");

    return prisma.review.create({
        data: { reviewerId, targetUserId, planId, rating, comment }
    });
};


export const TravelPlanRequestServices = {
    getJoinRequestsForMyPlans
}