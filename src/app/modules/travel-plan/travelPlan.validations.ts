import { z } from "zod";
import { TravelType } from "../../../../generated/prisma/enums.js";

const createTravelPlanSchema = z.object({
  destination: z.string("Destination is required"),
  startDate: z.string("Start Date is required"),
  endDate: z.string("End Date is required"),
  budgetRange: z.string().optional(),
  travelType: z.nativeEnum(TravelType),
  description: z.string().optional(),
  visibility: z.string().default('PUBLIC'),
});

const updateTravelPlanSchema = z.object({
  destination: z.string().min(1, "Destination is required").optional(),
  startDate: z.string().min(1, "Start date is required").optional(),
  endDate: z.string().min(1, "End date is required").optional(),
  budgetRange: z.string().optional(),
  travelType: z.enum(["SOLO", "FAMILY", "FRIENDS"]).optional(),
  description: z.string().optional(),
});

export const TravelPlanValidation = {
  createTravelPlanSchema,
  updateTravelPlanSchema,
};
