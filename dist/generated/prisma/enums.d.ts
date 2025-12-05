export declare const UserRole: {
    readonly SUPER_ADMIN: "SUPER_ADMIN";
    readonly ADMIN: "ADMIN";
    readonly USER: "USER";
};
export type UserRole = (typeof UserRole)[keyof typeof UserRole];
export declare const UserStatus: {
    readonly ACTIVE: "ACTIVE";
    readonly BLOCKED: "BLOCKED";
    readonly DELETED: "DELETED";
};
export type UserStatus = (typeof UserStatus)[keyof typeof UserStatus];
export declare const Gender: {
    readonly MALE: "MALE";
    readonly FEMALE: "FEMALE";
    readonly OTHERS: "OTHERS";
};
export type Gender = (typeof Gender)[keyof typeof Gender];
export declare const TravelType: {
    readonly SOLO: "SOLO";
    readonly FAMILY: "FAMILY";
    readonly FRIENDS: "FRIENDS";
};
export type TravelType = (typeof TravelType)[keyof typeof TravelType];
export declare const SubscriptionStatus: {
    readonly NONE: "NONE";
    readonly MONTHLY: "MONTHLY";
    readonly YEARLY: "YEARLY";
};
export type SubscriptionStatus = (typeof SubscriptionStatus)[keyof typeof SubscriptionStatus];
export declare const PaymentStatus: {
    readonly PENDING: "PENDING";
    readonly SUCCESS: "SUCCESS";
    readonly FAILED: "FAILED";
};
export type PaymentStatus = (typeof PaymentStatus)[keyof typeof PaymentStatus];
//# sourceMappingURL=enums.d.ts.map