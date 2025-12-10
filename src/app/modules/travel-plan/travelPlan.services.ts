import type { JwtPayload } from "jsonwebtoken";
import { StatusCodes } from "http-status-codes";
import type { Request } from "express";
import AppError from "@/app/errorHelpers/appError";
import { JWTPayload } from "@/app/interfaces";
import { prisma } from "@/app/config/prisma.config";
import calculatePagination from "@/app/utils/paginations";
import { TravelPlanWhereInput } from "@/generated/prisma/models";
import { connect } from "node:http2";

// create travel plan
const createTravelPlan = async (req: Request & { user?: JWTPayload }) => {
    const userId = req.user?.id

    if (!userId) {
        throw new AppError(StatusCodes.UNAUTHORIZED, 'User not found')
    }

    const { destination, startDate, endDate, budgetRange, travelType, description, visibility } = req.body

    try {
        const result = await prisma.$transaction(async (prisma) => {
            const createdPlan = await prisma.travelPlan.create({
                data: {
                    userId,
                    destination,
                    startDate: new Date(startDate),
                    endDate: new Date(endDate),
                    budgetRange: budgetRange ?? undefined,
                    travelType: travelType,
                    description: description ?? undefined,
                    visibility: visibility ?? true
                }
            })

            const user = await prisma.user.update({
                where: {
                    id: userId,
                },

                data: {
                    createdTravelPlans: {
                        push: createdPlan.id
                    }
                }
            })

            return { user, travelPlan: createdPlan }
        });

        return result

    } catch (error) {
        console.error('Transaction Failed:', error);
    }

}

// Get all plans with filter, seach and pagination
const getAllTravelPlans = async (params: any, options: any) => {
    const { page, limit, skip, sortOrder, sortBy } = calculatePagination(options)
    const { searchTerm, ...filterData } = params

    const andConditions: TravelPlanWhereInput[] = []

    const rawStart = filterData.startDate;
    const rawEnd = filterData.endDate;
    delete filterData.startDate;
    delete filterData.endDate;

    // Search fields
    if (searchTerm) {
        andConditions.push({
            OR: [
                { destination: { contains: searchTerm, mode: "insensitive" } },
                { description: { contains: searchTerm, mode: "insensitive" } }
            ]
        })
    }

    // date filter
    if (rawStart && rawEnd) {
        const start = new Date(rawStart);
        const end = new Date(rawEnd);

        if (start > end) {
            throw new AppError(400, "Start date cannot be later than end date");
        }

        andConditions.push({ startDate: { gte: start } });
        andConditions.push({ endDate: { lte: end } });
    }

    if (rawStart && !rawEnd) {
        andConditions.push({ startDate: { gte: new Date(rawStart) } });
    }

    if (!rawStart && rawEnd) {
        andConditions.push({ endDate: { lte: new Date(rawEnd) } });
    }



    // Filters
    if (Object.keys(filterData).length > 0) {
        andConditions.push({
            AND: Object.keys(filterData).map((key) => ({
                [key]: {
                    equals: filterData[key]
                }
            }))
        });
    }

    const whereCondition: TravelPlanWhereInput =
        andConditions.length > 0 ? { AND: andConditions } : {}

    const total = await prisma.travelPlan.count({ where: whereCondition })

    const result = await prisma.travelPlan.findMany({
        skip,
        take: limit,
        where: whereCondition,
        orderBy: {
            [sortBy]: sortOrder
        },
        include: {
            user: {
                select: {
                    id: true,
                    name: true,
                    email: true,
                    profileImage: true,
                    gender: true,
                    interests: true,
                    visitedCountries: true,
                    verifiedBadge: true,
                    status: true
                }
            }
        }
    })

    return {
        meta: { page, limit, total },
        data: result
    }
}


// Get travel plan by id
const getTravelPlanById = async (id: string) => {
    const result = await prisma.travelPlan.findUnique({
        where: { id },
        include: {
            user: true,
        },
    });

    if (!result) {
        throw new Error("Travel plan not found.");
    }

    return result;
};


// Get my own plans
const getMyTravelPlans = async (user: JwtPayload) => {
    const result = await prisma.travelPlan.findMany({
        where: {
            userId: user.id
        }
    })

    return result
}


// Update plan
const updateTravelPlan = async (id: string, user: JwtPayload, payload: any) => {
    const plan = await prisma.travelPlan.findUnique({
        where: { id }
    })

    if (!plan) {
        throw new AppError(StatusCodes.NOT_FOUND, "Travel plan not found.")
    }

    if (plan.userId !== user.id) {
        throw new AppError(StatusCodes.FORBIDDEN, "You are not allowed to update this plan.")
    }

    const updated = await prisma.travelPlan.update({
        where: { id },
        data: payload
    })

    return updated
}



// Delete plan
const deleteTravelPlan = async (id: string, user: JwtPayload) => {
    const plan = await prisma.travelPlan.findUnique({
        where: { id }
    });

    if (!plan) {
        throw new AppError(StatusCodes.NOT_FOUND, "Travel plan not found.");
    }

    if (plan.userId !== user.id) {
        throw new AppError(StatusCodes.FORBIDDEN, "You are not allowed to delete this plan.");
    }

    await prisma.travelPlan.delete({
        where: { id }
    });

    return { message: "Travel plan deleted successfully" };
};



export const TravelPlanServices = {
    createTravelPlan,
    getAllTravelPlans,
    getMyTravelPlans,
    updateTravelPlan,
    deleteTravelPlan,
    getTravelPlanById
}