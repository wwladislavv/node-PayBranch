import { Operations, UserTypes } from '../../types/operation';
import type { OperationItem } from '../../types/operation';
import { isStartOfWeek, sortByDate } from '../../utils/date';

import createWeeklyLimitTracker from './weekly-limit-tracker';
import type { Config } from '../../types/config';

type WeeklyLimitTrackerMap = Record<
    keyof typeof Operations,
    Record<keyof typeof UserTypes, ReturnType<typeof createWeeklyLimitTracker>>
>;

type CalculateMethod = 'common' | 'min' | 'max' | 'week_limit';

export const percentOfAmount = (amount: number, percent: number): number =>
    (amount * percent) / 100;

const createWeeklyLimitTrackerMap = (
    config: Config['commission']
): WeeklyLimitTrackerMap => ({
    [Operations.cash_in]: {
        [UserTypes.juridical]: createWeeklyLimitTracker(
            config[Operations.cash_in][UserTypes.juridical].week_limit
                ?.amount || 0
        ),
        [UserTypes.natural]: createWeeklyLimitTracker(
            config[Operations.cash_in][UserTypes.natural].week_limit?.amount ||
                0
        ),
    },
    [Operations.cash_out]: {
        [UserTypes.juridical]: createWeeklyLimitTracker(
            config[Operations.cash_out][UserTypes.juridical].week_limit
                ?.amount || 0
        ),
        [UserTypes.natural]: createWeeklyLimitTracker(
            config[Operations.cash_out][UserTypes.natural].week_limit?.amount ||
                0
        ),
    },
});

export const calculateCommon = (
    config: Config['commission'],
    operation: OperationItem
): number => {
    const { percents: percent } = config[operation.type][operation.user_type];
    return percentOfAmount(operation.operation.amount, percent);
};

const calculateWithMin = (
    config: Config['commission'],
    operation: OperationItem
): number => {
    const { min } = config[operation.type][operation.user_type];
    const commission = calculateCommon(config, operation);
    const minAmount = min?.amount || 0;
    return commission < minAmount ? minAmount : commission;
};

const calculateWithMax = (
    config: Config['commission'],
    operation: OperationItem
): number => {
    const { max } = config[operation.type][operation.user_type];
    const commission = calculateCommon(config, operation);
    const maxAmount = max?.amount || 0;
    return commission > maxAmount ? maxAmount : commission;
};

const calculateWithWeekLimit =
    (weeklyLimitTracker: WeeklyLimitTrackerMap) =>
    (config: Config['commission'], operation: OperationItem): number => {
        const {
            operation: { amount },
            user_id: userId,
            date,
        } = operation;
        const limitTracker =
            weeklyLimitTracker[operation.type][operation.user_type];

        if (isStartOfWeek(date)) {
            limitTracker.reset(userId);
        }

        const exceededLimit = limitTracker.hasExceededLimit(userId);
        const willExceedLimit = limitTracker.willExceedLimit(userId, amount);

        let commission = 0;

        if (exceededLimit) {
            commission = calculateCommon(config, operation);
        } else if (willExceedLimit) {
            commission = calculateCommon(config, {
                ...operation,
                operation: {
                    ...operation.operation,
                    amount:
                        amount -
                        (limitTracker.limit - limitTracker.usedAmount(userId)),
                },
            });
        }

        limitTracker.addAmount(userId, amount);

        return commission;
    };

const calculate =
    (config: Config['commission'], weeklyLimitTracker: WeeklyLimitTrackerMap) =>
    (operation: OperationItem): number => {
        const {
            min,
            max,
            week_limit: weekLimit,
        } = config[operation.type][operation.user_type];
        const method = {
            common: calculateCommon,
            min: calculateWithMin,
            max: calculateWithMax,
            week_limit: calculateWithWeekLimit(weeklyLimitTracker),
        } as const;

        let key: CalculateMethod;
        if (weekLimit) {
            key = 'week_limit';
        } else if (min) {
            key = 'min';
        } else if (max) {
            key = 'max';
        } else {
            key = 'common';
        }

        return method[key](config, operation);
    };

const createCalculateCommission = (config: Config['commission']) => {
    const weeklyLimitTracker: WeeklyLimitTrackerMap =
        createWeeklyLimitTrackerMap(config);

    return {
        calculate: calculate(config, weeklyLimitTracker),
    };
};

export default ({
    operations,
    config,
}: {
    operations: OperationItem[];
    config: Config;
}) => {
    const sortedByDate: () => OperationItem[] = () =>
        [...operations].sort(sortByDate);
    const calculateCommission = createCalculateCommission(config.commission);

    const commissions: () => number[] = () =>
        sortedByDate().map((operationItem) => {
            const operationConfig =
                config.commission[operationItem.type][operationItem.user_type];
            if (!operationConfig) {
                throw new Error('Unknown operation or user type');
            }

            return calculateCommission.calculate(operationItem);
        });

    return {
        sortedByDate,
        commissions,
    };
};
