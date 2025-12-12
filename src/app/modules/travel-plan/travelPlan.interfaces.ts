import type { TravelPlan, TravelType } from "../../../../generated/prisma/client.js";


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
