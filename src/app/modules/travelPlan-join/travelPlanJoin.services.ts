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

  return {
    participantId: participant.id,
    joinRequestId: request.id,
    planId: participant.planId,
    userId: participant.userId,
    status: JoinStatus.ACCEPTED
  };
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

  return prisma.travelPlanJoinRequest.update({
    where: { id: requestId },
    data: { status: JoinStatus.CANCELLED }
  });
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
          userId: true,
          destination: true,
          startDate: true,
          endDate: true,
        }
      },
    },
  });

  return requests
}

const getMySentRequests = async (userId: string) => {
  const result = prisma.travelPlanJoinRequest.findMany({
    where: { requesterId: userId },
    include: {
      plan: {
        include: {
          user: true
        }
      }
    }
  });

  return result || [];
}




// Complete joint request
export const completeJoinRequest = async (joinRequestId: string, status: string, userId: string) => {

  const joinRequest = await prisma.travelPlanJoinRequest.findUnique({
    where: { id: joinRequestId },
    include: { plan: true, requester: true }
  });

  if (!joinRequest) throw new AppError(404, "Join Request not found");

  // Check if trip ended
  const now = new Date();
  const tripEnded = new Date(joinRequest.plan.endDate) < now;

  if (!tripEnded) {
    throw new AppError(400, "Trip has not ended yet. Cannot mark completed.");
  }

  // Allow host OR participant to complete
  const isHost = joinRequest.plan.userId === userId;
  const isParticipantItself = joinRequest.requester.id === userId;

  if (!isHost && !isParticipantItself) {
    throw new AppError(403, "You are not allowed to complete this trip.");
  }

  const updated = await prisma.travelPlanJoinRequest.update({
    where: { id: joinRequestId },
    data: { status: "COMPLETED" }
  });

  return updated;
};


export const TravelPlanRequestServices = {
  getJoinRequestsForMyPlans,
  getMySentRequests,
  completeJoinRequest
}