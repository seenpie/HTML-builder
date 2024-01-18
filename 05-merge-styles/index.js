const fs = require('fs');
const path = require('path');

const directoryPath = path.join(__dirname, 'styles');

fs.readdir(directoryPath, { withFileTypes: true }, (err, files) => {
  if (err) console.log(err);
  else {
    const outputPath = path.join(__dirname, 'project-dist/bundle.css');
    const writeStream = fs.createWriteStream(outputPath, 'utf-8');
    files.forEach((el) => {
      fs.stat(el.path, (statError) => {
        if (statError) console.log(statError);
        else {
          const { ext } = path.parse(el.name);
          if (ext === '.css') {
            const readStream = fs.createReadStream(
              el.path + `\\${el.name}`,
              'utf8',
            );
            readStream.on('data', (data) => writeStream.write(data + '\n'));
          }
        }
      });
    });
  }
});
