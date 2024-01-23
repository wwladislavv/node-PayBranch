export default class WeeklyLimitTracker {
    public limit: number;
    private usedAmounts: Record<number, number> = {};

    constructor(limit: number = 1000) {
        this.limit = limit;
    }

    addAmount(userId: number, amount: number) {
        if (!this.usedAmounts[userId]) {
            this.usedAmounts[userId] = 0;
        }
        this.usedAmounts[userId] += amount;
    }

    hasExceededLimit(userId: number) {
        return this.usedAmounts[userId] > this.limit;
    }

    reset(userId: number) {
        this.usedAmounts[userId] = 0;
    }
}
