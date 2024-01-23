import type { RawDateString } from './date';

export const OPERATION_CASH_IN = 'cash_in';
export const OPERATION_CASH_OUT = 'cash_out';
export const USER_NATURAL = 'natural';
export const USER_JURIDICAL = 'juridical';

export type OperationType =
    | typeof OPERATION_CASH_IN
    | typeof OPERATION_CASH_OUT;

export type UserType = typeof USER_NATURAL | typeof USER_JURIDICAL;

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
