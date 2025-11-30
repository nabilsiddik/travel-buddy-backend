// Enums
export enum UserRole {
    SUPER_ADMIN = 'SUPER_ADMIN',
    ADMIN = 'ADMIN',
    USER = 'USER'
}

export enum UserStatus {
    ACTIVE = 'ACTIVE',
    BLOCKED = 'BLOCKED',
    DELETED = 'DELETED'
}

export enum Gender {
    MALE = 'MALE',
    FEMALE = 'FEMALE',
    OTHERS = 'OTHERS'
}

// Interfaces
export type createPatientInput = {
    name: string
    email: string
    password: string
    contactNumber?: string
    address?: string
    gender?: Gender
    profilePhoto: String
    role: UserRole
}