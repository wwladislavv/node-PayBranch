import fs from 'fs';
import minimist from 'minimist';

import type { OperationItem } from './types/operation';
import { sortByDate } from './utils/date';
import calculateCommission from './modules/commission';

const { input: inputPath } = minimist(process.argv.slice(2));

const processOperations = (operations: OperationItem[]) => {
    const result = operations.map(calculateCommission);

    result.forEach((commission) => console.log(commission.toFixed(2)));
};

const data = fs.readFileSync(inputPath, 'utf8');
const dataJSON = JSON.parse(data) as OperationItem[];
const dataSorted = [...dataJSON].sort(sortByDate);

processOperations(dataSorted);
