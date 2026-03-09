import type { Principal } from "@icp-sdk/core/principal";
export interface Some<T> {
    __kind__: "Some";
    value: T;
}
export interface None {
    __kind__: "None";
}
export type Option<T> = Some<T> | None;
export interface LoanApplication {
    id: bigint;
    status: LoanStatus;
    loanAmount: string;
    name: string;
    whatsapp: string;
    submittedAt: Time;
    email: string;
    purpose: string;
}
export type Time = bigint;
export interface UserProfile {
    name: string;
}
export enum LoanStatus {
    pending = "pending",
    approved = "approved",
    rejected = "rejected"
}
export enum UserRole {
    admin = "admin",
    user = "user",
    guest = "guest"
}
export interface backendInterface {
    assignCallerUserRole(user: Principal, role: UserRole): Promise<void>;
    deleteApplication(id: bigint): Promise<void>;
    getApplications(): Promise<Array<LoanApplication>>;
    getCallerUserProfile(): Promise<UserProfile | null>;
    getCallerUserRole(): Promise<UserRole>;
    getUserProfile(user: Principal): Promise<UserProfile | null>;
    isCallerAdmin(): Promise<boolean>;
    saveCallerUserProfile(profile: UserProfile): Promise<void>;
    submitApplication(name: string, whatsapp: string, email: string, loanAmount: string, purpose: string): Promise<string>;
    updateStatus(id: bigint, newStatus: LoanStatus): Promise<void>;
}
