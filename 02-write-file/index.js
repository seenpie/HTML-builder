const fs = require('fs');
const path = require('path');
const readline = require('node:readline');
const { stdin: input, stdout: output } = require('node:process');

const writeStream = fs.createWriteStream(path.join(__dirname, 'output.txt'), {
  encoding: 'utf8',
});
const rl = readline.createInterface({
  input,
  output,
});

output.write('Enter data \n');

rl.on('line', (input) => {
  if (input.toLowerCase() === 'exit') {
    rl.close();
  } else {
    writeStream.write(input + '\n');
  }
});

rl.on('close', () => {
  writeStream.end();
  output.write('Thx for data');
});
