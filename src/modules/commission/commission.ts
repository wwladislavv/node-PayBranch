import {
    OPERATION_CASH_IN,
    OPERATION_CASH_OUT,
    USER_NATURAL,
    USER_JURIDICAL,
} from '../../types/operation';
import type { OperationItem, OperationType } from '../../types/operation';
import { isStartOfWeek } from '../../utils/date';

import WeeklyLimitTracker from './weekly-limit-tracker';

const commissionPercentByOperationType: Record<OperationType, number> = {
    [OPERATION_CASH_IN]: 0.03,
    [OPERATION_CASH_OUT]: 0.3,
};
const percentOfAmount = (amount: number, percent: number): number =>
    (amount * percent) / 100;

const weeklyLimitTracker = new WeeklyLimitTracker(1000);

const calculateCommissionCommon = (
    amount: number,
    operationType: OperationType
) => {
    const percent = commissionPercentByOperationType[operationType];
    return percentOfAmount(amount, percent);
};

const calculateCommissionCashInDefault = ({
    operation: { amount },
}: OperationItem): number => {
    // Commission fee - 0.03% from total amount, but no more than 5.00 EUR.
    const commission = calculateCommissionCommon(amount, OPERATION_CASH_IN);

    return commission > 5 ? 5 : commission;
};
const calculateCommissionByOperation = {
    [OPERATION_CASH_IN]: {
        [USER_JURIDICAL]: calculateCommissionCashInDefault,
        [USER_NATURAL]: calculateCommissionCashInDefault,
    },
    [OPERATION_CASH_OUT]: {
        [USER_JURIDICAL]: ({
            operation: { amount },
        }: OperationItem): number => {
            // Commission fee - 0.3% from amount, but not less than 0.50 EUR for operation.
            const commission = calculateCommissionCommon(
                amount,
                OPERATION_CASH_OUT
            );

            return commission < 0.5 ? 0.5 : commission;
        },
        [USER_NATURAL]: ({
            operation: { amount },
            user_id,
            date,
        }: OperationItem): number => {
            // 1000.00 EUR per week (from monday to sunday) is free of charge.
            // If total cash out amount is exceeded - commission is calculated only from exceeded amount (that is, for 1000.00 EUR there is still no commission fee).
            if (isStartOfWeek(date)) {
                weeklyLimitTracker.reset(user_id);
            }

            weeklyLimitTracker.addAmount(user_id, amount);

            if (!weeklyLimitTracker.hasExceededLimit(user_id)) {
                return 0;
            } else if (amount > weeklyLimitTracker.limit) {
                return calculateCommissionCommon(
                    amount - weeklyLimitTracker.limit,
                    OPERATION_CASH_OUT
                );
            }

            return calculateCommissionCommon(amount, OPERATION_CASH_OUT);
        },
    },
};

export default (operationItem: OperationItem): number => {
    let calculateCommissionByUserType =
        calculateCommissionByOperation[operationItem.type];
    if (!calculateCommissionByUserType) {
        throw new Error('Unknown operation type');
    }

    const calculateCommission =
        calculateCommissionByUserType[operationItem.user_type];
    if (!calculateCommission) {
        throw new Error('Unknown user type');
    }

    return calculateCommission(operationItem);
};
