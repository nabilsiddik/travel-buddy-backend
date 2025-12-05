import { z } from "zod";
export declare const TravelPlanValidation: {
    createTravelPlanSchema: z.ZodObject<{
        destination: z.ZodString;
        startDate: z.ZodString;
        endDate: z.ZodString;
        budgetRange: z.ZodOptional<z.ZodString>;
        travelType: z.ZodEnum<{
            readonly SOLO: "SOLO";
            readonly FAMILY: "FAMILY";
            readonly FRIENDS: "FRIENDS";
        }>;
        description: z.ZodOptional<z.ZodString>;
        visibility: z.ZodOptional<z.ZodBoolean>;
    }, z.core.$strip>;
    updateTravelPlanSchema: z.ZodObject<{
        body: z.ZodObject<{
            destination: z.ZodOptional<z.ZodString>;
            startDate: z.ZodOptional<z.ZodString>;
            endDate: z.ZodOptional<z.ZodString>;
            budgetRange: z.ZodOptional<z.ZodString>;
            travelType: z.ZodOptional<z.ZodEnum<{
                readonly SOLO: "SOLO";
                readonly FAMILY: "FAMILY";
                readonly FRIENDS: "FRIENDS";
            }>>;
            description: z.ZodOptional<z.ZodString>;
            visibility: z.ZodOptional<z.ZodBoolean>;
        }, z.core.$strip>;
    }, z.core.$strip>;
};
//# sourceMappingURL=travelPlan.validations.d.ts.map