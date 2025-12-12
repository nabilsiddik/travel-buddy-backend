import type { Request } from "express"
import AppError from "../../errorHelpers/appError"
import { StatusCodes } from "http-status-codes"
import bcrypt from "bcryptjs"
import { envVars } from "../../config/env.config"
import { fileUploader } from "@/app/utils/fileUploader"
import { prisma } from "@/app/config/prisma.config"
import { JWTPayload } from "@/app/interfaces"
import calculatePagination from "@/app/utils/paginations"
import { UserWhereInput } from "@/generated/prisma/models"
import { userSearchableFields } from "./user.constants"
import { UserRole, UserStatus } from "@/generated/prisma/enums"

// Create user
const createUser = async (req: Request) => {
    const { name, email, password, bio, currentLocation, visitedCountries, gender } = req.body

    let uploadedResult
    if (req?.file) {
        uploadedResult = await fileUploader.uploadToCloudinary(req.file)
    }

    const existingUser = await prisma.user.findUnique({
        where: { email }
    })

    if (existingUser) {
        throw new AppError(StatusCodes.BAD_REQUEST, 'An account with this email already exist.')
    }

    const hashedPassword = await bcrypt.hash(password, Number(envVars.SALT_ROUND))

    const createdUser = await prisma.user.create({
        data: {
            name,
            email,
            password: hashedPassword,
            profileImage: uploadedResult?.secure_url || '',
            bio: bio || '',
            currentLocation: currentLocation || '',
            gender: gender || '',
            createdTravelPlans: [],
            visitedCountries: visitedCountries || []
        }
    })

    const { password: userPassword, ...rest } = createdUser

    return rest
}

// Get all users from db
const getAllUsers = async (params: any, options: any) => {
    const { page, limit, skip, sortOrder, sortBy } = calculatePagination(options)
    const { searchTerm, ...filterData } = params

    const andConditions: UserWhereInput[] = []

    if (searchTerm) {
        andConditions.push({
            OR: userSearchableFields.map((field) => ({
                [field]: {
                    contains: searchTerm,
                    mode: 'insensitive'
                }
            }))
        })
    }

    if (Object.keys(filterData).length > 0) {
        andConditions.push({
            AND: Object.keys(filterData).map((key) => ({
                [key]: {
                    equals: filterData[key]
                }
            }))
        })
    }

    const whereConditions: UserWhereInput = andConditions.length > 0 ? {
        AND: andConditions
    } : {}

    const total = await prisma.user.count({
        where: whereConditions
    })

    const result = await prisma.user.findMany({
        skip,
        take: limit,
        where: whereConditions,
        orderBy: {
            [sortBy]: sortOrder
        }
    })

    return {
        meta: {
            page,
            limit,
            total
        },
        data: result
    }
}

const getUserById = async (id: string) => {
  const user = await prisma.user.findUnique({
    where: { id },
  });

  if (!user) {
    throw new AppError(StatusCodes.NOT_FOUND, "User not found");
  }

  // Remove password before sending
  const { password, ...rest } = user;

  return rest;
};


// get top rated user
const getTopRatedUsers = async () => {
  const topUsers = await prisma.review.groupBy({
    by: ['targetUserId'],
    _avg: {
      rating: true,
    },
    orderBy: {
      _avg: {
        rating: 'desc',
      },
    },
    take: 4,
  });

  const users = await prisma.user.findMany({
    where: {
      id: { in: topUsers.map((user) => user.targetUserId) },
    },
    select: {
      id: true,
      name: true,
      email: true,
      profileImage: true,
    },
  });

  const topRatedUsers = topUsers.map((userGroup) => {
    const user = users.find((user) => user.id === userGroup.targetUserId);
    return {
      ...user,
      averageRating: userGroup._avg.rating, 
    };
  });

  return topRatedUsers;
};


// Get profile info
const getMyProfile = async (user: JWTPayload) => {
    const userInfo = await prisma.user.findUniqueOrThrow({
        where: {
            email: user.email,
            status: UserStatus.ACTIVE
        },
        select: {
            id: true,
            email: true,
            role: true,
            status: true
        }
    })

    let profileData;

    if (userInfo.role === UserRole.USER) {
        profileData = await prisma.user.findUnique({
            where: {
                email: userInfo.email
            }
        })
    }

    return {
        ...userInfo,
        ...profileData
    };

};

// Update user
const updateUser = async (userId: string, req: Request) => {
    const { name, bio, currentLocation, visitedCountries, interests } = req.body

    const user = await prisma.user.findUniqueOrThrow({
        where: {id: userId}
    })

    let uploadedResult
    if (req?.file) {
        uploadedResult = await fileUploader.uploadToCloudinary(req.file)
    }

    const interestsArray = interests?.toString()
    .split(",")
    .map((i: any) => i.trim()).filter(Boolean) || []

    const visitedCountriesArray = visitedCountries?.toString()
    .split(",")
    .map((i: any) => i.trim()).filter(Boolean) || []

    const updatedUser = await prisma.user.update({
        where: { id: userId },
        data: {
            name,
            bio,
            currentLocation,
            interests: interestsArray,
            visitedCountries: visitedCountriesArray,
            profileImage: uploadedResult?.secure_url || user?.profileImage,
        }
    });

    return updatedUser;
};


export const UserServices = {
    createUser,
    getAllUsers,
    getMyProfile,
    updateUser,
    getUserById,
    getTopRatedUsers
}