import { Step } from '../bdr/decorators';
import { User } from '../types/BusinessEntities';

/**
 * DataDrivenFlow
 * Demonstrates BDR's ability to handle collection-based constructors
 * and step-level type inference for arrays.
 */
export class DataDrivenFlow {
    constructor(private users: User[]) { }

    @Step('GIVEN: I have a list of users to process')
    async logUsers() {
        console.log(`Processing ${this.users.length} users...`);
        this.users.forEach(u => console.log(` - ${u.username} (${u.role})`));
    }

    @Step('WHEN: I perform a bulk action for all users')
    async bulkAction() {
        // Implementation...
    }
}
