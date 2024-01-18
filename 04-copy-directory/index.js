const fs = require('fs');
const path = require('path');

const sourceDirectory = path.join(__dirname, 'files');
const copiedDirectory = path.join(__dirname, 'files-copy');

fs.mkdir(copiedDirectory, (err) => {
  if (err) {
    fs.rm(copiedDirectory, { recursive: true }, (err2) => {
      if (err2) console.log(err2);
      else {
        fs.mkdir(copiedDirectory, { recursive: true }, (err3) => {
          if (err3) console.log(err3);
          else {
            copyFiles();
          }
        });
      }
    });
  } else {
    copyFiles();
  }
});

function copyFiles() {
  fs.readdir(sourceDirectory, (err, files) => {
    if (err) console.log(err);
    else {
      files.forEach((file) => {
        const sourcePath = path.join(sourceDirectory, file);
        const copiedPath = path.join(copiedDirectory, file);

        fs.copyFile(sourcePath, copiedPath, (err) => {
          if (err) console.log(err);
        });
      });
    }
  });
}
