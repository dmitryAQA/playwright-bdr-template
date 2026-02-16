export interface Product {
    name: string;
    description: string;
    price: number;
    category: 'electronics' | 'clothing' | 'food';
}

export interface User {
    username: string;
    role: 'admin' | 'user' | 'guest';
    email: string;
}
