import { StatusCodes } from "http-status-codes";
import { prisma } from "../../config/prisma.config.js";
import AppError from "../../errorHelpers/appError.js";

// Trip Participant join request
const createTripParticipant = async (tripId: string, participantId: string) => {

    const trip = await prisma.travelPlan.findFirst({
        where: {
            id: tripId,
            isDeleted: false
        },
        include: {
            tripParticipants: true
        }
    })

    if(!trip){
        throw new AppError(StatusCodes.NOT_FOUND, 'Trip not found.')
    }

    if(trip?.userId === participantId){
        throw new AppError(StatusCodes.BAD_REQUEST, 'You Cannot Join Your Own Trip.')
    }

    const existingParticipant = await prisma.tripParticipant.findFirst({
        where: {
            tripId,
            userId: participantId
        }
    })

    if(existingParticipant){
        throw new AppError(StatusCodes.CONFLICT, 'You already participated to this trip.')
    }

    if(trip?.tripParticipants?.length > trip?.maxMates){
        throw new AppError(StatusCodes.NOT_ACCEPTABLE, 'No More Guest Allowed.')
    }

    const result = await prisma.tripParticipant.create({
        data: {
            tripId,
            userId: participantId
        }
    })

    return result;
};


// Get all approved participation of an user for join room conversation
const getAllParticipationsOfAnUser = async (userId: string) => {

    const result = await prisma.tripParticipant.findMany({
        where: {
            userId: userId,
            status: 'APPROVED'
        },
        include: {
            user: {
                select: {
                    id: true,
                    firstName: true,
                    lastName: true,
                    email: true,
                    profileImage: true,
                }
            },
            trip: true
        },
    })

    return result;
};


// Get all my Participant join request
const myParticipantRequest = async (userId: string) => {

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

// Get user participant status
const getUserParticipationForTrip = async (tripId: string, participantId: string) => {

    const userParticipation = await prisma.tripParticipant.findFirst({
        where: {
            tripId,
            userId: participantId
        }
    })

    return userParticipation
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
    getParticipantsForSpecificTrip,
    getUserParticipationForTrip,
    getAllParticipationsOfAnUser
}