const fs = require('fs');
const path = require('path');

const readStream = fs.createReadStream(
  path.resolve(__dirname, './text.txt'),
  'utf8',
);

readStream.on('data', (data) => process.stdout.write(data));
