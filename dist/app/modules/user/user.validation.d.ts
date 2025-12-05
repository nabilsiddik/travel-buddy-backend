import z from 'zod';
export declare const UserRoleEnum: z.ZodEnum<{
    USER: "USER";
    ADMIN: "ADMIN";
    SUPER_ADMIN: "SUPER_ADMIN";
}>;
export declare const SubscriptionStatusEnum: z.ZodEnum<{
    NONE: "NONE";
    MONTHLY: "MONTHLY";
    YEARLY: "YEARLY";
}>;
export declare const UserStatusEnum: z.ZodEnum<{
    ACTIVE: "ACTIVE";
    BLOCKED: "BLOCKED";
    DELETED: "DELETED";
}>;
export declare const Gender: z.ZodEnum<{
    MALE: "MALE";
    FEMALE: "FEMALE";
    OTHERS: "OTHERS";
}>;
export declare const createUserSchema: z.ZodObject<{
    name: z.ZodString;
    email: z.ZodString;
    password: z.ZodString;
    bio: z.ZodOptional<z.ZodString>;
    profileImage: z.ZodOptional<z.ZodString>;
    currentLocation: z.ZodOptional<z.ZodString>;
    interests: z.ZodDefault<z.ZodOptional<z.ZodArray<z.ZodString>>>;
    visitedCountries: z.ZodDefault<z.ZodOptional<z.ZodArray<z.ZodString>>>;
    gender: z.ZodEnum<{
        MALE: "MALE";
        FEMALE: "FEMALE";
        OTHERS: "OTHERS";
    }>;
    role: z.ZodDefault<z.ZodEnum<{
        USER: "USER";
        ADMIN: "ADMIN";
        SUPER_ADMIN: "SUPER_ADMIN";
    }>>;
    subscriptionStatus: z.ZodDefault<z.ZodEnum<{
        NONE: "NONE";
        MONTHLY: "MONTHLY";
        YEARLY: "YEARLY";
    }>>;
    verifiedBadge: z.ZodDefault<z.ZodOptional<z.ZodBoolean>>;
    status: z.ZodDefault<z.ZodEnum<{
        ACTIVE: "ACTIVE";
        BLOCKED: "BLOCKED";
        DELETED: "DELETED";
    }>>;
}, z.core.$strip>;
export declare const UserValidation: {
    createUserSchema: z.ZodObject<{
        name: z.ZodString;
        email: z.ZodString;
        password: z.ZodString;
        bio: z.ZodOptional<z.ZodString>;
        profileImage: z.ZodOptional<z.ZodString>;
        currentLocation: z.ZodOptional<z.ZodString>;
        interests: z.ZodDefault<z.ZodOptional<z.ZodArray<z.ZodString>>>;
        visitedCountries: z.ZodDefault<z.ZodOptional<z.ZodArray<z.ZodString>>>;
        gender: z.ZodEnum<{
            MALE: "MALE";
            FEMALE: "FEMALE";
            OTHERS: "OTHERS";
        }>;
        role: z.ZodDefault<z.ZodEnum<{
            USER: "USER";
            ADMIN: "ADMIN";
            SUPER_ADMIN: "SUPER_ADMIN";
        }>>;
        subscriptionStatus: z.ZodDefault<z.ZodEnum<{
            NONE: "NONE";
            MONTHLY: "MONTHLY";
            YEARLY: "YEARLY";
        }>>;
        verifiedBadge: z.ZodDefault<z.ZodOptional<z.ZodBoolean>>;
        status: z.ZodDefault<z.ZodEnum<{
            ACTIVE: "ACTIVE";
            BLOCKED: "BLOCKED";
            DELETED: "DELETED";
        }>>;
    }, z.core.$strip>;
};
//# sourceMappingURL=user.validation.d.ts.map