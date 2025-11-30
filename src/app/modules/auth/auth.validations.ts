import z from 'zod'

const userLoginZodSchema = z.object({
    email: z.email('Email is required'),
    password: z.string('Password is required').min(6, "Password minimum length is 6"),
})

export const AuthValidations = {
    userLoginZodSchema
}
