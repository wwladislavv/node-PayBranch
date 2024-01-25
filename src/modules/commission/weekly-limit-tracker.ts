const createWeeklyLimitTracker = (limit = 1000) => {
    let usedAmounts: Record<number, number> = {};

    const addAmount = (userId: number, amount: number) => {
        usedAmounts = {
            ...usedAmounts,
            [userId]: (usedAmounts[userId] || 0) + amount,
        };
    };

    const hasExceededLimit = (userId: number) =>
        (usedAmounts[userId] || 0) > limit;

    const willExceedLimit = (userId: number, amount: number) =>
        (usedAmounts[userId] || 0) + amount > limit;

    const usedAmount = (userId: number) => usedAmounts[userId] || 0;

    const reset = (userId: number) => {
        usedAmounts = {
            ...usedAmounts,
            [userId]: 0,
        };
    };

    return {
        limit,
        addAmount,
        hasExceededLimit,
        willExceedLimit,
        usedAmount,
        reset,
    };
};

export default createWeeklyLimitTracker;
