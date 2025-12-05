import type { Request } from "express";
import type { JWTPayload } from "src/app/interfaces";
import { UserRole, UserStatus } from "src/generated/prisma/enums";
export declare const UserServices: {
    createUser: (req: Request) => Promise<{
        gender: import("src/generated/prisma/enums").Gender;
        name: string;
        email: string;
        bio: string | null;
        profileImage: string | null;
        currentLocation: string | null;
        interests: string[];
        visitedCountries: string[];
        role: UserRole;
        subscriptionStatus: import("src/generated/prisma/enums").SubscriptionStatus;
        verifiedBadge: boolean;
        status: UserStatus;
        createdAt: Date;
        id: string;
        updatedAt: Date;
    }>;
    getAllUsers: (params: any, options: any) => Promise<{
        meta: {
            page: number;
            limit: number;
            total: number;
        };
        data: {
            gender: import("src/generated/prisma/enums").Gender;
            name: string;
            email: string;
            password: string;
            bio: string | null;
            profileImage: string | null;
            currentLocation: string | null;
            interests: string[];
            visitedCountries: string[];
            role: UserRole;
            subscriptionStatus: import("src/generated/prisma/enums").SubscriptionStatus;
            verifiedBadge: boolean;
            status: UserStatus;
            createdAt: Date;
            id: string;
            updatedAt: Date;
        }[];
    }>;
    getMyProfile: (user: JWTPayload) => Promise<{
        gender?: import("src/generated/prisma/enums").Gender;
        name?: string;
        email: string;
        password?: string;
        bio?: string | null;
        profileImage?: string | null;
        currentLocation?: string | null;
        interests?: string[];
        visitedCountries?: string[];
        role: UserRole;
        subscriptionStatus?: import("src/generated/prisma/enums").SubscriptionStatus;
        verifiedBadge?: boolean;
        status: UserStatus;
        createdAt?: Date;
        id: string;
        updatedAt?: Date;
    }>;
};
//# sourceMappingURL=user.services.d.ts.map