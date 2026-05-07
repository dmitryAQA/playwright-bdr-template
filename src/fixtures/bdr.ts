import { test as base } from './factories';
import { BDR } from '../bdr/bdr';
import { attachTable, attachCompareTable } from '../bdr/tables';

export type BdrUtilityFixtures = {
    bdr: typeof BDR;
    attachTable: typeof attachTable;
    attachCompareTable: typeof attachCompareTable;
};

export const test = base.extend<BdrUtilityFixtures>({
    bdr: async ({}, use: (r: typeof BDR) => Promise<void>) => {
        await use(BDR);
    },

    attachTable: async ({}, use: (r: typeof attachTable) => Promise<void>) => {
        await use(attachTable);
    },

    attachCompareTable: async ({}, use: (r: typeof attachCompareTable) => Promise<void>) => {
        await use(attachCompareTable);
    },
});
