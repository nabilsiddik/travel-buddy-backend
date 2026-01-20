import { StatusCodes } from "http-status-codes";
import { prisma } from "../../config/prisma.config.js";
import AppError from "../../errorHelpers/appError.js";

// Trip Participant join request
const createTripParticipant = async (tripId: string, participantId: string) => {

    const existingParticipant = await prisma.tripParticipant.findFirst({
        where: {
            tripId,
            userId: participantId
        }
    })

    if(existingParticipant){
        throw new AppError(StatusCodes.CONFLICT, 'You already participated to this trip.')
    }

    const result = await prisma.tripParticipant.create({
        data: {
            tripId,
            userId: participantId
        }
    })

    return result;
};


// Get all my Participant join request
const myParticipantRequest = async (userId: string) => {

    console.log(userId, 'user');

    const result = await prisma.tripParticipant.findMany({
        where: {
            trip: {
                userId
            }
        },
        include: {
            trip: true,
            user: true
        }
    })

    return result;
};


// Get trip participant by id
const getTripParticipantById = async (participantReqId: string) => {

    const result = await prisma.tripParticipant.findUniqueOrThrow({
        where: {
            id: participantReqId
        }
    })

    return result;
};


// Update participant request
const updateParticipantRequest = async (participantReqId: string, status: 'PENDING' | 'APPROVED' | 'REJECTED' | 'REMOVED') => {


    const result = await prisma.tripParticipant.update({
        where: {
            id: participantReqId
        },
        data: {
            status
        }
    })

    return result;
};


// Get participant for specific trip
const getParticipantsForSpecificTrip = async (tripId: string) => {
    const result = await prisma.tripParticipant.findMany({
        where: {
            status: 'APPROVED',
            tripId,
        },
        include: {
            trip: true,
            user: true,
        }
    })

    return result;
};



export const TripParticipantServices = {
    createTripParticipant,
    myParticipantRequest,
    getTripParticipantById,
    updateParticipantRequest,
    getParticipantsForSpecificTrip
}