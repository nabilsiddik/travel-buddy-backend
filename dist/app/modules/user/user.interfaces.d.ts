export declare enum UserRole {
    SUPER_ADMIN = "SUPER_ADMIN",
    ADMIN = "ADMIN",
    USER = "USER"
}
export declare enum UserStatus {
    ACTIVE = "ACTIVE",
    BLOCKED = "BLOCKED",
    DELETED = "DELETED"
}
export declare enum Gender {
    MALE = "MALE",
    FEMALE = "FEMALE",
    OTHERS = "OTHERS"
}
export type createPatientInput = {
    name: string;
    email: string;
    password: string;
    contactNumber?: string;
    address?: string;
    gender?: Gender;
    profilePhoto: String;
    role: UserRole;
};
//# sourceMappingURL=user.interfaces.d.ts.map