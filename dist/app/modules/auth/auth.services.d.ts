import type { userLoginInput } from "./auth.interfaces";
export declare const AuthServices: {
    userLogin: (payload: userLoginInput) => Promise<{
        accessToken: string;
        refreshToken: string;
    }>;
    getMe: (session: any) => Promise<{
        id: string;
        name: string;
        email: string;
        profileImage: string | null;
        role: import("../../../generated/prisma/enums").UserRole;
        status: import("../../../generated/prisma/enums").UserStatus;
    }>;
};
//# sourceMappingURL=auth.services.d.ts.map