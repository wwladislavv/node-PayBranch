import type { Operations, UserTypes } from './operation';

export type CommissionConfigValue = {
    percents: number;
    max?: { amount: number; currency: 'EUR' };
    min?: { amount: number; currency: 'EUR' };
    week_limit?: { amount: number; currency: 'EUR' };
};
type CommissionConfig = Record<
    Operations,
    Record<UserTypes, CommissionConfigValue>
>;

export type Config = {
    commission: CommissionConfig;
};
