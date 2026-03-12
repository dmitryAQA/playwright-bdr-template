import { User } from '../types/BusinessEntities';

// Basic decorator stub if it doesn't exist
export function Factory(name: string) {
    return function (constructor: Function) {
        // Decorator logic
        constructor.prototype.bdrFactoryName = name;
    }
}

@Factory('User')
export class UserFactory {
    static create(overrides?: Partial<User>): User {
        return {
            username: "FactoryUser",
            role: "user",
            email: "factory@test.com",
            ...overrides
        };
    }

    static buildList(count: number, overrides?: Partial<User>): User[] {
        const list: User[] = [];
        for (let i = 0; i < count; i++) {
            list.push(this.create(overrides));
        }
        return list;
    }
}
