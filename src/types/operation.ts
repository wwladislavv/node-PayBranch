import type { RawDateString } from './date';

export enum Operations {
    cash_in = 'cash_in',
    cash_out = 'cash_out',
}

export enum UserTypes {
    natural = 'natural',
    juridical = 'juridical',
}

export type OperationType = Operations.cash_in | Operations.cash_out;

export type UserType = UserTypes.natural | UserTypes.juridical;

export type OperationItem = {
    date: RawDateString;
    user_id: number;
    user_type: UserType;
    type: OperationType;
    operation: {
        amount: number;
        currency: 'EUR';
    };
};
