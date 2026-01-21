import type { TravelPlan, TravelType } from "../../../../generated/prisma/client.js";


export interface ITravelPlan {
  title: string;
  destination: string;
  startDate: Date;
  endDate: Date;

  travelPlans?: TravelPlan[];
  budgetFrom?: string | null;
  budgetTo?: string | null;
  travelType: TravelType;
  description?: string | null;
  visibility: boolean;
}
