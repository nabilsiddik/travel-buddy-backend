import type { JwtPayload } from "jsonwebtoken";
import type { Request } from "express";
import type { JWTPayload } from "src/app/interfaces";
export declare const TravelPlanServices: {
    createTravelPlan: (req: Request & {
        user?: JWTPayload;
    }) => Promise<{
        createdAt: Date;
        id: string;
        updatedAt: Date;
        destination: string;
        startDate: Date;
        endDate: Date;
        budgetRange: string | null;
        travelType: import("../../../generated/prisma/enums").TravelType;
        description: string | null;
        visibility: boolean;
        userId: string;
    }>;
    getAllTravelPlans: (params: any, options: any) => Promise<{
        meta: {
            page: number;
            limit: number;
            total: number;
        };
        data: ({
            user: {
                gender: import("../../../generated/prisma/enums").Gender;
                name: string;
                email: string;
                password: string;
                bio: string | null;
                profileImage: string | null;
                currentLocation: string | null;
                interests: string[];
                visitedCountries: string[];
                role: import("../../../generated/prisma/enums").UserRole;
                subscriptionStatus: import("../../../generated/prisma/enums").SubscriptionStatus;
                verifiedBadge: boolean;
                status: import("../../../generated/prisma/enums").UserStatus;
                createdAt: Date;
                id: string;
                updatedAt: Date;
            };
        } & {
            createdAt: Date;
            id: string;
            updatedAt: Date;
            destination: string;
            startDate: Date;
            endDate: Date;
            budgetRange: string | null;
            travelType: import("../../../generated/prisma/enums").TravelType;
            description: string | null;
            visibility: boolean;
            userId: string;
        })[];
    }>;
    getMyTravelPlans: (user: JwtPayload) => Promise<{
        createdAt: Date;
        id: string;
        updatedAt: Date;
        destination: string;
        startDate: Date;
        endDate: Date;
        budgetRange: string | null;
        travelType: import("../../../generated/prisma/enums").TravelType;
        description: string | null;
        visibility: boolean;
        userId: string;
    }[]>;
    updateTravelPlan: (id: string, user: JwtPayload, payload: any) => Promise<{
        createdAt: Date;
        id: string;
        updatedAt: Date;
        destination: string;
        startDate: Date;
        endDate: Date;
        budgetRange: string | null;
        travelType: import("../../../generated/prisma/enums").TravelType;
        description: string | null;
        visibility: boolean;
        userId: string;
    }>;
    deleteTravelPlan: (id: string, user: JwtPayload) => Promise<{
        message: string;
    }>;
};
//# sourceMappingURL=travelPlan.services.d.ts.map