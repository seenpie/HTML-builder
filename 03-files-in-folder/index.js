const fs = require('fs');
const path = require('path');

const directoryPath = path.resolve(__dirname, './secret-folder');

fs.readdir(directoryPath, { withFileTypes: true }, (err, files) => {
  if (err) {
    console.log(err);
  } else {
    files.forEach((el) => {
      const filePath = path.resolve(directoryPath, el.name);
      fs.stat(filePath, (error, stats) => {
        if (error) {
          console.log(error);
        } else {
          const { name, ext } = path.parse(el.name);
          const res = `${name} - ${ext.slice(1)} - ${stats.size}`;
          if (el.isFile()) {
            process.stdout.write(res + '\n');
          }
        }
      });
    });
  }
});
