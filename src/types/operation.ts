import type { RawDateString } from './date';

export enum Operations {
    cash_in = 'cash_in',
    cash_out = 'cash_out',
}

export enum UserTypes {
    natural = 'natural',
    juridical = 'juridical',
}

export type OperationItem = {
    date: RawDateString;
    user_id: number;
    user_type: `${UserTypes}`;
    type: `${Operations}`;
    operation: {
        amount: number;
        currency: 'EUR';
    };
};
