import { describe, expect, test } from '@jest/globals';

import { isStartOfWeek, sortByDate } from './date';
import { OperationItem } from '../types/operation';

describe('isStartOfWeek', () => {
    test('should return true if the date is Monday', () => {
        expect(isStartOfWeek('2016-01-04')).toBe(true);
    });

    test('should return false if the date is not Monday', () => {
        expect(isStartOfWeek('2016-01-05')).toBe(false);
    });
});

describe('sortByDate', () => {
    test('should sort the array in ascending order by date', () => {
        const arr: OperationItem[] = [
            {
                date: '2016-01-05',
                user_id: 1,
                user_type: 'natural',
                type: 'cash_in',
                operation: { amount: 200, currency: 'EUR' },
            },
            {
                date: '2016-01-03',
                user_id: 1,
                user_type: 'natural',
                type: 'cash_in',
                operation: { amount: 200, currency: 'EUR' },
            },
        ];

        expect(arr.sort(sortByDate)).toEqual([
            {
                date: '2016-01-03',
                user_id: 1,
                user_type: 'natural',
                type: 'cash_in',
                operation: { amount: 200, currency: 'EUR' },
            },
            {
                date: '2016-01-05',
                user_id: 1,
                user_type: 'natural',
                type: 'cash_in',
                operation: { amount: 200, currency: 'EUR' },
            },
        ]);
    });
});
