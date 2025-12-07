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

    // Search fields
    if (searchTerm) {
        andConditions.push({
            OR: [
                { destination: { contains: searchTerm, mode: "insensitive" } },
                { description: { contains: searchTerm, mode: "insensitive" } }
            ]
        })
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
    console.log(id, 'my id')
  const result = await prisma.travelPlan.findUnique({
    where: { id },
    include: {
      user: true,
    },
  });

  console.log(result, 'my result')

  if (!result) {
    throw new Error("Travel plan not found.");
  }

  return result;
};


// Get my own plans
const getMyTravelPlans = async (user: JwtPayload) => {
    return await prisma.travelPlan.findMany({
        where: {
            userId: user.id
        }
    })
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