import { prisma } from "src/app/config/prisma.config";
import AppError from "src/app/errorHelpers/appError";
import { StatusCodes } from "http-status-codes";
import calculatePagination from "src/app/utils/paginations";
// create travel plan
const createTravelPlan = async (req) => {
    const userId = req.user?.id;
    if (!userId) {
        throw new AppError(StatusCodes.UNAUTHORIZED, 'User not found');
    }
    const { destination, startDate, endDate, budgetRange, travelType, description, visibility } = req.body;
    console.log({ destination, startDate, endDate, budgetRange, travelType, description, visibility }, 'body');
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
    });
    return createdPlan;
};
// Get all plans with filter, seach and pagination
const getAllTravelPlans = async (params, options) => {
    const { page, limit, skip, sortOrder, sortBy } = calculatePagination(options);
    const { searchTerm, ...filterData } = params;
    const andConditions = [];
    // Search fields
    if (searchTerm) {
        andConditions.push({
            OR: [
                { destination: { contains: searchTerm, mode: "insensitive" } },
                { description: { contains: searchTerm, mode: "insensitive" } }
            ]
        });
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
    const whereCondition = andConditions.length > 0 ? { AND: andConditions } : {};
    const total = await prisma.travelPlan.count({ where: whereCondition });
    const result = await prisma.travelPlan.findMany({
        skip,
        take: limit,
        where: whereCondition,
        orderBy: {
            [sortBy]: sortOrder
        },
        include: {
            user: true
        }
    });
    return {
        meta: { page, limit, total },
        data: result
    };
};
// Get my own plans
const getMyTravelPlans = async (user) => {
    return await prisma.travelPlan.findMany({
        where: {
            userId: user.id
        }
    });
};
// Update plan
const updateTravelPlan = async (id, user, payload) => {
    const plan = await prisma.travelPlan.findUnique({
        where: { id }
    });
    if (!plan) {
        throw new AppError(StatusCodes.NOT_FOUND, "Travel plan not found.");
    }
    if (plan.userId !== user.id) {
        throw new AppError(StatusCodes.FORBIDDEN, "You are not allowed to update this plan.");
    }
    const updated = await prisma.travelPlan.update({
        where: { id },
        data: payload
    });
    return updated;
};
// Delete plan
const deleteTravelPlan = async (id, user) => {
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
    deleteTravelPlan
};
//# sourceMappingURL=travelPlan.services.js.map