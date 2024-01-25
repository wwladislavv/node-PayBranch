import fs from 'fs';
import minimist from 'minimist';

import { OperationItem } from './types/operation';
import type { Config } from './types/config';
import createOperations from './modules/commission';

const { input: inputPath } = minimist(process.argv.slice(2));

if (!inputPath) {
    throw Error('Input file path is required. Use --input argument.');
}

let input: string;
try {
    input = fs.readFileSync(inputPath, 'utf-8');
} catch (error) {
    throw Error('Input file not found');
}

let operations: OperationItem[];
try {
    operations = JSON.parse(input) as OperationItem[];
} catch (error) {
    throw Error('Invalid input file format');
}

fs.readFile('./config.json', 'utf8', (error, data) => {
    if (error) {
        throw Error('Config file not found');
    }

    let configJson: Config;
    try {
        configJson = JSON.parse(data) as Config;
    } catch (parseError) {
        throw Error('Invalid config file format');
    }

    const operationsInstance = createOperations({
        operations,
        config: configJson,
    });

    const calculatedCommissions = operationsInstance.commissions();
    calculatedCommissions.forEach((commission) =>
        // eslint-disable-next-line no-console
        console.log(commission.toFixed(2))
    );
});
