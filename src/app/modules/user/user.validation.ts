import z from 'zod'

export const UserRoleEnum = z.enum(["USER", "ADMIN", 'SUPER_ADMIN']);
export const SubscriptionStatusEnum = z.enum(["NONE", "MONTHLY", "YEARLY"]);
export const UserStatusEnum = z.enum(["ACTIVE", "BLOCKED", "DELETED"]);
export const Gender = z.enum(["MALE", "FEMALE", "OTHERS"]);

// patient creation input zod schema
export const createUserSchema = z.object({
    name: z
        .string()
        .min(2, "Name must be at least 2 characters"),

    email: z
        .string()
        .email("Invalid email format"),

    password: z
        .string()
        .min(6, "Password must be at least 6 characters"),

    bio: z.string().optional(),
    profileImage: z.string().optional(),
    currentLocation: z.string().optional(),

    interests: z
        .array(z.string())
        .optional()
        .default([]),

    visitedCountries: z
        .array(z.string())
        .optional()
        .default([]),

    gender: Gender,
    role: UserRoleEnum.default("USER"),
    subscriptionStatus: SubscriptionStatusEnum.default("NONE"),
    verifiedBadge: z.boolean().optional().default(false),
    status: UserStatusEnum.default("ACTIVE"),
});


export const UserValidation = {
    createUserSchema
}
