import z from 'zod';
export declare const AuthValidations: {
    userLoginZodSchema: z.ZodObject<{
        email: z.ZodEmail;
        password: z.ZodString;
    }, z.core.$strip>;
};
//# sourceMappingURL=auth.validations.d.ts.map