import type { OperationItem } from '../types/operation';
import type { RawDateString } from '../types/date';

export const isStartOfWeek = (date: RawDateString) =>
    new Date(date).getDay() === 1;

export const sortByDate = (a: OperationItem, b: OperationItem) => {
    const { date: aDate } = a;
    const { date: bDate } = b;
    // Convert the date strings to Date objects
    const dateA = new Date(aDate);
    const dateB = new Date(bDate);

    return +dateA - +dateB;
};
