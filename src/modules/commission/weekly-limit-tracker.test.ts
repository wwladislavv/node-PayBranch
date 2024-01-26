import { describe, expect, test } from '@jest/globals';

import createWeeklyLimitTracker from './weekly-limit-tracker';

describe('WeeklyLimitTracker', () => {
    test('tracks weekly limit', () => {
        const tracker = createWeeklyLimitTracker(1000);

        expect(tracker.limit).toBe(1000);
        expect(tracker.usedAmount(1)).toBe(0);
        expect(tracker.hasExceededLimit(1)).toBe(false);
        expect(tracker.willExceedLimit(1, 100)).toBe(false);
        tracker.addAmount(1, 100);
        expect(tracker.usedAmount(1)).toBe(100);
        expect(tracker.hasExceededLimit(1)).toBe(false);
        expect(tracker.willExceedLimit(1, 100)).toBe(false);
        tracker.addAmount(1, 900);
        expect(tracker.usedAmount(1)).toBe(1000);
        expect(tracker.hasExceededLimit(1)).toBe(true);
        tracker.reset(1);
        expect(tracker.usedAmount(1)).toBe(0);
        expect(tracker.hasExceededLimit(1)).toBe(false);
        expect(tracker.willExceedLimit(1, 100)).toBe(false);
    });
});
