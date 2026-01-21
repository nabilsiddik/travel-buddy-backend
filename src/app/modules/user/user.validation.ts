import z from 'zod'

export const UserRoleEnum = z.enum(["USER", "ADMIN", 'SUPER_ADMIN']);
export const SubscriptionStatusEnum = z.enum(["NONE", "MONTHLY", "YEARLY"]);
export const UserStatusEnum = z.enum(["ACTIVE", "BLOCKED", "DELETED"]);
export const Gender = z.enum(["MALE", "FEMALE", "OTHERS"]);

// patient creation input zod schema
export const createUserSchema = z.object({
    firstName: z
        .string('First Name is Required'),

    lastName: z
        .string('Last Name is Required'),

    email: z
        .string('Email is Required')
        .email("Invalid email format"),

    password: z
        .string('Password is required')
        .min(6, "Password must be at least 6 characters"),

    birthDate: z.string('Birth Date is Required')

});



// update user zod schema
export const updateUserZodSchema = z.object({
    firstName: z.string().min(2).optional(),
    lastName: z.string().min(2).optional(),
    bio: z.string().optional(),
    currentLocation: z.string().optional(),
    interests: z.string().optional(),
    visitedCountries: z.string().optional(),
});


export const UserValidation = {
    createUserSchema,
    updateUserZodSchema
}
