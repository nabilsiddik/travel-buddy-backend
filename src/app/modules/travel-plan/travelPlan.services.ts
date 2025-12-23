import type { JwtPayload } from "jsonwebtoken";
import { StatusCodes } from "http-status-codes";
import type { Request } from "express";
import type { JWTPayload } from "../../interfaces/index.js";
import AppError from "../../errorHelpers/appError.js";
import { prisma } from "../../config/prisma.config.js";
import calculatePagination from "../../utils/paginations.js";
import type { TravelPlanWhereInput } from "../../../../generated/prisma/models.js";
import { fileUploader } from "../../utils/fileUploader.js";

// create travel plan
const createTravelPlan = async (req: Request & { user?: JWTPayload }) => {
  const userId = req.user?.id;

  let uploadedResult: any;
  if (req?.file) {
    uploadedResult = await fileUploader.uploadToCloudinary(req.file);
  }

  if (!userId) {
    throw new AppError(StatusCodes.UNAUTHORIZED, "User not found");
  }

  const {
    destination,
    startDate,
    endDate,
    budgetRange,
    travelType,
    description,
  } = req.body;

  try {
    const result = await prisma.$transaction(async (prisma) => {
      const createdPlan = await prisma.travelPlan.create({
        data: {
          userId,
          destination,
          travelPlanImage: uploadedResult?.secure_url || "",
          startDate: new Date(startDate),
          endDate: new Date(endDate),
          budgetRange: budgetRange ?? undefined,
          travelType: travelType,
          description: description ?? undefined,
        },
      });

      return { travelPlan: createdPlan };
    });

    return result;
  } catch (error) {
    console.error("Transaction Failed:", error);
  }
};

// Get all plans with filter, seach and pagination
const getAllTravelPlans = async (
  params: any,
  options: any,
  user: JwtPayload
) => {
  const { page, limit, skip, sortOrder, sortBy } = calculatePagination(options);
  const { searchTerm, travelType, ...filterData } = params;

  const andConditions: TravelPlanWhereInput[] = [];

  const rawStart = filterData.startDate;
  const rawEnd = filterData.endDate;
  delete filterData.startDate;
  delete filterData.endDate;

  if (user?.role === "USER") {
    andConditions.push({
      isDeleted: false,
    });
  }

  if (user?.role === "ADMIN") {
    andConditions.push({ isDeleted: false });
  }

  // Search fields
  if (searchTerm) {
    andConditions.push({
      OR: [
        { destination: { contains: searchTerm, mode: "insensitive" } },
        { description: { contains: searchTerm, mode: "insensitive" } },
      ],
    });
  }

  // date filter
  if (rawStart && rawEnd) {
    const start = new Date(rawStart);
    const end = new Date(rawEnd);

    if (start > end) {
      throw new AppError(400, "Start date cannot be later than end date");
    }

    andConditions.push({
      AND: [{ startDate: { gte: start } }, { endDate: { lte: end } }],
    });
  }

  if (rawStart && !rawEnd) {
    andConditions.push({ startDate: { gte: new Date(rawStart) } });
  }

  if (!rawStart && rawEnd) {
    andConditions.push({ endDate: { lte: new Date(rawEnd) } });
  }

  // Handle travelType filter
  if (travelType && travelType !== "ALL") {
    andConditions.push({ travelType: { equals: travelType } });
  }

  // Filters
  if (Object.keys(filterData).length > 0) {
    andConditions.push({
      AND: Object.keys(filterData).map((key) => ({
        [key]: {
          equals: filterData[key],
        },
      })),
    });
  }

  const whereCondition: TravelPlanWhereInput =
    andConditions.length > 0 ? { AND: andConditions } : {};

  const total = await prisma.travelPlan.count({ where: whereCondition });

  const result = await prisma.travelPlan.findMany({
    skip,
    take: limit,
    where: whereCondition,
    orderBy: {
      [sortBy]: sortOrder,
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
          status: true,
        },
      },
    },
  });

  return {
    meta: { page, limit, total },
    data: result,
  };
};

// Get travel plan by id
const getTravelPlanById = async (id: string) => {
  const result = await prisma.travelPlan.findUnique({
    where: { id, isDeleted: false },
    include: {
      user: true,
    },
  });

  if (!result) {
    throw new Error("Travel plan not found.");
  }

  return result;
};

// Get loged in users travel plan
const getMyTravelPlans = async (
  params: any,
  options: any,
  user: JwtPayload
) => {
  const { page, limit, skip, sortOrder, sortBy } = calculatePagination(options);
  const { searchTerm, travelType, ...filterData } = params;

  const andConditions: TravelPlanWhereInput[] = [];

  const rawStart = filterData.startDate;
  const rawEnd = filterData.endDate;
  delete filterData.startDate;
  delete filterData.endDate;

  if (user?.role === "USER") {
    andConditions.push({
      userId: user?.id,
      isDeleted: false,
    });
  }

  // Search fields
  if (searchTerm) {
    andConditions.push({
      OR: [
        { destination: { contains: searchTerm, mode: "insensitive" } },
        { description: { contains: searchTerm, mode: "insensitive" } },
      ],
    });
  }

  // date filter
  if (rawStart && rawEnd) {
    const start = new Date(rawStart);
    const end = new Date(rawEnd);

    if (start > end) {
      throw new AppError(400, "Start date cannot be later than end date");
    }

    andConditions.push({
      AND: [{ startDate: { gte: start } }, { endDate: { lte: end } }],
    });
  }

  if (rawStart && !rawEnd) {
    andConditions.push({ startDate: { gte: new Date(rawStart) } });
  }

  if (!rawStart && rawEnd) {
    andConditions.push({ endDate: { lte: new Date(rawEnd) } });
  }

  // Handle travelType filter
  if (travelType && travelType !== "ALL") {
    andConditions.push({ travelType: { equals: travelType } });
  }

  // Filters
  if (Object.keys(filterData).length > 0) {
    andConditions.push({
      AND: Object.keys(filterData).map((key) => ({
        [key]: {
          equals: filterData[key],
        },
      })),
    });
  }

  const whereCondition: TravelPlanWhereInput =
    andConditions.length > 0 ? { AND: andConditions } : {};

  const total = await prisma.travelPlan.count({ where: whereCondition });

  const result = await prisma.travelPlan.findMany({
    skip,
    take: limit,
    where: whereCondition,
    orderBy: {
      [sortBy]: sortOrder,
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
          status: true,
        },
      },
    },
  });

  return {
    meta: { page, limit, total },
    data: result,
  };
};

// Update plan
const updateTravelPlan = async (id: string, user: JwtPayload, payload: any) => {
  const plan = await prisma.travelPlan.findUnique({
    where: { id },
  });

  if (!plan) {
    throw new AppError(StatusCodes.NOT_FOUND, "Travel plan not found.");
  }

  if (plan.userId !== user.id) {
    throw new AppError(
      StatusCodes.FORBIDDEN,
      "You are not allowed to update this plan."
    );
  }

  const updated = await prisma.travelPlan.update({
    where: { id },
    data: payload,
  });

  return updated;
};

// Delete plan
const deleteTravelPlan = async (id: string, user: JwtPayload) => {
  const plan = await prisma.travelPlan.findUnique({
    where: { id },
  });

  if (!plan) {
    throw new AppError(StatusCodes.NOT_FOUND, "Travel plan not found.");
  }

  await prisma.travelPlan.update({
    where: { id },
    data: { isDeleted: true },
  });

  return { message: "Travel plan deleted successfully" };
};

export const TravelPlanServices = {
  createTravelPlan,
  getAllTravelPlans,
  getMyTravelPlans,
  updateTravelPlan,
  deleteTravelPlan,
  getTravelPlanById,
};
