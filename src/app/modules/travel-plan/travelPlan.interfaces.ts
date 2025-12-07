import { TravelPlan } from "@/generated/prisma/client";
import { TravelType } from "@/generated/prisma/enums";

export interface ITravelPlan {
  destination: string;
  startDate: Date;
  endDate: Date;

  travelPlans?: TravelPlan[];
  budgetRange?: string | null;
  travelType: TravelType;
  description?: string | null;
  visibility: boolean;
}
