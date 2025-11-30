import type { Request } from "express"
import AppError from "../../errorHelpers/appError"
import { StatusCodes } from "http-status-codes"
import bcrypt from "bcryptjs"
import { envVars } from "../../config/env.config"
import { prisma } from "src/app/config/prisma.config"
import calculatePagination from "src/app/utils/paginations"
import { userSearchableFields } from "./user.constants"
import type { UserWhereInput } from "src/generated/prisma/models"
import type { JWTPayload } from "src/app/interfaces"
import { UserRole, UserStatus } from "src/generated/prisma/enums"

// Create user
const createUser = async (req: Request) => {
    const { name, email, password, role, contactNumber, profilePhoto, address } = req.body

    // if (req?.file) {
    //     const uploadedResult = await fileUploader.uploadToCloudinary(req.file)
    //     req.body.patient.profilePhoto = uploadedResult?.secure_url
    // }

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
            role: role || 'USER',
            address: address || '',
            profilePhoto: profilePhoto || '',
            contactNumber: contactNumber || ''
        }
    })

    const {password: userPassword, ...rest} = createdUser

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

    if(Object.keys(filterData).length > 0){
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
            needPasswordChange: true,
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


export const UserServices = {
    createUser,
    getAllUsers,
    getMyProfile
}