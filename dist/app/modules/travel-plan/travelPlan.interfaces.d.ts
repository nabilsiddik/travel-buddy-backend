import type { TravelType } from "src/generated/prisma/enums";
export interface ITravelPlan {
    destination: string;
    startDate: Date;
    endDate: Date;
    budgetRange?: string | null;
    travelType: TravelType;
    description?: string | null;
    visibility: boolean;
}
//# sourceMappingURL=travelPlan.interfaces.d.ts.map