import { z } from "zod";
import { TravelType } from "../../../../generated/prisma/enums.js";

const createTravelPlanSchema = z.object({
  destination: z.string("Destination is required"),
  startDate: z.string("Start Date is required"),
  endDate: z.string("End Date is required"),
  budgetFrom: z.string().optional(),
  budgetTo: z.string().optional(),
  travelType: z.nativeEnum(TravelType),
  description: z.string().optional(),
  visibility: z.string().default('PUBLIC'),
});

const updateTravelPlanSchema = z.object({
  title: z.string().min(1, "Title is required").optional(),
  destination: z.string().min(1, "Destination is required").optional(),
  startDate: z.string().min(1, "Start date is required").optional(),
  endDate: z.string().min(1, "End date is required").optional(),
  budgetFrom: z.string().optional(),
  budgetTo: z.string().optional(),
  travelType: z.enum(["SOLO", "FAMILY", "FRIENDS"]).optional(),
  description: z.string().optional(),
});

export const TravelPlanValidation = {
  createTravelPlanSchema,
  updateTravelPlanSchema,
};
