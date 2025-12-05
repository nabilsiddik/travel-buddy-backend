import { TravelType } from "@/generated/prisma/enums";
import { z } from "zod";

const createTravelPlanSchema = z.object({
  destination: z.string('Destination is required'),
  startDate: z.string('Start Date is required'),
  endDate: z.string('End Date is required'),
  budgetRange: z.string().optional(),
  travelType: z.nativeEnum(TravelType),
  description: z.string().optional(),
  visibility: z.boolean().optional()
});

const updateTravelPlanSchema = z.object({
  body: z.object({
    destination: z.string().optional(),
    startDate: z.string().optional(),
    endDate: z.string().optional(),
    budgetRange: z.string().optional(),
    travelType: z.nativeEnum(TravelType).optional(),
    description: z.string().optional(),
    visibility: z.boolean().optional()
  })
});

export const TravelPlanValidation = {
  createTravelPlanSchema,
  updateTravelPlanSchema
};
