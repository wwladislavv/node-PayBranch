import { describe, expect, test } from '@jest/globals';

import type { OperationItem } from '../../types/operation';
import { Config } from '../../types/config';

import createOperations, { percentOfAmount } from './index';

describe('percentOfAmount', () => {
    test('calculates percent of number', () => {
        expect(percentOfAmount(100, 32)).toBe(32);
    });
});

describe('OperationsInstance', () => {
    test('calculates commissions by config', () => {
        const config: Config = {
            commission: {
                cash_in: {
                    natural: {
                        percents: 0.03,
                        max: { amount: 5, currency: 'EUR' },
                    },
                    juridical: {
                        percents: 0.03,
                        max: { amount: 5, currency: 'EUR' },
                    },
                },
                cash_out: {
                    natural: {
                        percents: 0.3,
                        week_limit: { amount: 1000, currency: 'EUR' },
                    },
                    juridical: {
                        percents: 0.3,
                        min: { amount: 0.5, currency: 'EUR' },
                    },
                },
            },
        };
        const operations: OperationItem[] = [
            {
                date: '2016-01-05',
                user_id: 1,
                user_type: 'natural',
                type: 'cash_in',
                operation: { amount: 200.0, currency: 'EUR' },
            },
            {
                date: '2016-01-06',
                user_id: 2,
                user_type: 'juridical',
                type: 'cash_out',
                operation: { amount: 300.0, currency: 'EUR' },
            },
            {
                date: '2016-01-06',
                user_id: 1,
                user_type: 'natural',
                type: 'cash_out',
                operation: { amount: 30000, currency: 'EUR' },
            },
            {
                date: '2016-01-07',
                user_id: 1,
                user_type: 'natural',
                type: 'cash_out',
                operation: { amount: 1000.0, currency: 'EUR' },
            },
            {
                date: '2016-01-07',
                user_id: 1,
                user_type: 'natural',
                type: 'cash_out',
                operation: { amount: 100.0, currency: 'EUR' },
            },
            {
                date: '2016-01-10',
                user_id: 1,
                user_type: 'natural',
                type: 'cash_out',
                operation: { amount: 100.0, currency: 'EUR' },
            },
            {
                date: '2016-01-10',
                user_id: 2,
                user_type: 'juridical',
                type: 'cash_in',
                operation: { amount: 1000000.0, currency: 'EUR' },
            },
            {
                date: '2016-01-10',
                user_id: 3,
                user_type: 'natural',
                type: 'cash_out',
                operation: { amount: 1000.0, currency: 'EUR' },
            },
            {
                date: '2016-02-15',
                user_id: 1,
                user_type: 'natural',
                type: 'cash_out',
                operation: { amount: 300.0, currency: 'EUR' },
            },
        ];
        const operationsInstance = createOperations({
            operations,
            config,
        });

        expect(
            operationsInstance.commissions().map((item) => item.toFixed(2))
        ).toStrictEqual([
            '0.06',
            '0.90',
            '87.00',
            '3.00',
            '0.30',
            '0.30',
            '5.00',
            '0.00',
            '0.00',
        ]);
    });
});
