export interface Product {
    name: string;
    description: string;
    price: number;
    category: 'electronics' | 'clothing' | 'food';
    _cleanup?: boolean;
}

export interface User {
    username: string;
    role: 'admin' | 'user' | 'guest';
    email: string;
    _cleanup?: boolean;
}
