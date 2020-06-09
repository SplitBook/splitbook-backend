const fs = require('fs');
const path = require('path');

const content = fs.readFileSync(path.resolve(__dirname, 'example.csv'));

console.log('content', content);
