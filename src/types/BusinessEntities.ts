export enum ProductCategory {
    Electronics = 'electronics',
    Clothing = 'clothing',
    Food = 'food',
}

export interface Product {
    id: string;
    name: string;
    description: string;
    price: number;
    category: ProductCategory;
    _cleanup?: boolean;
}

export enum UserRole {
    Admin = 'admin',
    User = 'user',
    Guest = 'guest',
}

export interface User {
    username: string;
    password?: string;
    role: UserRole;
    email: string;
    _cleanup?: boolean;
}

export type UserStatus = 'Active' | 'Inactive' | 'Suspended';

export interface UserProfile {
    username: string;
    balance: string;
    status: UserStatus;
    region: string;
}
