import fs from 'fs';
import minimist from 'minimist';

const { input: inputPath } = minimist(process.argv.slice(2));

const data = fs.readFileSync(inputPath, 'utf8');
const dataJSON = JSON.parse(data);

console.log('dataJSsON', dataJSON);