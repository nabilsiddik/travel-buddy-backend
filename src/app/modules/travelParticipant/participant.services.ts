import { prisma } from "@/app/config/prisma.config";
import AppError from "@/app/errorHelpers/appError";
import { ParticipantStatus } from "@/generated/prisma/enums";

export const markParticipantComplete = async (participantId: string, userId: string) => {
  const participant = await prisma.travelPlanParticipant.findUnique({
    where: { id: participantId },
    include: { plan: true }
  });

  if (!participant) throw new AppError(404, "Participant not found");

  // Check if trip ended
  const now = new Date();
  const tripEnded = new Date(participant.plan.endDate) < now;

  if (!tripEnded) {
    throw new AppError(400, "Trip has not ended yet. Cannot mark completed.");
  }

  // Allow host OR participant to complete
  const isHost = participant.plan.userId === userId;
  const isParticipantItself = participant.userId === userId;

  if (!isHost && !isParticipantItself) {
    throw new AppError(403, "You are not allowed to complete this trip.");
  }

  const updated = await prisma.travelPlanParticipant.update({
    where: { id: participantId },
    data: { status: "COMPLETED" }
  });

  return updated;
};



export const getHostParticipants = async (hostId: string) => {
  const plans = await prisma.travelPlan.findMany({
    where: { userId: hostId },
    include: {
      participants: {
        include: {
          user: true,
        },
      },
    },
  });

  return plans;
};



export const ParticipantServices = {
    markParticipantComplete,
    getHostParticipants
}
